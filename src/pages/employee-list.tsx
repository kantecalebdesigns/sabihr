import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Download,
  UserCircle,
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
  MOCK_EMPLOYEE_LIST,
  EMPLOYEE_STATUS_STYLES,
  EMPLOYMENT_TYPE_LABELS,
} from "@/lib/employee-list-mock-data";
import type { EmploymentStatus, EmploymentType } from "@/types/employee";

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const departments = useMemo(
    () => [...new Set(MOCK_EMPLOYEE_LIST.map((e) => e.department))].sort(),
    []
  );

  const locations = useMemo(
    () => [...new Set(MOCK_EMPLOYEE_LIST.map((e) => e.location))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return MOCK_EMPLOYEE_LIST.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q);
      const matchesDept =
        departmentFilter === "all" || e.department === departmentFilter;
      const matchesStatus =
        statusFilter === "all" || e.employmentStatus === statusFilter;
      const matchesType =
        typeFilter === "all" || e.employmentType === typeFilter;
      const matchesLocation =
        locationFilter === "all" || e.location === locationFilter;
      return (
        matchesSearch &&
        matchesDept &&
        matchesStatus &&
        matchesType &&
        matchesLocation
      );
    });
  }, [search, departmentFilter, statusFilter, typeFilter, locationFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_EMPLOYEE_LIST.length };
    MOCK_EMPLOYEE_LIST.forEach((e) => {
      counts[e.employmentStatus] = (counts[e.employmentStatus] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Employee Management
          </h1>
          <p className="text-sm text-muted-foreground">
            {MOCK_EMPLOYEE_LIST.length} total employees &middot;{" "}
            {filtered.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate("/employees/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {[
          { key: "all", label: "All" },
          { key: "active", label: "Active" },
          { key: "on-leave", label: "On Leave" },
          { key: "suspended", label: "Suspended" },
          { key: "terminated", label: "Terminated" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              statusFilter === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {statusCounts[tab.key] ? (
              <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {statusCounts[tab.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, email, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
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
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Employment Type
            </label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Location
            </label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">
                Employee
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Employee ID
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Department
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Job Title
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Type
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Location
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Start Date
              </th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => {
              const statusStyle =
                EMPLOYEE_STATUS_STYLES[emp.employmentStatus as EmploymentStatus];
              return (
                <tr
                  key={emp.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                        {emp.firstName[0]}
                        {emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs">
                    {emp.employeeId}
                  </td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3 text-muted-foreground">{emp.jobTitle}</td>
                  <td className="p-3 text-muted-foreground">
                    {EMPLOYMENT_TYPE_LABELS[emp.employmentType as EmploymentType]}
                  </td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        statusStyle?.bg,
                        statusStyle?.color
                      )}
                    >
                      {statusStyle?.label}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{emp.location}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(emp.startDate).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="p-12 text-center text-muted-foreground"
                >
                  <UserCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No employees found</p>
                  <p className="text-xs mt-1">
                    Try adjusting your search or filters
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
