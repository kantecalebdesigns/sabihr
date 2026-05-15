import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Users,
  MapPin,
  Building2,
  Wallet,
  ChevronDown,
  MoreHorizontal,
  ArrowRightLeft,
  TrendingUp,
  X,
  Check,
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
import { MOCK_DEPARTMENTS, formatBudget } from "@/lib/department-mock-data";
import { MOCK_EMPLOYEE_LIST } from "@/lib/employee-list-mock-data";

// ── Avatar palette for HOD initials ─────────────────────────────────────
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
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Reassign modal ──────────────────────────────────────────────────────
function ReassignModal({
  departmentName,
  onClose,
}: {
  departmentName: string;
  onClose: () => void;
}) {
  const employees = MOCK_EMPLOYEE_LIST.filter(
    (e) => e.department === departmentName && e.employmentStatus === "active"
  );
  const otherDepts = MOCK_DEPARTMENTS.filter((d) => d.name !== departmentName);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetDept, setTargetDept] = useState("");
  const [done, setDone] = useState(false);

  function toggleEmployee(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === employees.length) setSelected(new Set());
    else setSelected(new Set(employees.map((e) => e.id)));
  }

  function handleReassign() {
    setDone(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200/70 w-full sm:max-w-[520px] max-h-[90vh] sm:max-h-[80vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Reassign Employees</h3>
            <p className="text-xs text-slate-500">From {departmentName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-900">
              {selected.size} employee{selected.size !== 1 ? "s" : ""} reassigned
            </p>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-slate-200/70">
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Move to</label>
              <Select value={targetDept} onValueChange={setTargetDept}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {otherDepts.map((d) => (
                    <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3">
              {employees.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No active employees in this department</p>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={toggleAll}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 mb-2"
                  >
                    {selected.size === employees.length ? "Deselect all" : "Select all"}
                  </button>
                  {employees.map((emp) => (
                    <label
                      key={emp.id}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(emp.id)}
                        onChange={() => toggleEmployee(emp.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold text-white",
                        avatarColor(emp.id)
                      )}>
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{emp.jobTitle}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200/70">
              <p className="text-xs text-slate-500">{selected.size} selected</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onClose} className="border-slate-200">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReassign}
                  disabled={selected.size === 0 || !targetDept}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  Reassign
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const STATUS_PILL = {
  active: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700" },
  inactive: { dot: "bg-slate-400", pill: "bg-slate-100 text-slate-600" },
} as const;

export default function DepartmentListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "employees" | "budget">("name");
  const [reassignDept, setReassignDept] = useState<string | null>(null);
  const [rowMenuId, setRowMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const rows = MOCK_DEPARTMENTS.filter((d) => {
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.headOfDepartment.toLowerCase().includes(q);
      return matchesSearch;
    });

    rows.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "employees") return b.employeeCount - a.employeeCount;
      return b.budget - a.budget;
    });
    return rows;
  }, [search, sortBy]);

  const totalEmployees = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.employeeCount, 0);
  const totalBudget = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.budget, 0);
  const uniqueLocations = new Set(MOCK_DEPARTMENTS.map((d) => d.location)).size;

  const kpis = [
    { value: MOCK_DEPARTMENTS.length, label: "Total departments", icon: Building2, wellBg: "bg-blue-50", iconColor: "text-blue-600", trend: 2 },
    { value: totalEmployees, label: "Total employees", icon: Users, wellBg: "bg-blue-50", iconColor: "text-blue-600", trend: 6 },
    { value: formatBudget(totalBudget), label: "Total budget", icon: Wallet, wellBg: "bg-blue-50", iconColor: "text-blue-600", trend: 4 },
    { value: uniqueLocations, label: "Locations", icon: MapPin, wellBg: "bg-blue-50", iconColor: "text-blue-600", trend: 1 },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {reassignDept && (
        <ReassignModal
          departmentName={reassignDept}
          onClose={() => setReassignDept(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Departments</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Structure your organization — create departments, assign heads, and track headcount
            and budgets across locations.
          </p>
        </div>
        <Button
          onClick={() => navigate("/departments/create")}
          className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add department
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
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.wellBg)}>
                  <Icon className={cn("w-[18px] h-[18px]", kpi.iconColor)} />
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

      {/* Table card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, code, head..."
                className="pl-9 bg-white border-slate-200 h-10 rounded-lg"
              />
            </div>
            <p className="text-sm text-slate-500 whitespace-nowrap">{filtered.length} departments</p>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "employees" | "budget")}
              className="appearance-none h-10 pl-3 pr-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 cursor-pointer"
            >
              <option value="name">Sort: Name</option>
              <option value="employees">Sort: Employees</option>
              <option value="budget">Sort: Budget</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Department</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Head</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Employees</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Location</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Budget</th>
                <th className="w-10 px-2" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept) => {
                const status = STATUS_PILL[dept.status];
                return (
                  <tr
                    key={dept.id}
                    onClick={() => navigate(`/departments/${dept.id}`)}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-4 pl-5 pr-5">
                      <p className="font-semibold text-slate-900 leading-tight">{dept.name}</p>
                      <p className="text-xs text-slate-500 leading-tight mt-0.5 font-mono">{dept.code}</p>
                    </td>
                    <td className="py-4 pr-5">
                      {dept.headOfDepartment ? (
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold text-white",
                            avatarColor(dept.id)
                          )}>
                            {initials(dept.headOfDepartment)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 leading-tight truncate">{dept.headOfDepartment}</p>
                            {dept.headTitle && (
                              <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">{dept.headTitle}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-5">
                      <span className="font-semibold text-slate-900">{dept.employeeCount}</span>
                      {dept.onLeaveCount > 0 && (
                        <span className="text-xs text-slate-500 ml-1">({dept.onLeaveCount} on leave)</span>
                      )}
                    </td>
                    <td className="py-4 pr-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {dept.location}
                      </span>
                    </td>
                    <td className="py-4 pr-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                        status.pill
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                        {dept.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 pr-5 font-semibold text-slate-900 tabular-nums">{formatBudget(dept.budget)}</td>
                    <td className="px-2 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setRowMenuId(rowMenuId === dept.id ? null : dept.id)}
                        className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {rowMenuId === dept.id && (
                        <div className="absolute right-2 top-11 w-48 rounded-xl border border-slate-200/80 bg-white shadow-lg z-10 py-1">
                          <button
                            onClick={() => {
                              setRowMenuId(null);
                              navigate(`/departments/${dept.id}`);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            View details
                          </button>
                          <button
                            onClick={() => {
                              setRowMenuId(null);
                              setReassignDept(dept.name);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            Reassign employees
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-slate-900">No departments found</p>
                    <p className="text-xs mt-1 text-slate-500">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
