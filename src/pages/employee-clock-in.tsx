import { useState, useEffect } from "react";
import { LogIn, LogOut, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ClockStatus = "not-clocked" | "clocked-in" | "clocked-out";

const RECENT_HISTORY = [
  { date: "2026-04-08", day: "Wednesday", clockIn: "08:48", clockOut: "17:05", hours: "8.3", status: "present" as const },
  { date: "2026-04-07", day: "Tuesday", clockIn: "09:22", clockOut: "17:30", hours: "8.1", status: "late" as const },
  { date: "2026-04-06", day: "Monday", clockIn: "08:40", clockOut: "17:00", hours: "8.3", status: "present" as const },
  { date: "2026-04-03", day: "Friday", clockIn: "08:55", clockOut: "17:10", hours: "8.2", status: "present" as const },
  { date: "2026-04-02", day: "Thursday", clockIn: "08:30", clockOut: "17:00", hours: "8.5", status: "present" as const },
];

const STATUS_COLORS: Record<string, string> = {
  present: "bg-emerald-50 border-emerald-200 text-emerald-700",
  late: "bg-amber-50 border-amber-200 text-amber-700",
};

export default function EmployeeClockInPage() {
  const [now, setNow] = useState(new Date());
  const [status, setStatus] = useState<ClockStatus>("not-clocked");
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  const formatShortTime = (d: Date) =>
    d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false });

  const handleClockIn = () => {
    setClockInTime(formatShortTime(new Date()));
    setClockOutTime(null);
    setStatus("clocked-in");
  };

  const handleClockOut = () => {
    setClockOutTime(formatShortTime(new Date()));
    setStatus("clocked-out");
  };

  const hoursWorked = () => {
    if (!clockInTime) return "--";
    const end = clockOutTime || formatShortTime(new Date());
    const [h1, m1] = clockInTime.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    const diff = (h2 * 60 + m2 - (h1 * 60 + m1)) / 60;
    return diff > 0 ? diff.toFixed(1) : "--";
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Clock In / Out</h1>
        <p className="text-sm text-slate-500">Record your attendance for today</p>
      </div>

      {/* Live Clock & Action */}
      <div className="rounded-xl border border-[#efefef] bg-white p-8 text-center space-y-6">
        <p className="text-sm text-slate-500">{now.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        <p className="text-5xl font-bold tracking-tight tabular-nums">{formatTime(now)}</p>

        <div className="flex items-center justify-center gap-2">
          {status === "not-clocked" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600">Not Clocked In</span>
          )}
          {status === "clocked-in" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-4 h-4 mr-1.5" /> Clocked In at {clockInTime}
            </span>
          )}
          {status === "clocked-out" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
              Clocked Out at {clockOutTime}
            </span>
          )}
        </div>

        {status !== "clocked-out" ? (
          <Button
            size="lg"
            className={cn(
              "h-14 px-10 text-base font-semibold rounded-xl",
              status === "not-clocked"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            )}
            onClick={status === "not-clocked" ? handleClockIn : handleClockOut}
          >
            {status === "not-clocked" ? (
              <><LogIn className="w-5 h-5 mr-2" /> Clock In</>
            ) : (
              <><LogOut className="w-5 h-5 mr-2" /> Clock Out</>
            )}
          </Button>
        ) : (
          <p className="text-sm text-slate-400">You have completed your shift for today.</p>
        )}
      </div>

      {/* Today's Summary */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-semibold mb-4">Today's Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Clock In</p>
            <p className="text-sm font-medium">{clockInTime || "--:--"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Clock Out</p>
            <p className="text-sm font-medium">{clockOutTime || "--:--"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Hours Worked</p>
            <p className="text-sm font-medium">{hoursWorked()} hrs</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Status</p>
            <p className="text-sm font-medium capitalize">{status === "not-clocked" ? "Pending" : status === "clocked-in" ? "In Progress" : "Completed"}</p>
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-semibold mb-4">Recent Attendance (Last 5 Days)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef]">
                <th className="text-left pb-3 font-medium text-slate-500">Date</th>
                <th className="text-left pb-3 font-medium text-slate-500">Day</th>
                <th className="text-left pb-3 font-medium text-slate-500">Clock In</th>
                <th className="text-left pb-3 font-medium text-slate-500">Clock Out</th>
                <th className="text-left pb-3 font-medium text-slate-500">Hours</th>
                <th className="text-left pb-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_HISTORY.map((r) => (
                <tr key={r.date} className="border-b border-[#efefef] last:border-0">
                  <td className="py-3">{r.date}</td>
                  <td className="py-3">{r.day}</td>
                  <td className="py-3">{r.clockIn}</td>
                  <td className="py-3">{r.clockOut}</td>
                  <td className="py-3">{r.hours}</td>
                  <td className="py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", STATUS_COLORS[r.status])}>
                      {r.status === "present" ? "Present" : "Late"}
                    </span>
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
