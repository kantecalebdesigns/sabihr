import { useState, useMemo } from "react";
import { Search, ClipboardList } from "lucide-react";
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
  MOCK_APPRAISALS,
  APPRAISAL_STATUS_STYLES,
} from "@/lib/performance-mock-data";

const SELF_REVIEW_STYLES: Record<"pending" | "submitted", { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-amber-700" },
  submitted: { label: "Submitted", color: "text-emerald-700" },
};

const MANAGER_REVIEW_STYLES: Record<"pending" | "submitted", { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-amber-700" },
  submitted: { label: "Submitted", color: "text-emerald-700" },
};

export default function PerformanceReviewsPage() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const departments = useMemo(
    () => [...new Set(MOCK_APPRAISALS.map((a) => a.department))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return MOCK_APPRAISALS.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        a.employeeName.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        a.managerName.toLowerCase().includes(q);
      const matchesDept =
        departmentFilter === "all" || a.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [search, departmentFilter]);

  const counts = useMemo(() => {
    const c = { total: MOCK_APPRAISALS.length, completed: 0, pendingSelf: 0, pendingManager: 0 };
    MOCK_APPRAISALS.forEach((a) => {
      if (a.status === "completed") c.completed++;
      else if (a.status === "pending-self") c.pendingSelf++;
      else if (a.status === "pending-manager") c.pendingManager++;
    });
    return c;
  }, []);

  const summaryCards = [
    { label: "Total Appraisals", value: counts.total },
    { label: "Completed", value: counts.completed },
    { label: "Awaiting Self Review", value: counts.pendingSelf },
    { label: "Awaiting Manager", value: counts.pendingManager },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Appraisal Management
        </h1>
        <p className="text-sm text-slate-500">
          {MOCK_APPRAISALS.length} total appraisals &middot; {filtered.length} shown
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2"
          >
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + Department Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search employees, managers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
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

      {/* Table */}
      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#efefef] bg-[#f8fafc]">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Manager</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Self Review</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Manager Review</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Final Rating</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((appraisal) => {
              const statusStyle = APPRAISAL_STATUS_STYLES[appraisal.status];
              const selfStyle = SELF_REVIEW_STYLES[appraisal.selfReviewStatus];
              const mgrStyle = MANAGER_REVIEW_STYLES[appraisal.managerReviewStatus];
              return (
                <tr
                  key={appraisal.id}
                  className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors"
                >
                  <td className="p-3 font-medium text-slate-900">
                    {appraisal.employeeName}
                  </td>
                  <td className="p-3 text-slate-500">{appraisal.department}</td>
                  <td className="p-3 text-slate-500">{appraisal.managerName}</td>
                  <td className={cn("p-3 text-sm font-medium", selfStyle.color)}>
                    {selfStyle.label}
                  </td>
                  <td className={cn("p-3 text-sm font-medium", mgrStyle.color)}>
                    {mgrStyle.label}
                  </td>
                  <td className="p-3 font-medium text-slate-900">
                    {appraisal.finalRating ? `${appraisal.finalRating}/5` : "\u2014"}
                  </td>
                  <td className={cn("p-3 text-sm font-medium", statusStyle.color)}>
                    {statusStyle.label}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400">
                  <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-slate-900">No appraisals found</p>
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
