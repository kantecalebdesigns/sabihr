import { useState } from "react";
import { RefreshCw, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_SHIFT_ASSIGNMENTS, MOCK_SHIFTS, CORRECTION_STATUS_STYLES } from "@/lib/attendance-extended-mock-data";

const MY_ID = "emp-001";
const myAssignments = MOCK_SHIFT_ASSIGNMENTS.filter((a) => a.employeeId === MY_ID);
const activeShifts = MOCK_SHIFTS.filter((s) => s.status === "active");
const shiftMap = new Map(MOCK_SHIFTS.map((s) => [s.id, s]));

const PREVIOUS_REQUESTS = [
  { id: "sc-1", date: "2026-04-10", currentShift: "Morning Shift", requestedShift: "Standard Office", reason: "Need to attend training at 9 AM", status: "approved" as const, submittedAt: "2026-04-07" },
  { id: "sc-2", date: "2026-04-14", currentShift: "Afternoon Shift", requestedShift: "Morning Shift", reason: "Evening class enrollment", status: "pending" as const, submittedAt: "2026-04-09" },
  { id: "sc-3", date: "2026-04-08", currentShift: "Night Shift", requestedShift: "Afternoon Shift", reason: "Health appointment in the morning", status: "rejected" as const, submittedAt: "2026-04-05" },
];

export default function EmployeeShiftChangePage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [requestedShiftId, setRequestedShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const myShiftForDate = myAssignments.find((a) => a.date === selectedDate);
  const currentShift = myShiftForDate ? shiftMap.get(myShiftForDate.shiftId) : null;
  const requestedShift = requestedShiftId ? shiftMap.get(requestedShiftId) : null;

  const availableDates = [...new Set(myAssignments.map((a) => a.date))].sort();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Shift Change Request</h1>
        <p className="text-sm text-slate-500">Request to change your assigned shift</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> New Change Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Select Date</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">Choose a date...</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Current Shift (auto-filled)</label>
              <div className="flex h-10 w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm items-center">
                {currentShift ? `${currentShift.name} (${currentShift.startTime} - ${currentShift.endTime})` : "Select a date first"}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Requested Shift</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={requestedShiftId}
              onChange={(e) => setRequestedShiftId(e.target.value)}
            >
              <option value="">Choose a shift...</option>
              {activeShifts
                .filter((s) => s.id !== currentShift?.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.startTime} - {s.endTime})
                  </option>
                ))}
            </select>
          </div>

          {/* Shift Comparison */}
          {currentShift && requestedShift && (
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-600 mb-3">Shift Comparison</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 rounded-lg p-3 text-center" style={{ backgroundColor: `${currentShift.color}15`, borderColor: `${currentShift.color}40`, border: "1px solid" }}>
                  <p className="text-xs text-slate-500 mb-1">Current</p>
                  <p className="text-sm font-semibold" style={{ color: currentShift.color }}>{currentShift.name}</p>
                  <p className="text-xs text-slate-500">{currentShift.startTime} - {currentShift.endTime}</p>
                  <p className="text-xs text-slate-500">{currentShift.breakMinutes} min break</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="flex-1 rounded-lg p-3 text-center" style={{ backgroundColor: `${requestedShift.color}15`, borderColor: `${requestedShift.color}40`, border: "1px solid" }}>
                  <p className="text-xs text-slate-500 mb-1">Requested</p>
                  <p className="text-sm font-semibold" style={{ color: requestedShift.color }}>{requestedShift.name}</p>
                  <p className="text-xs text-slate-500">{requestedShift.startTime} - {requestedShift.endTime}</p>
                  <p className="text-xs text-slate-500">{requestedShift.breakMinutes} min break</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Reason</label>
            <textarea
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
              placeholder="Why do you need this change?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={submitted || !selectedDate || !requestedShiftId} className="gap-2">
            <Send className="w-4 h-4" /> {submitted ? "Submitted!" : "Submit Change Request"}
          </Button>
        </form>
      </div>

      {/* Previous Requests */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <h2 className="text-sm font-semibold mb-4">Previous Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef]">
                <th className="text-left pb-3 font-medium text-slate-500">Date</th>
                <th className="text-left pb-3 font-medium text-slate-500">Current Shift</th>
                <th className="text-left pb-3 font-medium text-slate-500">Requested Shift</th>
                <th className="text-left pb-3 font-medium text-slate-500">Reason</th>
                <th className="text-left pb-3 font-medium text-slate-500">Status</th>
                <th className="text-left pb-3 font-medium text-slate-500">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {PREVIOUS_REQUESTS.map((r) => {
                const style = CORRECTION_STATUS_STYLES[r.status];
                return (
                  <tr key={r.id} className="border-b border-[#efefef] last:border-0">
                    <td className="py-3">{r.date}</td>
                    <td className="py-3">{r.currentShift}</td>
                    <td className="py-3">{r.requestedShift}</td>
                    <td className="py-3 max-w-[180px] truncate">{r.reason}</td>
                    <td className="py-3">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                        {style.label}
                      </span>
                    </td>
                    <td className="py-3">{r.submittedAt}</td>
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
