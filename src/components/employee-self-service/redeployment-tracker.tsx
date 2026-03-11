import { useState } from "react";
import { Clock, Search, CheckCircle2, XCircle, ChevronDown, ChevronUp, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_REDEPLOYMENT_REQUESTS } from "@/lib/employee-mock-data";
import type { RedeploymentStatus } from "@/types/employee";

const STATUS_CONFIG: Record<RedeploymentStatus, { icon: typeof Clock; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100", label: "Pending" },
  "under-review": { icon: Search, color: "text-primary", bg: "bg-primary/10", label: "Under Review" },
  approved: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100", label: "Approved" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-red-100", label: "Rejected" },
};

const BADGE_STYLES: Record<RedeploymentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  "under-review": "bg-primary/10 text-primary border-primary/20",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export function RedeploymentTracker() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const requests = MOCK_REDEPLOYMENT_REQUESTS;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">My Requests</CardTitle>
        <CardAction>
          <Badge variant="secondary" className="text-xs">
            {requests.length}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Inbox className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No redeployment requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const config = STATUS_CONFIG[req.status];
              const isExpanded = expandedId === req.id;

              return (
                <div
                  key={req.id}
                  className="rounded-lg border border-border p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{req.targetDepartment}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Submitted{" "}
                        {new Date(req.submittedDate).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] shrink-0", BADGE_STYLES[req.status])}>
                      {config.label}
                    </Badge>
                  </div>

                  {/* Reason */}
                  <p className="text-xs text-muted-foreground line-clamp-2">{req.reason}</p>

                  {/* Toggle timeline */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    {isExpanded ? (
                      <>Hide timeline <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>View timeline <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>

                  {/* Status timeline */}
                  {isExpanded && (
                    <div className="relative pl-5 space-y-4 pt-1">
                      {/* Vertical line */}
                      <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />

                      {req.statusHistory.map((entry, i) => {
                        const entryConfig = STATUS_CONFIG[entry.status];
                        const EntryIcon = entryConfig.icon;
                        return (
                          <div key={i} className="relative flex gap-3">
                            <div
                              className={cn(
                                "absolute -left-5 w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-card",
                                entryConfig.bg
                              )}
                            >
                              <EntryIcon className={cn("w-2 h-2", entryConfig.color)} />
                            </div>
                            <div>
                              <p className="text-xs font-medium">{entryConfig.label}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {new Date(entry.date).toLocaleDateString("en-NG", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              {entry.note && (
                                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{entry.note}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
