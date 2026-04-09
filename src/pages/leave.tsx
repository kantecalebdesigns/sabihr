import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Palmtree,
  Check,
  X,
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
  MOCK_LEAVE_REQUESTS,
  LEAVE_STATUS_STYLES,
  LEAVE_TYPE_LABELS,
  LEAVE_POLICY_SUMMARY,
} from "@/lib/leave-mock-data";
import type { LeaveStatus, LeaveType } from "@/lib/leave-mock-data";

export default function LeavePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const departments = useMemo(
    () => [...new Set(MOCK_LEAVE_REQUESTS.map((r) => r.department))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return MOCK_LEAVE_REQUESTS.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;
      const matchesType = typeFilter === "all" || r.leaveType === typeFilter;
      const matchesDept =
        departmentFilter === "all" || r.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesType && matchesDept;
    });
  }, [search, statusFilter, typeFilter, departmentFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: MOCK_LEAVE_REQUESTS.length,
    };
    MOCK_LEAVE_REQUESTS.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  }, []);

  const handleApprove = (_id: string) => {
    // Mock action
    // no-op
  };

  const handleReject = (_id: string) => {
    // Mock action
    // no-op
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Leave Management
          </h1>
          <p className="text-sm text-slate-500">
            Review and manage employee leave requests
          </p>
        </div>
        <Button variant="outline" size="sm" className="border-[#efefef]">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Leave Policy Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(LEAVE_POLICY_SUMMARY).map(([key, policy]) => (
          <div
            key={key}
            className="rounded-xl border border-[#efefef] bg-white p-3 text-center"
          >
            <p className="text-xs text-slate-500 mb-1">
              {policy.label}
            </p>
            <p className="text-lg font-semibold text-slate-900">{policy.total}</p>
            <p className="text-[10px] text-slate-500">days/year</p>
          </div>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { key: "all", label: "All Requests" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
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
              <span
                className={cn(
                  "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                  tab.key === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-[#f8fafc]"
                )}
              >
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
              placeholder="Search by employee or department..."
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
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#efefef] bg-white p-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">
              Leave Type
            </label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(LEAVE_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
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
                Department
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Leave Type
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Duration
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Days
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Applied On
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Status
              </th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((request) => {
              const statusStyle =
                LEAVE_STATUS_STYLES[request.status as LeaveStatus];
              return (
                <tr
                  key={request.id}
                  className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors"
                >
                  <td className="p-3 font-medium text-slate-900">
                    {request.employeeName}
                  </td>
                  <td className="p-3 text-slate-500">
                    {request.department}
                  </td>
                  <td className="p-3 text-slate-500">
                    {LEAVE_TYPE_LABELS[request.leaveType as LeaveType]}
                  </td>
                  <td className="p-3 text-xs text-slate-500">
                    <div>
                      {new Date(request.startDate).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })}
                      {" - "}
                      {new Date(request.endDate).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-900">{request.days}</td>
                  <td className="p-3 text-slate-500 text-xs">
                    {new Date(request.appliedOn).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className={cn("p-3 text-sm font-medium", statusStyle?.color)}>
                    {statusStyle?.label}
                  </td>
                  <td className="p-3">
                    {request.status === "pending" ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="p-1.5 rounded-md text-[#009966] hover:bg-emerald-50 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="p-1.5 rounded-md text-[#e7000b] hover:bg-red-50 transition-colors"
                          title="Decline"
                        >
                          <X className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : request.approvedBy ? (
                      <span className="text-xs text-slate-500">
                        by {request.approvedBy}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">--</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-12 text-center text-slate-400"
                >
                  <Palmtree className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-slate-900">No leave requests found</p>
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
