import { useState, useMemo } from "react";
import { Plus, Palmtree, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_LEAVE_REQUESTS,
  LEAVE_TYPE_LABELS,
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

  function progressBarColor(used: number, total: number) {
    const pct = total > 0 ? used / total : 0;
    if (pct < 0.5) return "bg-emerald-500";
    if (pct < 0.75) return "bg-amber-500";
    return "bg-red-500";
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
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {(Object.keys(LEAVE_BALANCES) as LeaveType[]).map((type) => {
          const { used, total } = LEAVE_BALANCES[type];
          const remaining = total - used;
          const pct = total > 0 ? (used / total) * 100 : 0;

          return (
            <div
              key={type}
              className="rounded-xl border border-[#efefef] bg-white p-4 flex flex-col gap-3"
            >
              <span className="text-xs font-medium text-slate-500">
                {LEAVE_POLICY_SUMMARY[type].label}
              </span>
              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900">
                  {remaining}
                  <span className="text-sm font-normal text-slate-400 ml-1">/ {total}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {used} used · {remaining} remaining
                </p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className={cn("h-1.5 rounded-full transition-all", progressBarColor(used, total))}
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
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-xs text-slate-400">
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
                  const statusText: Record<LeaveStatus, { label: string; color: string }> = {
                    pending: { label: "Pending", color: "text-amber-600" },
                    approved: { label: "Approved", color: "text-emerald-600" },
                    rejected: { label: "Rejected", color: "text-red-600" },
                    cancelled: { label: "Cancelled", color: "text-slate-400" },
                  };
                  const st = statusText[req.status];
                  return (
                    <tr
                      key={req.id}
                      className="border-b border-[#efefef] hover:bg-[#f8fafc]"
                    >
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {LEAVE_TYPE_LABELS[req.leaveType]}
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
                        <span className={cn("text-sm font-medium", st.color)}>
                          {st.label}
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
