import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Camera,
  Upload,
  ShieldCheck,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";
import { ASSET_CONDITION_STYLES } from "@/lib/asset-mock-data";
import type { AssetCondition } from "@/types/asset";

interface ReturnInspectionFormProps {
  assetName: string;
  assetTag: string;
  assignmentCondition: AssetCondition;
  onSubmit: (data: any) => void;
}

const CONDITION_LEVELS: AssetCondition[] = [
  "new",
  "good",
  "fair",
  "poor",
  "damaged",
  "non-functional",
];

const DEFAULT_CHECKLIST = [
  { id: "screen", label: "Screen OK" },
  { id: "keyboard", label: "Keyboard OK" },
  { id: "charger", label: "Charger Included" },
  { id: "power-cable", label: "Power Cable" },
  { id: "body-intact", label: "Body/Casing Intact" },
  { id: "ports-working", label: "Ports Working" },
  { id: "battery-health", label: "Battery Health Acceptable" },
  { id: "data-wiped", label: "Data Wiped / Ready for Reset" },
];

export default function ReturnInspectionForm({
  assetName,
  assetTag,
  assignmentCondition,
  onSubmit,
}: ReturnInspectionFormProps) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    Object.fromEntries(DEFAULT_CHECKLIST.map((item) => [item.id, false]))
  );
  const [selectedCondition, setSelectedCondition] = useState<AssetCondition | null>(null);
  const [damagePhotos, setDamagePhotos] = useState<string[]>([]);
  const [damageNotes, setDamageNotes] = useState("");
  const [liabilityFlag, setLiabilityFlag] = useState(false);
  const [costEstimate, setCostEstimate] = useState("");

  function toggleCheckItem(id: string) {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handlePhotoUpload() {
    // Simulated upload
    setDamagePhotos((prev) => [...prev, `photo_${prev.length + 1}.jpg`]);
  }

  function handleSubmit() {
    onSubmit({
      checklist,
      conditionAfter: selectedCondition,
      damagePhotos,
      damageNotes,
      liabilityFlag,
      costEstimate: liabilityFlag ? parseFloat(costEstimate) || 0 : 0,
    });
  }

  const assignStyle = ASSET_CONDITION_STYLES[assignmentCondition];
  const currentStyle = selectedCondition ? ASSET_CONDITION_STYLES[selectedCondition] : null;

  return (
    <div className="space-y-6">
      {/* Asset Header */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardCheck className="size-5" />
            Return Inspection
          </CardTitle>
          <CardDescription className="text-sm">
            Assess the condition of <span className="font-medium text-foreground">{assetName}</span>{" "}
            <span className="text-xs">({assetTag})</span>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Condition Comparison */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Condition Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">At Assignment</p>
              <Badge
                variant="outline"
                className={cn("text-sm border", assignStyle.bg, assignStyle.color)}
              >
                {assignStyle.label}
              </Badge>
            </div>
            <div className="rounded-xl border border-border p-4 space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Current Assessment</p>
              {currentStyle ? (
                <Badge
                  variant="outline"
                  className={cn("text-sm border", currentStyle.bg, currentStyle.color)}
                >
                  {currentStyle.label}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground italic">Select below</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Inspection Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEFAULT_CHECKLIST.map((item) => (
              <label
                key={item.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-border p-3 cursor-pointer transition-colors",
                  checklist[item.id] && "bg-green-50 border-green-200"
                )}
              >
                <Checkbox
                  checked={checklist[item.id]}
                  onCheckedChange={() => toggleCheckItem(item.id)}
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Damage Photos */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Damage Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {damagePhotos.map((_photo, i) => (
              <div
                key={i}
                className="w-24 h-24 rounded-xl border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground"
              >
                <Camera className="size-5" />
              </div>
            ))}
            <button
              onClick={handlePhotoUpload}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              <Upload className="size-5" />
              Upload
            </button>
          </div>
          <div className="mt-4">
            <Label className="text-sm mb-1.5 block">Damage Notes</Label>
            <Input
              placeholder="Describe any visible damage..."
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
              className="text-sm rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Condition Rating */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Overall Condition Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CONDITION_LEVELS.map((level) => {
              const style = ASSET_CONDITION_STYLES[level];
              const isSelected = selectedCondition === level;
              return (
                <button
                  key={level}
                  onClick={() => setSelectedCondition(level)}
                  className={cn(
                    "px-4 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer",
                    isSelected
                      ? cn(style.bg, style.color, "border-current ring-2 ring-current/20")
                      : "border-border text-muted-foreground hover:border-foreground/30"
                  )}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Damage Liability */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-500" />
            Damage Liability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={liabilityFlag}
                onCheckedChange={(v) => setLiabilityFlag(v === true)}
              />
              <span className="text-sm">Flag employee for damage liability</span>
            </label>
            {liabilityFlag && (
              <div>
                <Label className="text-sm mb-1.5 block">Estimated Repair/Replacement Cost</Label>
                <Input
                  type="number"
                  placeholder="Enter amount..."
                  value={costEstimate}
                  onChange={(e) => setCostEstimate(e.target.value)}
                  className="text-sm rounded-xl max-w-xs"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          className="rounded-xl gap-2 text-sm"
          onClick={handleSubmit}
          disabled={!selectedCondition}
        >
          <ShieldCheck className="size-4" />
          Submit Inspection &amp; Sign Off
        </Button>
      </div>
    </div>
  );
}
