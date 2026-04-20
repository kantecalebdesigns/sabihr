import { useState } from "react";
import { FileEdit, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MOCK_CORRECTION_REQUESTS, CORRECTION_STATUS_STYLES } from "@/lib/attendance-extended-mock-data";

const MY_REQUESTS = MOCK_CORRECTION_REQUESTS.filter((r) => r.employeeId === "emp-003");

export default function EmployeeAttendanceCorrectionPage() {
  const [date, setDate] = useState("2026-04-08");
  const [originalIn] = useState("09:22");
  const [originalOut] = useState("");
  const [correctedIn, setCorrectedIn] = useState("08:55");
  const [correctedOut, setCorrectedOut] = useState("17:30");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Attendance Correction</h1>
        <p className="text-sm text-slate-500">Request a correction to your attendance record</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <FileEdit className="w-4 h-4" /> New Correction Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Original Clock In</label>
              <Input value={originalIn || "Not recorded"} readOnly className="bg-slate-50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Original Clock Out</label>
              <Input value={originalOut || "Not recorded"} readOnly className="bg-slate-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Corrected Clock In</label>
              <Input type="time" value={correctedIn} onChange={(e) => setCorrectedIn(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Corrected Clock Out</label>
              <Input type="time" value={correctedOut} onChange={(e) => setCorrectedOut(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Reason</label>
            <textarea
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
              placeholder="Explain why you need this correction..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-600">Change Preview</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">Clock In</p>
                <p><span className="line-through text-red-400">{originalIn || "None"}</span> &rarr; <span className="text-emerald-600 font-medium">{correctedIn}</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Clock Out</p>
                <p><span className="line-through text-red-400">{originalOut || "None"}</span> &rarr; <span className="text-emerald-600 font-medium">{correctedOut}</span></p>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={submitted} className="gap-2">
            <Send className="w-4 h-4" /> {submitted ? "Submitted!" : "Submit Correction Request"}
          </Button>
        </form>
      </div>

      {/* Previous Requests */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <h2 className="text-sm font-semibold mb-4">My Previous Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef]">
                <th className="text-left pb-3 font-medium text-slate-500">Date</th>
                <th className="text-left pb-3 font-medium text-slate-500">Original In/Out</th>
                <th className="text-left pb-3 font-medium text-slate-500">Requested In/Out</th>
                <th className="text-left pb-3 font-medium text-slate-500">Reason</th>
                <th className="text-left pb-3 font-medium text-slate-500">Status</th>
                <th className="text-left pb-3 font-medium text-slate-500">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {MY_REQUESTS.map((r) => {
                const style = CORRECTION_STATUS_STYLES[r.status];
                return (
                  <tr key={r.id} className="border-b border-[#efefef] last:border-0">
                    <td className="py-3">{r.date}</td>
                    <td className="py-3">{r.originalClockIn || "--"} / {r.originalClockOut || "--"}</td>
                    <td className="py-3">{r.requestedClockIn} / {r.requestedClockOut}</td>
                    <td className="py-3 max-w-[200px] truncate">{r.reason}</td>
                    <td className="py-3">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                        {style.label}
                      </span>
                    </td>
                    <td className="py-3">{new Date(r.submittedAt).toLocaleDateString("en-NG")}</td>
                  </tr>
                );
              })}
              {MY_REQUESTS.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400 text-sm">No correction requests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
