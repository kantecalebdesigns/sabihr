import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MOCK_APPROVAL_QUEUE } from "@/lib/asset-mock-data";
import type { ApprovalStatus } from "@/types/asset";

function daysRemaining(deadline: string): number {
  const now = new Date();
  const end = new Date(deadline);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const CATEGORIES = ["All", ...new Set(MOCK_APPROVAL_QUEUE.map((a) => a.categoryName))];
const DEPARTMENTS = ["All", ...new Set(MOCK_APPROVAL_QUEUE.map((a) => a.targetDepartment))];
const STATUSES: { label: string; value: "all" | ApprovalStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AssetApprovalQueuePage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | ApprovalStatus>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, string>>({});
  const [localStatuses, setLocalStatuses] = useState<Record<string, ApprovalStatus>>({});
  const [showFilters, setShowFilters] = useState(false);

  const items = useMemo(() => {
    return MOCK_APPROVAL_QUEUE.filter((item) => {
      const effectiveStatus = localStatuses[item.id] ?? item.status;
      const q = search.toLowerCase();
      const matchesSearch =
        q === "" ||
        item.assetName.toLowerCase().includes(q) ||
        item.targetEmployee.toLowerCase().includes(q) ||
        item.requestedBy.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "All" || item.categoryName === categoryFilter;
      const matchesDept =
        departmentFilter === "All" || item.targetDepartment === departmentFilter;
      const matchesStatus =
        statusFilter === "all" || effectiveStatus === statusFilter;
      return matchesSearch && matchesCategory && matchesDept && matchesStatus;
    });
  }, [search, categoryFilter, departmentFilter, statusFilter, localStatuses]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAction(id: string, action: ApprovalStatus) {
    setLocalStatuses((prev) => ({ ...prev, [id]: action }));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleBulkApprove() {
    const updates: Record<string, ApprovalStatus> = {};
    selectedIds.forEach((id) => {
      updates[id] = "approved";
    });
    setLocalStatuses((prev) => ({ ...prev, ...updates }));
    setSelectedIds(new Set());
  }

  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i.id));

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Assignment Approval Queue
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and approve asset assignment requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button size="sm" onClick={handleBulkApprove}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Bulk Approve ({selectedIds.size})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border border-border rounded-xl bg-card p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Category</Label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Department</Label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Status</Label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | ApprovalStatus)
              }
              className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Request List */}
      <div className="space-y-3">
        {/* Select-all row */}
        <div className="flex items-center gap-2 px-1">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => {
              if (allSelected) setSelectedIds(new Set());
              else setSelectedIds(new Set(items.map((i) => i.id)));
            }}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-xs text-muted-foreground">
            Select all ({items.length})
          </span>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">
            No requests match your filters
          </p>
        )}

        {items.map((item) => {
          const effectiveStatus = localStatuses[item.id] ?? item.status;
          const days = daysRemaining(item.slaDeadline);
          const isUrgent = item.urgency === "urgent";
          const isActioned = effectiveStatus !== "pending";

          return (
            <div
              key={item.id}
              className={cn(
                "border rounded-xl bg-card p-4 space-y-3 transition-opacity",
                isActioned ? "opacity-60 border-border" : "border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  disabled={isActioned}
                  className="w-4 h-4 mt-1 rounded border-border"
                />

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{item.assetName}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {item.categoryName}
                    </span>
                    {isUrgent && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700">
                        <AlertTriangle className="w-3 h-3" />
                        Urgent
                      </span>
                    )}
                    {effectiveStatus === "approved" && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {effectiveStatus === "rejected" && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      Requested by <strong>{item.requestedBy}</strong>
                    </span>
                    <span>
                      For <strong>{item.targetEmployee}</strong>
                    </span>
                    <span>{item.targetDepartment}</span>
                    <span>{item.requestDate}</span>
                  </div>

                  {item.comment && (
                    <p className="text-xs text-muted-foreground italic">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                  )}

                  {/* SLA countdown */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span
                      className={cn(
                        days <= 1
                          ? "text-red-600 font-medium"
                          : days <= 3
                            ? "text-amber-600"
                            : "text-muted-foreground"
                      )}
                    >
                      {days <= 0
                        ? "SLA overdue"
                        : `${days} day${days > 1 ? "s" : ""} remaining`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!isActioned && (
                <div className="flex flex-col sm:flex-row gap-2 pl-7">
                  <div className="flex-1 relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Add a comment..."
                      value={comments[item.id] ?? ""}
                      onChange={(e) =>
                        setComments((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      className="pl-9 h-8 text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAction(item.id, "approved")}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction(item.id, "rejected")}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
