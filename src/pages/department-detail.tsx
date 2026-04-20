import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  UserCheck,
  Clock,
  UserX,
  Building2,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_DEPARTMENTS, formatBudget } from "@/lib/department-mock-data";
import {
  MOCK_EMPLOYEE_LIST,
  EMPLOYEE_STATUS_STYLES,
} from "@/lib/employee-list-mock-data";
import type { EmploymentStatus } from "@/types/employee";

export default function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const department = MOCK_DEPARTMENTS.find((d) => d.id === id);

  const employees = useMemo(() => {
    if (!department) return [];
    return MOCK_EMPLOYEE_LIST.filter(
      (e) => e.department === department.name
    );
  }, [department]);

  const statusCounts = useMemo(() => {
    const counts = { active: 0, "on-leave": 0, suspended: 0, terminated: 0, inactive: 0 };
    employees.forEach((e) => {
      if (e.employmentStatus in counts) {
        counts[e.employmentStatus as keyof typeof counts]++;
      }
    });
    return counts;
  }, [employees]);

  if (!department) {
    return (
      <div className="max-w-[1400px] mx-auto py-20 text-center">
        <Building2 className="w-10 h-10 mx-auto mb-3 text-slate-300" />
        <p className="font-medium text-slate-900">Department not found</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 border-[#efefef]"
          onClick={() => navigate("/departments")}
        >
          Back to Departments
        </Button>
      </div>
    );
  }

  // Group employees by role for the org breakdown
  const roleGroups = useMemo(() => {
    const map = new Map<string, typeof employees>();
    employees.forEach((emp) => {
      const existing = map.get(emp.jobTitle) || [];
      existing.push(emp);
      map.set(emp.jobTitle, existing);
    });
    // Sort: head of department first, then by group size desc
    return [...map.entries()].sort((a, b) => {
      const aIsHead = a[1].some(
        (e) =>
          `${e.firstName} ${e.lastName}` === department.headOfDepartment
      );
      const bIsHead = b[1].some(
        (e) =>
          `${e.firstName} ${e.lastName}` === department.headOfDepartment
      );
      if (aIsHead && !bIsHead) return -1;
      if (!aIsHead && bIsHead) return 1;
      return b[1].length - a[1].length;
    });
  }, [employees, department.headOfDepartment]);

  const summaryCards = [
    { label: "Total Members", value: employees.length, icon: Users },
    { label: "Active", value: statusCounts.active, icon: UserCheck },
    { label: "On Leave", value: statusCounts["on-leave"], icon: Clock },
    { label: "Suspended", value: statusCounts.suspended + statusCounts.terminated + statusCounts.inactive, icon: UserX, sublabel: "Inactive" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate("/departments")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Departments
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                {department.name}
              </h1>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  department.status === "active"
                    ? "bg-emerald-50 text-[#007a55]"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {department.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              {department.code} &middot; {department.description}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-[#efefef] shrink-0"
            onClick={() => navigate(`/employees?department=${encodeURIComponent(department.name)}`)}
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Manage Employees
          </Button>
        </div>
      </div>

      {/* Department Info Bar */}
      <div className="rounded-xl border border-[#efefef] bg-white px-5 py-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <p className="text-slate-500">
          Head: <span className="font-medium text-slate-900">{department.headOfDepartment}</span>
        </p>
        <p className="text-slate-500">
          Location: <span className="text-slate-700">{department.location}</span>
        </p>
        <p className="text-slate-500">
          Budget: <span className="font-medium text-slate-900">{formatBudget(department.budget)}</span>
        </p>
        <p className="text-slate-500">
          Created: <span className="text-slate-700">{new Date(department.createdDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
        </p>
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
              <p className="text-xs font-medium text-slate-500">
                {card.sublabel || card.label}
              </p>
              <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#efefef]" />

      {/* Employee Table */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">
          Team Members ({employees.length})
        </h2>

        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="p-3 text-left text-xs font-medium text-slate-500">
                  Employee
                </th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">
                  Role
                </th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">
                  Employee ID
                </th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">
                  Status
                </th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">
                  Location
                </th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">
                  Reports To
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const statusStyle =
                  EMPLOYEE_STATUS_STYLES[
                    emp.employmentStatus as EmploymentStatus
                  ];
                const isHead =
                  `${emp.firstName} ${emp.lastName}` ===
                  department.headOfDepartment;

                return (
                  <tr
                    key={emp.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                          style={{
                            backgroundColor: department.color + "14",
                            color: department.color,
                          }}
                        >
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900 truncate">
                              {emp.firstName} {emp.lastName}
                            </p>
                            {isHead && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#f8fafc] text-slate-500 border border-[#efefef] shrink-0">
                                Head
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-slate-900">
                        {emp.jobTitle}
                      </p>
                    </td>
                    <td className="p-3 font-mono text-xs text-slate-500">
                      {emp.employeeId}
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
                    <td className="p-3 text-slate-500">{emp.supervisor}</td>
                  </tr>
                );
              })}
              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-slate-400"
                  >
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-slate-900">
                      No employees in this department
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles Breakdown */}
      {roleGroups.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Roles Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roleGroups.map(([role, members]) => (
              <div
                key={role}
                className="rounded-xl border border-[#efefef] bg-white p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{role}</p>
                  <span className="text-xs font-medium text-slate-500 bg-[#f8fafc] px-2 py-0.5 rounded-full">
                    {members.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {members.map((emp) => {
                    const statusStyle =
                      EMPLOYEE_STATUS_STYLES[
                        emp.employmentStatus as EmploymentStatus
                      ];
                    return (
                      <div
                        key={emp.id}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-[#f8fafc] rounded-lg px-2 py-1.5 -mx-2 transition-colors"
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
                          style={{
                            backgroundColor: department.color + "14",
                            color: department.color,
                          }}
                        >
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <p className="text-sm text-slate-700 flex-1 truncate">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            emp.employmentStatus === "active"
                              ? "bg-emerald-500"
                              : emp.employmentStatus === "on-leave"
                              ? "bg-amber-500"
                              : "bg-gray-400"
                          )}
                          title={statusStyle?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
