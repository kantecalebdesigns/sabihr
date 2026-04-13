import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Palmtree,
  Check,
  X,
  Plus,
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
  LEAVE_STATUS_STYLES,
  LEAVE_TYPE_LABELS,
  LEAVE_POLICY_SUMMARY,
} from "@/lib/leave-mock-data";
import type { LeaveStatus, LeaveType } from "@/lib/leave-mock-data";
import {
  ApprovalStepDots,
  ApprovalTimeline,
} from "@/components/shared/approval-workflow";
import type { ApprovalWorkflow } from "@/components/shared/approval-workflow";

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

// Mock admin-submitted entry
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

// Mock leave balance data for 8 employees
const LEAVE_BALANCE_DATA = [
  { employee: "Adebayo Ogunlesi", department: "Engineering", annual: { used: 5, total: 20 }, sick: { used: 2, total: 10 }, casual: { used: 1, total: 5 } },
  { employee: "Oluwaseun Afolabi", department: "Engineering", annual: { used: 12, total: 20 }, sick: { used: 7, total: 10 }, casual: { used: 3, total: 5 } },
  { employee: "Emeka Okafor", department: "Sales", annual: { used: 3, total: 20 }, sick: { used: 0, total: 10 }, casual: { used: 2, total: 5 } },
  { employee: "Fatima Abdullahi", department: "Human Resources", annual: { used: 8, total: 20 }, sick: { used: 4, total: 10 }, casual: { used: 5, total: 5 } },
  { employee: "Bukola Adeyemi", department: "Marketing", annual: { used: 15, total: 20 }, sick: { used: 8, total: 10 }, casual: { used: 4, total: 5 } },
  { employee: "Aisha Mohammed", department: "Finance", annual: { used: 2, total: 20 }, sick: { used: 1, total: 10 }, casual: { used: 0, total: 5 } },
  { employee: "Ibrahim Musa", department: "Operations", annual: { used: 10, total: 20 }, sick: { used: 5, total: 10 }, casual: { used: 3, total: 5 } },
  { employee: "Halima Yusuf", department: "Legal", annual: { used: 18, total: 20 }, sick: { used: 9, total: 10 }, casual: { used: 4, total: 5 } },
];

function balanceColor(used: number, total: number) {
  const remaining = total - used;
  const pct = total > 0 ? remaining / total : 0;
  if (pct > 0.5) return "text-emerald-700";
  if (pct >= 0.25) return "text-amber-700";
  return "text-red-700";
}

type ActiveTab = "all" | "pending" | "approved" | "rejected" | "balances";

export default function LeavePage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
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

  const statusFilter = activeTab === "balances" ? "all" : activeTab;

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
      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;
      const matchesType = typeFilter === "all" || r.leaveType === typeFilter;
      const matchesDept =
        departmentFilter === "all" || r.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesType && matchesDept;
    });
  }, [search, statusFilter, typeFilter, departmentFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: ALL_LEAVE_REQUESTS.length,
    };
    ALL_LEAVE_REQUESTS.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  }, []);

  const handleApprove = (_id: string) => {
    // Mock action
  };

  const handleReject = (_id: string) => {
    // Mock action
  };

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

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Toast */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Leave Management
          </h1>
          <p className="text-sm text-slate-500">
            Review and manage employee leave requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#efefef]"
            onClick={() => setShowAdminForm(!showAdminForm)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Request Leave for Employee
          </Button>
          <Button variant="outline" size="sm" className="border-[#efefef]">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Admin Request Form */}
      {showAdminForm && (
        <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
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
                className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Leave Type</label>
              <select
                value={adminLeaveType}
                onChange={(e) => setAdminLeaveType(e.target.value as LeaveType)}
                className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">End Date</label>
              <input
                type="date"
                required
                value={adminEndDate}
                onChange={(e) => setAdminEndDate(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                className="w-full rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
              />
            </div>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowAdminForm(false)}
                className="h-9 rounded-lg border border-[#efefef] bg-white px-4 text-sm font-medium text-slate-700 hover:bg-[#f8fafc] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Policy Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(LEAVE_POLICY_SUMMARY).map(([key, policy]) => (
          <div
            key={key}
            className="rounded-xl border border-[#efefef] bg-white p-3 text-center"
          >
            <p className="text-xs text-slate-500 mb-1">
              {policy.label}
            </p>
            <p className="text-lg font-semibold text-slate-900">{policy.total}</p>
            <p className="text-[10px] text-slate-500">days/year</p>
          </div>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { key: "all" as ActiveTab, label: "All Requests" },
          { key: "pending" as ActiveTab, label: "Pending" },
          { key: "approved" as ActiveTab, label: "Approved" },
          { key: "rejected" as ActiveTab, label: "Rejected" },
          { key: "balances" as ActiveTab, label: "Balances" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {tab.label}
            {tab.key !== "balances" && statusCounts[tab.key] ? (
              <span
                className={cn(
                  "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                  tab.key === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-[#f8fafc]"
                )}
              >
                {statusCounts[tab.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Balances Tab Content */}
      {activeTab === "balances" ? (
        <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
                <th className="p-3 text-center text-xs font-medium text-slate-500">Annual (Used/Total)</th>
                <th className="p-3 text-center text-xs font-medium text-slate-500">Sick (Used/Total)</th>
                <th className="p-3 text-center text-xs font-medium text-slate-500">Casual (Used/Total)</th>
                <th className="p-3 text-center text-xs font-medium text-slate-500">Total Used</th>
                <th className="p-3 text-center text-xs font-medium text-slate-500">Total Remaining</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_BALANCE_DATA.map((emp) => {
                const totalUsed = emp.annual.used + emp.sick.used + emp.casual.used;
                const totalAll = emp.annual.total + emp.sick.total + emp.casual.total;
                const totalRemaining = totalAll - totalUsed;
                return (
                  <tr key={emp.employee} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3 font-medium text-slate-900">{emp.employee}</td>
                    <td className="p-3 text-slate-500">{emp.department}</td>
                    <td className={cn("p-3 text-center font-medium", balanceColor(emp.annual.used, emp.annual.total))}>
                      {emp.annual.used}/{emp.annual.total}
                    </td>
                    <td className={cn("p-3 text-center font-medium", balanceColor(emp.sick.used, emp.sick.total))}>
                      {emp.sick.used}/{emp.sick.total}
                    </td>
                    <td className={cn("p-3 text-center font-medium", balanceColor(emp.casual.used, emp.casual.total))}>
                      {emp.casual.used}/{emp.casual.total}
                    </td>
                    <td className="p-3 text-center font-medium text-slate-900">{totalUsed}</td>
                    <td className={cn("p-3 text-center font-medium", balanceColor(totalUsed, totalAll))}>
                      {totalRemaining}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by employee or department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterOpen(!filterOpen)}
                className="border-[#efefef]"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#efefef] bg-white p-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Leave Type
                </label>
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
                <label className="text-xs font-medium text-slate-500">
                  Department
                </label>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
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

          {/* Table */}
          <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                  <th className="p-3 text-left text-xs font-medium text-slate-500">
                    Employee
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">
                    Department
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">
                    Leave Type
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">
                    Duration
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">
                    Days
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">
                    Applied On
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">
                    Status
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">
                    Approval
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((request) => {
                  const statusStyle =
                    LEAVE_STATUS_STYLES[request.status as LeaveStatus];
                  const isAdminSubmitted = "submittedByAdmin" in request && (request as typeof ADMIN_SUBMITTED_ENTRY).submittedByAdmin;
                  return (
                    <React.Fragment key={request.id}>
                    <tr
                      className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-pointer"
                      onClick={() => MOCK_LEAVE_WORKFLOWS[request.id] && setExpandedRow(expandedRow === request.id ? null : request.id)}
                    >
                      <td className="p-3 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          {request.employeeName}
                          {isAdminSubmitted && (
                            <span className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 border border-indigo-200">
                              Submitted by Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-slate-500">
                        {request.department}
                      </td>
                      <td className="p-3 text-slate-500">
                        {LEAVE_TYPE_LABELS[request.leaveType as LeaveType]}
                      </td>
                      <td className="p-3 text-xs text-slate-500">
                        <div>
                          {new Date(request.startDate).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                          })}
                          {" - "}
                          {new Date(request.endDate).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-900">{request.days}</td>
                      <td className="p-3 text-slate-500 text-xs">
                        {new Date(request.appliedOn).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className={cn("p-3 text-sm font-medium", statusStyle?.color)}>
                        {statusStyle?.label}
                      </td>
                      <td className="p-3">
                        {MOCK_LEAVE_WORKFLOWS[request.id] ? (
                          <button onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === request.id ? null : request.id); }}>
                            <ApprovalStepDots workflow={MOCK_LEAVE_WORKFLOWS[request.id]} />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">--</span>
                        )}
                      </td>
                      <td className="p-3">
                        {request.status === "pending" ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="p-1.5 rounded-md text-[#009966] hover:bg-emerald-50 transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-1.5 rounded-md text-[#e7000b] hover:bg-red-50 transition-colors"
                              title="Decline"
                            >
                              <X className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                          </div>
                        ) : request.approvedBy ? (
                          <span className="text-xs text-slate-500">
                            by {request.approvedBy}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">--</span>
                        )}
                      </td>
                    </tr>
                    {expandedRow === request.id && MOCK_LEAVE_WORKFLOWS[request.id] && (
                      <tr>
                        <td colSpan={9} className="p-4 bg-[#f8fafc]">
                          <ApprovalTimeline workflow={MOCK_LEAVE_WORKFLOWS[request.id]} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-12 text-center text-slate-400"
                    >
                      <Palmtree className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium text-slate-900">No leave requests found</p>
                      <p className="text-xs mt-1 text-slate-500">
                        Try adjusting your search or filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
