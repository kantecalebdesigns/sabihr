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
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  AlertTriangle,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

interface ClearanceAsset {
  name: string;
  tag: string;
  status: "returned" | "pending" | "overdue";
  conditionAssessed: boolean;
}

interface ExitClearanceChecklistProps {
  employeeName: string;
  assets: ClearanceAsset[];
}

const STATUS_CONFIG: Record<
  ClearanceAsset["status"],
  { icon: typeof CheckCircle2; label: string; color: string; bg: string }
> = {
  returned: {
    icon: CheckCircle2,
    label: "Returned",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
  overdue: {
    icon: AlertCircle,
    label: "Overdue",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
};

export default function ExitClearanceChecklist({
  employeeName,
  assets,
}: ExitClearanceChecklistProps) {
  const totalAssets = assets.length;
  const returnedCount = assets.filter((a) => a.status === "returned").length;
  const pendingCount = assets.filter((a) => a.status === "pending").length;
  const overdueCount = assets.filter((a) => a.status === "overdue").length;
  const assessedCount = assets.filter((a) => a.conditionAssessed).length;
  const progressPercent = totalAssets > 0 ? Math.round((returnedCount / totalAssets) * 100) : 0;
  const isCleared = returnedCount === totalAssets && assessedCount === totalAssets;
  const hasOutstanding = pendingCount > 0 || overdueCount > 0;

  function handlePrintHandover() {
    window.print();
  }

  function handleEscalate(assetTag: string) {
    alert(`Escalation triggered for overdue asset ${assetTag}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="size-5" />
            Exit Clearance
          </CardTitle>
          <CardDescription className="text-sm">
            Clearance checklist for <span className="font-semibold text-foreground">{employeeName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Overall Progress: {returnedCount}/{totalAssets} assets returned
              </span>
              <span className="font-semibold">{progressPercent}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isCleared ? "bg-green-500" : progressPercent > 50 ? "bg-amber-500" : "bg-red-500"
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-green-500" /> {returnedCount} Returned
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-amber-500" /> {pendingCount} Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-red-500" /> {overdueCount} Overdue
              </span>
            </div>
          </div>

          {/* Clearance block */}
          {hasOutstanding && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <ShieldAlert className="size-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">Clearance Blocked</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {overdueCount > 0
                    ? `${overdueCount} overdue asset${overdueCount !== 1 ? "s" : ""} must be returned before clearance can be granted.`
                    : `${pendingCount} asset${pendingCount !== 1 ? "s" : ""} still pending return.`}
                </p>
              </div>
            </div>
          )}
          {isCleared && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 flex items-start gap-3">
              <CheckCircle2 className="size-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-700">Clearance Granted</p>
                <p className="text-xs text-green-600 mt-0.5">
                  All assets have been returned and condition assessments are complete.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset List */}
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Assigned Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assets.map((asset) => {
              const config = STATUS_CONFIG[asset.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={asset.tag}
                  className={cn(
                    "rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3",
                    asset.status === "overdue" && "border-red-200 bg-red-50/50"
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{asset.name}</span>
                      <span className="text-xs text-muted-foreground">({asset.tag})</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        variant="outline"
                        className={cn("text-xs border gap-1", config.bg, config.color)}
                      >
                        <StatusIcon className="size-3" />
                        {config.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Condition Assessment:{" "}
                        {asset.conditionAssessed ? (
                          <span className="text-green-600 font-medium">Complete</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Pending</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {asset.status === "overdue" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-xl text-sm gap-1.5 shrink-0"
                      onClick={() => handleEscalate(asset.tag)}
                    >
                      <AlertTriangle className="size-3.5" />
                      Escalate
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Print */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="rounded-xl text-sm gap-2"
          onClick={handlePrintHandover}
        >
          <Printer className="size-4" />
          Print Handover Form
        </Button>
      </div>
    </div>
  );
}
