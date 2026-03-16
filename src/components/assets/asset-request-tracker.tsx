import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AssetRequest, RequestStatus } from "@/types/asset";

interface AssetRequestTrackerProps {
  requests: AssetRequest[];
}

const REQUEST_STATUS_STYLES: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  "manager-approved": { label: "Manager Approved", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  "it-processing": { label: "IT Processing", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  "ready-for-pickup": { label: "Ready", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const APPROVAL_STEPS: { key: RequestStatus; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "manager-approved", label: "Manager Approved" },
  { key: "it-processing", label: "IT Processing" },
  { key: "ready-for-pickup", label: "Ready for Pickup" },
];

function getStepIndex(status: RequestStatus): number {
  if (status === "rejected") return -1;
  return APPROVAL_STEPS.findIndex((s) => s.key === status);
}

export function AssetRequestTracker({ requests }: AssetRequestTrackerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Package className="size-10 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No requests to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const style = REQUEST_STATUS_STYLES[req.status];
        const isExpanded = expandedId === req.id;
        const stepIndex = getStepIndex(req.status);

        return (
          <Card key={req.id} className="rounded-xl border-border bg-card">
            <CardContent className="space-y-0 p-0">
              {/* Summary row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : req.id)}
                className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">
                      {req.categoryName}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {req.requestNumber}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(req.requestDate).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {req.urgency === "urgent" && (
                    <Badge
                      variant="outline"
                      className="text-xs text-orange-700 bg-orange-50 border-orange-200"
                    >
                      Urgent
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={cn("text-xs", style.color, style.bg)}
                  >
                    {style.label}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border px-6 py-5 space-y-5">
                  {/* Progress stepper */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-3">
                      Approval Progress
                    </p>
                    {req.status === "rejected" ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="size-5" />
                        <span className="text-sm font-medium">
                          Request Rejected
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {APPROVAL_STEPS.map((step, i) => {
                          const isComplete = i <= stepIndex;
                          const isCurrent = i === stepIndex;
                          return (
                            <div key={step.key} className="flex items-center flex-1 last:flex-none">
                              <div className="flex flex-col items-center gap-1">
                                <div
                                  className={cn(
                                    "flex size-7 items-center justify-center rounded-full border-2 transition-colors",
                                    isComplete
                                      ? "border-green-500 bg-green-500 text-white"
                                      : "border-border bg-card text-muted-foreground"
                                  )}
                                >
                                  {isComplete ? (
                                    <CheckCircle2 className="size-4" />
                                  ) : (
                                    <span className="text-xs">{i + 1}</span>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "text-[10px] text-center leading-tight max-w-[72px]",
                                    isCurrent
                                      ? "font-medium text-foreground"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {step.label}
                                </span>
                              </div>
                              {i < APPROVAL_STEPS.length - 1 && (
                                <div
                                  className={cn(
                                    "h-0.5 flex-1 mx-1 mt-[-18px]",
                                    i < stepIndex ? "bg-green-500" : "bg-border"
                                  )}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Comments */}
                  {req.comments.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <MessageSquare className="size-3" />
                        Comments
                      </p>
                      <div className="space-y-2">
                        {req.comments.map((c, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-muted/50 px-3 py-2 text-sm"
                          >
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                              <span className="font-medium text-foreground">
                                {c.by}
                              </span>
                              <span>
                                {new Date(c.date).toLocaleDateString("en-NG", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>
                            <p>{c.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expected delivery */}
                  {req.expectedDelivery && (
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Expected delivery:
                      </span>
                      <span className="font-medium">
                        {new Date(req.expectedDelivery).toLocaleDateString(
                          "en-NG",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
