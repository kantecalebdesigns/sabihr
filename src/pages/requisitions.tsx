import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Check, X, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_REQUISITIONS,
  REQ_TYPE_STYLES,
  REQ_STATUS_STYLES,
  formatReqCurrency,
} from "@/lib/requisitions-mock-data";
import type { Requisition, RequisitionStatus } from "@/lib/requisitions-mock-data";
import {
  ApprovalStepDots,
  ApprovalTimeline,
} from "@/components/shared/approval-workflow";
import type { ApprovalWorkflow } from "@/components/shared/approval-workflow";

const MOCK_REQ_WORKFLOWS: Record<string, ApprovalWorkflow> = {
  "req-1": {
    id: "wf-req-1", module: "requisitions", requestId: "req-1", requestType: "Expense Requisition",
    requestedBy: "Emeka Okafor", requestedAt: "2026-04-02T09:00:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Emeka Okafor", status: "approved", date: "2026-04-02T09:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Ngozi Ibe", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
  "req-7": {
    id: "wf-req-7", module: "requisitions", requestId: "req-7", requestType: "Procurement Requisition",
    requestedBy: "Oluwaseun Afolabi", requestedAt: "2026-03-18T10:00:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Oluwaseun Afolabi", status: "approved", date: "2026-03-18T10:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Chiamaka Eze", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
};

type TabFilter = "all" | RequisitionStatus;

export default function RequisitionsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Requisition[]>(MOCK_REQUISITIONS);
  const [showForm, setShowForm] = useState(false);
  const [formSaved, setFormSaved] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSaveReq = () => {
    setFormSaved(true);
    setTimeout(() => { setShowForm(false); setFormSaved(false); }, 1500);
  };

  const filtered = useMemo(() => {
    let list = data;
    if (tab !== "all") list = list.filter((r) => r.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, tab, search]);

  const totalRequests = data.length;
  const pending = data.filter((r) => r.status === "pending");
  const approved = data.filter((r) => r.status === "approved");
  const totalAmount = [...pending, ...approved].reduce((s, r) => s + r.amount, 0);

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "All Requests" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  function handleApprove(id: string) {
    setData((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "approved" as const, approvedDate: new Date().toISOString().slice(0, 10) } : r
      )
    );
  }

  function handleReject(id: string) {
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
  }

  const summaryCards = [
    { label: "Total Requests", value: totalRequests },
    { label: "Pending", value: pending.length },
    { label: "Approved", value: approved.length },
    { label: "Total Amount", value: formatReqCurrency(totalAmount) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Requisitions</h1>
        <Button onClick={() => { setShowForm(true); setFormSaved(false); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* New Request Form */}
      {showForm && (
        formSaved ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-2 text-emerald-800 text-sm">
            <Check className="w-4 h-4" />
            Requisition submitted successfully
          </div>
        ) : (
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">New Requisition</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-[#f8fafc] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Type</label>
                <Input placeholder="Expense, Service, or Procurement" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Category</label>
                <Input placeholder="e.g. Travel, Equipment" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Amount (₦)</label>
                <Input placeholder="e.g. 50000" type="number" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Approver</label>
                <Input placeholder="Manager name" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Description</label>
              <Input placeholder="What is this requisition for?" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={handleSaveReq}>Submit Request</Button>
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-2xl font-semibold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#efefef]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors -mb-px",
              tab === t.key
                ? "border-b-2 border-blue-600 text-slate-900"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search requisitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#efefef] bg-white p-12 text-center">
          <ClipboardList className="w-10 h-10 mx-auto text-slate-500" />
          <p className="mt-3 text-sm text-slate-500">No requisitions found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="p-3 text-xs font-medium text-slate-500">Employee</th>
                <th className="p-3 text-xs font-medium text-slate-500">Type</th>
                <th className="p-3 text-xs font-medium text-slate-500">Category</th>
                <th className="p-3 text-xs font-medium text-slate-500">Description</th>
                <th className="p-3 text-xs font-medium text-slate-500">Amount</th>
                <th className="p-3 text-xs font-medium text-slate-500">Date</th>
                <th className="p-3 text-xs font-medium text-slate-500">Status</th>
                <th className="p-3 text-xs font-medium text-slate-500">Approval</th>
                <th className="p-3 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => {
                const typeStyle = REQ_TYPE_STYLES[r.type];
                const statusStyle = REQ_STATUS_STYLES[r.status];
                const workflow = MOCK_REQ_WORKFLOWS[r.id];
                return (
                  <React.Fragment key={r.id}>
                  <tr
                    className="hover:bg-[#f8fafc] cursor-pointer transition-colors"
                    onClick={() => navigate(`/requisitions/${r.id}`)}
                  >
                    <td className="p-3">
                      <p className="text-sm font-medium">{r.employeeName}</p>
                      <p className="text-xs text-slate-500">{r.department}</p>
                    </td>
                    <td className={cn("p-3 text-sm font-medium", typeStyle.color)}>{typeStyle.label}</td>
                    <td className="p-3 text-sm">{r.category}</td>
                    <td className="p-3 text-sm text-slate-500 max-w-[200px] truncate">{r.description}</td>
                    <td className="p-3 text-sm font-medium">{formatReqCurrency(r.amount)}</td>
                    <td className="p-3 text-sm text-slate-500">{r.requestDate}</td>
                    <td className={cn("p-3 text-sm font-medium", statusStyle.color)}>{statusStyle.label}</td>
                    <td className="p-3">
                      {workflow ? (
                        <button onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === r.id ? null : r.id); }}>
                          <ApprovalStepDots workflow={workflow} />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">--</span>
                      )}
                    </td>
                    <td className="p-3">
                      {r.status === "pending" && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Approve"
                            onClick={() => handleApprove(r.id)}
                          >
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                          <button
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                            title="Reject"
                            onClick={() => handleReject(r.id)}
                          >
                            <X className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedRow === r.id && workflow && (
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
      )}
    </div>
  );
}
