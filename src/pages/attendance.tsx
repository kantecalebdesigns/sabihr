import { useState, useMemo } from "react";
import {
  Search,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

function formatDisplayDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-03-24");
  const [sortBy, setSortBy] = useState<"name" | "clockIn" | "hours">("name");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const rows = MOCK_ATTENDANCE_RECORDS.filter((r) => {
      return (
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
      );
    });
    rows.sort((a, b) => {
      if (sortBy === "name") return a.employeeName.localeCompare(b.employeeName);
      if (sortBy === "clockIn") return (a.clockIn ?? "zz").localeCompare(b.clockIn ?? "zz");
      return (b.hoursWorked ?? -1) - (a.hoursWorked ?? -1);
    });
    return rows;
  }, [search, sortBy]);

  const summary = useMemo(() => {
    const records = MOCK_ATTENDANCE_RECORDS;
    return {
      total: records.length,
      present: records.filter((r) => r.status === "present").length,
      late: records.filter((r) => r.status === "late").length,
      absent: records.filter((r) => r.status === "absent").length,
      onLeave: records.filter((r) => r.status === "on-leave").length,
      halfDay: records.filter((r) => r.status === "half-day").length,
    };
  }, []);

  const attendanceRate = Math.round(
    ((summary.present + summary.late + summary.halfDay) / summary.total) * 100
  );

  const kpis = [
    {
      label: "Attendance rate",
      value: `${attendanceRate}%`,
      icon: CheckCircle2,
      trend: 1.2,
      trendDirection: "up" as const,
    },
    {
      label: "Present today",
      value: summary.present,
      icon: Users,
      trend: 4,
      trendDirection: "up" as const,
    },
    {
      label: "Late today",
      value: summary.late,
      icon: AlertTriangle,
      trend: 2,
      trendDirection: "down" as const,
    },
    {
      label: "On leave",
      value: summary.onLeave,
      icon: CalendarDays,
      trend: 1,
      trendDirection: "up" as const,
    },
  ];

  function shiftDate(days: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
  }

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Attendance</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          See who's in today at a glance — review clock-ins, flag late arrivals, approve
          corrections, and export daily attendance reports.
        </p>
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50">
                  <Icon className="w-[18px] h-[18px] text-blue-600" />
                </div>
                <div
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-semibold",
                    up ? "text-emerald-600" : "text-rose-600"
                  )}
                >
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
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3 flex-1">
            {/* Date stepper */}
            <div className="inline-flex items-center gap-1 h-10 rounded-lg border border-slate-200 bg-white px-1">
              <button
                type="button"
                onClick={() => shiftDate(-1)}
                aria-label="Previous day"
                className="w-7 h-7 rounded-md text-slate-500 hover:bg-slate-100 inline-flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-slate-700 px-2 whitespace-nowrap">
                {formatDisplayDate(selectedDate)}
              </span>
              <button
                type="button"
                onClick={() => shiftDate(1)}
                aria-label="Next day"
                className="w-7 h-7 rounded-md text-slate-500 hover:bg-slate-100 inline-flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by employee or department..."
                className="pl-9 bg-white border-slate-200 h-10 rounded-lg"
              />
            </div>
            <p className="text-sm text-slate-500 whitespace-nowrap hidden sm:block">
              {filtered.length} records
            </p>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "clockIn" | "hours")}
              className="appearance-none h-10 pl-3 pr-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 cursor-pointer"
            >
              <option value="name">Sort: Name</option>
              <option value="clockIn">Sort: Clock-in</option>
              <option value="hours">Sort: Hours</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="hidden sm:table-cell w-12 pl-5 py-3">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Employee</th>
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
              {filtered.map((record) => {
                const status = STATUS_PILL[record.status];
                return (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <td className="hidden sm:table-cell pl-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                    </td>
                    <td className="py-4 pr-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm",
                            avatarColor(record.id)
                          )}
                        >
                          {initialsOf(record.employeeName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 leading-tight truncate">
                            {record.employeeName}
                          </p>
                          <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">
                            {record.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {record.department}
                      </span>
                    </td>
                    <td className="py-4 pr-5 font-mono text-xs text-slate-700">
                      {record.clockIn ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-4 pr-5 font-mono text-xs text-slate-700">
                      {record.clockOut ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-4 pr-5">
                      {record.hoursWorked != null ? (
                        <span className="font-semibold text-slate-900 tabular-nums">
                          {record.hoursWorked.toFixed(1)}h
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                          status.pill
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-slate-600 text-xs">{record.location}</td>
                    <td className="px-2 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-slate-900">No attendance records found</p>
                    <p className="text-xs mt-1 text-slate-500">Try adjusting your search or selected date</p>
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
