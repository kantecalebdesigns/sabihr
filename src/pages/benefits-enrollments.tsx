import { useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Users,
  Check,
  Search,
  TrendingUp,
  ClipboardCheck,
  AlertCircle,
  Clock,
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
  MOCK_ENROLLMENTS,
  MOCK_BENEFIT_PLANS,
  type EnrollmentStatus,
  type Enrollment,
} from "@/lib/benefits-mock-data";
import { MOCK_EMPLOYEE_LIST } from "@/lib/employee-list-mock-data";

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

const STATUS_PILL: Record<EnrollmentStatus, { label: string; dot: string; pill: string }> = {
  active: { label: "Active", dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700" },
  pending: { label: "Pending", dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700" },
  cancelled: { label: "Cancelled", dot: "bg-slate-400", pill: "bg-slate-100 text-slate-600" },
  expired: { label: "Expired", dot: "bg-rose-500", pill: "bg-rose-50 text-rose-700" },
};

export default function BenefitsEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(MOCK_ENROLLMENTS);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toRemove, setToRemove] = useState<Enrollment | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const uniquePlanNames = useMemo(
    () => [...new Set(enrollments.map((e) => e.planName))],
    [enrollments]
  );

  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      const matchesSearch =
        !search ||
        e.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase());
      const matchesPlan = planFilter === "all" || e.planName === planFilter;
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [enrollments, search, planFilter, statusFilter]);

  const groupedByEmployee = useMemo(() => {
    const map = new Map<
      string,
      { employeeId: string; employeeName: string; department: string; enrollments: Enrollment[] }
    >();
    for (const e of filtered) {
      const existing = map.get(e.employeeId);
      if (existing) {
        existing.enrollments.push(e);
      } else {
        map.set(e.employeeId, {
          employeeId: e.employeeId,
          employeeName: e.employeeName,
          department: e.department,
          enrollments: [e],
        });
      }
    }
    return [...map.values()].sort((a, b) => a.employeeName.localeCompare(b.employeeName));
  }, [filtered]);

  const totalCount = enrollments.length;
  const activeCount = enrollments.filter((e) => e.status === "active").length;
  const pendingCount = enrollments.filter((e) => e.status === "pending").length;
  const expiredCount = enrollments.filter((e) => e.status === "expired").length;

  const kpis = [
    { value: totalCount, label: "Total enrollments", icon: ClipboardCheck, trend: 3 },
    { value: activeCount, label: "Active", icon: Check, trend: 2 },
    { value: pendingCount, label: "Pending", icon: AlertCircle, trend: 1 },
    { value: expiredCount, label: "Expired", icon: Clock, trend: 0 },
  ];

  const handleRemove = () => {
    if (!toRemove) return;
    setEnrollments((prev) => prev.filter((e) => e.id !== toRemove.id));
    setToast(`Removed ${toRemove.employeeName} from ${toRemove.planName}.`);
    setToRemove(null);
  };

  const handleAdd = (newEnrollments: Enrollment[]) => {
    setEnrollments((prev) => [...newEnrollments, ...prev]);
    setShowAddModal(false);
    if (newEnrollments.length === 1) {
      setToast(`Added ${newEnrollments[0].employeeName} to ${newEnrollments[0].planName}.`);
    } else {
      setToast(`Added ${newEnrollments.length} employees to ${newEnrollments[0].planName}.`);
    }
  };

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Toast */}
      {toast && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            {toast}
          </div>
          <button onClick={() => setToast(null)} className="p-0.5 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Benefits enrollments</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Add or remove employees from benefit plans and track each enrollment's status at a glance.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add employee
        </Button>
      </div>

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
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none tabular-nums">
                  {kpi.value}
                </p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-slate-200 h-10 rounded-lg"
              />
            </div>
            <p className="text-sm text-slate-500 whitespace-nowrap">{groupedByEmployee.length} employees</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="h-10 rounded-lg border-slate-200 font-medium w-48">
                <SelectValue placeholder="All plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                {uniquePlanNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 rounded-lg border-slate-200 font-medium w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
                  Employee
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                  Enrolled plans
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedByEmployee.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-16 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold text-slate-900">No enrollments found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                groupedByEmployee.map((group) => (
                  <tr
                    key={group.employeeId}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 pl-5 pr-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0",
                            avatarColor(group.employeeId)
                          )}
                        >
                          {initialsOf(group.employeeName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 leading-tight">{group.employeeName}</p>
                          <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">
                            {group.department}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {group.enrollments.map((enrollment) => (
                          <PlanChip
                            key={enrollment.id}
                            enrollment={enrollment}
                            onRemove={() => setToRemove(enrollment)}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <AddEnrollmentModal
          existingEnrollments={enrollments}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}

      {/* Remove confirm */}
      {toRemove && (
        <ConfirmRemoveModal
          enrollment={toRemove}
          onCancel={() => setToRemove(null)}
          onConfirm={handleRemove}
        />
      )}
    </div>
  );
}

function PlanChip({ enrollment, onRemove }: { enrollment: Enrollment; onRemove: () => void }) {
  const style = STATUS_PILL[enrollment.status];
  const dateLabel = new Date(enrollment.startDate).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
  });
  const tooltip = `${style.label} · Since ${dateLabel}${
    enrollment.dependentsCovered > 0
      ? ` · ${enrollment.dependentsCovered} dependent${enrollment.dependentsCovered > 1 ? "s" : ""}`
      : ""
  }`;
  return (
    <span
      title={tooltip}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
        style.pill
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)} />
      <span>{enrollment.planName}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        title={`Remove ${enrollment.planName}`}
      >
        <X className="w-3 h-3" strokeWidth={2.5} />
      </button>
    </span>
  );
}

function AddEnrollmentModal({
  existingEnrollments,
  onClose,
  onAdd,
}: {
  existingEnrollments: Enrollment[];
  onClose: () => void;
  onAdd: (enrollments: Enrollment[]) => void;
}) {
  const [planId, setPlanId] = useState(MOCK_BENEFIT_PLANS[0]?.id ?? "");
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const selectedPlan = MOCK_BENEFIT_PLANS.find((p) => p.id === planId);

  const availableEmployees = useMemo(() => {
    const enrolledIds = new Set(
      existingEnrollments
        .filter((e) => e.planId === planId && (e.status === "active" || e.status === "pending"))
        .map((e) => e.employeeId)
    );
    return MOCK_EMPLOYEE_LIST.filter(
      (emp) =>
        !enrolledIds.has(emp.id) &&
        emp.employmentStatus === "active" &&
        (!search ||
          `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          emp.department.toLowerCase().includes(search.toLowerCase()))
    );
  }, [planId, existingEnrollments, search]);

  const toggleEmployee = (id: string) => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedEmployees.size === availableEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(availableEmployees.map((e) => e.id)));
    }
  };

  const handleSubmit = () => {
    if (!selectedPlan || selectedEmployees.size === 0) return;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toISOString();
    const newEnrollments: Enrollment[] = [...selectedEmployees].map((empId) => {
      const emp = MOCK_EMPLOYEE_LIST.find((e) => e.id === empId)!;
      return {
        id: `enr-${Date.now()}-${empId}`,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        startDate: today,
        endDate: null,
        dependentsCovered: 0,
        status: "active",
        enrolledAt: now,
      };
    });
    onAdd(newEnrollments);
  };

  const allSelected =
    availableEmployees.length > 0 && selectedEmployees.size === availableEmployees.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl border border-slate-200/70 shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Add employee</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a plan and the employees to enroll.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Benefit plan</label>
            <Select
              value={planId}
              onValueChange={(v) => {
                setPlanId(v);
                setSelectedEmployees(new Set());
              }}
            >
              <SelectTrigger className="h-10 rounded-lg border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_BENEFIT_PLANS.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPlan && <p className="text-xs text-slate-500">{selectedPlan.coverageSummary}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-500">
                Employees to enroll
                <span className="ml-1 text-slate-400 font-normal">({selectedEmployees.size} selected)</span>
              </label>
              {availableEmployees.length > 0 && (
                <button
                  onClick={toggleAll}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  {allSelected ? "Clear all" : "Select all"}
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-lg border-slate-200"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/70 divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {availableEmployees.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                All active employees are already enrolled in this plan.
              </div>
            ) : (
              availableEmployees.map((emp) => {
                const isSelected = selectedEmployees.has(emp.id);
                return (
                  <label
                    key={emp.id}
                    className={cn(
                      "flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50/60 transition-colors",
                      isSelected && "bg-blue-50/50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleEmployee(emp.id)}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-[11px] shrink-0",
                        avatarColor(emp.id)
                      )}
                    >
                      {emp.firstName[0]}
                      {emp.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {emp.jobTitle} <span className="text-slate-400">·</span> {emp.department}
                      </p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200/70">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedEmployees.size === 0}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            Add {selectedEmployees.size > 0 && `(${selectedEmployees.size})`}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmRemoveModal({
  enrollment,
  onCancel,
  onConfirm,
}: {
  enrollment: Enrollment;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl border border-slate-200/70 shadow-xl max-w-md w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Remove enrollment?</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          This will remove{" "}
          <span className="font-semibold text-slate-900">{enrollment.employeeName}</span> from{" "}
          <span className="font-semibold text-slate-900">{enrollment.planName}</span>. They will lose
          coverage immediately.
        </p>
        <div className="flex items-center justify-end gap-2 mt-5">
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="h-10 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
