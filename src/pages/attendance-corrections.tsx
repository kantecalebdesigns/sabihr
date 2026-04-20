import React, { useState, useMemo } from "react";
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_CORRECTION_REQUESTS,
  CORRECTION_STATUS_STYLES,
} from "@/lib/attendance-extended-mock-data";
import type { AttendanceCorrectionRequest } from "@/lib/attendance-extended-mock-data";
import {
  ApprovalStepDots,
  ApprovalTimeline,
} from "@/components/shared/approval-workflow";
import type { ApprovalWorkflow } from "@/components/shared/approval-workflow";

const MOCK_CORRECTION_WORKFLOWS: Record<string, ApprovalWorkflow> = {
  "cr-1": {
    id: "wf-cr-1", module: "attendance-corrections", requestId: "cr-1", requestType: "Clock-in Correction",
    requestedBy: "Oluwaseun Afolabi", requestedAt: "2026-04-08T09:00:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Oluwaseun Afolabi", status: "approved", date: "2026-04-08T09:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Emeka Nwosu", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
  "cr-2": {
    id: "wf-cr-2", module: "attendance-corrections", requestId: "cr-2", requestType: "Clock-out Correction",
    requestedBy: "Bukola Adeyemi", requestedAt: "2026-04-08T08:30:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Bukola Adeyemi", status: "approved", date: "2026-04-08T08:30:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Emeka Nwosu", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
};

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function AttendanceCorrectionsPage() {
  const [requests, setRequests] = useState<AttendanceCorrectionRequest[]>(MOCK_CORRECTION_REQUESTS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const counts = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;
    return { total: requests.length, pending, approved, rejected };
  }, [requests]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return requests;
    return requests.filter((r) => r.status === activeFilter);
  }, [requests, activeFilter]);

  const summaryCards = [
    { label: "Total Requests", value: counts.total, icon: FileCheck, iconBg: "bg-slate-100 text-slate-600" },
    { label: "Pending", value: counts.pending, icon: Clock, iconBg: "bg-amber-100 text-amber-600" },
    { label: "Approved", value: counts.approved, icon: CheckCircle2, iconBg: "bg-emerald-100 text-emerald-600" },
    { label: "Rejected", value: counts.rejected, icon: XCircle, iconBg: "bg-red-100 text-red-600" },
  ];

  const filterTabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.total },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "approved", label: "Approved", count: counts.approved },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  function handleApprove(id: string) {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "approved" as const, reviewedBy: "Admin", reviewedAt: new Date().toISOString() } : r)));
  }

  function handleReject(id: string) {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "rejected" as const, reviewedBy: "Admin", reviewedAt: new Date().toISOString() } : r)));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Attendance Corrections</h1>
        <p className="text-sm text-slate-500">Review and manage attendance correction requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeFilter === tab.id ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
            )}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.label}
            <span className="ml-1 text-xs text-slate-400">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#efefef] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 text-left">
                <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
                <th className="px-4 py-3 font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 font-medium text-slate-600">Original Times</th>
                <th className="px-4 py-3 font-medium text-slate-600">Requested Times</th>
                <th className="px-4 py-3 font-medium text-slate-600">Reason</th>
                <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 font-medium text-slate-600">Approval</th>
                <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => {
                const style = CORRECTION_STATUS_STYLES[req.status];
                const workflow = MOCK_CORRECTION_WORKFLOWS[req.id];
                return (
                  <React.Fragment key={req.id}>
                  <tr className="border-b border-slate-100 hover:bg-slate-50/60 cursor-pointer" onClick={() => workflow && setExpandedRow(expandedRow === req.id ? null : req.id)}>
                    <td className="px-4 py-3 font-medium">{req.employeeName}</td>
                    <td className="px-4 py-3 text-slate-600">{req.department}</td>
                    <td className="px-4 py-3 text-slate-600">{req.date}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="font-mono text-xs">
                        {req.originalClockIn ?? "--:--"} - {req.originalClockOut ?? "--:--"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="font-mono text-xs text-blue-700 font-medium">
                        {req.requestedClockIn} - {req.requestedClockOut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px]">
                      <p className="truncate text-xs">{req.reason}</p>
                    </td>
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
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon-xs" className="text-emerald-600 hover:bg-emerald-50" onClick={() => handleApprove(req.id)}>
                            <Check className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-xs" className="text-red-600 hover:bg-red-50" onClick={() => handleReject(req.id)}>
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {req.reviewedBy && `by ${req.reviewedBy}`}
                        </span>
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
    </div>
  );
}
