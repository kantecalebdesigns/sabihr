import { useState, useMemo } from "react";
import {
  Plus,
  Receipt,
  FileText,
  X,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_REQUISITIONS,
  REQ_TYPE_STYLES,
  REQ_STATUS_STYLES,
  formatReqCurrency,
  type RequisitionStatus,
  type RequisitionType,
} from "@/lib/requisitions-mock-data";

const EMPLOYEE_ID = "emp-001";

type TabKey = "all" | RequisitionStatus;

export default function EmployeeRequisitionsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formType, setFormType] = useState<RequisitionType>("expense");
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState("");

  const myRequisitions = useMemo(
    () => MOCK_REQUISITIONS.filter((r) => r.employeeId === EMPLOYEE_ID),
    []
  );

  const counts = useMemo(() => {
    const total = myRequisitions.length;
    const pending = myRequisitions.filter((r) => r.status === "pending").length;
    const approved = myRequisitions.filter(
      (r) => r.status === "approved"
    ).length;
    const rejected = myRequisitions.filter(
      (r) => r.status === "rejected"
    ).length;
    return { total, pending, approved, rejected };
  }, [myRequisitions]);

  const filteredRequisitions = useMemo(
    () =>
      activeTab === "all"
        ? myRequisitions
        : myRequisitions.filter((r) => r.status === activeTab),
    [myRequisitions, activeTab]
  );

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.total },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "rejected", label: "Rejected", count: counts.rejected },
  ];

  const summaryCards = [
    {
      label: "Total Requests",
      count: counts.total,
      icon: FileText,
      iconColor: "text-blue-600",
      iconBg: "bg-[#f8fafc]",
    },
    {
      label: "Pending",
      count: counts.pending,
      icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-[#f8fafc]",
    },
    {
      label: "Approved",
      count: counts.approved,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-[#f8fafc]",
    },
  ];

  function resetForm() {
    setFormType("expense");
    setFormCategory("");
    setFormDescription("");
    setFormAmount("");
  }

  function handleSubmit() {
    // In a real app this would POST to an API
    setShowModal(false);
    resetForm();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            My Requisitions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and track your expense and procurement requests
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 text-white h-9 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Request
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex gap-[14px] items-start"
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                card.iconBg
              )}
            >
              <card.icon className={cn("h-4 w-4", card.iconColor)} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {card.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-6 border-b border-[#efefef]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "pb-3 text-sm font-medium transition-colors border-b-2",
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {tab.label}{" "}
            <span
              className={cn(
                "ml-1 rounded-full px-2 py-0.5 text-xs",
                activeTab === tab.key
                  ? "bg-blue-50 text-blue-600"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Requisitions Table */}
      <div className="rounded-xl border border-[#efefef] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Approver
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequisitions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-slate-500"
                  >
                    <Receipt className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                    No requisitions found
                  </td>
                </tr>
              ) : (
                filteredRequisitions.map((req) => {
                  const typeStyle = REQ_TYPE_STYLES[req.type];
                  const statusStyle = REQ_STATUS_STYLES[req.status];
                  return (
                    <tr
                      key={req.id}
                      className="border-b border-[#efefef] hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium",
                            typeStyle.color
                          )}
                        >
                          {typeStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {req.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900 max-w-[240px] truncate">
                        {req.description}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {formatReqCurrency(req.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                        {req.requestDate}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium",
                            statusStyle.color
                          )}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {req.approver}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-[#efefef] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                New Requisition Request
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-[#f8fafc] hover:text-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Type
                </label>
                <select
                  value={formType}
                  onChange={(e) =>
                    setFormType(e.target.value as RequisitionType)
                  }
                  className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="expense">Expense</option>
                  <option value="service">Service</option>
                  <option value="procurement">Procurement</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Category
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Travel, Equipment, Training"
                  className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe your request..."
                  rows={3}
                  className="w-full rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    ₦
                  </span>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="0"
                    min={0}
                    className="h-9 w-full rounded-lg border border-[#efefef] bg-white pl-7 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="h-9 rounded-lg border border-[#efefef] bg-white px-4 text-sm font-medium text-slate-900 hover:bg-[#f8fafc] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
