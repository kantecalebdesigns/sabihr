import { CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type DayStatus = "present" | "late" | "absent" | "on-leave";

const RECENT_DAYS: { date: string; day: string; clockIn: string | null; clockOut: string | null; hours: string; status: DayStatus }[] = [
  { date: "2026-04-09", day: "Wednesday", clockIn: "08:48", clockOut: null, hours: "--", status: "present" },
  { date: "2026-04-08", day: "Tuesday", clockIn: "08:30", clockOut: "17:05", hours: "8.6", status: "present" },
  { date: "2026-04-07", day: "Monday", clockIn: "09:22", clockOut: "17:30", hours: "8.1", status: "late" },
  { date: "2026-04-04", day: "Friday", clockIn: "08:55", clockOut: "17:10", hours: "8.2", status: "present" },
  { date: "2026-04-03", day: "Thursday", clockIn: "08:40", clockOut: "17:00", hours: "8.3", status: "present" },
  { date: "2026-04-02", day: "Wednesday", clockIn: null, clockOut: null, hours: "--", status: "on-leave" },
  { date: "2026-04-01", day: "Tuesday", clockIn: "08:45", clockOut: "17:10", hours: "8.4", status: "present" },
];

const STATUS_STYLES: Record<DayStatus, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  present: { label: "Present", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700", icon: CheckCircle },
  late: { label: "Late", bg: "bg-amber-50 border-amber-200", color: "text-amber-700", icon: AlertTriangle },
  absent: { label: "Absent", bg: "bg-red-50 border-red-200", color: "text-red-700", icon: Clock },
  "on-leave": { label: "On Leave", bg: "bg-blue-50 border-blue-200", color: "text-blue-700", icon: Clock },
};

export default function EmployeeMobileAttendancePage() {
  return (
    <div className="max-w-md mx-auto space-y-4 pb-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Attendance</h1>
        <p className="text-sm text-slate-500">Your attendance overview</p>
      </div>

      {/* Today's Status */}
      <div className="rounded-xl border border-[#efefef] bg-white p-4 space-y-2">
        <p className="text-xs text-slate-500">Today, April 9, 2026</p>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">Clocked In at 08:48</span>
        </div>
        <div className="flex gap-4 text-xs text-slate-500">
          <span>Clock In: 08:48</span>
          <span>Clock Out: --</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[#efefef] bg-white p-3 text-center">
          <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <p className="text-lg font-bold">18</p>
          <p className="text-xs text-slate-500">Present</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-3 text-center">
          <AlertTriangle className="w-4 h-4 text-amber-600 mx-auto mb-1" />
          <p className="text-lg font-bold">3</p>
          <p className="text-xs text-slate-500">Late</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-3 text-center">
          <TrendingUp className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <p className="text-lg font-bold">91%</p>
          <p className="text-xs text-slate-500">Rate</p>
        </div>
      </div>

      {/* Recent Attendance Cards */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Last 7 Days</h2>
        <div className="space-y-2">
          {RECENT_DAYS.map((day) => {
            const style = STATUS_STYLES[day.status];
            const Icon = style.icon;
            return (
              <div key={day.date} className="rounded-xl border border-[#efefef] bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{day.day}</p>
                    <p className="text-xs text-slate-500">{day.date}</p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                    <Icon className="w-3 h-3" /> {style.label}
                  </span>
                </div>
                {day.clockIn && (
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span>In: {day.clockIn}</span>
                    <span>Out: {day.clockOut || "--"}</span>
                    <span>Hours: {day.hours}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
