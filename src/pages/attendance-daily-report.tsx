import { useState, useMemo } from "react";
import {
  Download,
  Users,
  Clock,
  AlertTriangle,
  Filter,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_ATTENDANCE_RECORDS } from "@/lib/attendance-mock-data";
import type { AttendanceStatus } from "@/lib/attendance-mock-data";

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

const STATUS_PILL: Record<AttendanceStatus, { dot: string; pill: string; label: string }> = {
  present: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700", label: "Present" },
  late: { dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700", label: "Late" },
  absent: { dot: "bg-rose-500", pill: "bg-rose-50 text-rose-700", label: "Absent" },
  "on-leave": { dot: "bg-blue-500", pill: "bg-blue-50 text-blue-700", label: "On leave" },
  "half-day": { dot: "bg-violet-500", pill: "bg-violet-50 text-violet-700", label: "Half day" },
};

export default function AttendanceDailyReport() {
  const [selectedDate, setSelectedDate] = useState("2026-03-24");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const departments = useMemo(
    () => [...new Set(MOCK_ATTENDANCE_RECORDS.map((r) => r.department))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return MOCK_ATTENDANCE_RECORDS.filter((r) => {
      return departmentFilter === "all" || r.department === departmentFilter;
    });
  }, [departmentFilter]);

  const presentCount = filtered.filter((r) => r.status === "present").length;
  const lateCount = filtered.filter((r) => r.status === "late").length;
  const absentCount = filtered.filter((r) => r.status === "absent").length;
  const attendanceRate =
    filtered.length > 0
      ? (((presentCount + lateCount) / filtered.length) * 100).toFixed(1)
      : "0";

  const kpis = [
    { value: `${attendanceRate}%`, label: "Attendance rate", icon: Users, trend: 1.2, trendDirection: "up" as const },
    { value: presentCount, label: "Present", icon: Users, trend: 4, trendDirection: "up" as const },
    { value: lateCount, label: "Late", icon: Clock, trend: 2, trendDirection: "down" as const },
    { value: absentCount, label: "Absent", icon: AlertTriangle, trend: 1, trendDirection: "down" as const },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daily attendance report</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          A point-in-time snapshot of who was in, late, or absent. Use the date and department
          filters to drill in, then export as CSV for finance or compliance review.
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
          const up = kpi.trendDirection === "up";
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/70 bg-white px-5 pt-5 pb-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-7"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] text-blue-600" />
                </div>
                <div className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", up ? "text-emerald-600" : "text-rose-600")}>
                  {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>
                    {up ? "+" : "-"}
                    {kpi.trend}
                  </span>
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

      {/* Table card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
            />
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="appearance-none h-10 pl-3 pr-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 cursor-pointer"
              >
                <option value="all">All departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <p className="text-sm text-slate-500 whitespace-nowrap">{filtered.length} records</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Employee</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Department</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Clock in</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Clock out</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Hours</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Location</th>
                <th className="w-10 px-2" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const status = STATUS_PILL[r.status];
                return (
                  <tr
                    key={r.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 pl-5 pr-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm",
                            avatarColor(r.id)
                          )}
                        >
                          {initialsOf(r.employeeName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{r.employeeName}</p>
                          <p className="text-xs text-slate-500 leading-tight mt-0.5">{r.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {r.department}
                      </span>
                    </td>
                    <td className="py-4 pr-5 font-mono text-xs text-slate-700">
                      {r.clockIn ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-4 pr-5 font-mono text-xs text-slate-700">
                      {r.clockOut ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-4 pr-5">
                      {r.hoursWorked != null ? (
                        <span className="font-semibold text-slate-900 tabular-nums">{r.hoursWorked.toFixed(1)}h</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-5">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", status.pill)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-slate-600 text-xs">{r.location}</td>
                    <td className="px-2 py-4 text-right">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-slate-900">No records found</p>
                    <p className="text-xs mt-1 text-slate-500">Try a different date or department</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
