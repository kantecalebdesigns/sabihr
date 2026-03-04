import { useState } from "react";
import { Shield, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROBATION_STATUS_OPTIONS } from "@/lib/admin-employee-mock-data";
import type { EmploymentInfo } from "@/types/employee";
import type { ProbationFormData, ProbationStatus } from "@/types/admin-employee";

interface Props {
  employment: EmploymentInfo;
  onSave: (updates: Partial<EmploymentInfo>) => void;
}

function getProgress(startDate: string, endDate: string | null) {
  if (!endDate) return { elapsed: 0, total: 0, percent: 0 };
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const percent = totalDays > 0 ? Math.min(Math.round((elapsedDays / totalDays) * 100), 100) : 0;
  return { elapsed: Math.max(elapsedDays, 0), total: totalDays, percent };
}

function deriveStatus(employment: EmploymentInfo): ProbationStatus {
  if (!employment.isProbation) return "completed";
  return "in-probation";
}

export function ProbationTrackingSection({ employment, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProbationFormData>({
    isProbation: employment.isProbation,
    probationEndDate: employment.probationEndDate || "",
    probationStatus: deriveStatus(employment),
    notes: "",
  });

  const progress = getProgress(employment.startDate, employment.probationEndDate);
  const currentStatus = deriveStatus(employment);
  const statusOption = PROBATION_STATUS_OPTIONS.find((o) => o.value === currentStatus);

  function handleSave() {
    onSave({
      isProbation: formData.probationStatus === "in-probation" || formData.probationStatus === "extended",
      probationEndDate: formData.probationEndDate || null,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setFormData({
      isProbation: employment.isProbation,
      probationEndDate: employment.probationEndDate || "",
      probationStatus: deriveStatus(employment),
      notes: "",
    });
    setIsEditing(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Probation Period</CardTitle>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {statusOption && (
                    <Badge variant="outline" className={statusOption.color}>
                      {statusOption.label}
                    </Badge>
                  )}
                  {employment.probationEndDate && (
                    <span className="text-sm text-muted-foreground">
                      End date: {new Date(employment.probationEndDate).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {employment.probationEndDate && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{progress.elapsed} days elapsed</span>
                  <span>{progress.total} days total</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      progress.percent >= 100
                        ? "bg-success"
                        : progress.percent >= 75
                          ? "bg-amber-500"
                          : "bg-primary"
                    )}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">{progress.percent}% complete</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status toggle */}
            <div className="space-y-1.5">
              <Label>Probation Status <span className="text-destructive">*</span></Label>
              <Select
                value={formData.probationStatus}
                onValueChange={(v) => {
                  const status = v as ProbationStatus;
                  setFormData((prev) => ({
                    ...prev,
                    probationStatus: status,
                    isProbation: status === "in-probation" || status === "extended",
                  }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {PROBATION_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(formData.probationStatus === "in-probation" || formData.probationStatus === "extended") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Probation End Date <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    value={formData.probationEndDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, probationEndDate: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Notes</Label>
              <textarea
                placeholder="Notes about probation status change..."
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-0 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Button size="sm" onClick={handleSave}>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-3.5 h-3.5 mr-1.5" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
