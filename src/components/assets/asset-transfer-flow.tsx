import { useState, useMemo } from "react";
import {
  ChevronRight,
  Package,
  User,
  UserPlus,
  FileText,
  ClipboardCheck,
  Route,
  CheckCircle2,
  ArrowRight,
  History,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_ASSIGNMENTS,
  MOCK_TRANSFERS,
  ASSET_CONDITION_STYLES,
  formatCurrency,
} from "@/lib/asset-mock-data";
import type { Asset, AssetCondition } from "@/types/asset";

// Derive employees from assignments
const EMPLOYEES = (() => {
  const map = new Map<
    string,
    { id: string; name: string; department: string }
  >();
  MOCK_ASSIGNMENTS.forEach((a) => {
    if (!map.has(a.employeeId)) {
      map.set(a.employeeId, {
        id: a.employeeId,
        name: a.employeeName,
        department: a.department,
      });
    }
  });
  return Array.from(map.values());
})();

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const STEPS = [
  { key: "asset", label: "Select Asset", icon: Package },
  { key: "source", label: "Source Employee", icon: User },
  { key: "dest", label: "Destination", icon: UserPlus },
  { key: "reason", label: "Reason", icon: FileText },
  { key: "condition", label: "Condition", icon: ClipboardCheck },
  { key: "review", label: "Approval", icon: Route },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

const CONDITIONS: AssetCondition[] = [
  "new",
  "good",
  "fair",
  "poor",
  "damaged",
  "non-functional",
];

export function AssetTransferFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [destEmployeeId, setDestEmployeeId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [condition, setCondition] = useState<AssetCondition>("good");
  const [submitted, setSubmitted] = useState(false);
  const [assetSearch, setAssetSearch] = useState("");
  const [empSearch, setEmpSearch] = useState("");

  // Only show assigned assets
  const assignedAssets = useMemo(
    () =>
      MOCK_ASSETS.filter(
        (a) =>
          a.status === "assigned" &&
          (assetSearch === "" ||
            a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
            a.tag.toLowerCase().includes(assetSearch.toLowerCase()))
      ),
    [assetSearch]
  );

  const selectedAsset = MOCK_ASSETS.find((a) => a.id === selectedAssetId);

  // Source employee is auto-populated from asset
  const sourceEmployee = selectedAsset
    ? EMPLOYEES.find((e) => e.id === selectedAsset.assignedTo) ?? {
        id: selectedAsset.assignedTo ?? "",
        name: selectedAsset.assignedToName ?? "Unknown",
        department: "Unknown",
      }
    : null;

  const destEmployee = EMPLOYEES.find((e) => e.id === destEmployeeId);

  const filteredDestEmployees = useMemo(
    () =>
      EMPLOYEES.filter(
        (e) =>
          e.id !== sourceEmployee?.id &&
          (empSearch === "" ||
            e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
            e.department.toLowerCase().includes(empSearch.toLowerCase()))
      ),
    [empSearch, sourceEmployee]
  );

  function canProceed(): boolean {
    switch (STEPS[currentStep].key) {
      case "asset":
        return !!selectedAssetId;
      case "source":
        return !!sourceEmployee;
      case "dest":
        return !!destEmployeeId;
      case "reason":
        return reason.trim().length > 0;
      case "condition":
        return !!condition;
      case "review":
        return true;
      default:
        return false;
    }
  }

  function handleNext() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
    }
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  function handleReset() {
    setCurrentStep(0);
    setSelectedAssetId(null);
    setDestEmployeeId(null);
    setReason("");
    setCondition("good");
    setSubmitted(false);
    setAssetSearch("");
    setEmpSearch("");
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Transfer Asset
        </h1>
        <p className="text-sm text-muted-foreground">
          Transfer an asset between employees step by step
        </p>
      </div>

      {/* Stepper */}
      <div className="border border-border rounded-xl bg-card p-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = idx === currentStep;
            const isDone = idx < currentStep || submitted;
            return (
              <div key={step.key} className="flex items-center">
                <button
                  onClick={() => {
                    if (idx < currentStep && !submitted) setCurrentStep(idx);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground"
                  )}
                >
                  {isDone && !isActive ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground mx-0.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      {!submitted ? (
        <div className="border border-border rounded-xl bg-card p-5 min-h-[280px]">
          {/* Step: Asset */}
          {STEPS[currentStep].key === "asset" && (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Select the asset to transfer
              </p>
              <div className="relative max-w-sm">
                <Input
                  placeholder="Search assigned assets..."
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                />
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {assignedAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={cn(
                      "w-full text-left border rounded-xl p-3 flex items-center gap-3 transition-colors",
                      selectedAssetId === asset.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <Package className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {asset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {asset.tag} &middot; Assigned to{" "}
                        {asset.assignedToName}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(asset.currentBookValue)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Source */}
          {STEPS[currentStep].key === "source" && sourceEmployee && (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Source employee (auto-populated)
              </p>
              <div className="border border-border rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {getInitials(sourceEmployee.name)}
                </div>
                <div>
                  <p className="text-sm font-medium">{sourceEmployee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sourceEmployee.department}
                  </p>
                </div>
              </div>
              {selectedAsset && (
                <p className="text-xs text-muted-foreground">
                  Currently holds: {selectedAsset.name} ({selectedAsset.tag})
                </p>
              )}
            </div>
          )}

          {/* Step: Destination */}
          {STEPS[currentStep].key === "dest" && (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Select destination employee
              </p>
              <div className="relative max-w-sm">
                <Input
                  placeholder="Search employees..."
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                />
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredDestEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => setDestEmployeeId(emp.id)}
                    className={cn(
                      "w-full text-left border rounded-xl p-3 flex items-center gap-3 transition-colors",
                      destEmployeeId === emp.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                      {getInitials(emp.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.department}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Reason */}
          {STEPS[currentStep].key === "reason" && (
            <div className="space-y-4">
              <p className="text-sm font-medium">Provide transfer reason</p>
              <div className="space-y-1.5">
                <Label className="text-sm">Reason for transfer</Label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="E.g. Role change, department restructuring..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* Step: Condition */}
          {STEPS[currentStep].key === "condition" && (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Assess asset condition at transfer
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CONDITIONS.map((c) => {
                  const style = ASSET_CONDITION_STYLES[c];
                  return (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={cn(
                        "border rounded-xl p-3 text-sm text-center transition-colors",
                        condition === c
                          ? "border-primary bg-primary/5 ring-1 ring-primary font-medium"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block text-xs px-2 py-0.5 rounded-full border mb-1",
                          style.bg,
                          style.color
                        )}
                      >
                        {style.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step: Review */}
          {STEPS[currentStep].key === "review" &&
            selectedAsset &&
            sourceEmployee &&
            destEmployee && (
              <div className="space-y-4">
                <p className="text-sm font-medium">Transfer Summary</p>

                {/* Summary card */}
                <div className="border border-border rounded-xl p-4 space-y-4">
                  {/* Asset */}
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {selectedAsset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedAsset.tag} &middot;{" "}
                        {formatCurrency(selectedAsset.currentBookValue)}
                      </p>
                    </div>
                  </div>

                  {/* From / To */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 flex-1 min-w-[160px]">
                      <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-semibold">
                        {getInitials(sourceEmployee.name)}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="text-sm font-medium">
                          {sourceEmployee.name}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 flex-1 min-w-[160px]">
                      <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-semibold">
                        {getInitials(destEmployee.name)}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="text-sm font-medium">
                          {destEmployee.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Condition</p>
                      <span
                        className={cn(
                          "inline-flex items-center text-xs px-2 py-0.5 rounded-full border mt-1",
                          ASSET_CONDITION_STYLES[condition].bg,
                          ASSET_CONDITION_STYLES[condition].color
                        )}
                      >
                        {ASSET_CONDITION_STYLES[condition].label}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reason</p>
                      <p className="text-sm mt-1 truncate">{reason}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  This transfer will be routed for approval before processing.
                </p>
              </div>
            )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Submit for Approval</Button>
            )}
          </div>
        </div>
      ) : (
        /* Success state */
        <div className="border border-border rounded-xl bg-card p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold">
            Transfer Submitted for Approval
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The transfer of {selectedAsset?.name} from{" "}
            {sourceEmployee?.name} to {destEmployee?.name} has been
            submitted and is pending approval.
          </p>
          <Button variant="outline" onClick={handleReset}>
            Start New Transfer
          </Button>
        </div>
      )}

      {/* Transfer History Log */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <History className="w-4 h-4 text-muted-foreground" />
          Transfer History
        </div>
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Asset
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    From
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    To
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Condition
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSFERS.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No transfer history
                    </td>
                  </tr>
                )}
                {MOCK_TRANSFERS.map((t) => {
                  const condStyle =
                    ASSET_CONDITION_STYLES[t.conditionAtTransfer];
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{t.assetName}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.assetTag}
                        </p>
                      </td>
                      <td className="px-4 py-3">{t.fromEmployeeName}</td>
                      <td className="px-4 py-3">{t.toEmployeeName}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {t.transferDate}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center text-xs px-2 py-0.5 rounded-full border",
                            condStyle.bg,
                            condStyle.color
                          )}
                        >
                          {condStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center text-xs px-2 py-0.5 rounded-full border",
                            t.approvalStatus === "approved"
                              ? "bg-green-50 border-green-200 text-green-700"
                              : t.approvalStatus === "rejected"
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-amber-50 border-amber-200 text-amber-700"
                          )}
                        >
                          {t.approvalStatus.charAt(0).toUpperCase() +
                            t.approvalStatus.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
