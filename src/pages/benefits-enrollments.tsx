import { useMemo, useState } from "react";
import { Plus, Trash2, X, Users, Check } from "lucide-react";
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
  ENROLLMENT_STATUS_STYLES,
  type EnrollmentStatus,
  type Enrollment,
} from "@/lib/benefits-mock-data";
import { MOCK_EMPLOYEE_LIST } from "@/lib/employee-list-mock-data";

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
      const matchesStatus =
        statusFilter === "all" || e.status === statusFilter;
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

  const summaryCards = [
    { label: "Total Enrollments", value: totalCount },
    { label: "Active", value: activeCount },
    { label: "Pending", value: pendingCount },
    { label: "Expired", value: expiredCount },
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
    <div className="space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Benefits Enrollments
          </h1>
          <p className="text-sm text-slate-500">
            Add or remove employees from benefit plans.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#efefef] bg-white p-4"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            {uniquePlanNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8fafc] text-left">
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Employee</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Department</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Plans</th>
            </tr>
          </thead>
          <tbody>
            {groupedByEmployee.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-slate-500">
                  No enrollments found.
                </td>
              </tr>
            ) : (
              groupedByEmployee.map((group) => {
                const initials = group.employeeName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("");
                return (
                  <tr key={group.employeeId} className="border-t border-[#efefef] hover:bg-[#f8fafc]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {initials}
                        </div>
                        <span className="font-medium">{group.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{group.department}</td>
                    <td className="px-4 py-3">
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
                );
              })
            )}
          </tbody>
        </table>
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

/* ── Plan chip ── */
const STATUS_DOT: Record<EnrollmentStatus, string> = {
  active: "bg-slate-700",
  pending: "bg-slate-700",
  cancelled: "bg-slate-700",
  expired: "bg-slate-700",
};

function PlanChip({
  enrollment,
  onRemove,
}: {
  enrollment: Enrollment;
  onRemove: () => void;
}) {
  const statusLabel = ENROLLMENT_STATUS_STYLES[enrollment.status].label;
  const dateLabel = new Date(enrollment.startDate).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
  });
  const tooltip = `${statusLabel} · Since ${dateLabel}${
    enrollment.dependentsCovered > 0
      ? ` · ${enrollment.dependentsCovered} dependent${enrollment.dependentsCovered > 1 ? "s" : ""}`
      : ""
  }`;
  return (
    <span
      title={tooltip}
      className="group inline-flex items-center gap-1.5 rounded-full border border-[#efefef] bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-300 transition-colors"
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOT[enrollment.status])} />
      <span>{enrollment.planName}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        title={`Remove ${enrollment.planName}`}
      >
        <X className="w-3 h-3" strokeWidth={2.5} />
      </button>
    </span>
  );
}

/* ── Add Enrollment Modal ── */
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

  // Employees not already enrolled in the selected plan
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-[#efefef]">
          <div>
            <h2 className="font-semibold text-slate-900">Add Employee</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a plan and the employees to enroll.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Plan selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Benefit Plan</label>
            <Select value={planId} onValueChange={(v) => { setPlanId(v); setSelectedEmployees(new Set()); }}>
              <SelectTrigger>
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
            {selectedPlan && (
              <p className="text-xs text-slate-500">{selectedPlan.coverageSummary}</p>
            )}
          </div>

          {/* Employee search */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">
                Employees to Enroll
                <span className="ml-1 text-slate-500 font-normal">
                  ({selectedEmployees.size} selected)
                </span>
              </label>
              {availableEmployees.length > 0 && (
                <button
                  onClick={toggleAll}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  {allSelected ? "Clear all" : "Select all"}
                </button>
              )}
            </div>
            <Input
              placeholder="Search by name or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Employee list */}
          <div className="rounded-lg border border-[#efefef] divide-y divide-[#efefef] max-h-80 overflow-y-auto">
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
                      "flex items-center gap-3 p-3 cursor-pointer hover:bg-[#f8fafc] transition-colors",
                      isSelected && "bg-blue-50/50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleEmployee(emp.id)}
                      className="rounded border-slate-300"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {emp.jobTitle} · {emp.department}
                      </p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-[#efefef] bg-[#f8fafc]">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={selectedEmployees.size === 0}>
            Add {selectedEmployees.size > 0 && `(${selectedEmployees.size})`}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Confirm Remove Modal ── */
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5">
        <h3 className="font-semibold text-slate-900">Remove enrollment?</h3>
        <p className="text-sm text-slate-500 mt-1">
          This will remove <span className="font-medium text-slate-900">{enrollment.employeeName}</span> from{" "}
          <span className="font-medium text-slate-900">{enrollment.planName}</span>. They will lose coverage immediately.
        </p>
        <div className="flex items-center justify-end gap-2 mt-5">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
