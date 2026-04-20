import { useState, useMemo } from "react";
import {
  Building2,
  Users,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_DEPT_ATTENDANCE } from "@/lib/attendance-extended-mock-data";

// Inline sample employees for expanded view
const SAMPLE_EMPLOYEES: Record<string, { name: string; status: string; clockIn: string; clockOut: string; hours: number }[]> = {
  Engineering: [
    { name: "Adebayo Ogunlesi", status: "present", clockIn: "08:45", clockOut: "17:10", hours: 8.4 },
    { name: "Chiamaka Eze", status: "present", clockIn: "08:30", clockOut: "17:30", hours: 9.0 },
    { name: "Oluwaseun Afolabi", status: "late", clockIn: "09:22", clockOut: "17:00", hours: 7.6 },
    { name: "Tochukwu Nwankwo", status: "late", clockIn: "09:10", clockOut: "17:30", hours: 8.3 },
    { name: "Damilola Osei", status: "present", clockIn: "08:42", clockOut: "17:05", hours: 8.4 },
  ],
  Sales: [
    { name: "Emeka Okafor", status: "absent", clockIn: "--:--", clockOut: "--:--", hours: 0 },
    { name: "Ngozi Ibe", status: "present", clockIn: "08:50", clockOut: "13:00", hours: 4.2 },
    { name: "Olumide Fashola", status: "absent", clockIn: "--:--", clockOut: "--:--", hours: 0 },
  ],
  Marketing: [
    { name: "Bukola Adeyemi", status: "present", clockIn: "08:55", clockOut: "17:00", hours: 8.1 },
    { name: "Amara Obi", status: "late", clockIn: "09:05", clockOut: "17:10", hours: 8.1 },
  ],
  Finance: [
    { name: "Aisha Mohammed", status: "present", clockIn: "08:40", clockOut: "17:15", hours: 8.6 },
    { name: "Chibueze Okoro", status: "present", clockIn: "08:28", clockOut: "17:20", hours: 8.9 },
    { name: "Folake Williams", status: "present", clockIn: "08:38", clockOut: "17:00", hours: 8.4 },
  ],
  "Human Resources": [
    { name: "Fatima Abdullahi", status: "present", clockIn: "08:50", clockOut: "17:05", hours: 8.2 },
    { name: "Kemi Adekunle", status: "on-leave", clockIn: "--:--", clockOut: "--:--", hours: 0 },
  ],
  Operations: [
    { name: "Ibrahim Musa", status: "on-leave", clockIn: "--:--", clockOut: "--:--", hours: 0 },
    { name: "Segun Adeniyi", status: "present", clockIn: "08:55", clockOut: "17:15", hours: 8.3 },
  ],
  Legal: [
    { name: "Yetunde Bakare", status: "present", clockIn: "08:35", clockOut: "17:00", hours: 8.4 },
    { name: "Halima Yusuf", status: "present", clockIn: "08:48", clockOut: "17:00", hours: 8.2 },
  ],
  IT: [
    { name: "Usman Bello", status: "present", clockIn: "08:30", clockOut: "17:00", hours: 8.5 },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  present: "text-emerald-700 bg-emerald-50 border-emerald-200",
  late: "text-amber-700 bg-amber-50 border-amber-200",
  absent: "text-red-700 bg-red-50 border-red-200",
  "on-leave": "text-blue-700 bg-blue-50 border-blue-200",
};

export default function AttendanceDepartmentPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const overallStats = useMemo(() => {
    const totalPresent = MOCK_DEPT_ATTENDANCE.reduce((s, d) => s + d.present + d.late, 0);
    const totalAbsent = MOCK_DEPT_ATTENDANCE.reduce((s, d) => s + d.absent, 0);
    const totalEmployees = MOCK_DEPT_ATTENDANCE.reduce((s, d) => s + d.totalEmployees, 0);
    const overallRate = ((totalPresent / totalEmployees) * 100).toFixed(1);
    return { totalPresent, totalAbsent, overallRate, totalEmployees };
  }, []);

  const summaryCards = [
    { label: "Overall Attendance", value: `${overallStats.overallRate}%`, icon: Building2, iconBg: "bg-blue-100 text-blue-600" },
    { label: "Total Present", value: overallStats.totalPresent, icon: UserCheck, iconBg: "bg-emerald-100 text-emerald-600" },
    { label: "Total Absent", value: overallStats.totalAbsent, icon: UserX, iconBg: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Department Attendance</h1>
        <p className="text-sm text-slate-500">Attendance breakdown by department</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex items-center justify-center rounded-lg size-10", card.iconBg)}>
                <card.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_DEPT_ATTENDANCE.map((dept) => {
          const isExpanded = expanded === dept.department;
          const presentPct = ((dept.present / dept.totalEmployees) * 100).toFixed(0);
          const latePct = ((dept.late / dept.totalEmployees) * 100).toFixed(0);
          const absentPct = ((dept.absent / dept.totalEmployees) * 100).toFixed(0);
          const employees = SAMPLE_EMPLOYEES[dept.department] || [];

          return (
            <div key={dept.department} className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
              <button
                className="w-full text-left p-5 hover:bg-[#f8fafc] transition-colors"
                onClick={() => setExpanded(isExpanded ? null : dept.department)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-slate-400" />
                    <h3 className="font-semibold text-sm">{dept.department}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-700">{dept.attendanceRate}%</span>
                    {isExpanded ? <ChevronUp className="size-4 text-slate-400" /> : <ChevronDown className="size-4 text-slate-400" />}
                  </div>
                </div>

                {/* Bar breakdown */}
                <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-100 mb-3">
                  <div className="bg-emerald-500 transition-all" style={{ width: `${presentPct}%` }} />
                  <div className="bg-amber-400 transition-all" style={{ width: `${latePct}%` }} />
                  <div className="bg-red-400 transition-all" style={{ width: `${absentPct}%` }} />
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">Present</p>
                    <p className="font-semibold text-emerald-700">{dept.present}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Late</p>
                    <p className="font-semibold text-amber-700">{dept.late}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Absent</p>
                    <p className="font-semibold text-red-700">{dept.absent}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Avg Hours</p>
                    <p className="font-semibold">{dept.avgHoursWorked}h</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <Users className="size-3" />
                  {dept.totalEmployees} employees
                </div>
              </button>

              {/* Expanded employee table */}
              {isExpanded && employees.length > 0 && (
                <div className="border-t border-[#efefef]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/70 text-left">
                        <th className="px-4 py-2 font-medium text-slate-500">Name</th>
                        <th className="px-4 py-2 font-medium text-slate-500">Status</th>
                        <th className="px-4 py-2 font-medium text-slate-500">In</th>
                        <th className="px-4 py-2 font-medium text-slate-500">Out</th>
                        <th className="px-4 py-2 font-medium text-slate-500">Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/60">
                          <td className="px-4 py-2 font-medium">{emp.name}</td>
                          <td className="px-4 py-2">
                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize", STATUS_COLORS[emp.status] || "text-slate-500 bg-slate-50 border-slate-200")}>
                              {emp.status.replace("-", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-2 font-mono text-slate-600">{emp.clockIn}</td>
                          <td className="px-4 py-2 font-mono text-slate-600">{emp.clockOut}</td>
                          <td className="px-4 py-2 text-slate-600">{emp.hours > 0 ? `${emp.hours}h` : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
