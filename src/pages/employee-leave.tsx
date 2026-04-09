import { useState, useMemo } from "react";
import { Plus, Palmtree, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_LEAVE_REQUESTS,
  LEAVE_STATUS_STYLES,
  LEAVE_TYPE_LABELS,
  LEAVE_TYPE_COLORS,
  LEAVE_POLICY_SUMMARY,
} from "@/lib/leave-mock-data";
import type { LeaveStatus, LeaveType } from "@/lib/leave-mock-data";

const EMPLOYEE_ID = "emp-001";

const LEAVE_BALANCES: Record<LeaveType, { used: number; total: number }> = {
  annual: { used: 5, total: 20 },
  sick: { used: 2, total: 10 },
  casual: { used: 1, total: 5 },
  maternity: { used: 0, total: 90 },
  paternity: { used: 0, total: 10 },
  compassionate: { used: 0, total: 5 },
};

const BALANCE_BAR_COLORS: Record<LeaveType, string> = {
  annual: "bg-blue-500",
  sick: "bg-red-500",
  casual: "bg-violet-500",
  maternity: "bg-pink-500",
  paternity: "bg-cyan-500",
  compassionate: "bg-amber-500",
};

type StatusTab = "all" | LeaveStatus;

export default function EmployeeLeavePage() {
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formLeaveType, setFormLeaveType] = useState<LeaveType>("annual");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formReason, setFormReason] = useState("");

  const myRequests = useMemo(
    () => MOCK_LEAVE_REQUESTS.filter((r) => r.employeeId === EMPLOYEE_ID),
    []
  );

  const statusCounts = useMemo(() => {
    const counts: Record<StatusTab, number> = {
      all: myRequests.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
    };
    myRequests.forEach((r) => {
      counts[r.status]++;
    });
    return counts;
  }, [myRequests]);

  const filteredRequests = useMemo(
    () =>
      activeTab === "all"
        ? myRequests
        : myRequests.filter((r) => r.status === activeTab),
    [myRequests, activeTab]
  );

  const tabs: { key: StatusTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowModal(false);
    setFormLeaveType("annual");
    setFormStartDate("");
    setFormEndDate("");
    setFormReason("");
    setSuccessMessage("Leave request submitted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">My Leave</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your leave requests and balances
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 text-white h-9 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Request Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {(Object.keys(LEAVE_BALANCES) as LeaveType[]).map((type) => {
          const { used, total } = LEAVE_BALANCES[type];
          const remaining = total - used;
          const pct = total > 0 ? (used / total) * 100 : 0;

          return (
            <div
              key={type}
              className="rounded-xl border border-[#efefef] bg-white p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                    LEAVE_TYPE_COLORS[type]
                  )}
                >
                  {LEAVE_POLICY_SUMMARY[type].label}
                </span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">
                {remaining}
                <span className="text-sm font-normal text-slate-400">
                  /{total}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {used} used &middot; {remaining} remaining
              </p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className={cn("h-1.5 rounded-full", BALANCE_BAR_COLORS[type])}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Tabs */}
      <div className="border-b border-[#efefef]">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs",
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {statusCounts[tab.key]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-xl border border-[#efefef] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Leave Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Days
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Applied On
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    <Palmtree className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const style = LEAVE_STATUS_STYLES[req.status];
                  return (
                    <tr
                      key={req.id}
                      className="border-b border-[#efefef] hover:bg-[#f8fafc]"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                            LEAVE_TYPE_COLORS[req.leaveType]
                          )}
                        >
                          {LEAVE_TYPE_LABELS[req.leaveType]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(req.startDate)} &ndash;{" "}
                          {formatDate(req.endDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {req.days}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            style.bg,
                            style.color
                          )}
                        >
                          {style.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(req.appliedOn)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 max-w-[200px] truncate">
                        {req.reason}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-[#efefef] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Request Leave
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Leave Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Leave Type
                </label>
                <select
                  value={formLeaveType}
                  onChange={(e) =>
                    setFormLeaveType(e.target.value as LeaveType)
                  }
                  className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  {(Object.keys(LEAVE_POLICY_SUMMARY) as LeaveType[]).map(
                    (type) => (
                      <option key={type} value={type}>
                        {LEAVE_POLICY_SUMMARY[type].label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Reason
                </label>
                <textarea
                  required
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Briefly describe your reason for leave..."
                  className="w-full rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-9 rounded-lg border border-[#efefef] bg-white px-4 text-sm font-medium text-slate-700 hover:bg-[#f8fafc] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
