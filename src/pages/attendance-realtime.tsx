import { useMemo } from "react";
import {
  Users,
  Clock,
  AlertTriangle,
  CalendarOff,
  Briefcase,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_ATTENDANCE_RECORDS,
  ATTENDANCE_STATUS_STYLES,
} from "@/lib/attendance-mock-data";

export default function AttendanceRealtimePage() {
  const stats = useMemo(() => {
    const records = MOCK_ATTENDANCE_RECORDS;
    const present = records.filter((r) => r.status === "present").length;
    const late = records.filter((r) => r.status === "late").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const onLeave = records.filter((r) => r.status === "on-leave").length;
    const halfDay = records.filter((r) => r.status === "half-day").length;
    const total = records.length;
    const rate = ((present + late + halfDay) / total * 100).toFixed(1);

    const clockedIn = records.filter((r) => r.clockIn).map((r) => r.clockIn!).sort();
    const avgClockInMinutes = clockedIn.reduce((sum, t) => {
      const [h, m] = t.split(":").map(Number);
      return sum + h * 60 + m;
    }, 0) / clockedIn.length;
    const avgH = Math.floor(avgClockInMinutes / 60);
    const avgM = Math.round(avgClockInMinutes % 60);
    const avgClockIn = `${String(avgH).padStart(2, "0")}:${String(avgM).padStart(2, "0")}`;

    return { present, late, absent, onLeave, halfDay, total, rate, avgClockIn, earliest: clockedIn[0], latest: clockedIn[clockedIn.length - 1] };
  }, []);

  const bigCards = [
    { label: "Present", value: stats.present, icon: Users, bg: "bg-emerald-50 border-emerald-200", iconBg: "bg-emerald-100 text-emerald-600", textColor: "text-emerald-700" },
    { label: "Late", value: stats.late, icon: Clock, bg: "bg-amber-50 border-amber-200", iconBg: "bg-amber-100 text-amber-600", textColor: "text-amber-700" },
    { label: "Absent", value: stats.absent, icon: AlertTriangle, bg: "bg-red-50 border-red-200", iconBg: "bg-red-100 text-red-600", textColor: "text-red-700" },
    { label: "On Leave", value: stats.onLeave, icon: CalendarOff, bg: "bg-blue-50 border-blue-200", iconBg: "bg-blue-100 text-blue-600", textColor: "text-blue-700" },
    { label: "Total", value: stats.total, icon: Briefcase, bg: "bg-slate-50 border-slate-200", iconBg: "bg-slate-100 text-slate-600", textColor: "text-slate-700" },
  ];

  // Simulated live feed from mock records (most recent clock-ins)
  const liveFeed = useMemo(() => {
    return MOCK_ATTENDANCE_RECORDS
      .filter((r) => r.clockIn)
      .sort((a, b) => (b.clockIn! > a.clockIn! ? 1 : -1))
      .slice(0, 8)
      .map((r) => ({
        id: r.id,
        name: r.employeeName,
        time: r.clockIn!,
        status: r.status,
        location: r.location,
      }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Real-Time Attendance</h1>
        <p className="text-sm text-slate-500">Live attendance dashboard for today</p>
      </div>

      {/* Big Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {bigCards.map((card) => (
          <div key={card.label} className={cn("rounded-xl border p-5 text-center", card.bg)}>
            <div className={cn("mx-auto flex items-center justify-center rounded-full size-12 mb-3", card.iconBg)}>
              <card.icon className="size-6" />
            </div>
            <p className={cn("text-3xl font-bold", card.textColor)}>{card.value}</p>
            <p className="text-xs text-slate-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed */}
        <div className="lg:col-span-1 rounded-xl border border-[#efefef] bg-white">
          <div className="px-5 py-4 border-b border-[#efefef] flex items-center gap-2">
            <Activity className="size-4 text-emerald-500" />
            <h2 className="text-sm font-semibold">Live Feed</h2>
            <span className="relative flex size-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div className="divide-y divide-[#efefef]">
            {liveFeed.map((entry) => {
              const style = ATTENDANCE_STATUS_STYLES[entry.status];
              return (
                <div key={entry.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-slate-400">{entry.location}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                      {entry.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats + Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#efefef] bg-white p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="size-4 text-emerald-500" />
                <span className="text-xs text-slate-500">Attendance Rate</span>
              </div>
              <p className="text-xl font-bold text-emerald-700">{stats.rate}%</p>
            </div>
            <div className="rounded-xl border border-[#efefef] bg-white p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="size-4 text-blue-500" />
                <span className="text-xs text-slate-500">Avg Clock-In</span>
              </div>
              <p className="text-xl font-bold">{stats.avgClockIn}</p>
            </div>
            <div className="rounded-xl border border-[#efefef] bg-white p-4">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="size-4 text-emerald-500" />
                <span className="text-xs text-slate-500">Earliest</span>
              </div>
              <p className="text-xl font-bold text-emerald-700">{stats.earliest}</p>
            </div>
            <div className="rounded-xl border border-[#efefef] bg-white p-4">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownRight className="size-4 text-amber-500" />
                <span className="text-xs text-slate-500">Latest</span>
              </div>
              <p className="text-xl font-bold text-amber-700">{stats.latest}</p>
            </div>
          </div>

          {/* Today's Attendance Table */}
          <div className="rounded-xl border border-[#efefef] bg-white">
            <div className="px-5 py-4 border-b border-[#efefef]">
              <h2 className="text-sm font-semibold">Today's Attendance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fafc] text-left">
                    <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Department</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Clock In</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Clock Out</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Hours</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ATTENDANCE_RECORDS.map((record) => {
                    const style = ATTENDANCE_STATUS_STYLES[record.status];
                    return (
                      <tr key={record.id} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                        <td className="px-4 py-3 font-medium">{record.employeeName}</td>
                        <td className="px-4 py-3 text-slate-600">{record.department}</td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs">{record.clockIn ?? "--:--"}</td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs">{record.clockOut ?? "--:--"}</td>
                        <td className="px-4 py-3 text-slate-600">{record.hoursWorked != null ? `${record.hoursWorked}h` : "-"}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                            {style.label}
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
      </div>
    </div>
  );
}
