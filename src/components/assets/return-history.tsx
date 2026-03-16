import { FileDown, Package, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReturnRequest, ReturnStatus } from "@/types/asset";

interface ReturnHistoryProps {
  returns: ReturnRequest[];
}

const RETURN_STATUS_STYLES: Record<ReturnStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  "collection-scheduled": { label: "Collection Scheduled", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  returned: { label: "Returned", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-50 border-green-200" },
};

export function ReturnHistory({ returns }: ReturnHistoryProps) {
  const completedReturns = returns.filter(
    (r) => r.status === "completed" || r.status === "returned"
  );
  const pendingReturns = returns.filter(
    (r) => r.status === "submitted" || r.status === "collection-scheduled"
  );

  if (returns.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Package className="size-10 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No return history to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending returns */}
      {pendingReturns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            Pending Returns
          </h3>
          {pendingReturns.map((ret) => {
            const style = RETURN_STATUS_STYLES[ret.status];
            return (
              <Card
                key={ret.id}
                className="rounded-xl border-border bg-card"
              >
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{ret.assetName}</p>
                    <p className="text-xs text-muted-foreground">
                      {ret.assetTag} — Proposed:{" "}
                      {new Date(ret.proposedDate).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", style.color, style.bg)}
                  >
                    {style.label}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Completed returns */}
      {completedReturns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="size-4 text-muted-foreground" />
            Previously Returned Assets
          </h3>
          {completedReturns.map((ret) => {
            const style = RETURN_STATUS_STYLES[ret.status];
            return (
              <Card
                key={ret.id}
                className="rounded-xl border-border bg-card"
              >
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{ret.assetName}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{ret.assetTag}</span>
                      <span>
                        Returned:{" "}
                        {new Date(ret.proposedDate).toLocaleDateString(
                          "en-NG",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                      <span className="capitalize">
                        Condition: {ret.selfAssessedCondition}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", style.color, style.bg)}
                    >
                      {style.label}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <FileDown className="size-3.5" />
                      Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
