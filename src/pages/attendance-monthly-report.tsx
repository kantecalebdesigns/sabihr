import { useState } from "react";
import { Download, TrendingUp, Calendar, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_MONTHLY_SUMMARY } from "@/lib/attendance-extended-mock-data";

export default function AttendanceMonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState("2026-03");

  const data = MOCK_MONTHLY_SUMMARY;

  const avgAttendance =
    data.length > 0
      ? (data.reduce((sum, r) => sum + r.attendanceRate, 0) / data.length).toFixed(1)
      : "0";
  const totalWorkDays = data.length > 0 ? data[0].totalWorkingDays : 0;
  const totalOvertime = data.reduce((sum, r) => sum + r.overtimeHours, 0);
  const topPerformer = data.reduce(
    (best, r) => (r.attendanceRate > (best?.attendanceRate ?? 0) ? r : best),
    data[0]
  );

  const summaryCards = [
    { label: "Avg Attendance Rate", value: `${avgAttendance}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Work Days", value: totalWorkDays, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Overtime Hours", value: `${totalOvertime}h`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Top Performer", value: topPerformer?.employeeName ?? "—", icon: Award, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  function rateColor(rate: number) {
    if (rate >= 95) return "text-emerald-700 bg-emerald-50";
    if (rate >= 85) return "text-amber-700 bg-amber-50";
    return "text-red-700 bg-red-50";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Monthly Attendance Summary</h1>
          <p className="text-sm text-slate-500">Attendance overview for the selected month</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Month Selector */}
      <div>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", card.bg)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{card.label}</p>
                <p className="text-lg font-semibold truncate max-w-[140px]">{card.value}</p>
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
                <th className="px-4 py-3 font-medium text-slate-600 text-center">Work Days</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-center">Present</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-center">Late</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-center">Absent</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-center">Leave</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-center">Half Day</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Hours</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Overtime</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.employeeId} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                  <td className="px-4 py-3 font-medium">{r.employeeName}</td>
                  <td className="px-4 py-3 text-slate-600">{r.department}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{r.totalWorkingDays}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{r.daysPresent}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{r.daysLate}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{r.daysAbsent}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{r.daysOnLeave}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{r.daysHalfDay}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{r.totalHoursWorked}h</td>
                  <td className="px-4 py-3 text-right text-slate-600">{r.overtimeHours}h</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", rateColor(r.attendanceRate))}>
                      {r.attendanceRate}%
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
