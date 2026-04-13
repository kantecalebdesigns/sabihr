import { useState, useEffect } from "react";
import { Clock, LogIn, TrendingUp, FileEdit, CheckCircle, AlertTriangle, Flame } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_MONTHLY_SUMMARY } from "@/lib/attendance-extended-mock-data";

const MY_SUMMARY = MOCK_MONTHLY_SUMMARY.find((s) => s.employeeId === "emp-003")!;

const WEEK_DAYS = [
  { day: "Mon", status: "present" as const },
  { day: "Tue", status: "late" as const },
  { day: "Wed", status: "present" as const },
  { day: "Thu", status: "present" as const },
  { day: "Fri", status: "present" as const },
];

const DOT_COLORS: Record<string, string> = {
  present: "bg-emerald-500",
  late: "bg-amber-500",
  absent: "bg-red-500",
  "on-leave": "bg-blue-500",
};

export default function EmployeeAttendanceDashboardPage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Attendance</h1>
        <p className="text-sm text-slate-500">Overview of your attendance for this month</p>
      </div>

      {/* Today's Status Card */}
      <div className="rounded-xl border border-[#efefef] bg-white p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1 text-center sm:text-left space-y-1">
          <p className="text-sm text-slate-500">Today</p>
          <p className="text-3xl font-bold tabular-nums">{formatTime(now)}</p>
          <p className="text-sm text-slate-500">{now.toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-4 h-4 mr-1.5" /> Clocked In at 08:48
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Days Present", value: MY_SUMMARY.daysPresent, icon: CheckCircle, color: "text-emerald-600" },
          { label: "Days Late", value: MY_SUMMARY.daysLate, icon: AlertTriangle, color: "text-amber-600" },
          { label: "Attendance Rate", value: `${MY_SUMMARY.attendanceRate}%`, icon: TrendingUp, color: "text-blue-600" },
          { label: "Overtime Hours", value: `${MY_SUMMARY.overtimeHours}h`, icon: Clock, color: "text-violet-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#efefef] bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{stat.label}</span>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Attendance Streak */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">7 consecutive on-time days</p>
            <p className="text-xs text-slate-500">Keep it up! Your best streak this month is 9 days.</p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-emerald-500" />
            ))}
          </div>
        </div>
      </div>

      {/* This Week */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-semibold mb-4">This Week</h2>
        <div className="flex items-center justify-between gap-2">
          {WEEK_DAYS.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-slate-500">{d.day}</span>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", DOT_COLORS[d.status])}>
                <span className="text-white text-xs font-bold">
                  {d.status === "present" ? "P" : d.status === "late" ? "L" : "A"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Present</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Late</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Absent</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Leave</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="outline" className="h-12 rounded-xl justify-start gap-2" asChild>
          <Link to="/employee/clock-in"><LogIn className="w-4 h-4" /> Clock In</Link>
        </Button>
        <Button variant="outline" className="h-12 rounded-xl justify-start gap-2" asChild>
          <Link to="/employee/attendance/correction"><FileEdit className="w-4 h-4" /> Request Correction</Link>
        </Button>
      </div>
    </div>
  );
}
