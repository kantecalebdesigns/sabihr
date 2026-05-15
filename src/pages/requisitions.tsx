import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Check,
  X,
  ClipboardList,
  Wallet,
  Clock,
  CheckCircle2,
  Receipt,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_REQUISITIONS,
  formatReqCurrency,
} from "@/lib/requisitions-mock-data";
import type {
  Requisition,
  RequisitionStatus,
  RequisitionType,
} from "@/lib/requisitions-mock-data";
import {
  ApprovalStepDots,
  ApprovalTimeline,
} from "@/components/shared/approval-workflow";
import type { ApprovalWorkflow } from "@/components/shared/approval-workflow";

const MOCK_REQ_WORKFLOWS: Record<string, ApprovalWorkflow> = {
  "req-1": {
    id: "wf-req-1",
    module: "requisitions",
    requestId: "req-1",
    requestType: "Expense Requisition",
    requestedBy: "Emeka Okafor",
    requestedAt: "2026-04-02T09:00:00",
    currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Emeka Okafor", status: "approved", date: "2026-04-02T09:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Ngozi Ibe", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
  "req-7": {
    id: "wf-req-7",
    module: "requisitions",
    requestId: "req-7",
    requestType: "Procurement Requisition",
    requestedBy: "Oluwaseun Afolabi",
    requestedAt: "2026-03-18T10:00:00",
    currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Oluwaseun Afolabi", status: "approved", date: "2026-03-18T10:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Chiamaka Eze", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
};

const AVATAR_PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const TYPE_PILL: Record<RequisitionType, { label: string; cls: string; dot: string }> = {
  expense: {
    label: "Expense",
    cls: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  service: {
    label: "Service",
    cls: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  procurement: {
    label: "Procurement",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const STATUS_PILL: Record<RequisitionStatus, { label: string; cls: string; dot: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
  recalled: {
    label: "Recalled",
    cls: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

const CARD_SHELL =
  "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]";

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
    setTimeout(() => {
      setShowForm(false);
      setFormSaved(false);
    }, 1500);
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

  const counts: Record<TabFilter, number> = {
    all: data.length,
    pending: pending.length,
    approved: approved.length,
    rejected: data.filter((r) => r.status === "rejected").length,
    recalled: data.filter((r) => r.status === "recalled").length,
  };

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  const summaryCards = [
    { label: "Total Requests", value: totalRequests, icon: ClipboardList },
    { label: "Pending", value: pending.length, icon: Clock },
    { label: "Approved", value: approved.length, icon: CheckCircle2 },
    {
      label: "Total Amount",
      value: formatReqCurrency(totalAmount),
      icon: Wallet,
    },
  ];

  function handleApprove(id: string) {
    setData((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved" as const,
              approvedDate: new Date().toISOString().slice(0, 10),
            }
          : r
      )
    );
  }

  function handleReject(id: string) {
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
  }

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Requisitions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit and approve expense, service, and procurement requests.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(true);
            setFormSaved(false);
          }}
          className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-1" />
          New request
        </Button>
      </div>

      {/* New Request Form */}
      {showForm &&
        (formSaved ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-2 text-emerald-800 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Requisition submitted successfully
          </div>
        ) : (
          <div className={cn(CARD_SHELL, "p-5 space-y-4")}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                New requisition
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                aria-label="Close form"
              >
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
              <Button
                onClick={handleSaveReq}
                className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
              >
                Submit request
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={cn(CARD_SHELL, "px-5 pt-5 pb-5 flex flex-col gap-7")}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="text-blue-600 w-[18px] h-[18px]" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none tabular-nums">
                  {c.value}
                </p>
                <p className="text-sm text-slate-500 mt-2">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chip filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "text-xs",
                  active ? "text-white/80" : "text-slate-400"
                )}
              >
                {counts[t.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table card */}
      <div className={cn(CARD_SHELL, "overflow-hidden")}>
        {/* Toolbar */}
        <div className="flex items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by employee, category, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <span className="text-sm text-slate-500 shrink-0">
            {filtered.length} request{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-slate-400" />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              No requisitions match your filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
                    Employee
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Type
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Category
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Description
                  </th>
                  <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Amount
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Date
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Status
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Approval
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const typePill = TYPE_PILL[r.type];
                  const statPill = STATUS_PILL[r.status];
                  const workflow = MOCK_REQ_WORKFLOWS[r.id];
                  return (
                    <React.Fragment key={r.id}>
                      <tr
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                        onClick={() => navigate(`/requisitions/${r.id}`)}
                      >
                        <td className="py-4 pl-5 pr-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0",
                                avatarColor(r.id)
                              )}
                            >
                              {initials(r.employeeName)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">
                                {r.employeeName}
                              </p>
                              <p className="text-xs text-slate-500 leading-tight mt-0.5">
                                {r.department}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                              typePill.cls
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                typePill.dot
                              )}
                            />
                            {typePill.label}
                          </span>
                        </td>
                        <td className="py-4 pr-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {r.category}
                          </span>
                        </td>
                        <td className="py-4 pr-5 text-sm text-slate-700 max-w-[240px] truncate">
                          {r.description}
                        </td>
                        <td className="py-4 pr-5 text-sm font-semibold text-slate-900 text-right tabular-nums">
                          {formatReqCurrency(r.amount)}
                        </td>
                        <td className="py-4 pr-5 text-sm text-slate-500">
                          {r.requestDate}
                        </td>
                        <td className="py-4 pr-5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                              statPill.cls
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                statPill.dot
                              )}
                            />
                            {statPill.label}
                          </span>
                        </td>
                        <td className="py-4 pr-5">
                          {workflow ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedRow(
                                  expandedRow === r.id ? null : r.id
                                );
                              }}
                            >
                              <ApprovalStepDots workflow={workflow} />
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-4 pr-5">
                          {r.status === "pending" ? (
                            <div
                              className="flex gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="w-8 h-8 rounded-md text-emerald-600 hover:bg-emerald-50 inline-flex items-center justify-center transition-colors"
                                title="Approve"
                                onClick={() => handleApprove(r.id)}
                              >
                                <Check className="w-4 h-4" strokeWidth={2.5} />
                              </button>
                              <button
                                className="w-8 h-8 rounded-md text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center transition-colors"
                                title="Reject"
                                onClick={() => handleReject(r.id)}
                              >
                                <X className="w-4 h-4" strokeWidth={2.5} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedRow === r.id && workflow && (
                        <tr>
                          <td
                            colSpan={9}
                            className="py-4 px-5 bg-slate-50 border-b border-slate-100"
                          >
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
    </div>
  );
}
