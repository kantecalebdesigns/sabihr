import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Wrench,
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import {
  MOCK_MAINTENANCE_RECORDS,
  MOCK_MAINTENANCE_REQUESTS,
  formatCurrency,
} from "@/lib/asset-mock-data";
import type {
  MaintenanceRecord,
  MaintenanceType,
  MaintenanceRequest,
  MaintenanceRequestStatus,
} from "@/types/asset";
import { Check, X as XIcon, Inbox } from "lucide-react";

const MAINTENANCE_TYPE_STYLES: Record<MaintenanceType, { label: string; color: string; bg: string }> = {
  preventive: { label: "Preventive", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  corrective: { label: "Corrective", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  inspection: { label: "Inspection", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  upgrade: { label: "Upgrade", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
};

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  scheduled: { label: "Scheduled", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Calendar },
  "in-progress": { label: "In Progress", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  overdue: { label: "Overdue", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertTriangle },
};

function isOverdue(record: MaintenanceRecord): boolean {
  if (record.status === "completed") return false;
  if (!record.nextDueDate) return false;
  return new Date(record.nextDueDate) < new Date();
}

const REQUEST_STATUS_STYLES: Record<MaintenanceRequestStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  approved: { label: "Approved", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  scheduled: { label: "Scheduled", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const URGENCY_STYLES: Record<MaintenanceRequest["urgency"], string> = {
  low: "text-slate-500",
  normal: "text-blue-700",
  high: "text-amber-700",
};

export default function AssetMaintenance() {
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE_REQUESTS);
  const [showRaise, setShowRaise] = useState(false);
  const [raiseAsset, setRaiseAsset] = useState("");
  const [raiseEmployee, setRaiseEmployee] = useState("");
  const [raiseType, setRaiseType] = useState<MaintenanceType>("preventive");
  const [raiseDescription, setRaiseDescription] = useState("");

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const updateRequest = (id: string, status: MaintenanceRequestStatus) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              reviewedBy: "Admin User",
              reviewedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const submitAdminRequest = () => {
    if (!raiseAsset || !raiseEmployee || !raiseDescription) return;
    const now = new Date().toISOString();
    const newRequest: MaintenanceRequest = {
      id: `mr-${Date.now()}`,
      assetId: "",
      assetName: raiseAsset,
      assetTag: "",
      employeeId: "",
      employeeName: raiseEmployee,
      type: raiseType,
      urgency: "normal",
      description: raiseDescription,
      preferredDate: null,
      submittedAt: now,
      status: "approved",
      reviewedBy: "Admin User",
      reviewedAt: now,
      reviewerNote: "Raised internally by admin.",
    };
    setRequests((prev) => [newRequest, ...prev]);
    setRaiseAsset("");
    setRaiseEmployee("");
    setRaiseDescription("");
    setShowRaise(false);
  };

  // Form state
  const [formAssetName, setFormAssetName] = useState("");
  const [formType, setFormType] = useState<MaintenanceType>("preventive");
  const [formDescription, setFormDescription] = useState("");
  const [formVendor, setFormVendor] = useState("");
  const [formCost, setFormCost] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formRecurring, setFormRecurring] = useState(false);
  const [formFrequency, setFormFrequency] = useState("");
  const [formNextDue, setFormNextDue] = useState("");

  const records = useMemo(() => {
    // Annotate overdue status
    return MOCK_MAINTENANCE_RECORDS.map((r) => ({
      ...r,
      status: isOverdue(r) ? ("overdue" as const) : r.status,
    }));
  }, []);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchType = filterType === "all" || r.type === filterType;
      const matchStatus = filterStatus === "all" || r.status === filterStatus;
      return matchType && matchStatus;
    });
  }, [records, filterType, filterStatus]);

  const totalCost = useMemo(
    () => records.reduce((sum, r) => sum + r.cost, 0),
    [records]
  );
  const completedCost = useMemo(
    () => records.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.cost, 0),
    [records]
  );
  const scheduledCount = records.filter((r) => r.status === "scheduled" || r.status === "in-progress").length;
  const overdueCount = records.filter((r) => r.status === "overdue").length;

  function handleAddRecord() {
    alert(`Maintenance record added for ${formAssetName}`);
    setShowForm(false);
    setFormAssetName("");
    setFormDescription("");
    setFormVendor("");
    setFormCost("");
    setFormDate("");
    setFormRecurring(false);
    setFormFrequency("");
    setFormNextDue("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Asset Maintenance</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track maintenance history, schedule upcoming work, and manage costs.
        </p>
      </div>

      {/* Cost Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <DollarSign className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Spend</p>
                <p className="text-lg font-bold">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed Spend</p>
                <p className="text-lg font-bold">{formatCurrency(completedCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Calendar className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Upcoming</p>
                <p className="text-lg font-bold">{scheduledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-lg font-bold text-red-600">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Requests Inbox */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Inbox className="size-4" />
              Maintenance Requests
              {pendingRequests.length > 0 && (
                <Badge variant="outline" className="text-[11px] text-amber-700 bg-amber-50 border-amber-200">
                  {pendingRequests.length} pending
                </Badge>
              )}
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowRaise((v) => !v)}>
              <Plus className="size-4" />
              Raise Request
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {showRaise && (
            <div className="rounded-lg border border-[#efefef] bg-[#f8fafc] p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Asset</Label>
                  <Input
                    placeholder="Asset name or tag..."
                    value={raiseAsset}
                    onChange={(e) => setRaiseAsset(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Employee (optional)</Label>
                  <Input
                    placeholder="Assigned employee..."
                    value={raiseEmployee}
                    onChange={(e) => setRaiseEmployee(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Type</Label>
                  <Select value={raiseType} onValueChange={(v) => setRaiseType(v as MaintenanceType)}>
                    <SelectTrigger className="text-sm w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="corrective">Corrective</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="upgrade">Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Description</Label>
                <textarea
                  rows={2}
                  value={raiseDescription}
                  onChange={(e) => setRaiseDescription(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowRaise(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={submitAdminRequest}>
                  Submit Request
                </Button>
              </div>
            </div>
          )}

          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No maintenance requests yet.
            </p>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => {
                const typeStyle = MAINTENANCE_TYPE_STYLES[r.type];
                const statusStyle = REQUEST_STATUS_STYLES[r.status];
                return (
                  <div
                    key={r.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-[#efefef] bg-white p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{r.assetName}</p>
                        <Badge variant="outline" className={cn("text-[11px]", typeStyle.bg, typeStyle.color)}>
                          {typeStyle.label}
                        </Badge>
                        <Badge variant="outline" className={cn("text-[11px]", statusStyle.bg, statusStyle.color)}>
                          {statusStyle.label}
                        </Badge>
                        <span className={cn("text-[11px] font-medium capitalize", URGENCY_STYLES[r.urgency])}>
                          {r.urgency} urgency
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        From {r.employeeName || "—"}
                        {r.preferredDate && ` · prefers ${new Date(r.preferredDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}`}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{r.description}</p>
                    </div>
                    {r.status === "pending" && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => updateRequest(r.id, "rejected")}>
                          <XIcon className="size-3.5" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => updateRequest(r.id, "approved")}>
                          <Check className="size-3.5" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Maintenance Record (collapsible) */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <button
            className="flex items-center justify-between w-full cursor-pointer"
            onClick={() => setShowForm(!showForm)}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Plus className="size-4" />
              Add Maintenance Record
            </CardTitle>
            {showForm ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </CardHeader>
        {showForm && (
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm mb-1.5 block">Asset Name</Label>
                <Input
                  placeholder="e.g. MacBook Pro 16&quot;"
                  value={formAssetName}
                  onChange={(e) => setFormAssetName(e.target.value)}
                  className="text-sm rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Type</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as MaintenanceType)}>
                  <SelectTrigger className="rounded-xl text-sm w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="corrective">Corrective</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="upgrade">Upgrade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Vendor</Label>
                <Input
                  placeholder="Service provider..."
                  value={formVendor}
                  onChange={(e) => setFormVendor(e.target.value)}
                  className="text-sm rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Cost</Label>
                <Input
                  type="number"
                  placeholder="Amount..."
                  value={formCost}
                  onChange={(e) => setFormCost(e.target.value)}
                  className="text-sm rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Date</Label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="text-sm rounded-xl"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label className="text-sm mb-1.5 block">Description</Label>
                <Input
                  placeholder="Describe maintenance work..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Recurring Setup */}
            <div className="mt-4 pt-4 border-t border-border space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={formRecurring}
                  onCheckedChange={(v) => setFormRecurring(v === true)}
                />
                <span className="text-sm flex items-center gap-1.5">
                  <RefreshCw className="size-3.5" />
                  Set as recurring maintenance
                </span>
              </label>
              {formRecurring && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7">
                  <div>
                    <Label className="text-sm mb-1.5 block">Frequency (months)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 6"
                      value={formFrequency}
                      onChange={(e) => setFormFrequency(e.target.value)}
                      className="text-sm rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Next Due Date</Label>
                    <Input
                      type="date"
                      value={formNextDue}
                      onChange={(e) => setFormNextDue(e.target.value)}
                      className="text-sm rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button className="rounded-xl text-sm gap-2" onClick={handleAddRecord}>
                <Plus className="size-4" />
                Add Record
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[160px]">
          <Label className="text-sm mb-1.5 block">Type</Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="rounded-xl text-sm w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="preventive">Preventive</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="upgrade">Upgrade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[160px]">
          <Label className="text-sm mb-1.5 block">Status</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="rounded-xl text-sm w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Maintenance History Table */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Wrench className="size-4" />
            Maintenance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Asset</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Vendor</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Cost</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Next Due</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => {
                  const typeStyle = MAINTENANCE_TYPE_STYLES[record.type];
                  const statusStyle = STATUS_STYLES[record.status];
                  const StatusIcon = statusStyle.icon;

                  return (
                    <tr key={record.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-2 whitespace-nowrap">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 font-medium">{record.assetName}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={cn("text-xs border", typeStyle.bg, typeStyle.color)}>
                          {typeStyle.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">{record.vendor}</td>
                      <td className="py-3 px-2 font-medium">{formatCurrency(record.cost)}</td>
                      <td className="py-3 px-2 max-w-[200px] truncate">{record.description}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={cn("text-xs border gap-1", statusStyle.bg, statusStyle.color)}>
                          <StatusIcon className="size-3" />
                          {statusStyle.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {record.nextDueDate ? (
                          <span className={cn(
                            record.status === "overdue" ? "text-red-600 font-medium" : "text-muted-foreground"
                          )}>
                            {new Date(record.nextDueDate).toLocaleDateString()}
                            {record.isRecurring && (
                              <RefreshCw className="inline size-3 ml-1 text-muted-foreground" />
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <Wrench className="size-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No maintenance records match your filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
