import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MismatchType = "on-leave-clocked-in" | "absent-no-leave" | "leave-mismatch" | "partial-day";

interface ReconciliationRow {
  id: string;
  employeeName: string;
  department: string;
  date: string;
  leaveStatus: string;
  attendanceStatus: string;
  mismatchType: MismatchType;
  resolved: boolean;
}

const MISMATCH_LABELS: Record<MismatchType, { label: string; bg: string; color: string }> = {
  "on-leave-clocked-in": { label: "On Leave but Clocked In", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  "absent-no-leave": { label: "Absent, No Leave", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  "leave-mismatch": { label: "Leave Type Mismatch", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  "partial-day": { label: "Partial Day Conflict", bg: "bg-purple-50 border-purple-200", color: "text-purple-700" },
};

const INITIAL_DATA: ReconciliationRow[] = [
  { id: "lr-1", employeeName: "Adebayo Ogunlesi", department: "Engineering", date: "2026-04-07", leaveStatus: "Approved Annual Leave", attendanceStatus: "Clocked In 08:55 - 17:02", mismatchType: "on-leave-clocked-in", resolved: false },
  { id: "lr-2", employeeName: "Emeka Okafor", department: "Sales", date: "2026-04-08", leaveStatus: "No Leave Recorded", attendanceStatus: "Absent (No Clock-In)", mismatchType: "absent-no-leave", resolved: false },
  { id: "lr-3", employeeName: "Bukola Adeyemi", department: "Marketing", date: "2026-04-07", leaveStatus: "Approved Sick Leave", attendanceStatus: "Clocked In 09:10 - 13:00", mismatchType: "on-leave-clocked-in", resolved: false },
  { id: "lr-4", employeeName: "Oluwaseun Afolabi", department: "Engineering", date: "2026-04-04", leaveStatus: "No Leave Recorded", attendanceStatus: "Absent (No Clock-In)", mismatchType: "absent-no-leave", resolved: true },
  { id: "lr-5", employeeName: "Chiamaka Eze", department: "Engineering", date: "2026-04-09", leaveStatus: "Approved Half-Day Leave", attendanceStatus: "Clocked In 08:45 - 17:30", mismatchType: "partial-day", resolved: false },
  { id: "lr-6", employeeName: "Aisha Mohammed", department: "Finance", date: "2026-04-03", leaveStatus: "Pending Casual Leave", attendanceStatus: "Absent (No Clock-In)", mismatchType: "leave-mismatch", resolved: false },
];

export default function AttendanceLeaveReconciliationPage() {
  const [data, setData] = useState<ReconciliationRow[]>(INITIAL_DATA);

  const totalMismatches = data.length;
  const onLeaveClocked = data.filter(r => r.mismatchType === "on-leave-clocked-in").length;
  const absentNoLeave = data.filter(r => r.mismatchType === "absent-no-leave").length;
  const resolved = data.filter(r => r.resolved).length;

  const summaryCards = [
    { label: "Total Mismatches", value: totalMismatches, icon: AlertTriangle, color: "text-slate-900" },
    { label: "On Leave but Clocked In", value: onLeaveClocked, icon: Clock, color: "text-blue-600" },
    { label: "Absent, No Leave", value: absentNoLeave, icon: XCircle, color: "text-red-600" },
    { label: "Resolved", value: resolved, icon: CheckCircle, color: "text-emerald-600" },
  ];

  const handleResolve = (id: string) => {
    setData(prev => prev.map(r => r.id === id ? { ...r, resolved: true } : r));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Leave-Attendance Reconciliation</h1>
        <p className="text-sm text-slate-500">Identify and resolve mismatches between leave records and attendance data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{card.label}</p>
              <card.icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className={cn("text-2xl font-bold mt-1", card.color)}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-[#f8fafc] text-left">
              <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
              <th className="px-4 py-3 font-medium text-slate-600">Date</th>
              <th className="px-4 py-3 font-medium text-slate-600">Leave Record</th>
              <th className="px-4 py-3 font-medium text-slate-600">Attendance Status</th>
              <th className="px-4 py-3 font-medium text-slate-600">Mismatch Type</th>
              <th className="px-4 py-3 font-medium text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => {
              const mismatch = MISMATCH_LABELS[row.mismatchType];
              return (
                <tr key={row.id} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.employeeName}</div>
                    <div className="text-xs text-slate-500">{row.department}</div>
                  </td>
                  <td className="px-4 py-3">{new Date(row.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-4 py-3">{row.leaveStatus}</td>
                  <td className="px-4 py-3">{row.attendanceStatus}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", mismatch.bg, mismatch.color)}>
                      {mismatch.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.resolved ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle className="h-3 w-3" /> Resolved
                      </span>
                    ) : (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleResolve(row.id)}>
                        Mark as Resolved
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
