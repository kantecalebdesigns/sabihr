import React, { useState } from "react";
import { ArrowLeftRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_SHIFT_SWAP_REQUESTS } from "@/lib/attendance-extended-mock-data";
import type { ShiftSwapRequest } from "@/lib/attendance-extended-mock-data";
import {
  ApprovalStepDots,
  ApprovalTimeline,
} from "@/components/shared/approval-workflow";
import type { ApprovalWorkflow } from "@/components/shared/approval-workflow";

const MOCK_SWAP_WORKFLOWS: Record<string, ApprovalWorkflow> = {
  "ss-1": {
    id: "wf-ss-1", module: "shift-swap", requestId: "ss-1", requestType: "Shift Swap",
    requestedBy: "Emeka Nwosu", requestedAt: "2026-04-09T10:00:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Emeka Nwosu", status: "approved", date: "2026-04-09T10:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Ibrahim Musa", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
  "ss-2": {
    id: "wf-ss-2", module: "shift-swap", requestId: "ss-2", requestType: "Shift Swap",
    requestedBy: "Segun Adeniyi", requestedAt: "2026-04-09T11:00:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Segun Adeniyi", status: "approved", date: "2026-04-09T11:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Ibrahim Musa", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
};

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  approved: { label: "Approved", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  rejected: { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export default function ShiftSwapQueuePage() {
  const [requests, setRequests] = useState<ShiftSwapRequest[]>(MOCK_SHIFT_SWAP_REQUESTS);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const total = requests.length;
  const pending = requests.filter(r => r.status === "pending").length;
  const approved = requests.filter(r => r.status === "approved").length;
  const rejected = requests.filter(r => r.status === "rejected").length;

  const summaryCards = [
    { label: "Total Requests", value: total, icon: ArrowLeftRight, color: "text-slate-900" },
    { label: "Pending", value: pending, icon: Clock, color: "text-amber-600" },
    { label: "Approved", value: approved, icon: CheckCircle, color: "text-emerald-600" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "text-red-600" },
  ];

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Shift Swap Request Queue</h1>
        <p className="text-sm text-slate-500">Review and manage shift swap requests from employees</p>
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
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200/70 text-left">
              <th className="px-4 py-3 font-medium text-slate-600">Requester</th>
              <th className="px-4 py-3 font-medium text-slate-600">Target Employee</th>
              <th className="px-4 py-3 font-medium text-slate-600">Date</th>
              <th className="px-4 py-3 font-medium text-slate-600">Requester's Shift</th>
              <th className="px-4 py-3 font-medium text-slate-600">Target's Shift</th>
              <th className="px-4 py-3 font-medium text-slate-600">Reason</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 font-medium text-slate-600">Approval</th>
              <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => {
              const style = STATUS_STYLES[req.status];
              const workflow = MOCK_SWAP_WORKFLOWS[req.id];
              return (
                <React.Fragment key={req.id}>
                <tr className="border-b border-slate-100 hover:bg-slate-50/60 cursor-pointer" onClick={() => workflow && setExpandedRow(expandedRow === req.id ? null : req.id)}>
                  <td className="px-4 py-3 font-medium">{req.requesterName}</td>
                  <td className="px-4 py-3">{req.targetName}</td>
                  <td className="px-4 py-3">{new Date(req.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-4 py-3">{req.requesterShift}</td>
                  <td className="px-4 py-3">{req.targetShift}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate" title={req.reason}>{req.reason}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                      {style.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {workflow ? (
                      <button onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === req.id ? null : req.id); }}>
                        <ApprovalStepDots workflow={workflow} />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "pending" ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleAction(req.id, "approved")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction(req.id, "rejected")}>
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                </tr>
                {expandedRow === req.id && workflow && (
                  <tr>
                    <td colSpan={9} className="p-4 bg-[#f8fafc]">
                      <ApprovalTimeline workflow={workflow} />
                    </td>
                  </tr>
                )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
