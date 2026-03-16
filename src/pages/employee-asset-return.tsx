import { useState } from "react";
import {
  Laptop,
  Monitor,
  Smartphone,
  Armchair,
  Car,
  Wifi,
  Printer,
  Box,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_RETURN_REQUESTS,
} from "@/lib/asset-mock-data";
import type { ReturnReason, AssetCondition, ReturnStatus } from "@/types/asset";

const CURRENT_EMPLOYEE_ID = "emp-001";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Laptops: Laptop,
  Monitors: Monitor,
  Phones: Smartphone,
  Furniture: Armchair,
  Vehicles: Car,
  Networking: Wifi,
  Printers: Printer,
  Other: Box,
};

const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
  { value: "no-longer-needed", label: "No Longer Needed" },
  { value: "upgrade", label: "Upgrade" },
  { value: "leaving", label: "Leaving Company" },
  { value: "damaged", label: "Damaged" },
];

const CONDITION_OPTIONS: { value: AssetCondition; label: string }[] = [
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "damaged", label: "Damaged" },
];

const RETURN_STATUS_STYLES: Record<ReturnStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  "collection-scheduled": { label: "Collection Scheduled", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  returned: { label: "Returned", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-50 border-green-200" },
};

export default function EmployeeAssetReturnPage() {
  const myAssets = MOCK_ASSETS.filter((a) => a.assignedTo === CURRENT_EMPLOYEE_ID);
  const myReturns = MOCK_RETURN_REQUESTS.filter(
    (r) => r.employeeId === CURRENT_EMPLOYEE_ID
  );

  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState<ReturnReason | null>(null);
  const [condition, setCondition] = useState<AssetCondition | null>(null);
  const [proposedDate, setProposedDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleAsset = (id: string) => {
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const resetForm = () => {
    setSelectedAssetIds(new Set());
    setReason(null);
    setCondition(null);
    setProposedDate("");
    setSubmitted(false);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Return Assets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Initiate a return for one or more of your assigned assets.
        </p>
      </div>

      {submitted ? (
        <Card className="rounded-xl border-border bg-card">
          <CardContent className="text-center py-10 space-y-4">
            <CheckCircle2 className="size-16 mx-auto text-green-600" />
            <h2 className="text-xl font-semibold">Return Request Submitted</h2>
            <p className="text-sm text-muted-foreground">
              Your return request for {selectedAssetIds.size} asset
              {selectedAssetIds.size !== 1 ? "s" : ""} has been submitted. You
              will be notified when a collection is scheduled.
            </p>
            <Button variant="outline" onClick={resetForm}>
              Submit Another Return
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Select assets */}
          <div className="space-y-3">
            <Label className="text-sm">Select Assets to Return</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {myAssets.map((asset) => {
                const IconComp = CATEGORY_ICONS[asset.categoryName] || Box;
                const selected = selectedAssetIds.has(asset.id);
                return (
                  <button
                    key={asset.id}
                    onClick={() => toggleAsset(asset.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent",
                      selected && "border-primary bg-primary/5 ring-1 ring-primary"
                    )}
                  >
                    <Checkbox
                      checked={selected}
                      className="pointer-events-none"
                    />
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <IconComp className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {asset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {asset.tag}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Return reason */}
          <div className="space-y-2">
            <Label className="text-sm">Reason for Return</Label>
            <div className="flex flex-wrap gap-2">
              {RETURN_REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setReason(r.value)}
                  className={cn(
                    "rounded-xl border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-accent",
                    reason === r.value &&
                      "border-primary bg-primary/5 ring-1 ring-primary font-medium"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Self-assessment of condition */}
          <div className="space-y-2">
            <Label className="text-sm">Condition of Asset(s)</Label>
            <div className="flex gap-2">
              {CONDITION_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCondition(c.value)}
                  className={cn(
                    "rounded-xl border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-accent",
                    condition === c.value &&
                      "border-primary bg-primary/5 ring-1 ring-primary font-medium"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Proposed return date */}
          <div className="space-y-2">
            <Label htmlFor="return-date" className="text-sm">
              Proposed Return Date
            </Label>
            <Input
              id="return-date"
              type="date"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              className="rounded-xl"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={
              selectedAssetIds.size === 0 ||
              !reason ||
              !condition ||
              !proposedDate
            }
          >
            <Send className="size-4" />
            Submit Return Request
          </Button>
        </div>
      )}

      {/* My Returns */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">My Returns</h2>
        {myReturns.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No return requests found.
          </p>
        ) : (
          <div className="space-y-3">
            {myReturns.map((ret) => {
              const style = RETURN_STATUS_STYLES[ret.status];
              return (
                <Card
                  key={ret.id}
                  className="rounded-xl border-border bg-card"
                >
                  <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{ret.assetName}</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted{" "}
                        {new Date(ret.submittedDate).toLocaleDateString(
                          "en-NG",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </p>
                    </div>
                    {style && (
                      <Badge
                        variant="outline"
                        className={cn("text-xs", style.color, style.bg)}
                      >
                        {style.label}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
