import { useState } from "react";
import {
  Upload,
  Camera,
  ChevronRight,
  Clock,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ASSET_CONDITION_STYLES } from "@/lib/asset-mock-data";
import type { AssetCondition, ConditionEntry } from "@/types/asset";

const CONDITIONS: AssetCondition[] = [
  "new",
  "good",
  "fair",
  "poor",
  "damaged",
  "non-functional",
];

interface ConditionUpdateFormProps {
  assetId: string;
  currentCondition: string;
  history: ConditionEntry[];
}

export default function ConditionUpdateForm({
  currentCondition,
  history,
}: ConditionUpdateFormProps) {
  const [selectedCondition, setSelectedCondition] = useState<string>(currentCondition);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const currentStyle = ASSET_CONDITION_STYLES[currentCondition];
  const selectedStyle = ASSET_CONDITION_STYLES[selectedCondition];
  const hasChanged = selectedCondition !== currentCondition;

  return (
    <div className="space-y-6">
      {/* Previous Condition Comparison */}
      {hasChanged && (
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">Current</p>
            <span
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                currentStyle?.bg,
                currentStyle?.color
              )}
            >
              {currentStyle?.label}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">New</p>
            <span
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                selectedStyle?.bg,
                selectedStyle?.color
              )}
            >
              {selectedStyle?.label}
            </span>
          </div>
        </div>
      )}

      {/* Condition Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Select Condition</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CONDITIONS.map((cond) => {
            const style = ASSET_CONDITION_STYLES[cond];
            const isSelected = selectedCondition === cond;
            return (
              <button
                key={cond}
                onClick={() => setSelectedCondition(cond)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all text-left",
                  isSelected
                    ? cn(style?.bg, style?.color, "border-current shadow-sm")
                    : "border-border hover:border-muted-foreground/30 text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "w-3 h-3 rounded-full border-2 shrink-0",
                    isSelected
                      ? "bg-current border-current"
                      : "border-muted-foreground/30"
                  )}
                />
                {style?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="condition-notes" className="text-sm font-semibold">
          Notes <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="condition-notes"
          rows={4}
          placeholder="Describe the current condition and any notable observations..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring"
        />
        {hasChanged && !notes && (
          <p className="text-xs text-red-500">
            Notes are required when changing condition
          </p>
        )}
      </div>

      {/* Photo Evidence */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Photo Evidence</Label>
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
          onClick={() =>
            setPhotos((prev) => [...prev, `evidence_${prev.length + 1}.jpg`])
          }
        >
          <div className="rounded-full p-2 bg-muted">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Upload photos as evidence
          </p>
        </div>
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {photos.map((_p, i) => (
              <div
                key={i}
                className="relative w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center"
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
                <button
                  onClick={() =>
                    setPhotos((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button disabled={!hasChanged || !notes} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Update Condition
      </Button>

      {/* Condition History Timeline */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Condition History</h3>
        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No previous condition changes recorded
          </p>
        ) : (
          <div className="space-y-0">
            {history.map((entry, i) => {
              const prevStyle = ASSET_CONDITION_STYLES[entry.previousCondition];
              const newStyle = ASSET_CONDITION_STYLES[entry.condition];
              return (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {i < history.length - 1 && (
                      <div className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-4 space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] border font-medium",
                          prevStyle?.bg,
                          prevStyle?.color
                        )}
                      >
                        {prevStyle?.label}
                      </span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] border font-medium",
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
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.assessedBy} &middot; {entry.assessedDate}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
