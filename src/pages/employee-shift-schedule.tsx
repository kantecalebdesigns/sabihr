import { Calendar, Clock, ArrowRightLeft, FileEdit, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MOCK_SHIFT_ASSIGNMENTS, MOCK_SHIFTS } from "@/lib/attendance-extended-mock-data";

const MY_ID = "emp-001";
const myAssignments = MOCK_SHIFT_ASSIGNMENTS.filter((a) => a.employeeId === MY_ID).sort(
  (a, b) => a.date.localeCompare(b.date)
);

const shiftMap = new Map(MOCK_SHIFTS.map((s) => [s.id, s]));

const today = "2026-04-09";
const todayAssignment = myAssignments.find((a) => a.date === today);
const todayShift = todayAssignment ? shiftMap.get(todayAssignment.shiftId) : null;

const upcomingAssignments = myAssignments.filter((a) => a.date > today).slice(0, 14);

export default function EmployeeShiftSchedulePage() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Shift Schedule</h1>
        <p className="text-sm text-slate-500">View your assigned shifts and upcoming schedule</p>
      </div>

      {/* Today's Shift */}
      <div
        className="rounded-xl border-2 bg-white p-6 space-y-3"
        style={{ borderColor: todayShift?.color || "#efefef" }}
      >
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          Today — {new Date(today).toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
        {todayShift ? (
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: todayShift.color }}
            >
              {todayAssignment?.shiftCode}
            </div>
            <div>
              <p className="text-lg font-semibold">{todayShift.name}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {todayShift.startTime} - {todayShift.endTime} ({todayShift.breakMinutes} min break)
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No shift assigned for today</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "Swap Request",
            description: "Swap a shift with a colleague",
            icon: ArrowRightLeft,
            path: "/employee/shifts/swap",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            label: "Change Request",
            description: "Request a shift change",
            icon: FileEdit,
            path: "/employee/shifts/change",
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
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

      {/* Upcoming 2 Weeks */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <h2 className="text-sm font-semibold mb-4">Upcoming Schedule</h2>
        <div className="space-y-2">
          {upcomingAssignments.map((assignment) => {
            const shift = shiftMap.get(assignment.shiftId);
            const dateObj = new Date(assignment.date);
            const dayName = dateObj.toLocaleDateString("en-NG", { weekday: "short" });
            const dateStr = dateObj.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
            return (
              <div key={assignment.id} className="flex items-center gap-3 rounded-lg border border-[#efefef] p-3">
                <div className="w-12 text-center">
                  <p className="text-xs text-slate-500">{dayName}</p>
                  <p className="text-sm font-semibold">{dateStr}</p>
                </div>
                <div
                  className="w-2 h-10 rounded-full"
                  style={{ backgroundColor: assignment.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{assignment.shiftName}</p>
                  <p className="text-xs text-slate-500">
                    {shift?.startTime} - {shift?.endTime}
                  </p>
                </div>
              </div>
            );
          })}
          {upcomingAssignments.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No upcoming shifts scheduled</p>
          )}
        </div>
      </div>

    </div>
  );
}
