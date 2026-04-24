import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Palmtree,
  Check,
  X,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  MOCK_LEAVE_REQUESTS,
  LEAVE_TYPE_LABELS,
} from "@/lib/leave-mock-data";
import type { LeaveStatus, LeaveType } from "@/lib/leave-mock-data";
import {
  ApprovalTimeline,
} from "@/components/shared/approval-workflow";
import type { ApprovalWorkflow } from "@/components/shared/approval-workflow";

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

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const STATUS_DOT: Record<LeaveStatus, string> = {
  pending: "bg-amber-500",
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
  cancelled: "bg-slate-400",
};

const STATUS_PILL: Record<LeaveStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
  cancelled: "bg-slate-100 text-slate-600",
};

const STATUS_LABEL: Record<LeaveStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const MOCK_LEAVE_WORKFLOWS: Record<string, ApprovalWorkflow> = {
  "lv-001": {
    id: "wf-lv-001", module: "leave", requestId: "lv-001", requestType: "Annual Leave",
    requestedBy: "Adebayo Ogunlesi", requestedAt: "2026-03-10T09:00:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Adebayo Ogunlesi", status: "approved", date: "2026-03-10T09:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Emeka Nwosu", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
  "lv-002": {
    id: "wf-lv-002", module: "leave", requestId: "lv-002", requestType: "Sick Leave",
    requestedBy: "Oluwaseun Afolabi", requestedAt: "2026-03-15T08:30:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Oluwaseun Afolabi", status: "approved", date: "2026-03-15T08:30:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Emeka Nwosu", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
  "lv-003": {
    id: "wf-lv-003", module: "leave", requestId: "lv-003", requestType: "Annual Leave",
    requestedBy: "Ibrahim Musa", requestedAt: "2026-03-05T10:00:00", currentStep: 2,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "Ibrahim Musa", status: "approved", date: "2026-03-05T10:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Emeka Nwosu", status: "approved", date: "2026-03-06T11:00:00", comment: "Approved, enjoy your trip." },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "approved", date: "2026-03-06T14:00:00", comment: null },
    ],
    overallStatus: "approved",
  },
};

const ADMIN_SUBMITTED_ENTRY = {
  id: "lv-admin-001",
  employeeId: "emp-020",
  employeeName: "Chidinma Eze",
  department: "Finance",
  leaveType: "annual" as LeaveType,
  startDate: "2026-04-14",
  endDate: "2026-04-18",
  days: 5,
  status: "pending" as LeaveStatus,
  reason: "Family commitment (submitted by admin)",
  appliedOn: "2026-04-08",
  approvedBy: null,
  submittedByAdmin: true,
};

const ALL_LEAVE_REQUESTS = [ADMIN_SUBMITTED_ENTRY, ...MOCK_LEAVE_REQUESTS];

const LEAVE_BALANCE_DATA = [
  { id: "emp-001", employee: "Adebayo Ogunlesi", department: "Engineering", annual: { used: 5, total: 20 }, sick: { used: 2, total: 10 }, casual: { used: 1, total: 5 } },
  { id: "emp-003", employee: "Oluwaseun Afolabi", department: "Engineering", annual: { used: 12, total: 20 }, sick: { used: 7, total: 10 }, casual: { used: 3, total: 5 } },
  { id: "emp-005", employee: "Emeka Okafor", department: "Sales", annual: { used: 3, total: 20 }, sick: { used: 0, total: 10 }, casual: { used: 2, total: 5 } },
  { id: "emp-004", employee: "Fatima Abdullahi", department: "Human Resources", annual: { used: 8, total: 20 }, sick: { used: 4, total: 10 }, casual: { used: 5, total: 5 } },
  { id: "emp-008", employee: "Bukola Adeyemi", department: "Marketing", annual: { used: 15, total: 20 }, sick: { used: 8, total: 10 }, casual: { used: 4, total: 5 } },
  { id: "emp-006", employee: "Aisha Mohammed", department: "Finance", annual: { used: 2, total: 20 }, sick: { used: 1, total: 10 }, casual: { used: 0, total: 5 } },
  { id: "emp-009", employee: "Ibrahim Musa", department: "Operations", annual: { used: 10, total: 20 }, sick: { used: 5, total: 10 }, casual: { used: 3, total: 5 } },
  { id: "emp-018", employee: "Halima Yusuf", department: "Legal", annual: { used: 18, total: 20 }, sick: { used: 9, total: 10 }, casual: { used: 4, total: 5 } },
];

function balanceColor(used: number, total: number) {
  const remaining = total - used;
  const pct = total > 0 ? remaining / total : 0;
  if (pct > 0.5) return "text-emerald-700";
  if (pct >= 0.25) return "text-amber-700";
  return "text-rose-700";
}

function formatDateShort(s: string) {
  return new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}
function formatDateFull(s: string) {
  return new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

type View = "requests" | "balances";

export default function LeavePage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("requests");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Admin form state
  const [adminEmployee, setAdminEmployee] = useState("");
  const [adminDepartment, setAdminDepartment] = useState("");
  const [adminLeaveType, setAdminLeaveType] = useState<LeaveType>("annual");
  const [adminStartDate, setAdminStartDate] = useState("");
  const [adminEndDate, setAdminEndDate] = useState("");
  const [adminReason, setAdminReason] = useState("");

  const departments = useMemo(
    () => [...new Set(ALL_LEAVE_REQUESTS.map((r) => r.department))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return ALL_LEAVE_REQUESTS.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || r.leaveType === typeFilter;
      const matchesDept =
        departmentFilter === "all" || r.department === departmentFilter;
      return matchesSearch && matchesType && matchesDept;
    });
  }, [search, typeFilter, departmentFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: ALL_LEAVE_REQUESTS.length,
    };
    ALL_LEAVE_REQUESTS.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  }, []);

  const handleApprove = (_id: string) => {};
  const handleReject = (_id: string) => {};

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(`Leave request submitted on behalf of ${adminEmployee}`);
    setShowAdminForm(false);
    setAdminEmployee("");
    setAdminDepartment("");
    setAdminLeaveType("annual");
    setAdminStartDate("");
    setAdminEndDate("");
    setAdminReason("");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const totalRequests = ALL_LEAVE_REQUESTS.length;
  const pendingCount = statusCounts["pending"] ?? 0;
  const approvedCount = statusCounts["approved"] ?? 0;
  const approvalRate = totalRequests > 0 ? Math.round((approvedCount / totalRequests) * 100) : 0;

  const kpis = [
    { value: totalRequests, label: "Total requests", icon: Palmtree, trend: 6 },
    { value: pendingCount, label: "Pending review", icon: Clock, trend: 2 },
    { value: approvedCount, label: "Approved", icon: CheckCircle2, trend: 4 },
    { value: `${approvalRate}%`, label: "Approval rate", icon: AlertCircle, trend: 1.5 },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Toast */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leave</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Review, approve, or reject leave requests across the company, submit leave on behalf of
          an employee, and keep balances up to date by type and policy.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-200 p-1">
          <button
            type="button"
            onClick={() => setView("requests")}
            className={cn(
              "h-8 px-3 rounded-md text-sm font-semibold transition-colors",
              view === "requests" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Requests
          </button>
          <button
            type="button"
            onClick={() => setView("balances")}
            className={cn(
              "h-8 px-3 rounded-md text-sm font-semibold transition-colors",
              view === "balances" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Balances
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAdminForm(!showAdminForm)}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Request for employee
          </Button>
        </div>
      </div>

      {/* Admin Request Form */}
      {showAdminForm && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">Request Leave on Behalf of Employee</h2>
          <form onSubmit={handleAdminSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Employee Name</label>
              <input
                type="text"
                required
                value={adminEmployee}
                onChange={(e) => setAdminEmployee(e.target.value)}
                placeholder="e.g. Chidinma Eze"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Department</label>
              <input
                type="text"
                required
                value={adminDepartment}
                onChange={(e) => setAdminDepartment(e.target.value)}
                placeholder="e.g. Finance"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Leave Type</label>
              <select
                value={adminLeaveType}
                onChange={(e) => setAdminLeaveType(e.target.value as LeaveType)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
                <option value="compassionate">Compassionate Leave</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Start Date</label>
              <input
                type="date"
                required
                value={adminStartDate}
                onChange={(e) => setAdminStartDate(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">End Date</label>
              <input
                type="date"
                required
                value={adminEndDate}
                onChange={(e) => setAdminEndDate(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-medium text-slate-500">Reason</label>
              <textarea
                required
                rows={1}
                value={adminReason}
                onChange={(e) => setAdminReason(e.target.value)}
                placeholder="Reason for leave..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
              />
            </div>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowAdminForm(false)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/70 bg-white px-5 pt-5 pb-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-7"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] text-blue-600" />
                </div>
                <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{kpi.trend}</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* View content */}
      {view === "balances" ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">Leave balances</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                {LEAVE_BALANCE_DATA.length}
              </span>
            </div>
            <p className="text-xs text-slate-500">Used / Total days per leave type</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Employee</th>
                  <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Annual</th>
                  <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Sick</th>
                  <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Casual</th>
                  <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {LEAVE_BALANCE_DATA.map((emp) => {
                  const totalUsed = emp.annual.used + emp.sick.used + emp.casual.used;
                  const totalAll = emp.annual.total + emp.sick.total + emp.casual.total;
                  const totalRemaining = totalAll - totalUsed;
                  return (
                    <tr
                      key={emp.employee}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 pl-5 pr-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0",
                              avatarColor(emp.id)
                            )}
                          >
                            {initialsOf(emp.employee)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 leading-tight">{emp.employee}</p>
                            <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">{emp.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className={cn("py-4 pr-5 text-center font-semibold tabular-nums", balanceColor(emp.annual.used, emp.annual.total))}>
                        {emp.annual.used}/{emp.annual.total}
                      </td>
                      <td className={cn("py-4 pr-5 text-center font-semibold tabular-nums", balanceColor(emp.sick.used, emp.sick.total))}>
                        {emp.sick.used}/{emp.sick.total}
                      </td>
                      <td className={cn("py-4 pr-5 text-center font-semibold tabular-nums", balanceColor(emp.casual.used, emp.casual.total))}>
                        {emp.casual.used}/{emp.casual.total}
                      </td>
                      <td className={cn("py-4 pr-5 text-right font-semibold tabular-nums", balanceColor(totalUsed, totalAll))}>
                        {totalRemaining} days
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Panel */}
          {filterOpen && (
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Leave Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(LEAVE_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Department</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Table card */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
            {/* Search + count + filters toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by employee or department..."
                    className="pl-9 bg-white border-slate-200 h-10 rounded-lg"
                  />
                </div>
                <p className="text-sm text-slate-500 whitespace-nowrap">{filtered.length} requests</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setFilterOpen(!filterOpen)}
                className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200/70">
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Employee</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Type</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Duration</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Days</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                    <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((request) => {
                    const isAdminSubmitted = "submittedByAdmin" in request && (request as typeof ADMIN_SUBMITTED_ENTRY).submittedByAdmin;
                    const hasWorkflow = !!MOCK_LEAVE_WORKFLOWS[request.id];
                    return (
                      <React.Fragment key={request.id}>
                        <tr
                          className={cn(
                            "border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors",
                            hasWorkflow && "cursor-pointer"
                          )}
                          onClick={() => hasWorkflow && setExpandedRow(expandedRow === request.id ? null : request.id)}
                        >
                          <td className="py-4 pl-5 pr-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0",
                                  avatarColor(request.employeeId)
                                )}
                              >
                                {initialsOf(request.employeeName)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-slate-900 leading-tight">{request.employeeName}</p>
                                  {isAdminSubmitted && (
                                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                                      By admin
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">{request.department}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-5">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                              {LEAVE_TYPE_LABELS[request.leaveType as LeaveType]}
                            </span>
                          </td>
                          <td className="py-4 pr-5 text-slate-700 tabular-nums">
                            {formatDateShort(request.startDate)} – {formatDateFull(request.endDate)}
                          </td>
                          <td className="py-4 pr-5 font-semibold text-slate-900 tabular-nums">{request.days}</td>
                          <td className="py-4 pr-5">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                                STATUS_PILL[request.status as LeaveStatus]
                              )}
                            >
                              <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[request.status as LeaveStatus])} />
                              {STATUS_LABEL[request.status as LeaveStatus]}
                            </span>
                          </td>
                          <td className="py-4 pr-5 text-right" onClick={(e) => e.stopPropagation()}>
                            {request.status === "pending" ? (
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => handleApprove(request.id)}
                                  className="w-8 h-8 rounded-md text-emerald-600 hover:bg-emerald-50 inline-flex items-center justify-center transition-colors"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                                <button
                                  onClick={() => handleReject(request.id)}
                                  className="w-8 h-8 rounded-md text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center transition-colors"
                                  title="Decline"
                                >
                                  <X className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                        {expandedRow === request.id && hasWorkflow && (
                          <tr>
                            <td colSpan={6} className="p-4 bg-slate-50/60 border-b border-slate-100">
                              <ApprovalTimeline workflow={MOCK_LEAVE_WORKFLOWS[request.id]} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400">
                        <Palmtree className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium text-slate-900">No leave requests found</p>
                        <p className="text-xs mt-1 text-slate-500">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
