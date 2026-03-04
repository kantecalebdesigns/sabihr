import { useState } from "react";
import { CreditCard, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PAY_GRADES } from "@/lib/admin-employee-mock-data";
import type { EmploymentInfo } from "@/types/employee";
import type { PayGradeFormData } from "@/types/admin-employee";

interface Props {
  employment: EmploymentInfo;
  onSave: (updates: Partial<EmploymentInfo>) => void;
}

function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PayGradeSection({ employment, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PayGradeFormData>({
    payGrade: employment.payGrade,
    effectiveDate: "",
    notes: "",
  });

  const currentGrade = PAY_GRADES.find((g) => g.grade === employment.payGrade);

  function handleSave() {
    onSave({ payGrade: formData.payGrade });
    setIsEditing(false);
  }

  function handleCancel() {
    setFormData({ payGrade: employment.payGrade, effectiveDate: "", notes: "" });
    setIsEditing(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Pay Grade</CardTitle>
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
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {employment.payGrade}
                </Badge>
                {currentGrade && (
                  <span className="text-sm text-muted-foreground">{currentGrade.label}</span>
                )}
              </div>
              {currentGrade && (
                <p className="text-xs text-muted-foreground mt-1">
                  Salary range: {formatNaira(currentGrade.minSalary)} — {formatNaira(currentGrade.maxSalary)} /year
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Select Pay Grade <span className="text-destructive">*</span></Label>
              <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
                {PAY_GRADES.map((grade) => {
                  const isSelected = formData.payGrade === grade.grade;
                  return (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, payGrade: grade.grade }))}
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
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {grade.grade} — {grade.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatNaira(grade.minSalary)} — {formatNaira(grade.maxSalary)} /year
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, effectiveDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <textarea
                placeholder="Reason for grade assignment or change..."
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
