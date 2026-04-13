import { useMemo } from "react";
import { Clock, TrendingUp, AlertTriangle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_MONTHLY_SUMMARY } from "@/lib/attendance-extended-mock-data";

export default function AttendanceWorkHours() {
  const data = MOCK_MONTHLY_SUMMARY;

  const totalRegularHours = data.reduce((sum, r) => sum + r.totalHoursWorked, 0);
  const totalOvertime = data.reduce((sum, r) => sum + r.overtimeHours, 0);
  const avgDailyHours =
    data.length > 0
      ? (data.reduce((sum, r) => sum + r.totalHoursWorked / r.totalWorkingDays, 0) / data.length).toFixed(1)
      : "0";

  const undertimeThreshold = 7.5; // hours per day average
  const undertimeEmployees = useMemo(
    () =>
      data.filter(
        (r) => r.totalHoursWorked / r.totalWorkingDays < undertimeThreshold
      ),
    []
  );

  const summaryCards = [
    { label: "Total Regular Hours", value: `${totalRegularHours}h`, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Overtime", value: `${totalOvertime}h`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Avg Daily Hours", value: `${avgDailyHours}h`, icon: Timer, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Undertime Count", value: undertimeEmployees.length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  ];

  function getStatus(r: (typeof data)[0]) {
    const avgDaily = r.totalHoursWorked / r.totalWorkingDays;
    if (r.overtimeHours > 5) return { label: "Overtime", bg: "bg-amber-50", color: "text-amber-700" };
    if (avgDaily < undertimeThreshold) return { label: "Undertime", bg: "bg-red-50", color: "text-red-700" };
    return { label: "Normal", bg: "bg-emerald-50", color: "text-emerald-700" };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Work Hours Summary</h1>
        <p className="text-sm text-slate-500">Overview of employee work hours, overtime, and undertime</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", card.bg)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{card.label}</p>
                <p className="text-lg font-semibold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#efefef] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc] text-left">
                <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
                <th className="px-4 py-3 font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Regular Hours</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Overtime Hours</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Total Hours</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Avg Daily</th>
                <th className="px-4 py-3 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => {
                const status = getStatus(r);
                const avgDaily = (r.totalHoursWorked / r.totalWorkingDays).toFixed(1);
                const total = r.totalHoursWorked + r.overtimeHours;
                return (
                  <tr key={r.employeeId} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                    <td className="px-4 py-3 font-medium">{r.employeeName}</td>
                    <td className="px-4 py-3 text-slate-600">{r.department}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{r.totalHoursWorked}h</td>
                    <td className="px-4 py-3 text-right text-slate-600">{r.overtimeHours}h</td>
                    <td className="px-4 py-3 text-right font-medium">{total}h</td>
                    <td className="px-4 py-3 text-right text-slate-600">{avgDaily}h</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", status.bg, status.color)}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Undertime Section */}
      {undertimeEmployees.length > 0 && (
        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Undertime Employees (Below {undertimeThreshold}h/day avg)
          </h2>
          <div className="space-y-2">
            {undertimeEmployees.map((emp) => {
              const avgDaily = (emp.totalHoursWorked / emp.totalWorkingDays).toFixed(1);
              return (
                <div
                  key={emp.employeeId}
                  className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{emp.employeeName}</p>
                    <p className="text-xs text-slate-500">{emp.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">{avgDaily}h/day</p>
                    <p className="text-xs text-slate-500">{emp.totalHoursWorked}h total</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
