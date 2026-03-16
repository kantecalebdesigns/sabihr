import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  ArrowRightLeft,
  Wrench,
  Trash2,
  Edit3,
  Save,
  X,
  Check,
  Clock,
  FileText,
  BarChart3,
  ClipboardList,
  History,
  Shield,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_ASSIGNMENTS,
  MOCK_MAINTENANCE_RECORDS,
  MOCK_DEPRECIATION_SCHEDULE,
  MOCK_CONDITION_HISTORY,
  ASSET_STATUS_STYLES,
  ASSET_CONDITION_STYLES,
  formatCurrency,
} from "@/lib/asset-mock-data";

type Tab = "overview" | "assignments" | "maintenance" | "depreciation" | "documents" | "condition" | "audit";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <ClipboardList className="w-4 h-4" /> },
  { key: "assignments", label: "Assignments", icon: <UserPlus className="w-4 h-4" /> },
  { key: "maintenance", label: "Maintenance", icon: <Wrench className="w-4 h-4" /> },
  { key: "depreciation", label: "Depreciation", icon: <BarChart3 className="w-4 h-4" /> },
  { key: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
  { key: "condition", label: "Condition", icon: <Shield className="w-4 h-4" /> },
  { key: "audit", label: "Audit Trail", icon: <History className="w-4 h-4" /> },
];

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editMode, setEditMode] = useState(false);
  const [activeModal, setActiveModal] = useState<"assign" | "transfer" | "maintenance" | "dispose" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    model: "",
    vendor: "",
    warrantyProvider: "",
    location: "",
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const asset = MOCK_ASSETS.find((a) => a.id === id) ?? MOCK_ASSETS[0];

  const startEdit = () => {
    setEditForm({
      model: asset.model,
      vendor: asset.vendor,
      warrantyProvider: asset.warrantyProvider,
      location: asset.location,
    });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
  };

  const handleSaveEdit = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditMode(false);
      showToast("Asset updated successfully");
    }, 800);
  };
  const statusStyle = ASSET_STATUS_STYLES[asset.status];
  const condStyle = ASSET_CONDITION_STYLES[asset.condition];

  const assetAssignments = MOCK_ASSIGNMENTS.filter(
    (a) => a.assetId === asset.id
  );
  const assetMaintenance = MOCK_MAINTENANCE_RECORDS.filter(
    (m) => m.assetId === asset.id
  );
  const assetConditions = MOCK_CONDITION_HISTORY.filter(
    (c) => c.assetId === asset.id
  );

  const totalDepreciated = asset.purchasePrice - asset.currentBookValue;
  const remainingMonths = Math.max(
    0,
    asset.usefulLifeMonths -
      Math.round(
        (Date.now() - new Date(asset.purchaseDate).getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      )
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Back Link */}
      <button
        onClick={() => navigate("/assets")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Asset Register
      </button>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight">
                {asset.name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  statusStyle?.bg,
                  statusStyle?.color
                )}
              >
                {statusStyle?.label}
              </span>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  condStyle?.bg,
                  condStyle?.color
                )}
              >
                {condStyle?.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-mono">{asset.tag}</span>
              <span>&middot;</span>
              <span>{asset.categoryName}</span>
              <span>&middot;</span>
              <span>{asset.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {editMode ? (
              <>
                <Button variant="outline" size="sm" onClick={cancelEdit}>
                  <X className="w-4 h-4 mr-1.5" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit} disabled={saving}>
                  {saving ? (
                    <span className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                  ) : (
                    <Save className="w-4 h-4 mr-1.5" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setActiveModal("assign")}>
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Assign
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveModal("transfer")}>
                  <ArrowRightLeft className="w-4 h-4 mr-1.5" />
                  Transfer
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveModal("maintenance")}>
                  <Wrench className="w-4 h-4 mr-1.5" />
                  Maintenance
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveModal("dispose")}>
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Dispose
                </Button>
                <Button variant="outline" size="sm" onClick={startEdit}>
                  <Edit3 className="w-4 h-4 mr-1.5" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Specifications */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold">Specifications</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Model</span>
                {editMode ? (
                  <Input
                    value={editForm.model}
                    onChange={(e) => setEditForm((f) => ({ ...f, model: e.target.value }))}
                    className="h-7 w-48 text-xs"
                  />
                ) : (
                  <span className="font-medium">{asset.model}</span>
                )}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Serial Number</span>
                <span className="font-medium font-mono text-xs">
                  {asset.serialNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Location</span>
                {editMode ? (
                  <Input
                    value={editForm.location}
                    onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                    className="h-7 w-48 text-xs"
                  />
                ) : (
                  <span className="font-medium">{asset.location}</span>
                )}
              </div>
              {Object.entries(asset.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Details */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold">Purchase Details</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Purchase Date</span>
                <span className="font-medium">{asset.purchaseDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Purchase Price</span>
                <span className="font-medium">
                  {formatCurrency(asset.purchasePrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Vendor</span>
                {editMode ? (
                  <Input
                    value={editForm.vendor}
                    onChange={(e) => setEditForm((f) => ({ ...f, vendor: e.target.value }))}
                    className="h-7 w-48 text-xs"
                  />
                ) : (
                  <span className="font-medium">{asset.vendor}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Warranty Expiry</span>
                <span className="font-medium">
                  {asset.warrantyExpiry ?? "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Warranty Provider
                </span>
                {editMode ? (
                  <Input
                    value={editForm.warrantyProvider}
                    onChange={(e) => setEditForm((f) => ({ ...f, warrantyProvider: e.target.value }))}
                    className="h-7 w-48 text-xs"
                  />
                ) : (
                  <span className="font-medium">{asset.warrantyProvider}</span>
                )}
              </div>
            </div>
          </div>

          {/* Current Value */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 lg:col-span-2">
            <h3 className="text-sm font-semibold">Current Value</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-lg font-bold">
                  {formatCurrency(asset.purchasePrice)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Purchase Price
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-lg font-bold">
                  {formatCurrency(asset.currentBookValue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Current Book Value
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-lg font-bold">
                  {formatCurrency(totalDepreciated)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total Depreciated
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-lg font-bold">{remainingMonths}m</p>
                <p className="text-xs text-muted-foreground">
                  Remaining Life
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Assignment History</h3>
          {assetAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">
              No assignment records
            </p>
          ) : (
            <div className="space-y-3">
              {assetAssignments.map((record) => (
                <div
                  key={record.id}
                  className="rounded-xl border border-border bg-card p-4 flex items-start gap-4"
                >
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {record.employeeName}
                      </p>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium",
                          record.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : record.status === "returned"
                              ? "bg-gray-50 text-gray-700 border-gray-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                      >
                        {record.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {record.department} &middot; Assigned by{" "}
                      {record.assignedBy}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {record.assignedDate}
                      </span>
                      {record.returnedDate && (
                        <span>
                          <ChevronRight className="w-3 h-3 inline" />{" "}
                          {record.returnedDate}
                        </span>
                      )}
                    </div>
                    {record.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        {record.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === "maintenance" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Maintenance Log</h3>
          <div className="rounded-xl border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Vendor
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Cost
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {assetMaintenance.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="p-3">{m.date}</td>
                    <td className="p-3">
                      <span className="capitalize">{m.type}</span>
                    </td>
                    <td className="p-3 max-w-[250px] truncate">
                      {m.description}
                    </td>
                    <td className="p-3">{m.vendor}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(m.cost)}
                    </td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium",
                          m.status === "completed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : m.status === "scheduled"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : m.status === "in-progress"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        )}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {assetMaintenance.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No maintenance records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Depreciation Tab */}
      {activeTab === "depreciation" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Depreciation Schedule</h3>
            <span className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground font-medium capitalize">
              {asset.depreciationMethod} method
            </span>
          </div>

          {/* Chart placeholder */}
          <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center h-48">
            <div className="text-center space-y-2">
              <BarChart3 className="w-10 h-10 mx-auto text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Depreciation chart visualization
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Period
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Opening Value
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Charge
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Accumulated
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Closing Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DEPRECIATION_SCHEDULE.map((entry) => (
                  <tr
                    key={entry.period}
                    className="border-b border-border last:border-0"
                  >
                    <td className="p-3 font-medium">{entry.period}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(entry.openingValue)}
                    </td>
                    <td className="p-3 text-right text-red-600">
                      -{formatCurrency(entry.charge)}
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      {formatCurrency(entry.accumulated)}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatCurrency(entry.closingValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Documents</h3>
          {asset.documents.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground text-sm">
              No documents attached
            </div>
          ) : (
            <div className="space-y-2">
              {asset.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
                >
                  <FileText className="w-5 h-5 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.fileName} &middot; {doc.size} &middot;{" "}
                      {doc.uploadDate}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Condition History Tab */}
      {activeTab === "condition" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Condition History</h3>
          {assetConditions.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground text-sm">
              No condition change records
            </div>
          ) : (
            <div className="space-y-3">
              {assetConditions.map((entry) => {
                const prevStyle = ASSET_CONDITION_STYLES[entry.previousCondition];
                const newStyle = ASSET_CONDITION_STYLES[entry.condition];
                return (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-border bg-card p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs border font-medium",
                          prevStyle?.bg,
                          prevStyle?.color
                        )}
                      >
                        {prevStyle?.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs border font-medium",
                          newStyle?.bg,
                          newStyle?.color
                        )}
                      >
                        {newStyle?.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {entry.notes}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Assessed by {entry.assessedBy} on {entry.assessedDate}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Audit Trail</h3>
          <div className="space-y-3">
            {[
              { action: "Asset created", by: "System", date: asset.createdAt.split("T")[0], detail: "Initial record created" },
              { action: "Assigned to employee", by: "Amina Bello", date: asset.assignedDate ?? "", detail: `Assigned to ${asset.assignedToName}` },
              { action: "Condition updated", by: "Amina Bello", date: "2026-02-15", detail: "Condition changed from New to Good" },
              { action: "Record updated", by: "System", date: asset.updatedAt.split("T")[0], detail: "Asset information updated" },
            ].map((entry, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="mt-0.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium">{entry.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.detail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.by} &middot; {entry.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setActiveModal(null)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl mx-4 space-y-5" onClick={(e) => e.stopPropagation()}>
            {/* Assign Modal */}
            {activeModal === "assign" && (
              <AssignModal
                assetName={asset.name}
                onClose={() => setActiveModal(null)}
                onSubmit={() => { setActiveModal(null); showToast("Asset assigned successfully"); }}
              />
            )}
            {/* Transfer Modal */}
            {activeModal === "transfer" && (
              <TransferModal
                assetName={asset.name}
                currentAssignee={asset.assignedToName}
                onClose={() => setActiveModal(null)}
                onSubmit={() => { setActiveModal(null); showToast("Transfer initiated successfully"); }}
              />
            )}
            {/* Maintenance Modal */}
            {activeModal === "maintenance" && (
              <MaintenanceModal
                assetName={asset.name}
                onClose={() => setActiveModal(null)}
                onSubmit={() => { setActiveModal(null); showToast("Maintenance record added"); }}
              />
            )}
            {/* Dispose Modal */}
            {activeModal === "dispose" && (
              <DisposeModal
                assetName={asset.name}
                onClose={() => setActiveModal(null)}
                onSubmit={() => { setActiveModal(null); showToast("Disposal request submitted"); }}
              />
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ── Assign Modal ── */
function AssignModal({ assetName, onClose, onSubmit }: { assetName: string; onClose: () => void; onSubmit: () => void }) {
  const [employee, setEmployee] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!employee) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(); }, 800);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Assign Asset</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
      </div>
      <p className="text-sm text-muted-foreground">Assign <span className="font-medium text-foreground">{assetName}</span> to an employee</p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Employee</Label>
          <Select value={employee} onValueChange={setEmployee}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select employee" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="emp-001">Adebayo Ogunlesi</SelectItem>
              <SelectItem value="emp-002">Chioma Nwosu</SelectItem>
              <SelectItem value="emp-003">Emeka Eze</SelectItem>
              <SelectItem value="emp-004">Fatima Ibrahim</SelectItem>
              <SelectItem value="emp-005">Oluwaseun Adeyemi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Notes (optional)</Label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Assignment notes..."
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSubmit} disabled={!employee || loading}>
          {loading ? <span className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" /> : <UserPlus className="w-4 h-4 mr-1.5" />}
          {loading ? "Assigning..." : "Assign"}
        </Button>
      </div>
    </>
  );
}

/* ── Transfer Modal ── */
function TransferModal({ assetName, currentAssignee, onClose, onSubmit }: { assetName: string; currentAssignee: string | null; onClose: () => void; onSubmit: () => void }) {
  const [toEmployee, setToEmployee] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!toEmployee || !reason) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(); }, 800);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Transfer Asset</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
      </div>
      <p className="text-sm text-muted-foreground">Transfer <span className="font-medium text-foreground">{assetName}</span> to another employee</p>
      {currentAssignee && (
        <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          Currently assigned to: <span className="font-medium text-foreground">{currentAssignee}</span>
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Transfer To</Label>
          <Select value={toEmployee} onValueChange={setToEmployee}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select employee" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="emp-001">Adebayo Ogunlesi</SelectItem>
              <SelectItem value="emp-002">Chioma Nwosu</SelectItem>
              <SelectItem value="emp-003">Emeka Eze</SelectItem>
              <SelectItem value="emp-004">Fatima Ibrahim</SelectItem>
              <SelectItem value="emp-005">Oluwaseun Adeyemi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Reason</Label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for transfer..."
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSubmit} disabled={!toEmployee || !reason || loading}>
          {loading ? <span className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" /> : <ArrowRightLeft className="w-4 h-4 mr-1.5" />}
          {loading ? "Transferring..." : "Transfer"}
        </Button>
      </div>
    </>
  );
}

/* ── Maintenance Modal ── */
function MaintenanceModal({ assetName, onClose, onSubmit }: { assetName: string; onClose: () => void; onSubmit: () => void }) {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!type || !description) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(); }, 800);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Schedule Maintenance</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
      </div>
      <p className="text-sm text-muted-foreground">Add maintenance record for <span className="font-medium text-foreground">{assetName}</span></p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Maintenance type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="preventive">Preventive</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="upgrade">Upgrade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the maintenance needed..."
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Vendor</Label>
            <Input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Vendor name" />
          </div>
          <div className="space-y-1.5">
            <Label>Scheduled Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSubmit} disabled={!type || !description || loading}>
          {loading ? <span className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" /> : <Wrench className="w-4 h-4 mr-1.5" />}
          {loading ? "Saving..." : "Add Record"}
        </Button>
      </div>
    </>
  );
}

/* ── Dispose Modal ── */
function DisposeModal({ assetName, onClose, onSubmit }: { assetName: string; onClose: () => void; onSubmit: () => void }) {
  const [method, setMethod] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!method || !reason) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(); }, 800);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Dispose Asset</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
      </div>
      <p className="text-sm text-muted-foreground">Request disposal of <span className="font-medium text-foreground">{assetName}</span></p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Disposal Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select method" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="donated">Donated</SelectItem>
              <SelectItem value="scrapped">Scrapped</SelectItem>
              <SelectItem value="recycled">Recycled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Reason for Disposal</Label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is this asset being disposed?"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" variant="destructive" onClick={handleSubmit} disabled={!method || !reason || loading}>
          {loading ? <span className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" /> : <Trash2 className="w-4 h-4 mr-1.5" />}
          {loading ? "Submitting..." : "Request Disposal"}
        </Button>
      </div>
    </>
  );
}
