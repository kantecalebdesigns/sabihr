import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
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
import { PRESET_DEPARTMENTS } from "@/lib/mock-data";
import { validateRedeploymentRequest } from "@/lib/employee-validators";
import { hasErrors } from "@/lib/validators";
import type { RedeploymentRequest } from "@/types/employee";
import type { ValidationErrors } from "@/lib/validators";

interface RedeploymentFormProps {
  open: boolean;
  onClose: () => void;
}

const INITIAL: RedeploymentRequest = {
  targetDepartment: "",
  reason: "",
  preferredDate: "",
  additionalNotes: "",
};

export function RedeploymentForm({ open, onClose }: RedeploymentFormProps) {
  const [data, setData] = useState<RedeploymentRequest>(INITIAL);
  const [errors, setErrors] = useState<ValidationErrors<RedeploymentRequest>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateRedeploymentRequest(data);
    setErrors(errs);
    if (hasErrors(errs)) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  function handleClose() {
    setData(INITIAL);
    setErrors({});
    setSubmitted(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-xl shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-base font-semibold">
            {submitted ? "Request Submitted" : "Request Redeployment"}
          </h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Redeployment request submitted</p>
                <p className="text-sm text-muted-foreground">
                  Your request to transfer to {data.targetDepartment} is pending HR review.
                </p>
              </div>
              <Button onClick={handleClose} className="mt-2">Done</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Target Department <span className="text-destructive">*</span></Label>
                <Select
                  value={data.targetDepartment}
                  onValueChange={(v) => {
                    setData((prev) => ({ ...prev, targetDepartment: v }));
                    if (errors.targetDepartment) setErrors((prev) => ({ ...prev, targetDepartment: undefined }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.targetDepartment && (
                  <p className="text-xs text-destructive">{errors.targetDepartment}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reason">Reason <span className="text-destructive">*</span></Label>
                <textarea
                  id="reason"
                  rows={3}
                  placeholder="Why would you like to be redeployed?"
                  value={data.reason}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, reason: e.target.value }));
                    if (errors.reason) setErrors((prev) => ({ ...prev, reason: undefined }));
                  }}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-0"
                />
                {errors.reason && (
                  <p className="text-xs text-destructive">{errors.reason}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="preferredDate">Preferred Date <span className="text-destructive">*</span></Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={data.preferredDate}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, preferredDate: e.target.value }));
                    if (errors.preferredDate) setErrors((prev) => ({ ...prev, preferredDate: undefined }));
                  }}
                />
                {errors.preferredDate && (
                  <p className="text-xs text-destructive">{errors.preferredDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Additional Notes</Label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="Any additional information..."
                  value={data.additionalNotes}
                  onChange={(e) => setData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-0"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
