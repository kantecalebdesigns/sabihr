import { useMemo, Fragment } from "react";
import { Clock, DollarSign, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_OVERTIME_RECORDS, formatNaira } from "@/lib/attendance-extended-mock-data";

const BASE_HOURLY_RATE = 5000;

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  approved: { label: "Approved", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  rejected: { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export default function AttendanceOvertimePreviewPage() {
  const totalOTHours = MOCK_OVERTIME_RECORDS.reduce((s, r) => s + r.overtimeHours, 0);
  const totalOTAmount = MOCK_OVERTIME_RECORDS.reduce((s, r) => s + r.amount, 0);
  const avgRate = MOCK_OVERTIME_RECORDS.length > 0
    ? (MOCK_OVERTIME_RECORDS.reduce((s, r) => s + r.rate, 0) / MOCK_OVERTIME_RECORDS.length).toFixed(1)
    : "0";
  const employeesWithOT = new Set(MOCK_OVERTIME_RECORDS.map(r => r.employeeId)).size;

  const summaryCards = [
    { label: "Total OT Hours", value: totalOTHours.toFixed(1), icon: Clock, color: "text-slate-900" },
    { label: "Total OT Amount", value: formatNaira(totalOTAmount), icon: DollarSign, color: "text-emerald-600" },
    { label: "Avg Rate Multiplier", value: `${avgRate}x`, icon: TrendingUp, color: "text-blue-600" },
    { label: "Employees with OT", value: employeesWithOT, icon: Users, color: "text-indigo-600" },
  ];

  // Group by employee for subtotals
  const grouped = useMemo(() => {
    const m = new Map<string, typeof MOCK_OVERTIME_RECORDS>();
    MOCK_OVERTIME_RECORDS.forEach(r => {
      if (!m.has(r.employeeId)) m.set(r.employeeId, []);
      m.get(r.employeeId)!.push(r);
    });
    return m;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Overtime Payment Preview</h1>
          <p className="text-sm text-slate-500">Review overtime calculations before syncing to payroll. Base hourly rate: {formatNaira(BASE_HOURLY_RATE)}</p>
        </div>
        <Button className="gap-2">
          <DollarSign className="h-4 w-4" /> Sync to Payroll
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

      {/* Table grouped by employee */}
      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-[#f8fafc] text-left">
              <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
              <th className="px-4 py-3 font-medium text-slate-600">Department</th>
              <th className="px-4 py-3 font-medium text-slate-600">Date</th>
              <th className="px-4 py-3 font-medium text-slate-600">OT Hours</th>
              <th className="px-4 py-3 font-medium text-slate-600">Rate</th>
              <th className="px-4 py-3 font-medium text-slate-600">Base Hourly</th>
              <th className="px-4 py-3 font-medium text-slate-600">Amount</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(grouped.entries()).map(([empId, records]) => {
              const subtotalHours = records.reduce((s, r) => s + r.overtimeHours, 0);
              const subtotalAmount = records.reduce((s, r) => s + r.amount, 0);
              return (
                <Fragment key={empId}>
                  {records.map((rec, idx) => {
                    const style = STATUS_STYLES[rec.status];
                    return (
                      <tr key={rec.id} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                        {idx === 0 ? (
                          <td className="px-4 py-3 font-medium" rowSpan={records.length}>{rec.employeeName}</td>
                        ) : null}
                        <td className="px-4 py-3 text-slate-600">{rec.department}</td>
                        <td className="px-4 py-3">{new Date(rec.date).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</td>
                        <td className="px-4 py-3">{rec.overtimeHours}</td>
                        <td className="px-4 py-3">{rec.rate}x</td>
                        <td className="px-4 py-3">{formatNaira(BASE_HOURLY_RATE)}</td>
                        <td className="px-4 py-3 font-medium">{formatNaira(rec.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                            {style.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-50/50 border-b border-[#efefef]">
                    <td className="px-4 py-2 text-xs font-semibold text-slate-500" colSpan={3}>Subtotal - {records[0].employeeName}</td>
                    <td className="px-4 py-2 text-xs font-semibold">{subtotalHours} hrs</td>
                    <td className="px-4 py-2" colSpan={2}></td>
                    <td className="px-4 py-2 text-xs font-semibold">{formatNaira(subtotalAmount)}</td>
                    <td className="px-4 py-2"></td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-[#f8fafc] font-semibold">
              <td className="px-4 py-3" colSpan={3}>Grand Total</td>
              <td className="px-4 py-3">{totalOTHours} hrs</td>
              <td className="px-4 py-3" colSpan={2}></td>
              <td className="px-4 py-3">{formatNaira(totalOTAmount)}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

