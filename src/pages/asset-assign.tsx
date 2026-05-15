import { useState, useMemo } from "react";
import {
  Search,
  Package,
  User,
  CalendarDays,
  FileText,
  ShieldCheck,
  CheckCircle2,
  X,
  ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_ASSIGNMENTS,
  ASSET_STATUS_STYLES,
  ASSET_CONDITION_STYLES,
  formatCurrency,
} from "@/lib/asset-mock-data";
import type { Asset } from "@/types/asset";

// Inline employee list derived from mock data
const MOCK_EMPLOYEES = [
  { id: "emp-001", name: "Adebayo Ogunlesi", department: "Engineering" },
  { id: "emp-002", name: "Chiamaka Eze", department: "Engineering" },
  { id: "emp-003", name: "Oluwaseun Afolabi", department: "Engineering" },
  { id: "emp-004", name: "Fatima Abdullahi", department: "Human Resources" },
  { id: "emp-005", name: "Emeka Okafor", department: "Operations" },
  { id: "emp-006", name: "Aisha Mohammed", department: "Finance" },
  { id: "emp-007", name: "Tochukwu Nwankwo", department: "Engineering" },
  { id: "emp-009", name: "Ibrahim Musa", department: "Operations" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getEmployeeAssetCount(employeeId: string) {
  return MOCK_ASSIGNMENTS.filter(
    (a) => a.employeeId === employeeId && a.status === "active"
  ).length;
}

export default function AssetAssignPage() {
  const [assetSearch, setAssetSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<
    (typeof MOCK_EMPLOYEES)[0] | null
  >(null);
  const [assignDate, setAssignDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [requireAck, setRequireAck] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableAssets = useMemo(
    () =>
      MOCK_ASSETS.filter(
        (a) =>
          a.status === "available" &&
          (assetSearch === "" ||
            a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
            a.tag.toLowerCase().includes(assetSearch.toLowerCase()) ||
            a.categoryName.toLowerCase().includes(assetSearch.toLowerCase()))
      ),
    [assetSearch]
  );

  const filteredEmployees = useMemo(
    () =>
      MOCK_EMPLOYEES.filter(
        (e) =>
          employeeSearch === "" ||
          e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
          e.department.toLowerCase().includes(employeeSearch.toLowerCase())
      ),
    [employeeSearch]
  );

  function handleConfirm() {
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setSelectedAsset(null);
      setSelectedEmployee(null);
      setNotes("");
    }, 1500);
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Assign Asset</h1>
        <p className="text-sm text-muted-foreground">
          Select an available asset and assign it to an employee
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Asset Selection */}
        <div className="border border-border rounded-xl bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Package className="w-4 h-4 text-primary" />
            Select Asset
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, tag, category..."
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {availableAssets.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No available assets found
              </p>
            )}
            {availableAssets.map((asset) => {
              const statusStyle = ASSET_STATUS_STYLES[asset.status];
              const condStyle = ASSET_CONDITION_STYLES[asset.condition];
              const isSelected = selectedAsset?.id === asset.id;
              return (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={cn(
                    "w-full text-left border rounded-xl p-4 transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex gap-3">
                    {/* Photo placeholder */}
                    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium truncate">
                        {asset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {asset.tag} &middot; {asset.categoryName}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "inline-flex items-center text-xs px-2 py-0.5 rounded-full border",
                            statusStyle.bg,
                            statusStyle.color
                          )}
                        >
                          {statusStyle.label}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center text-xs px-2 py-0.5 rounded-full border",
                            condStyle.bg,
                            condStyle.color
                          )}
                        >
                          {condStyle.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(asset.purchasePrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Employee Selection */}
        <div className="border border-border rounded-xl bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4 text-primary" />
            Select Employee
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or department..."
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {filteredEmployees.map((emp) => {
              const isSelected = selectedEmployee?.id === emp.id;
              const assetCount = getEmployeeAssetCount(emp.id);
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={cn(
                    "w-full text-left border rounded-xl p-4 transition-colors flex items-center gap-3",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                    {getInitials(emp.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {emp.department}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {assetCount} asset{assetCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="border border-border rounded-xl bg-card p-5 space-y-4">
        <p className="text-sm font-medium">Assignment Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm">
              <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
              Assignment Date
            </Label>
            <Input
              type="date"
              value={assignDate}
              onChange={(e) => setAssignDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">
              <FileText className="w-3.5 h-3.5 inline mr-1" />
              Notes
            </Label>
            <Input
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRequireAck(!requireAck)}
            className={cn(
              "w-10 h-6 rounded-full relative transition-colors",
              requireAck ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                requireAck ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </button>
          <Label className="text-sm flex items-center gap-1.5 cursor-pointer">
            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
            Require employee acknowledgment
          </Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedAsset(null);
            setSelectedEmployee(null);
            setNotes("");
          }}
        >
          Reset
        </Button>
        <Button
          disabled={!selectedAsset || !selectedEmployee}
          onClick={() => setShowModal(true)}
        >
          Review &amp; Assign
        </Button>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedAsset && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-card border border-border rounded-t-xl sm:rounded-xl w-full sm:max-w-md p-5 sm:p-6 space-y-5 shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-semibold">Confirm Assignment</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Asset</span>
                <span className="font-medium">{selectedAsset.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tag</span>
                <span>{selectedAsset.tag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{selectedAsset.categoryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Value</span>
                <span>{formatCurrency(selectedAsset.purchasePrice)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee</span>
                <span className="font-medium">{selectedEmployee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <span>{selectedEmployee.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{assignDate}</span>
              </div>
              {notes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Notes</span>
                  <span className="text-right max-w-[200px] truncate">
                    {notes}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Acknowledgment</span>
                <span>{requireAck ? "Required" : "Not required"}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirm}
                disabled={submitted}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Assigned!
                  </>
                ) : (
                  "Confirm Assignment"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
