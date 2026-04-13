import { useMemo } from "react";
import { AlertTriangle, Users, DollarSign, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_MONTHLY_SUMMARY, formatNaira } from "@/lib/attendance-extended-mock-data";

const ABSENCE_RATE = 25000; // per day
const LATE_RATE = 5000; // per day

export default function AttendanceDeductionPreviewPage() {
  const rows = useMemo(() => {
    return MOCK_MONTHLY_SUMMARY.map(emp => {
      const absenceDeduction = emp.daysAbsent * ABSENCE_RATE;
      const lateDeduction = emp.daysLate * LATE_RATE;
      const totalDeduction = absenceDeduction + lateDeduction;
      return {
        ...emp,
        absenceDeduction,
        lateDeduction,
        totalDeduction,
      };
    }).filter(r => r.totalDeduction > 0);
  }, []);

  const totalAbsenceDed = rows.reduce((s, r) => s + r.absenceDeduction, 0);
  const totalLateDed = rows.reduce((s, r) => s + r.lateDeduction, 0);
  const employeesAffected = rows.length;
  const netImpact = totalAbsenceDed + totalLateDed;

  const summaryCards = [
    { label: "Total Absence Deductions", value: formatNaira(totalAbsenceDed), icon: AlertTriangle, color: "text-red-600" },
    { label: "Total Late Deductions", value: formatNaira(totalLateDed), icon: TrendingDown, color: "text-amber-600" },
    { label: "Employees Affected", value: employeesAffected, icon: Users, color: "text-slate-900" },
    { label: "Net Impact", value: formatNaira(netImpact), icon: DollarSign, color: "text-red-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Absence & Late Deduction Preview</h1>
          <p className="text-sm text-slate-500">Preview deductions before applying to payroll. Absence: {formatNaira(ABSENCE_RATE)}/day, Late: {formatNaira(LATE_RATE)}/day.</p>
        </div>
        <Button className="gap-2">
          <DollarSign className="h-4 w-4" /> Apply to Payroll
        </Button>
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
      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-[#f8fafc] text-left">
              <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
              <th className="px-4 py-3 font-medium text-slate-600">Department</th>
              <th className="px-4 py-3 font-medium text-slate-600">Days Absent</th>
              <th className="px-4 py-3 font-medium text-slate-600">Late Count</th>
              <th className="px-4 py-3 font-medium text-slate-600">Absence Deduction</th>
              <th className="px-4 py-3 font-medium text-slate-600">Late Deduction</th>
              <th className="px-4 py-3 font-medium text-slate-600">Total Deduction</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.employeeId} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                <td className="px-4 py-3 font-medium">{row.employeeName}</td>
                <td className="px-4 py-3 text-slate-600">{row.department}</td>
                <td className="px-4 py-3">{row.daysAbsent}</td>
                <td className="px-4 py-3">{row.daysLate}</td>
                <td className="px-4 py-3 text-red-600">{row.absenceDeduction > 0 ? formatNaira(row.absenceDeduction) : "-"}</td>
                <td className="px-4 py-3 text-amber-600">{row.lateDeduction > 0 ? formatNaira(row.lateDeduction) : "-"}</td>
                <td className="px-4 py-3 font-semibold text-red-700">{formatNaira(row.totalDeduction)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#f8fafc] font-semibold">
              <td className="px-4 py-3" colSpan={4}>Total</td>
              <td className="px-4 py-3 text-red-600">{formatNaira(totalAbsenceDed)}</td>
              <td className="px-4 py-3 text-amber-600">{formatNaira(totalLateDed)}</td>
              <td className="px-4 py-3 text-red-700">{formatNaira(netImpact)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
