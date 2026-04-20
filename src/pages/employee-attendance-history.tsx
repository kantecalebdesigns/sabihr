import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ATTENDANCE_STATUS_STYLES } from "@/lib/attendance-mock-data";
import type { AttendanceStatus } from "@/lib/attendance-mock-data";

interface DayEntry {
  date: number;
  clockIn: string | null;
  clockOut: string | null;
  hours: number | null;
  status: AttendanceStatus;
}

function generateMarchEntries(): DayEntry[] {
  const entries: DayEntry[] = [];
  const statuses: AttendanceStatus[] = ["present", "present", "late", "present", "present", "absent", "on-leave", "present", "present", "present", "late", "present", "present", "present", "present", "half-day", "present", "present", "late", "present", "present", "present"];
  const clockIns = ["08:45", "08:30", "09:15", "08:50", "08:40", null, null, "08:48", "08:35", "08:55", "09:10", "08:42", "08:30", "08:50", "08:45", "08:40", "08:55", "08:38", "09:22", "08:48", "08:30", "08:50"];
  const clockOuts = ["17:10", "17:30", "17:00", "17:05", "17:00", null, null, "17:15", "17:00", "17:10", "17:30", "17:05", "17:00", "17:15", "17:10", "13:00", "17:05", "17:00", "17:30", "17:10", "17:00", "17:15"];

  for (let d = 2; d <= 31; d++) {
    const dow = new Date(2026, 2, d).getDay();
    if (dow === 0 || dow === 6) continue;
    const idx = entries.length % statuses.length;
    const h = clockIns[idx] && clockOuts[idx]
      ? parseFloat(((parseInt(clockOuts[idx]!.split(":")[0]) * 60 + parseInt(clockOuts[idx]!.split(":")[1]) - parseInt(clockIns[idx]!.split(":")[0]) * 60 - parseInt(clockIns[idx]!.split(":")[1])) / 60).toFixed(1))
      : null;
    entries.push({ date: d, clockIn: clockIns[idx], clockOut: clockOuts[idx], hours: h, status: statuses[idx] });
  }
  return entries;
}

const MARCH_ENTRIES = generateMarchEntries();

const STATUS_DOT_COLORS: Record<AttendanceStatus, string> = {
  present: "bg-emerald-500",
  late: "bg-amber-500",
  absent: "bg-red-500",
  "on-leave": "bg-blue-500",
  "half-day": "bg-violet-500",
};

type ViewMode = "calendar" | "table";

export default function EmployeeAttendanceHistoryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [monthOffset, setMonthOffset] = useState(0);
  const baseMonth = 2; // March 2026
  const baseYear = 2026;
  const currentMonth = baseMonth + monthOffset;
  const currentYear = baseYear + Math.floor(currentMonth / 12);
  const adjustedMonth = ((currentMonth % 12) + 12) % 12;

  const monthName = new Date(currentYear, adjustedMonth, 1).toLocaleString("en-NG", { month: "long", year: "numeric" });

  // Build calendar grid
  const firstDay = new Date(currentYear, adjustedMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, adjustedMonth + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon=0

  const entryMap = new Map<number, DayEntry>();
  if (monthOffset === 0) {
    MARCH_ENTRIES.forEach((e) => entryMap.set(e.date, e));
  }

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Attendance History</h1>
          <p className="text-sm text-slate-500">View your monthly attendance records</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg border border-[#efefef] bg-white p-1">
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "calendar"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "table"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Table className="w-3.5 h-3.5" />
            Table
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={() => setMonthOffset(monthOffset - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-sm font-semibold">{monthName}</h2>
          <Button variant="outline" size="sm" onClick={() => setMonthOffset(monthOffset + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="font-medium text-slate-500 py-2">{d}</div>
              ))}
              {calendarCells.map((day, i) => {
                const entry = day ? entryMap.get(day) : null;
                return (
                  <div key={i} className={cn("py-2 h-12 flex flex-col items-center justify-center rounded-lg", day ? "bg-slate-50" : "")}>
                    {day && (
                      <>
                        <span className="text-sm font-medium">{day}</span>
                        {entry && <div className={cn("w-2 h-2 rounded-full mt-0.5", STATUS_DOT_COLORS[entry.status])} />}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Present</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Late</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Absent</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> On Leave</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Half Day</span>
            </div>
          </>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#efefef]">
                  <th className="text-left pb-3 font-medium text-slate-500">Date</th>
                  <th className="text-left pb-3 font-medium text-slate-500">Clock In</th>
                  <th className="text-left pb-3 font-medium text-slate-500">Clock Out</th>
                  <th className="text-left pb-3 font-medium text-slate-500">Hours</th>
                  <th className="text-left pb-3 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {(monthOffset === 0 ? MARCH_ENTRIES : []).map((entry) => {
                  const style = ATTENDANCE_STATUS_STYLES[entry.status];
                  return (
                    <tr key={entry.date} className="border-b border-[#efefef] last:border-0">
                      <td className="py-3">March {entry.date}, 2026</td>
                      <td className="py-3">{entry.clockIn || "--"}</td>
                      <td className="py-3">{entry.clockOut || "--"}</td>
                      <td className="py-3">{entry.hours != null ? `${entry.hours}h` : "--"}</td>
                      <td className="py-3">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                          {style.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {monthOffset !== 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400 text-sm">No data available for this month</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
