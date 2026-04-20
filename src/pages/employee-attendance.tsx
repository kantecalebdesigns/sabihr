import { useState } from "react";
import {
  Clock,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Timer,
  LogIn,
  FileEdit,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ATTENDANCE_STATUS_STYLES,
  MOCK_ATTENDANCE_RECORDS,
  type AttendanceRecord,
  type AttendanceStatus,
} from "@/lib/attendance-mock-data";

// Generate 2 weeks of mock attendance records for emp-001
function generateEmployeeRecords(): AttendanceRecord[] {
  const existing = MOCK_ATTENDANCE_RECORDS.filter(
    (r) => r.employeeId === "emp-001"
  );

  const patterns: {
    status: AttendanceStatus;
    clockIn: string | null;
    clockOut: string | null;
    hoursWorked: number | null;
  }[] = [
    { status: "present", clockIn: "08:45", clockOut: "17:10", hoursWorked: 8.4 },
    { status: "present", clockIn: "08:30", clockOut: "17:15", hoursWorked: 8.8 },
    { status: "late", clockIn: "09:15", clockOut: "17:30", hoursWorked: 8.2 },
    { status: "present", clockIn: "08:50", clockOut: "17:05", hoursWorked: 8.2 },
    { status: "present", clockIn: "08:40", clockOut: "17:20", hoursWorked: 8.7 },
    { status: "absent", clockIn: null, clockOut: null, hoursWorked: null },
    { status: "present", clockIn: "08:35", clockOut: "17:00", hoursWorked: 8.4 },
    { status: "present", clockIn: "08:48", clockOut: "17:10", hoursWorked: 8.4 },
    { status: "late", clockIn: "09:20", clockOut: "17:25", hoursWorked: 8.1 },
    { status: "present", clockIn: "08:42", clockOut: "17:00", hoursWorked: 8.3 },
    { status: "half-day", clockIn: "08:45", clockOut: "13:00", hoursWorked: 4.2 },
    { status: "present", clockIn: "08:30", clockOut: "17:10", hoursWorked: 8.7 },
    { status: "present", clockIn: "08:55", clockOut: "17:15", hoursWorked: 8.3 },
  ];

  const generated: AttendanceRecord[] = [];
  const today = new Date("2026-04-07");

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const day = date.getDay();
    // Skip weekends
    if (day === 0 || day === 6) continue;

    const dateStr = date.toISOString().split("T")[0];
    // Check if we already have an existing record for this date
    const existingRecord = existing.find((r) => r.date === dateStr);
    if (existingRecord) {
      generated.push(existingRecord);
      continue;
    }

    const pattern = patterns[i % patterns.length];
    generated.push({
      id: `att-emp001-${dateStr}`,
      employeeId: "emp-001",
      employeeName: "Adebayo Ogunlesi",
      department: "Engineering",
      date: dateStr,
      clockIn: pattern.clockIn,
      clockOut: pattern.clockOut,
      status: pattern.status,
      hoursWorked: pattern.hoursWorked,
      location: "Lagos Office",
    });
  }

  // Sort descending by date
  return generated.sort((a, b) => b.date.localeCompare(a.date));
}

const MY_RECORDS = generateEmployeeRecords();

function computeMonthStats(records: AttendanceRecord[]) {
  const now = new Date("2026-04-07");
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthRecords = records.filter((r) => {
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const present = monthRecords.filter(
    (r) => r.status === "present" || r.status === "half-day"
  ).length;
  const late = monthRecords.filter((r) => r.status === "late").length;
  const absent = monthRecords.filter((r) => r.status === "absent").length;

  const workedRecords = monthRecords.filter((r) => r.hoursWorked !== null);
  const avgHours =
    workedRecords.length > 0
      ? workedRecords.reduce((sum, r) => sum + (r.hoursWorked ?? 0), 0) /
        workedRecords.length
      : 0;

  return { present, late, absent, avgHours };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EmployeeAttendancePage() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);

  const stats = computeMonthStats(MY_RECORDS);

  const todayStr = "2026-04-07";
  const todayRecord = MY_RECORDS.find((r) => r.date === todayStr);

  const handleClockIn = () => {
    setClockedIn(true);
    setClockInTime("08:47");
  };

  const handleClockOut = () => {
    setClockOutTime("17:05");
  };

  const effectiveClockIn = todayRecord?.clockIn ?? clockInTime;
  const effectiveClockOut = todayRecord?.clockOut ?? clockOutTime;
  const effectiveStatus: AttendanceStatus | null = todayRecord
    ? todayRecord.status
    : clockedIn
      ? "present"
      : null;
  const effectiveHours = todayRecord?.hoursWorked ?? (clockOutTime ? 8.3 : null);

  const summaryCards = [
    {
      label: "Days Present",
      value: stats.present,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Days Late",
      value: stats.late,
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      label: "Days Absent",
      value: stats.absent,
      icon: CalendarDays,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
    },
    {
      label: "Avg Hours/Day",
      value: stats.avgHours.toFixed(1),
      icon: Timer,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          My Attendance
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your daily attendance and work hours
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] px-[21px] pt-[21px] pb-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full bg-[#f8fafc]",
                    card.iconBg
                  )}
                >
                  <Icon className={cn("h-4 w-4", card.iconColor)} />
                </div>
                <span className="text-sm text-slate-500">{card.label}</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-slate-400">This month</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Clock In/Out",
            description: "Record your attendance",
            icon: LogIn,
            path: "/employee/clock-in",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            label: "Request Correction",
            description: "Fix attendance records",
            icon: FileEdit,
            path: "/employee/attendance/correction",
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
          },
          {
            label: "My Dashboard",
            description: "Detailed attendance stats",
            icon: BarChart3,
            path: "/employee/attendance/dashboard",
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
          },
        ].map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] px-[21px] py-4 flex items-center gap-4 hover:bg-[#f8fafc] transition-colors group"
          >
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", action.iconBg)}>
              <action.icon className={cn("h-5 w-5", action.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{action.label}</p>
              <p className="text-xs text-slate-500">{action.description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      {/* Today's Status Card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] px-[21px] pt-[21px] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8fafc]">
              <Clock className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Today's Status
              </h2>
              <p className="text-xs text-slate-500">
                {formatDate(todayStr)}
              </p>
            </div>
          </div>
          {effectiveStatus && (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                ATTENDANCE_STATUS_STYLES[effectiveStatus].bg,
                ATTENDANCE_STATUS_STYLES[effectiveStatus].color
              )}
            >
              {ATTENDANCE_STATUS_STYLES[effectiveStatus].label}
            </span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Clock In</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {effectiveClockIn ?? "--:--"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Clock Out</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {effectiveClockOut ?? "--:--"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Hours Worked</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {effectiveHours !== null ? `${effectiveHours}h` : "--"}
            </p>
          </div>
        </div>

        <div className="mt-5">
          {!clockedIn && !todayRecord ? (
            <button
              onClick={handleClockIn}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Clock className="h-4 w-4" />
              Clock In
            </button>
          ) : !effectiveClockOut ? (
            <button
              onClick={handleClockOut}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Clock className="h-4 w-4" />
              Clock Out
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Work day completed
            </span>
          )}
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="px-[21px] pt-[21px] pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Attendance History
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your attendance records for the past 2 weeks
            </p>
          </div>
          <Link to="/employee/attendance/history" className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline mt-1">
            See all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="px-[21px] py-3 text-left text-xs font-medium text-slate-500">
                  Date
                </th>
                <th className="px-[21px] py-3 text-left text-xs font-medium text-slate-500">
                  Clock In
                </th>
                <th className="px-[21px] py-3 text-left text-xs font-medium text-slate-500">
                  Clock Out
                </th>
                <th className="px-[21px] py-3 text-left text-xs font-medium text-slate-500">
                  Status
                </th>
                <th className="px-[21px] py-3 text-left text-xs font-medium text-slate-500">
                  Hours Worked
                </th>
              </tr>
            </thead>
            <tbody>
              {MY_RECORDS.map((record) => {
                const style = ATTENDANCE_STATUS_STYLES[record.status];
                return (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-[21px] py-3 text-sm text-slate-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-[21px] py-3 text-sm text-slate-900">
                      {record.clockIn ?? "--:--"}
                    </td>
                    <td className="px-[21px] py-3 text-sm text-slate-900">
                      {record.clockOut ?? "--:--"}
                    </td>
                    <td className="px-[21px] py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          style.bg,
                          style.color
                        )}
                      >
                        {style.label}
                      </span>
                    </td>
                    <td className="px-[21px] py-3 text-sm text-slate-900">
                      {record.hoursWorked !== null
                        ? `${record.hoursWorked}h`
                        : "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
