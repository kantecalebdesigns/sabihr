import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  CalendarClock,
  PackageCheck,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { MOCK_RETURN_REQUESTS } from "@/lib/asset-mock-data";

const RETURN_REASON_LABELS: Record<string, string> = {
  "no-longer-needed": "No Longer Needed",
  upgrade: "Upgrade",
  leaving: "Leaving",
  damaged: "Damaged",
};

const RETURN_STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  "collection-scheduled": { label: "Collection Scheduled", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  returned: { label: "Returned", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  completed: { label: "Completed", color: "text-gray-700", bg: "bg-gray-100 border-gray-300" },
};

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AssetReturnQueue() {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const branches = useMemo(
    () => [...new Set(MOCK_RETURN_REQUESTS.map((r) => r.branch))],
    []
  );
  const categories = useMemo(
    () => [...new Set(MOCK_RETURN_REQUESTS.map((r) => r.categoryName))],
    []
  );

  const filtered = useMemo(() => {
    return MOCK_RETURN_REQUESTS.filter((r) => {
      const matchSearch =
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.assetName.toLowerCase().includes(search.toLowerCase());
      const matchBranch = branchFilter === "all" || r.branch === branchFilter;
      const matchCategory = categoryFilter === "all" || r.categoryName === categoryFilter;
      const days = getDaysUntil(r.proposedDate);
      const matchUrgency =
        urgencyFilter === "all" ||
        (urgencyFilter === "overdue" && days < 0) ||
        (urgencyFilter === "due-soon" && days >= 0 && days <= 3) ||
        (urgencyFilter === "on-time" && days > 3);
      return matchSearch && matchBranch && matchCategory && matchUrgency;
    });
  }, [search, branchFilter, categoryFilter, urgencyFilter]);

  function handleScheduleCollection(id: string) {
    alert(`Collection scheduled for return request ${id}`);
  }

  function handleMarkReceived(id: string) {
    alert(`Return request ${id} marked as received`);
  }

  function handleReject(id: string) {
    if (!rejectReason.trim()) return;
    alert(`Return request ${id} rejected. Reason: ${rejectReason}`);
    setRejectingId(null);
    setRejectReason("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Asset Return Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage pending asset returns, schedule collections, and process received items.
        </p>
      </div>

      {/* Filters */}
      <Card className="rounded-xl border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-sm mb-1.5 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee or asset..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-sm rounded-xl"
                />
              </div>
            </div>
            <div className="min-w-[180px]">
              <Label className="text-sm mb-1.5 block">Branch</Label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="rounded-xl text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[160px]">
              <Label className="text-sm mb-1.5 block">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="rounded-xl text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[160px]">
              <Label className="text-sm mb-1.5 block">Urgency</Label>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="rounded-xl text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="due-soon">Due Soon</SelectItem>
                  <SelectItem value="on-time">On Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <Card className="rounded-xl border-border bg-card">
            <CardContent className="py-12 text-center">
              <RotateCcw className="size-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No return requests match your filters.</p>
            </CardContent>
          </Card>
        )}

        {filtered.map((req) => {
          const days = getDaysUntil(req.proposedDate);
          const isOverdue = days < 0;
          const isDueSoon = days >= 0 && days <= 3;
          const statusStyle = RETURN_STATUS_STYLES[req.status] ?? RETURN_STATUS_STYLES.submitted;

          return (
            <Card key={req.id} className="rounded-xl border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-sm">{req.employeeName}</span>
                      <Badge variant="outline" className={cn("text-xs border", statusStyle.bg, statusStyle.color)}>
                        {statusStyle.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {req.categoryName}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{req.assetName}</span>{" "}
                      <span className="text-xs">({req.assetTag})</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Reason: <span className="font-medium text-foreground">{RETURN_REASON_LABELS[req.reason] ?? req.reason}</span>
                      </span>
                      <span>
                        Proposed: <span className="font-medium text-foreground">{new Date(req.proposedDate).toLocaleDateString()}</span>
                      </span>
                      <span>Branch: {req.branch}</span>
                    </div>

                    {/* SLA indicator */}
                    <div className="flex items-center gap-2 mt-1">
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <AlertTriangle className="size-3.5" />
                          {Math.abs(days)} day{Math.abs(days) !== 1 ? "s" : ""} overdue
                        </span>
                      ) : isDueSoon ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                          <Clock className="size-3.5" />
                          Due in {days} day{days !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                          <Clock className="size-3.5" />
                          {days} day{days !== 1 ? "s" : ""} remaining
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-sm rounded-xl gap-1.5"
                      onClick={() => handleScheduleCollection(req.id)}
                    >
                      <CalendarClock className="size-4" />
                      Schedule Collection
                    </Button>
                    <Button
                      size="sm"
                      className="text-sm rounded-xl gap-1.5"
                      onClick={() => handleMarkReceived(req.id)}
                    >
                      <PackageCheck className="size-4" />
                      Mark Received
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-sm rounded-xl gap-1.5"
                      onClick={() => setRejectingId(rejectingId === req.id ? null : req.id)}
                    >
                      <XCircle className="size-4" />
                      Reject
                    </Button>
                  </div>
                </div>

                {/* Reject reason input */}
                {rejectingId === req.id && (
                  <div className="mt-4 pt-4 border-t border-border flex items-end gap-3">
                    <div className="flex-1">
                      <Label className="text-sm mb-1.5 block">Rejection Reason</Label>
                      <Input
                        placeholder="Enter reason for rejection..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="text-sm rounded-xl"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-sm rounded-xl"
                      onClick={() => handleReject(req.id)}
                      disabled={!rejectReason.trim()}
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
