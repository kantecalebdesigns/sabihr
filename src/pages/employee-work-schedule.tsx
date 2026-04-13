import {
  Clock,
  CalendarDays,
  Coffee,
  Sun,
  Moon,
  MapPin,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MY_SCHEDULE,
  DAYS_OF_WEEK,
  DAY_LABELS,
} from "@/lib/work-schedule-mock-data";

const TODAY_INDEX = new Date().getDay(); // 0=Sun, 1=Mon...
const TODAY_MAP: Record<number, string> = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
const TODAY = TODAY_MAP[TODAY_INDEX];

export default function EmployeeWorkSchedulePage() {
  const schedule = MY_SCHEDULE;
  const isWorkDay = schedule.workDays.includes(TODAY as any);
  const weeklyHours = schedule.workDays.length * schedule.totalHoursPerDay;

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Work Schedule</h1>
        <p className="text-sm text-slate-500">{schedule.name}</p>
      </div>

      {/* Today's status banner */}
      <div className={cn(
        "rounded-xl border p-5 flex items-center gap-4",
        isWorkDay ? "border-[#efefef] bg-white" : "border-blue-200 bg-blue-50"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          isWorkDay ? "bg-[#f0f4f8]" : "bg-blue-100"
        )}>
          {isWorkDay ? <Sun className="w-6 h-6 text-slate-500" /> : <Moon className="w-6 h-6 text-blue-600" />}
        </div>
        <div>
          <p className={cn("font-semibold", isWorkDay ? "text-slate-900" : "text-blue-800")}>
            {isWorkDay ? "Today is a work day" : "Today is a day off"}
          </p>
          <p className={cn("text-sm", isWorkDay ? "text-slate-500" : "text-blue-600")}>
            {isWorkDay
              ? `Your hours are ${schedule.startTime} — ${schedule.endTime}`
              : "Enjoy your rest day!"}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Clock className="w-4 h-4" /><span className="text-xs font-medium">Daily Hours</span></div>
          <p className="text-xl font-semibold">{schedule.totalHoursPerDay}h</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><CalendarDays className="w-4 h-4" /><span className="text-xs font-medium">Work Days</span></div>
          <p className="text-xl font-semibold">{schedule.workDays.length} days</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Clock className="w-4 h-4" /><span className="text-xs font-medium">Weekly Hours</span></div>
          <p className="text-xl font-semibold">{weeklyHours}h</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Coffee className="w-4 h-4" /><span className="text-xs font-medium">Break</span></div>
          <p className="text-xl font-semibold">{schedule.breakStart ? `${schedule.breakStart}` : "None"}</p>
        </div>
      </div>

      {/* Weekly schedule */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
        <h2 className="font-semibold">Weekly Schedule</h2>
        <div className="space-y-2">
          {DAYS_OF_WEEK.map((day) => {
            const isActive = schedule.workDays.includes(day);
            const isToday = day === TODAY;
            return (
              <div
                key={day}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-4 py-3 transition-colors",
                  isToday && isActive ? "border-blue-200 bg-blue-50" :
                  isToday && !isActive ? "border-slate-200 bg-slate-50" :
                  isActive ? "border-[#efefef] bg-white" :
                  "border-transparent bg-[#f8fafc]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold",
                    isActive
                      ? isToday ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-400"
                  )}>
                    {day}
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium", !isActive && "text-slate-400")}>
                      {DAY_LABELS[day]}
                      {isToday && <span className="ml-2 text-xs font-medium text-blue-600">(Today)</span>}
                    </p>
                    <p className="text-xs text-slate-500">
                      {isActive ? `${schedule.startTime} — ${schedule.endTime}` : "Day off"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {isActive ? (
                    <span className="text-sm font-medium text-slate-700">{schedule.totalHoursPerDay}h</span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule details */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
        <h2 className="font-semibold">Schedule Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Sun className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-500">Work Hours</span>
              <p className="font-medium">{schedule.startTime} — {schedule.endTime}</p>
            </div>
          </div>
          {schedule.breakStart && (
            <div className="flex items-start gap-3">
              <Coffee className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-500">Break Period</span>
                <p className="font-medium">{schedule.breakStart} — {schedule.breakEnd}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <CalendarDays className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-500">Schedule Type</span>
              <p className="font-medium">{schedule.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-500">Department</span>
              <p className="font-medium">{schedule.department ?? "Company-wide"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3 text-sm text-blue-800">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>Your work schedule is managed by your HR administrator. If you need to request a schedule change, please contact your manager or HR department.</p>
      </div>
    </div>
  );
}
