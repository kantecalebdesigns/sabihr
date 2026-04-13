import { useState, useMemo } from "react";
import { Download, Users, Clock, AlertTriangle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_ATTENDANCE_RECORDS,
  ATTENDANCE_STATUS_STYLES,
} from "@/lib/attendance-mock-data";

export default function AttendanceDailyReport() {
  const [selectedDate, setSelectedDate] = useState("2026-03-24");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const departments = useMemo(
    () => [...new Set(MOCK_ATTENDANCE_RECORDS.map((r) => r.department))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return MOCK_ATTENDANCE_RECORDS.filter((r) => {
      const matchesDept = departmentFilter === "all" || r.department === departmentFilter;
      return matchesDept;
    });
  }, [departmentFilter]);

  const presentCount = filtered.filter((r) => r.status === "present").length;
  const lateCount = filtered.filter((r) => r.status === "late").length;
  const absentCount = filtered.filter((r) => r.status === "absent").length;
  const onLeaveCount = filtered.filter((r) => r.status === "on-leave").length;
  const attendanceRate =
    filtered.length > 0
      ? (((presentCount + lateCount) / filtered.length) * 100).toFixed(1)
      : "0";

  const summaryCards = [
    { label: "Present", value: presentCount, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Late", value: lateCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Absent", value: absentCount, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "On Leave", value: onLeaveCount, icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Attendance Rate", value: `${attendanceRate}%`, icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Daily Attendance Report</h1>
          <p className="text-sm text-slate-500">View attendance records for a specific date</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
                <th className="px-4 py-3 font-medium text-slate-600">Clock In</th>
                <th className="px-4 py-3 font-medium text-slate-600">Clock Out</th>
                <th className="px-4 py-3 font-medium text-slate-600">Hours Worked</th>
                <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 font-medium text-slate-600">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const style = ATTENDANCE_STATUS_STYLES[r.status];
                return (
                  <tr key={r.id} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                    <td className="px-4 py-3 font-medium">{r.employeeName}</td>
                    <td className="px-4 py-3 text-slate-600">{r.department}</td>
                    <td className="px-4 py-3 text-slate-600">{r.clockIn ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{r.clockOut ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{r.hoursWorked != null ? `${r.hoursWorked}h` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", style.bg, style.color)}>
                        {style.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.location}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No records found.
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
