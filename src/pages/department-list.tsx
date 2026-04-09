import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Users,
  MapPin,
  Building2,
  TrendingUp,
  ArrowRightLeft,
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

// Reassign modal
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
    if (selected.size === employees.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(employees.map((e) => e.id)));
    }
  }

  function handleReassign() {
    // Mock — in real app this would call an API
    setDone(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-[#efefef] w-full max-w-[520px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#efefef]">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Reassign Employees</h3>
            <p className="text-xs text-slate-500">From {departmentName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-[#f8fafc] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ecfdf5] flex items-center justify-center">
              <Check className="w-5 h-5 text-[#007a55]" />
            </div>
            <p className="text-sm font-medium text-slate-900">
              {selected.size} employee{selected.size !== 1 ? "s" : ""} reassigned
            </p>
          </div>
        ) : (
          <>
            {/* Target department */}
            <div className="px-5 py-3 border-b border-[#efefef]">
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

            {/* Employee list */}
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
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#f8fafc] transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(emp.id)}
                        onChange={() => toggleEmployee(emp.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      <div className="w-7 h-7 rounded-full bg-[#f8fafc] flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-medium text-slate-500">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </span>
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

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#efefef]">
              <p className="text-xs text-slate-500">
                {selected.size} selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onClose} className="border-[#efefef]">
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

export default function DepartmentListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [reassignDept, setReassignDept] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return MOCK_DEPARTMENTS;
    return MOCK_DEPARTMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.headOfDepartment.toLowerCase().includes(q)
    );
  }, [search]);

  const totalEmployees = MOCK_DEPARTMENTS.reduce(
    (sum, d) => sum + d.employeeCount,
    0
  );
  const totalBudget = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.budget, 0);

  const summaryCards = [
    { label: "Total Departments", value: MOCK_DEPARTMENTS.length, icon: Building2 },
    { label: "Total Employees", value: totalEmployees, icon: Users },
    { label: "Total Budget", value: formatBudget(totalBudget), icon: TrendingUp },
    { label: "Locations", value: new Set(MOCK_DEPARTMENTS.map((d) => d.location)).size, icon: MapPin },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Reassign Modal */}
      {reassignDept && (
        <ReassignModal
          departmentName={reassignDept}
          onClose={() => setReassignDept(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Department Management
          </h1>
          <p className="text-sm text-slate-500">
            {MOCK_DEPARTMENTS.length} departments &middot; {totalEmployees} employees
          </p>
        </div>
        <Button
          onClick={() => navigate("/departments/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex gap-[14px] items-start"
          >
            <div className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center shrink-0">
              <card.icon className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#efefef]" />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center border border-[#efefef] rounded-lg overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors",
              view === "grid" ? "bg-blue-600 text-white" : "hover:bg-[#f8fafc] text-slate-500"
            )}
          >
            Grid
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors",
              view === "table" ? "bg-blue-600 text-white" : "hover:bg-[#f8fafc] text-slate-500"
            )}
          >
            Table
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dept) => (
            <div
              key={dept.id}
              className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4 hover:border-slate-300 transition-colors cursor-pointer"
              onClick={() => navigate(`/departments/${dept.id}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                  <p className="text-xs text-slate-500">{dept.code}</p>
                </div>
                <span className={cn("text-xs font-medium", dept.status === "active" ? "text-[#007a55]" : "text-gray-500")}>
                  {dept.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-xs text-[#62748e] line-clamp-2">{dept.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-[#efefef]">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {dept.employeeCount} employees
                  </span>
                  {dept.onLeaveCount > 0 && (
                    <span className="text-[#e17100]">{dept.onLeaveCount} on leave</span>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-900">{formatBudget(dept.budget)}</span>
              </div>

              <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setReassignDept(dept.name)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Reassign Employees
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center p-12 text-slate-400">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-slate-900">No departments found</p>
              <p className="text-xs mt-1 text-slate-500">Try adjusting your search</p>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Code</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Head of Department</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Employees</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Location</th>
                <th className="p-3 text-right text-xs font-medium text-slate-500">Budget</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
                <th className="p-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-pointer"
                  onClick={() => navigate(`/departments/${dept.id}`)}
                >
                  <td className="p-3"><span className="font-medium text-slate-900">{dept.name}</span></td>
                  <td className="p-3 font-mono text-xs text-slate-500">{dept.code}</td>
                  <td className="p-3">
                    <p className="font-medium text-slate-900">{dept.headOfDepartment || "—"}</p>
                    {dept.headTitle && <p className="text-xs text-slate-500">{dept.headTitle}</p>}
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-slate-900">{dept.employeeCount}</span>
                    {dept.onLeaveCount > 0 && (
                      <span className="text-xs text-[#e17100] ml-1">({dept.onLeaveCount} on leave)</span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500">{dept.location}</td>
                  <td className="p-3 text-right font-medium text-slate-900">{formatBudget(dept.budget)}</td>
                  <td className="p-3">
                    <span className={cn("text-xs font-medium", dept.status === "active" ? "text-[#007a55]" : "text-gray-500")}>
                      {dept.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setReassignDept(dept.name)}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-slate-900">No departments found</p>
                    <p className="text-xs mt-1 text-slate-500">Try adjusting your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
