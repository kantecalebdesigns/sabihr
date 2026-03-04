import { useState, useRef } from "react";
import { ScrollText, FileText, Upload, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CONTRACT_TYPE_OPTIONS } from "@/lib/admin-employee-mock-data";
import type { EmploymentInfo } from "@/types/employee";
import type { ContractFormData, ContractType } from "@/types/admin-employee";

interface Props {
  employment: EmploymentInfo;
  onSave: (updates: Partial<EmploymentInfo>) => void;
}

const TYPE_COLORS: Record<string, string> = {
  permanent: "bg-success/10 text-success border-success/20",
  "fixed-term": "bg-primary/10 text-primary border-primary/20",
  temporary: "bg-amber-100 text-amber-700 border-amber-200",
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export function ContractDetailsSection({ employment, onSave }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContractFormData>({
    contractType: employment.contractType as ContractType,
    contractEndDate: employment.contractEndDate || "",
    renewalDate: "",
    notes: "",
  });
  const [fileName, setFileName] = useState(employment.contractDocument || "");

  const showDateFields = formData.contractType === "fixed-term" || formData.contractType === "temporary";

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  function handleSave() {
    onSave({
      contractType: formData.contractType,
      contractEndDate: showDateFields ? formData.contractEndDate || null : null,
      contractDocument: fileName || null,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setFormData({
      contractType: employment.contractType as ContractType,
      contractEndDate: employment.contractEndDate || "",
      renewalDate: "",
      notes: "",
    });
    setFileName(employment.contractDocument || "");
    setIsEditing(false);
  }

  const typeLabel = CONTRACT_TYPE_OPTIONS.find((o) => o.value === employment.contractType)?.label || employment.contractType;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Employment Contract</CardTitle>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
            <div className="flex items-center gap-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <ScrollText className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground leading-none mb-0.5">Contract Type</p>
                <Badge variant="outline" className={TYPE_COLORS[employment.contractType] || ""}>
                  {typeLabel}
                </Badge>
              </div>
            </div>
            <InfoRow
              icon={<FileText className="w-3.5 h-3.5 text-muted-foreground" />}
              label="End Date"
              value={
                employment.contractEndDate
                  ? new Date(employment.contractEndDate).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A — Permanent"
              }
            />
            <InfoRow
              icon={<FileText className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Document"
              value={employment.contractDocument || "No document attached"}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Contract type radios */}
            <div className="space-y-1.5">
              <Label>Contract Type <span className="text-destructive">*</span></Label>
              <div className="space-y-2">
                {CONTRACT_TYPE_OPTIONS.map((option) => {
                  const isSelected = formData.contractType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          contractType: option.value,
                          contractEndDate: option.value === "permanent" ? "" : prev.contractEndDate,
                        }))
                      }
                      className={cn(
                        "relative w-full text-left rounded-lg border p-4 pl-10 transition-all hover:border-primary/50",
                        isSelected
                          ? "border-primary bg-background shadow-sm"
                          : "border-border bg-background"
                      )}
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                            isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional date fields */}
            {showDateFields && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Contract End Date <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    value={formData.contractEndDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contractEndDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Renewal Review Date</Label>
                  <Input
                    type="date"
                    value={formData.renewalDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, renewalDate: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Document upload */}
            <div className="space-y-1.5">
              <Label>Contract Document</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload Document
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {fileName && (
                  <span className="text-sm text-muted-foreground truncate">{fileName}</span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <textarea
                placeholder="Additional contract notes..."
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
