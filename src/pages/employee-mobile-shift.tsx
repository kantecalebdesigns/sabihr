import { useState } from "react";
import { Calendar, Clock, ArrowRightLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const nextAssignment = myAssignments.find((a) => a.date > today);
const nextShift = nextAssignment ? shiftMap.get(nextAssignment.shiftId) : null;

const upcoming7 = myAssignments.filter((a) => a.date >= today).slice(0, 7);

export default function EmployeeMobileShiftPage() {
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [swapDate, setSwapDate] = useState("");
  const [swapReason, setSwapReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowSwapForm(false);
      setSwapDate("");
      setSwapReason("");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Shifts</h1>
        <p className="text-sm text-slate-500">View your schedule and request swaps</p>
      </div>

      {/* Current / Next Shift */}
      <div className="space-y-3">
        {todayShift && todayAssignment && (
          <div
            className="rounded-xl border-2 bg-white p-4"
            style={{ borderColor: todayShift.color }}
          >
            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Today
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: todayShift.color }}
              >
                {todayAssignment.shiftCode}
              </div>
              <div>
                <p className="text-sm font-semibold">{todayShift.name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {todayShift.startTime} - {todayShift.endTime}
                </p>
              </div>
            </div>
          </div>
        )}

        {nextShift && nextAssignment && (
          <div className="rounded-xl border border-[#efefef] bg-white p-4">
            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Next: {nextAssignment.date}
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: nextShift.color }}
              >
                {nextAssignment.shiftCode}
              </div>
              <div>
                <p className="text-sm font-medium">{nextShift.name}</p>
                <p className="text-xs text-slate-500">{nextShift.startTime} - {nextShift.endTime}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7-Day View */}
      <div className="rounded-xl border border-[#efefef] bg-white p-4">
        <h2 className="text-sm font-semibold mb-3">Upcoming 7 Days</h2>
        <div className="space-y-2">
          {upcoming7.map((a) => {
            const shift = shiftMap.get(a.shiftId);
            const dateObj = new Date(a.date);
            const dayName = dateObj.toLocaleDateString("en-NG", { weekday: "short" });
            const dateStr = dateObj.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
            const isToday = a.date === today;
            return (
              <div
                key={a.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2.5",
                  isToday ? "bg-slate-50" : ""
                )}
              >
                <div className="w-10 text-center">
                  <p className="text-xs text-slate-500">{dayName}</p>
                  <p className="text-xs font-semibold">{dateStr}</p>
                </div>
                <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: a.color }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.shiftName}</p>
                  <p className="text-xs text-slate-500">{shift?.startTime} - {shift?.endTime}</p>
                </div>
                {isToday && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">Today</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Request Swap */}
      {!showSwapForm ? (
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl gap-2"
          onClick={() => setShowSwapForm(true)}
        >
          <ArrowRightLeft className="w-4 h-4" /> Request Swap
        </Button>
      ) : (
        <div className="rounded-xl border border-[#efefef] bg-white p-4 space-y-3">
          <h3 className="text-sm font-semibold">Quick Swap Request</h3>
          <form onSubmit={handleSubmitSwap} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Date</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={swapDate}
                onChange={(e) => setSwapDate(e.target.value)}
              >
                <option value="">Select date...</option>
                {upcoming7.map((a) => (
                  <option key={a.id} value={a.date}>{a.date} - {a.shiftName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Reason</label>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                placeholder="Why do you need this swap?"
                value={swapReason}
                onChange={(e) => setSwapReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={submitted || !swapDate} className="gap-1">
                <Send className="w-3.5 h-3.5" /> {submitted ? "Sent!" : "Submit"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setShowSwapForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Shift Legend */}
      <div className="rounded-xl border border-[#efefef] bg-white p-4">
        <h2 className="text-sm font-semibold mb-3">Shift Legend</h2>
        <div className="grid grid-cols-2 gap-2">
          {MOCK_SHIFTS.filter((s) => s.status === "active").map((shift) => (
            <div key={shift.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: shift.color }} />
              <span className="text-xs text-slate-600">{shift.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
