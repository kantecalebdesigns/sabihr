import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Users,
  MapPin,
  UserCircle,
  Building2,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MOCK_DEPARTMENTS, formatBudget } from "@/lib/department-mock-data";

export default function DepartmentListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");

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

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Department Management
          </h1>
          <p className="text-sm text-muted-foreground">
            {MOCK_DEPARTMENTS.length} departments &middot; {totalEmployees}{" "}
            employees
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Building2 className="w-4 h-4" />
            <span className="text-xs font-medium">Total Departments</span>
          </div>
          <p className="text-2xl font-semibold">{MOCK_DEPARTMENTS.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Total Employees</span>
          </div>
          <p className="text-2xl font-semibold">{totalEmployees}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Total Budget</span>
          </div>
          <p className="text-2xl font-semibold">{formatBudget(totalBudget)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">Locations</span>
          </div>
          <p className="text-2xl font-semibold">
            {new Set(MOCK_DEPARTMENTS.map((d) => d.location)).size}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors",
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            Grid
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors",
              view === "table"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
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
              className="rounded-xl border border-border bg-card p-5 space-y-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                navigate(`/employees?department=${encodeURIComponent(dept.name)}`)
              }
            >
              {/* Department Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: dept.color }}
                  >
                    {dept.code}
                  </div>
                  <div>
                    <h3 className="font-semibold">{dept.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {dept.code}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                    dept.status === "active"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  )}
                >
                  {dept.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {dept.description}
              </p>

              {/* Head of Department */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">
                    {dept.headOfDepartment}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {dept.headTitle}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {dept.employeeCount} employees
                  </span>
                  {dept.onLeaveCount > 0 && (
                    <span className="text-amber-600">
                      {dept.onLeaveCount} on leave
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">
                  {formatBudget(dept.budget)}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {dept.location}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center p-12 text-muted-foreground">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No departments found</p>
              <p className="text-xs mt-1">
                Try adjusting your search
              </p>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Department
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Code
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Head of Department
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Employees
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Location
                </th>
                <th className="p-3 text-right font-medium text-muted-foreground">
                  Budget
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/employees?department=${encodeURIComponent(dept.name)}`
                    )
                  }
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs">{dept.code}</td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{dept.headOfDepartment}</p>
                      <p className="text-xs text-muted-foreground">
                        {dept.headTitle}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-medium">{dept.employeeCount}</span>
                    {dept.onLeaveCount > 0 && (
                      <span className="text-xs text-amber-600 ml-1">
                        ({dept.onLeaveCount} on leave)
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-muted-foreground">{dept.location}</td>
                  <td className="p-3 text-right font-medium">
                    {formatBudget(dept.budget)}
                  </td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        dept.status === "active"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      )}
                    >
                      {dept.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-muted-foreground"
                  >
                    <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No departments found</p>
                    <p className="text-xs mt-1">
                      Try adjusting your search
                    </p>
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
