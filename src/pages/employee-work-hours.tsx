import { useState } from "react";
import { Clock, TrendingUp, Timer, CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WEEKLY_DATA = [
  { date: "2026-04-07", day: "Monday", clockIn: "08:48", clockOut: "17:05", regular: 8.0, overtime: 0.3, total: 8.3 },
  { date: "2026-04-08", day: "Tuesday", clockIn: "08:30", clockOut: "19:00", regular: 8.0, overtime: 2.5, total: 10.5 },
  { date: "2026-04-09", day: "Wednesday", clockIn: "08:55", clockOut: "17:10", regular: 8.0, overtime: 0.2, total: 8.2 },
  { date: "2026-04-06", day: "Sunday", clockIn: "--", clockOut: "--", regular: 0, overtime: 0, total: 0 },
  { date: "2026-04-05", day: "Saturday", clockIn: "--", clockOut: "--", regular: 0, overtime: 0, total: 0 },
  { date: "2026-04-04", day: "Friday", clockIn: "08:40", clockOut: "17:00", regular: 8.0, overtime: 0.3, total: 8.3 },
  { date: "2026-04-03", day: "Thursday", clockIn: "08:45", clockOut: "20:30", regular: 8.0, overtime: 3.8, total: 11.8 },
];

const MONTHLY_OT = [
  { month: "April 2026", hours: 6.8, amount: "N51,000" },
  { month: "March 2026", hours: 12.0, amount: "N90,000" },
  { month: "February 2026", hours: 8.5, amount: "N63,750" },
];

export default function EmployeeWorkHoursPage() {
  const [showOtForm, setShowOtForm] = useState(false);
  const [otDate, setOtDate] = useState("");
  const [otEndTime, setOtEndTime] = useState("");
  const [otReason, setOtReason] = useState("");

  const totalHours = 158;
  const regularHours = 144;
  const overtimeHours = 14;
  const avgDaily = 8.1;

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Work Hours</h1>
        <p className="text-sm text-slate-500">Track your regular and overtime hours</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Hours (This Month)", value: `${totalHours}h`, icon: Clock, color: "text-blue-600" },
          { label: "Regular Hours", value: `${regularHours}h`, icon: CalendarDays, color: "text-emerald-600" },
          { label: "Overtime Hours", value: `${overtimeHours}h`, icon: Timer, color: "text-amber-600" },
          { label: "Avg Daily", value: `${avgDaily}h`, icon: TrendingUp, color: "text-violet-600" },
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

      {/* Weekly Breakdown */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-semibold mb-4">Weekly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef]">
                <th className="text-left pb-3 font-medium text-slate-500">Date</th>
                <th className="text-left pb-3 font-medium text-slate-500">Day</th>
                <th className="text-left pb-3 font-medium text-slate-500">Clock In</th>
                <th className="text-left pb-3 font-medium text-slate-500">Clock Out</th>
                <th className="text-left pb-3 font-medium text-slate-500">Regular</th>
                <th className="text-left pb-3 font-medium text-slate-500">Overtime</th>
                <th className="text-left pb-3 font-medium text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {WEEKLY_DATA.map((row) => (
                <tr key={row.date} className="border-b border-[#efefef] last:border-0">
                  <td className="py-3">{row.date}</td>
                  <td className="py-3">{row.day}</td>
                  <td className="py-3">{row.clockIn}</td>
                  <td className="py-3">{row.clockOut}</td>
                  <td className="py-3">{row.regular > 0 ? `${row.regular}h` : "--"}</td>
                  <td className="py-3">
                    {row.overtime > 0 ? (
                      <span className="text-amber-600 font-medium">{row.overtime}h</span>
                    ) : "--"}
                  </td>
                  <td className="py-3 font-medium">{row.total > 0 ? `${row.total}h` : "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Overtime */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Request Overtime</h2>
          {!showOtForm && (
            <Button size="sm" variant="outline" onClick={() => setShowOtForm(true)} className="gap-1">
              <Plus className="w-4 h-4" /> New Request
            </Button>
          )}
        </div>

        {showOtForm && (
          <div className="rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Date</label>
                <Input type="date" value={otDate} onChange={(e) => setOtDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Expected End Time</label>
                <Input type="time" value={otEndTime} onChange={(e) => setOtEndTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Reason</label>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[60px]"
                placeholder="Reason for overtime..."
                value={otReason}
                onChange={(e) => setOtReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm">Submit Request</Button>
              <Button size="sm" variant="outline" onClick={() => setShowOtForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {/* Monthly OT History */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-semibold mb-4">Monthly Overtime Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MONTHLY_OT.map((m) => (
            <div key={m.month} className="rounded-lg border border-slate-200 p-4 space-y-1">
              <p className="text-xs text-slate-500">{m.month}</p>
              <p className="text-lg font-bold">{m.hours}h</p>
              <p className="text-xs text-slate-500">Estimated: {m.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
