import { useState } from "react";
import { ArrowRightLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_SHIFT_ASSIGNMENTS,
  MOCK_SHIFTS,
  MOCK_SHIFT_SWAP_REQUESTS,
  CORRECTION_STATUS_STYLES,
} from "@/lib/attendance-extended-mock-data";

const MY_ID = "emp-001";
const myAssignments = MOCK_SHIFT_ASSIGNMENTS.filter((a) => a.employeeId === MY_ID);
const otherEmployees = Array.from(
  new Map(
    MOCK_SHIFT_ASSIGNMENTS.filter((a) => a.employeeId !== MY_ID).map((a) => [a.employeeId, { id: a.employeeId, name: a.employeeName }])
  ).values()
);

const shiftMap = new Map(MOCK_SHIFTS.map((s) => [s.id, s]));

export default function EmployeeShiftSwapPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedColleague, setSelectedColleague] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const myShiftForDate = myAssignments.find((a) => a.date === selectedDate);
  const colleagueShiftForDate = MOCK_SHIFT_ASSIGNMENTS.find(
    (a) => a.employeeId === selectedColleague && a.date === selectedDate
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const availableDates = [...new Set(myAssignments.map((a) => a.date))].sort();

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Shift Swap Request</h1>
        <p className="text-sm text-slate-500">Request to swap your shift with a colleague</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" /> New Swap Request
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
              <label className="text-xs font-medium text-slate-600">My Current Shift</label>
              <Input
                value={myShiftForDate ? `${myShiftForDate.shiftName} (${shiftMap.get(myShiftForDate.shiftId)?.startTime} - ${shiftMap.get(myShiftForDate.shiftId)?.endTime})` : "Select a date first"}
                readOnly
                className="bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Select Colleague</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedColleague}
                onChange={(e) => setSelectedColleague(e.target.value)}
              >
                <option value="">Choose a colleague...</option>
                {otherEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Their Shift</label>
              <Input
                value={colleagueShiftForDate ? `${colleagueShiftForDate.shiftName} (${shiftMap.get(colleagueShiftForDate.shiftId)?.startTime} - ${shiftMap.get(colleagueShiftForDate.shiftId)?.endTime})` : "Select colleague & date"}
                readOnly
                className="bg-slate-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Reason</label>
            <textarea
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
              placeholder="Why do you need this swap?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={submitted || !selectedDate || !selectedColleague} className="gap-2">
            <Send className="w-4 h-4" /> {submitted ? "Submitted!" : "Submit Swap Request"}
          </Button>
        </form>
      </div>

      {/* Previous Swap Requests */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <h2 className="text-sm font-semibold mb-4">Previous Swap Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef]">
                <th className="text-left pb-3 font-medium text-slate-500">Date</th>
                <th className="text-left pb-3 font-medium text-slate-500">Requester</th>
                <th className="text-left pb-3 font-medium text-slate-500">My Shift</th>
                <th className="text-left pb-3 font-medium text-slate-500">Swap With</th>
                <th className="text-left pb-3 font-medium text-slate-500">Their Shift</th>
                <th className="text-left pb-3 font-medium text-slate-500">Reason</th>
                <th className="text-left pb-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SHIFT_SWAP_REQUESTS.map((r) => {
                const style = CORRECTION_STATUS_STYLES[r.status];
                return (
                  <tr key={r.id} className="border-b border-[#efefef] last:border-0">
                    <td className="py-3">{r.date}</td>
                    <td className="py-3">{r.requesterName}</td>
                    <td className="py-3">{r.requesterShift}</td>
                    <td className="py-3">{r.targetName}</td>
                    <td className="py-3">{r.targetShift}</td>
                    <td className="py-3 max-w-[150px] truncate">{r.reason}</td>
                    <td className="py-3">
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
  );
}
