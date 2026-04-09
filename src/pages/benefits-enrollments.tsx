import { useMemo, useState } from "react";
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
  ENROLLMENT_STATUS_STYLES,
  type EnrollmentStatus,
} from "@/lib/benefits-mock-data";

export default function BenefitsEnrollmentsPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const uniquePlanNames = useMemo(
    () => [...new Set(MOCK_ENROLLMENTS.map((e) => e.planName))],
    []
  );

  const filtered = useMemo(() => {
    return MOCK_ENROLLMENTS.filter((e) => {
      const matchesSearch =
        !search ||
        e.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase());
      const matchesPlan = planFilter === "all" || e.planName === planFilter;
      const matchesStatus =
        statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [search, planFilter, statusFilter]);

  const totalCount = MOCK_ENROLLMENTS.length;
  const activeCount = MOCK_ENROLLMENTS.filter(
    (e) => e.status === "active"
  ).length;
  const pendingCount = MOCK_ENROLLMENTS.filter(
    (e) => e.status === "pending"
  ).length;
  const expiredCount = MOCK_ENROLLMENTS.filter(
    (e) => e.status === "expired"
  ).length;

  const summaryCards = [
    { label: "Total Enrollments", value: totalCount },
    { label: "Active", value: activeCount },
    { label: "Pending", value: pendingCount },
    { label: "Expired", value: expiredCount },
  ];

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Benefits Enrollments
        </h1>
        <p className="text-sm text-slate-500">
          View and manage employee benefit plan enrollments.
        </p>
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
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Plan</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Start Date</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Dependents</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No enrollments found.
                </td>
              </tr>
            ) : (
              filtered.map((enrollment) => {
                const style =
                  ENROLLMENT_STATUS_STYLES[
                    enrollment.status as EnrollmentStatus
                  ];
                return (
                  <tr
                    key={enrollment.id}
                    className="border-t border-[#efefef]"
                  >
                    <td className="px-4 py-3">{enrollment.employeeName}</td>
                    <td className="px-4 py-3">{enrollment.department}</td>
                    <td className="px-4 py-3">{enrollment.planName}</td>
                    <td className="px-4 py-3">
                      {formatDate(enrollment.startDate)}
                    </td>
                    <td className="px-4 py-3">
                      {enrollment.dependentsCovered}
                    </td>
                    <td className={cn("px-4 py-3 font-medium", style.color)}>
                      {style.label}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
