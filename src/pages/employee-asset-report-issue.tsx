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
  AlertTriangle,
  Camera,
  Send,
  CheckCircle2,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_ASSETS, MOCK_DAMAGE_REPORTS } from "@/lib/asset-mock-data";
import type { IssueType } from "@/types/asset";

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

const ISSUE_TYPES: { value: IssueType; label: string; icon: React.ElementType; description: string }[] = [
  { value: "damaged", label: "Damaged", icon: AlertTriangle, description: "Physical damage to the asset" },
  { value: "malfunctioning", label: "Malfunctioning", icon: AlertTriangle, description: "Not working correctly" },
  { value: "lost", label: "Lost", icon: AlertTriangle, description: "Cannot locate the asset" },
  { value: "stolen", label: "Stolen", icon: AlertTriangle, description: "Asset was stolen" },
];

const REPORT_STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  "under-investigation": { label: "Under Investigation", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  resolved: { label: "Resolved", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  closed: { label: "Closed", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
};

export default function EmployeeAssetReportIssuePage() {
  const myAssets = MOCK_ASSETS.filter((a) => a.assignedTo === CURRENT_EMPLOYEE_ID);
  const myReports = MOCK_DAMAGE_REPORTS.filter((r) => r.employeeId === CURRENT_EMPLOYEE_ID);

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [issueType, setIssueType] = useState<IssueType | null>(null);
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const resetForm = () => {
    setSelectedAssetId(null);
    setIssueType(null);
    setDescription("");
    setIncidentDate("");
    setSubmitted(false);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Report an Issue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Report damage, malfunction, loss, or theft of an assigned asset.
        </p>
      </div>

      {submitted ? (
        <Card className="rounded-xl border-border bg-card">
          <CardContent className="text-center py-10 space-y-4">
            <CheckCircle2 className="size-16 mx-auto text-green-600" />
            <h2 className="text-xl font-semibold">Report Submitted</h2>
            <p className="text-sm text-muted-foreground">
              Your issue report has been submitted. The IT/Admin team will
              review and follow up.
            </p>
            <Button variant="outline" onClick={resetForm}>
              Report Another Issue
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Select asset */}
          <div className="space-y-3">
            <Label className="text-sm">Select Asset</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {myAssets.map((asset) => {
                const IconComp = CATEGORY_ICONS[asset.categoryName] || Box;
                const selected = selectedAssetId === asset.id;
                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent",
                      selected && "border-primary bg-primary/5 ring-1 ring-primary"
                    )}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <IconComp className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.tag}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Issue type */}
          <div className="space-y-3">
            <Label className="text-sm">Issue Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ISSUE_TYPES.map((it) => {
                const selected = issueType === it.value;
                return (
                  <button
                    key={it.value}
                    onClick={() => setIssueType(it.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:bg-accent",
                      selected && "border-primary bg-primary/5 ring-1 ring-primary"
                    )}
                  >
                    <it.icon className={cn("size-5", selected ? "text-primary" : "text-muted-foreground")} />
                    <span className="font-medium">{it.label}</span>
                    <span className="text-xs text-muted-foreground text-center leading-tight">
                      {it.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="desc" className="text-sm">
              Description
            </Label>
            <textarea
              id="desc"
              rows={3}
              placeholder="Describe what happened..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex w-full rounded-xl border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring resize-none"
            />
          </div>

          {/* Date of incident */}
          <div className="space-y-2">
            <Label htmlFor="incident-date" className="text-sm">
              Date of Incident
            </Label>
            <Input
              id="incident-date"
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="rounded-xl"
            />
          </div>

          {/* Photo upload area */}
          <div className="space-y-2">
            <Label className="text-sm">Evidence Photos</Label>
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8">
              <div className="text-center space-y-2">
                <ImagePlus className="size-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click or drag photos here to upload
                </p>
                <Button variant="outline" size="sm">
                  <Camera className="size-4" />
                  Choose Files
                </Button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedAssetId ||
              !issueType ||
              description.trim().length === 0 ||
              !incidentDate
            }
          >
            <Send className="size-4" />
            Submit Report
          </Button>
        </div>
      )}

      {/* Report tracker */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">My Reports</h2>
        {myReports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No issue reports found.
          </p>
        ) : (
          <div className="space-y-3">
            {myReports.map((report) => {
              const style = REPORT_STATUS_STYLES[report.status];
              return (
                <Card
                  key={report.id}
                  className="rounded-xl border-border bg-card"
                >
                  <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {report.assetName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {report.issueType.charAt(0).toUpperCase() +
                          report.issueType.slice(1)}{" "}
                        — reported{" "}
                        {new Date(report.reportedDate).toLocaleDateString(
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
