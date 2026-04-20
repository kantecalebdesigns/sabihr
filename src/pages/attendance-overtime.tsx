import React, { useState, useMemo } from "react";
import { Clock, CheckCircle, XCircle, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_OVERTIME_RECORDS,
  formatNaira,
} from "@/lib/attendance-extended-mock-data";
import type { OvertimeRecord } from "@/lib/attendance-extended-mock-data";
import {
  ApprovalStepDots,
  ApprovalTimeline,
} from "@/components/shared/approval-workflow";
import type { ApprovalWorkflow } from "@/components/shared/approval-workflow";

const MOCK_OVERTIME_WORKFLOWS: Record<string, ApprovalWorkflow> = {
  "ot-3": {
    id: "wf-ot-3", module: "overtime", requestId: "ot-3", requestType: "Overtime Request",
    requestedBy: "Damilola Osei", requestedAt: "2026-04-08T21:00:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Damilola Osei", status: "approved", date: "2026-04-08T21:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Emeka Nwosu", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
  "ot-4": {
    id: "wf-ot-4", module: "overtime", requestId: "ot-4", requestType: "Overtime Request",
    requestedBy: "Aisha Mohammed", requestedAt: "2026-04-08T19:30:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Aisha Mohammed", status: "approved", date: "2026-04-08T19:30:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Emeka Nwosu", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
};

type TabKey = "all" | "pending" | "approved" | "rejected";

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  approved: { label: "Approved", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  rejected: { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export default function AttendanceOvertime() {
  const [records, setRecords] = useState<OvertimeRecord[]>(MOCK_OVERTIME_RECORDS);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeTab === "all") return records;
    return records.filter((r) => r.status === activeTab);
  }, [records, activeTab]);

  const totalOTHours = records.reduce((sum, r) => sum + r.overtimeHours, 0);
  const pendingCount = records.filter((r) => r.status === "pending").length;
  const approvedAmount = records
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + r.amount, 0);
  const rejectedCount = records.filter((r) => r.status === "rejected").length;

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: records.length },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "approved", label: "Approved", count: records.filter((r) => r.status === "approved").length },
    { key: "rejected", label: "Rejected", count: rejectedCount },
  ];

  function handleApprove(id: string) {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const, approvedBy: "Admin" } : r))
    );
  }

  function handleReject(id: string) {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const, approvedBy: "Admin" } : r))
    );
  }

  const summaryCards = [
    { label: "Total OT Hours", value: `${totalOTHours}h`, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Approvals", value: pendingCount, icon: Hourglass, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Approved Amount", value: formatNaira(approvedAmount), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Rejected", value: rejectedCount, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Overtime Tracking & Approval</h1>
        <p className="text-sm text-slate-500">Review and approve employee overtime requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", card.bg)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{card.label}</p>
                <p className="text-lg font-semibold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-[#efefef] bg-[#f8fafc] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-slate-400">({tab.count})</span>
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
                <th className="px-4 py-3 font-medium text-slate-600">Scheduled End</th>
                <th className="px-4 py-3 font-medium text-slate-600">Actual End</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">OT Hours</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Rate</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Amount</th>
                <th className="px-4 py-3 font-medium text-slate-600">Reason</th>
                <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 font-medium text-slate-600">Approval</th>
                <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const style = STATUS_STYLES[r.status];
                const workflow = MOCK_OVERTIME_WORKFLOWS[r.id];
                return (
                  <React.Fragment key={r.id}>
                  <tr className="border-b border-slate-100 hover:bg-slate-50/60 cursor-pointer" onClick={() => workflow && setExpandedRow(expandedRow === r.id ? null : r.id)}>
                    <td className="px-4 py-3 font-medium">{r.employeeName}</td>
                    <td className="px-4 py-3 text-slate-600">{r.department}</td>
                    <td className="px-4 py-3 text-slate-600">{r.date}</td>
                    <td className="px-4 py-3 text-slate-600">{r.scheduledEnd}</td>
                    <td className="px-4 py-3 text-slate-600">{r.actualEnd}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{r.overtimeHours}h</td>
                    <td className="px-4 py-3 text-right text-slate-600">{r.rate}x</td>
                    <td className="px-4 py-3 text-right font-medium">{formatNaira(r.amount)}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{r.reason}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", style.bg, style.color)}>
                        {style.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {workflow ? (
                        <button onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === r.id ? null : r.id); }}>
                          <ApprovalStepDots workflow={workflow} />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.status === "pending" && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(r.id)}
                            className="h-7 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(r.id)}
                            className="h-7 text-xs text-red-700 border-red-200 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedRow === r.id && workflow && (
                    <tr>
                      <td colSpan={12} className="p-4 bg-[#f8fafc]">
                        <ApprovalTimeline workflow={workflow} />
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-slate-400">
                    No overtime records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
