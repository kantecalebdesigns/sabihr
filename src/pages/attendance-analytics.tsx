import { useMemo } from "react";
import {
  AlertTriangle,
  Clock,
  Users,
  TrendingDown,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_MONTHLY_SUMMARY,
  MOCK_DEPT_ATTENDANCE,
} from "@/lib/attendance-extended-mock-data";

const AVATAR_PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AttendanceAnalytics() {
  const data = MOCK_MONTHLY_SUMMARY;
  const deptData = MOCK_DEPT_ATTENDANCE;

  const totalAbsences = data.reduce((sum, r) => sum + r.daysAbsent, 0);
  const avgAbsences = data.length > 0 ? (totalAbsences / data.length).toFixed(1) : "0";
  const repeatOffenders = data.filter((r) => r.daysAbsent >= 2).length;
  const latenessRate =
    data.length > 0
      ? (
          (data.reduce((sum, r) => sum + r.daysLate, 0) /
            data.reduce((sum, r) => sum + r.totalWorkingDays, 0)) *
          100
        ).toFixed(1)
      : "0";

  const topAbsentees = useMemo(
    () => [...data].sort((a, b) => b.daysAbsent - a.daysAbsent).slice(0, 5),
    [data]
  );

  const kpis = [
    { value: totalAbsences, label: "Total absences", icon: AlertTriangle },
    { value: avgAbsences, label: "Avg per employee", icon: Users },
    { value: repeatOffenders, label: "Repeat offenders", icon: TrendingDown },
    { value: `${latenessRate}%`, label: "Lateness rate", icon: Clock },
  ];

  function trendPill(rate: number) {
    if (rate <= 5) return { label: "Low", pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
    if (rate <= 10) return { label: "Medium", pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" };
    return { label: "High", pill: "bg-rose-50 text-rose-700", dot: "bg-rose-500" };
  }

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Attendance analytics</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Spot patterns in absenteeism, lateness, and department performance — surface repeat
          offenders and pinpoint days where teams need extra support.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white">
          <Filter className="w-4 h-4 mr-1" />
          Filters
        </Button>
        <Button variant="outline" className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white">
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/70 bg-white px-5 pt-5 pb-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-7"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top absentees */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Top absentees</h3>
          <p className="text-xs text-slate-500 mt-0.5">Employees with the most absences this month</p>
        </div>
        <div className="space-y-2">
          {topAbsentees.map((emp, i) => (
            <div
              key={emp.employeeId}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50/60 transition-colors"
            >
              <span className="text-sm font-semibold text-slate-400 w-5 tabular-nums">#{i + 1}</span>
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-[11px]", avatarColor(emp.employeeId))}>
                {initialsOf(emp.employeeName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{emp.employeeName}</p>
                <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">{emp.department}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-rose-600 tabular-nums">{emp.daysAbsent} days</p>
                <p className="text-[11px] text-slate-500 tabular-nums">{emp.attendanceRate}% rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department comparison */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/70">
          <h3 className="text-sm font-semibold text-slate-900">Department comparison</h3>
          <p className="text-xs text-slate-500 mt-0.5">Absence and lateness rates per department</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Department</th>
                <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Employees</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Absence rate</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Lateness rate</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Trend</th>
              </tr>
            </thead>
            <tbody>
              {deptData.map((dept) => {
                const absenceRate = ((dept.absent / dept.totalEmployees) * 100).toFixed(1);
                const lateRate = ((dept.late / dept.totalEmployees) * 100).toFixed(1);
                const trend = trendPill(parseFloat(absenceRate) + parseFloat(lateRate));
                return (
                  <tr
                    key={dept.department}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 pl-5 pr-5 font-semibold text-slate-900">{dept.department}</td>
                    <td className="py-4 pr-5 text-center text-slate-700 tabular-nums">{dept.totalEmployees}</td>
                    <td className="py-4 pr-5 text-right text-slate-700 tabular-nums">{absenceRate}%</td>
                    <td className="py-4 pr-5 text-right text-slate-700 tabular-nums">{lateRate}%</td>
                    <td className="py-4 pr-5 text-right">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", trend.pill)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", trend.dot)} />
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
