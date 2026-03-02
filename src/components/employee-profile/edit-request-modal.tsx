import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EditRequestModalProps {
  open: boolean;
  onClose: () => void;
  section: string;
}

export function EditRequestModal({ open, onClose, section }: EditRequestModalProps) {
  const [changes, setChanges] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!changes.trim() || !reason.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  function handleClose() {
    setChanges("");
    setReason("");
    setSubmitted(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-xl shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-base font-semibold">
            {submitted ? "Request Submitted" : `Request Edit — ${section}`}
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
                <p className="font-medium">Update request submitted</p>
                <p className="text-sm text-muted-foreground">
                  Your HR admin will review and approve the changes.
                </p>
              </div>
              <Button onClick={handleClose} className="mt-2">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="changes">What would you like to change?</Label>
                <textarea
                  id="changes"
                  rows={3}
                  placeholder="Describe the changes you'd like to make..."
                  value={changes}
                  onChange={(e) => setChanges(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reason">Reason for change</Label>
                <textarea
                  id="reason"
                  rows={2}
                  placeholder="e.g. Address changed, name correction..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !changes.trim() || !reason.trim()}>
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
