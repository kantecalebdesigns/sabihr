import { useState } from "react";
import {
  Download,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_MONTHLY_SUMMARY } from "@/lib/attendance-extended-mock-data";

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

export default function AttendanceMonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState("2026-03");

  const data = MOCK_MONTHLY_SUMMARY;

  const avgAttendance =
    data.length > 0
      ? (data.reduce((sum, r) => sum + r.attendanceRate, 0) / data.length).toFixed(1)
      : "0";
  const totalWorkDays = data.length > 0 ? data[0].totalWorkingDays : 0;
  const totalOvertime = data.reduce((sum, r) => sum + r.overtimeHours, 0);
  const topPerformer = data.reduce(
    (best, r) => (r.attendanceRate > (best?.attendanceRate ?? 0) ? r : best),
    data[0]
  );

  const kpis = [
    { value: `${avgAttendance}%`, label: "Avg attendance rate", icon: TrendingUp },
    { value: totalWorkDays, label: "Work days", icon: Calendar },
    { value: `${totalOvertime}h`, label: "Total overtime", icon: Clock },
    { value: topPerformer?.employeeName.split(" ")[0] ?? "—", label: "Top performer", icon: Award },
  ];

  function ratePill(rate: number): string {
    if (rate >= 95) return "bg-emerald-50 text-emerald-700";
    if (rate >= 85) return "bg-amber-50 text-amber-700";
    return "bg-rose-50 text-rose-700";
  }
  function rateDot(rate: number): string {
    if (rate >= 95) return "bg-emerald-500";
    if (rate >= 85) return "bg-amber-500";
    return "bg-rose-500";
  }

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Monthly summary</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          A roll-up of attendance, hours, and overtime per employee for the selected month —
          perfect for performance reviews or payroll reconciliation.
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
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none truncate">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200/70">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
          />
          <p className="text-sm text-slate-500">{data.length} employees</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Employee</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Department</th>
                <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-3">Days</th>
                <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-3">Present</th>
                <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-3">Late</th>
                <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-3">Absent</th>
                <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-3">Leave</th>
                <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-3">Half</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-3">Hours</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-3">Overtime</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Rate</th>
                <th className="w-10 px-2" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr
                  key={r.employeeId}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-4 pl-5 pr-5">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm", avatarColor(r.employeeId))}>
                        {initialsOf(r.employeeName)}
                      </div>
                      <p className="font-semibold text-slate-900 leading-tight">{r.employeeName}</p>
                    </div>
                  </td>
                  <td className="py-4 pr-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {r.department}
                    </span>
                  </td>
                  <td className="py-4 pr-3 text-center text-slate-700 tabular-nums">{r.totalWorkingDays}</td>
                  <td className="py-4 pr-3 text-center text-slate-700 tabular-nums">{r.daysPresent}</td>
                  <td className="py-4 pr-3 text-center text-slate-700 tabular-nums">{r.daysLate}</td>
                  <td className="py-4 pr-3 text-center text-slate-700 tabular-nums">{r.daysAbsent}</td>
                  <td className="py-4 pr-3 text-center text-slate-700 tabular-nums">{r.daysOnLeave}</td>
                  <td className="py-4 pr-3 text-center text-slate-700 tabular-nums">{r.daysHalfDay}</td>
                  <td className="py-4 pr-3 text-right font-semibold text-slate-900 tabular-nums">{r.totalHoursWorked}h</td>
                  <td className="py-4 pr-3 text-right text-slate-700 tabular-nums">{r.overtimeHours}h</td>
                  <td className="py-4 pr-5 text-right">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", ratePill(r.attendanceRate))}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", rateDot(r.attendanceRate))} />
                      {r.attendanceRate}%
                    </span>
                  </td>
                  <td className="px-2 py-4 text-right">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
