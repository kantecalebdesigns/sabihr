import { useMemo } from "react";
import { DollarSign, Moon, Sun, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_SHIFT_ASSIGNMENTS, MOCK_SHIFTS, formatNaira } from "@/lib/attendance-extended-mock-data";

export default function ShiftAllowancePage() {
  const shiftMap = useMemo(() => {
    const m = new Map<string, typeof MOCK_SHIFTS[0]>();
    MOCK_SHIFTS.forEach(s => m.set(s.id, s));
    return m;
  }, []);

  // Aggregate: employee -> { shiftId -> { dates, allowancePerShift } }
  const employeeAllowances = useMemo(() => {
    const m = new Map<string, {
      employeeName: string;
      department: string;
      shifts: Map<string, { shiftName: string; dates: string[]; allowancePerShift: number }>;
    }>();

    MOCK_SHIFT_ASSIGNMENTS.forEach(a => {
      const shift = shiftMap.get(a.shiftId);
      if (!shift || shift.allowance === 0) return;

      if (!m.has(a.employeeId)) {
        m.set(a.employeeId, { employeeName: a.employeeName, department: a.department, shifts: new Map() });
      }
      const emp = m.get(a.employeeId)!;
      if (!emp.shifts.has(a.shiftId)) {
        emp.shifts.set(a.shiftId, { shiftName: a.shiftName, dates: [], allowancePerShift: shift.allowance });
      }
      emp.shifts.get(a.shiftId)!.dates.push(a.date);
    });

    return m;
  }, [shiftMap]);

  // Flatten to rows
  const rows = useMemo(() => {
    const result: {
      key: string;
      employeeName: string;
      department: string;
      shiftName: string;
      datesWorked: number;
      allowancePerShift: number;
      totalAllowance: number;
      synced: boolean;
    }[] = [];

    employeeAllowances.forEach((emp, empId) => {
      emp.shifts.forEach((shiftData, shiftId) => {
        const total = shiftData.dates.length * shiftData.allowancePerShift;
        result.push({
          key: `${empId}-${shiftId}`,
          employeeName: emp.employeeName,
          department: emp.department,
          shiftName: shiftData.shiftName,
          datesWorked: shiftData.dates.length,
          allowancePerShift: shiftData.allowancePerShift,
          totalAllowance: total,
          synced: Math.random() > 0.4, // mock sync status
        });
      });
    });

    return result.sort((a, b) => b.totalAllowance - a.totalAllowance);
  }, [employeeAllowances]);

  const totalAllowances = rows.reduce((sum, r) => sum + r.totalAllowance, 0);
  const nightPremium = rows.filter(r => r.shiftName.includes("Night")).reduce((s, r) => s + r.totalAllowance, 0);
  const afternoonPremium = rows.filter(r => r.shiftName.includes("Afternoon")).reduce((s, r) => s + r.totalAllowance, 0);
  const employeesWithAllowances = new Set(rows.map(r => r.employeeName)).size;

  const summaryCards = [
    { label: "Total Allowances This Month", value: formatNaira(totalAllowances), icon: DollarSign, color: "text-slate-900" },
    { label: "Night Shift Premium", value: formatNaira(nightPremium), icon: Moon, color: "text-indigo-600" },
    { label: "Afternoon Premium", value: formatNaira(afternoonPremium), icon: Sun, color: "text-blue-600" },
    { label: "Employees with Allowances", value: employeesWithAllowances, icon: Users, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Shift Allowance & Payroll Integration</h1>
        <p className="text-sm text-slate-500">Track shift-based allowances and payroll sync status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{card.label}</p>
              <card.icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className={cn("text-2xl font-bold mt-1", card.color)}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200/70 text-left">
              <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
              <th className="px-4 py-3 font-medium text-slate-600">Shift</th>
              <th className="px-4 py-3 font-medium text-slate-600">Dates Worked</th>
              <th className="px-4 py-3 font-medium text-slate-600">Allowance/Shift</th>
              <th className="px-4 py-3 font-medium text-slate-600">Total Allowance</th>
              <th className="px-4 py-3 font-medium text-slate-600">Payroll Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.key} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="font-medium">{row.employeeName}</div>
                  <div className="text-xs text-slate-500">{row.department}</div>
                </td>
                <td className="px-4 py-3">{row.shiftName}</td>
                <td className="px-4 py-3">{row.datesWorked} days</td>
                <td className="px-4 py-3">{formatNaira(row.allowancePerShift)}</td>
                <td className="px-4 py-3 font-semibold">{formatNaira(row.totalAllowance)}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                    row.synced
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  )}>
                    {row.synced ? "Synced" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
