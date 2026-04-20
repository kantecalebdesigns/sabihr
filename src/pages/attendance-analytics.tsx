import { useMemo } from "react";
import { AlertTriangle, Clock, Users, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_MONTHLY_SUMMARY,
  MOCK_DEPT_ATTENDANCE,
} from "@/lib/attendance-extended-mock-data";

export default function AttendanceAnalytics() {
  const data = MOCK_MONTHLY_SUMMARY;
  const deptData = MOCK_DEPT_ATTENDANCE;

  const totalAbsences = data.reduce((sum, r) => sum + r.daysAbsent, 0);
  const avgAbsences = data.length > 0 ? (totalAbsences / data.length).toFixed(1) : "0";
  const repeatOffenders = data.filter((r) => r.daysAbsent >= 2).length;
  const latenessRate =
    data.length > 0
      ? ((data.reduce((sum, r) => sum + r.daysLate, 0) / data.reduce((sum, r) => sum + r.totalWorkingDays, 0)) * 100).toFixed(1)
      : "0";

  const topAbsentees = useMemo(
    () => [...data].sort((a, b) => b.daysAbsent - a.daysAbsent).slice(0, 5),
    []
  );

  // Simulated lateness by day of week
  const latenessByDay = [
    { day: "Monday", count: 8, pct: "4.5%" },
    { day: "Tuesday", count: 4, pct: "2.3%" },
    { day: "Wednesday", count: 3, pct: "1.7%" },
    { day: "Thursday", count: 5, pct: "2.8%" },
    { day: "Friday", count: 7, pct: "4.0%" },
  ];

  const summaryCards = [
    { label: "Total Absences (Month)", value: totalAbsences, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Avg Absences/Employee", value: avgAbsences, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Repeat Offenders", value: repeatOffenders, icon: TrendingDown, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Lateness Rate", value: `${latenessRate}%`, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  function trendIndicator(rate: number) {
    if (rate <= 5) return { label: "Low", className: "text-emerald-700 bg-emerald-50" };
    if (rate <= 10) return { label: "Medium", className: "text-amber-700 bg-amber-50" };
    return { label: "High", className: "text-red-700 bg-red-50" };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Absenteeism & Lateness Analytics</h1>
        <p className="text-sm text-slate-500">Identify attendance patterns and repeat offenders</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Absentees */}
        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold">Top Absentees</h2>
          <div className="space-y-3">
            {topAbsentees.map((emp, i) => (
              <div
                key={emp.employeeId}
                className="flex items-center justify-between rounded-lg border border-[#efefef] px-4 py-3 hover:bg-[#f8fafc]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-xs font-semibold text-red-600">
                    #{i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{emp.employeeName}</p>
                    <p className="text-xs text-slate-500">{emp.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">{emp.daysAbsent} days</p>
                  <p className="text-xs text-slate-500">{emp.attendanceRate}% rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lateness Trends */}
        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold">Lateness Trends by Day of Week</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 text-left">
                <th className="px-4 py-2 font-medium text-slate-600">Day</th>
                <th className="px-4 py-2 font-medium text-slate-600 text-center">Late Count</th>
                <th className="px-4 py-2 font-medium text-slate-600 text-right">% of Employees</th>
              </tr>
            </thead>
            <tbody>
              {latenessByDay.map((row) => (
                <tr key={row.day} className="border-b border-[#efefef]">
                  <td className="px-4 py-2 font-medium">{row.day}</td>
                  <td className="px-4 py-2 text-center text-slate-600">{row.count}</td>
                  <td className="px-4 py-2 text-right text-slate-600">{row.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Comparison */}
      <div className="rounded-xl border border-[#efefef] bg-white">
        <div className="border-b border-[#efefef] px-5 py-4">
          <h2 className="text-sm font-semibold">Department Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 text-left">
                <th className="px-4 py-3 font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-center">Total Employees</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Absence Rate</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Lateness Rate</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {deptData.map((dept) => {
                const absenceRate = ((dept.absent / dept.totalEmployees) * 100).toFixed(1);
                const lateRate = ((dept.late / dept.totalEmployees) * 100).toFixed(1);
                const trend = trendIndicator(parseFloat(absenceRate) + parseFloat(lateRate));
                return (
                  <tr key={dept.department} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium">{dept.department}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{dept.totalEmployees}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{absenceRate}%</td>
                    <td className="px-4 py-3 text-right text-slate-600">{lateRate}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", trend.className)}>
                        {trend.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
