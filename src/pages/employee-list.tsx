import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Download,
  UserCircle,
  Users,
  UserCheck,
  UserX,
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

  const summaryCards = [
    { label: "Total Employees", value: MOCK_EMPLOYEE_LIST.length, icon: Users },
    { label: "Active", value: statusCounts["active"] || 0, icon: UserCheck },
    { label: "On Leave", value: statusCounts["on-leave"] || 0, icon: Clock },
    { label: "Terminated", value: statusCounts["terminated"] || 0, icon: UserX },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Employee Management
          </h1>
          <p className="text-sm text-slate-500">
            {MOCK_EMPLOYEE_LIST.length} total employees &middot;{" "}
            {filtered.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-[#efefef]">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate("/employees/create")} className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
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

      {/* Status Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
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
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {tab.label}
            {statusCounts[tab.key] ? (
              <span className="ml-1.5 text-xs bg-[#f8fafc] px-1.5 py-0.5 rounded-full">
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
            className="border-[#efefef]"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-[#efefef] bg-white p-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">
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
            <label className="text-xs font-medium text-slate-500">
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
            <label className="text-xs font-medium text-slate-500">
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
      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#efefef] bg-[#f8fafc]">
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Employee
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Employee ID
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Department
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Job Title
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Type
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Status
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Location
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
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
                  className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-pointer"
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500 text-xs font-medium">
                        {emp.firstName[0]}
                        {emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs text-slate-500">
                    {emp.employeeId}
                  </td>
                  <td className="p-3 text-slate-900">{emp.department}</td>
                  <td className="p-3 text-slate-500">{emp.jobTitle}</td>
                  <td className="p-3 text-slate-500">
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
                  <td className="p-3 text-slate-500">{emp.location}</td>
                  <td className="p-3 text-slate-500">
                    {new Date(emp.startDate).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 rounded hover:bg-[#f8fafc] transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="p-12 text-center text-slate-400"
                >
                  <UserCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-slate-900">No employees found</p>
                  <p className="text-xs mt-1 text-slate-500">
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
