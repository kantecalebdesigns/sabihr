import { useState, useMemo } from "react";
import {
  Plus,
  Receipt,
  FileText,
  X,
  Clock,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_REQUISITIONS,
  formatReqCurrency,
  type RequisitionStatus,
  type RequisitionType,
} from "@/lib/requisitions-mock-data";

const EMPLOYEE_ID = "emp-001";

type TabKey = "all" | RequisitionStatus;

const TYPE_PILL: Record<RequisitionType, { label: string; cls: string; dot: string }> = {
  expense: { label: "Expense", cls: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  service: { label: "Service", cls: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  procurement: {
    label: "Procurement",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const STATUS_PILL: Record<RequisitionStatus, { label: string; cls: string; dot: string }> = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  rejected: { label: "Rejected", cls: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
  recalled: { label: "Recalled", cls: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

const CARD_SHELL =
  "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]";

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
    const approved = myRequisitions.filter((r) => r.status === "approved").length;
    const rejected = myRequisitions.filter((r) => r.status === "rejected").length;
    const recalled = myRequisitions.filter((r) => r.status === "recalled").length;
    const totalAmount = myRequisitions
      .filter((r) => r.status === "approved" || r.status === "pending")
      .reduce((s, r) => s + r.amount, 0);
    return { total, pending, approved, rejected, recalled, totalAmount };
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
    { label: "Total Requests", value: counts.total, icon: FileText },
    { label: "Pending", value: counts.pending, icon: Clock },
    { label: "Approved", value: counts.approved, icon: CheckCircle2 },
    {
      label: "Total Amount",
      value: formatReqCurrency(counts.totalAmount),
      icon: Wallet,
    },
  ];

  function resetForm() {
    setFormType("expense");
    setFormCategory("");
    setFormDescription("");
    setFormAmount("");
  }

  function handleSubmit() {
    setShowModal(false);
    resetForm();
  }

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Requisitions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and track your expense, service, and procurement requests.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 text-white h-10 text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New request
        </button>
      </div>

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
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label}
              <span
                className={cn("text-xs", active ? "text-white/80" : "text-slate-400")}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requisitions Table */}
      <div className={cn(CARD_SHELL, "overflow-hidden")}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Your requests
          </h2>
          <span className="text-sm text-slate-500">
            {filteredRequisitions.length} record
            {filteredRequisitions.length === 1 ? "" : "s"}
          </span>
        </div>

        {filteredRequisitions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-slate-400" />
            </div>
            <p className="mt-3 text-sm text-slate-500">No requisitions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
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
                    Approver
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequisitions.map((req) => {
                  const typePill = TYPE_PILL[req.type];
                  const statPill = STATUS_PILL[req.status];
                  return (
                    <tr
                      key={req.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 pl-5 pr-5">
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
                          {req.category}
                        </span>
                      </td>
                      <td className="py-4 pr-5 text-sm text-slate-700 max-w-[260px] truncate">
                        {req.description}
                      </td>
                      <td className="py-4 pr-5 text-sm font-semibold text-slate-900 text-right tabular-nums">
                        {formatReqCurrency(req.amount)}
                      </td>
                      <td className="py-4 pr-5 text-sm text-slate-500 whitespace-nowrap">
                        {req.requestDate}
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
                      <td className="py-4 pr-5 text-sm text-slate-500">
                        {req.approver}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          />

          <div className={cn(CARD_SHELL, "relative z-10 w-full max-w-lg p-6 shadow-xl")}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                New requisition request
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as RequisitionType)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="expense">Expense</option>
                  <option value="service">Service</option>
                  <option value="procurement">Procurement</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Category
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Travel, Equipment, Training"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe your request..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
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
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
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
