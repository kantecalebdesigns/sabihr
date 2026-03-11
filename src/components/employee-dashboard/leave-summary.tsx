import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RECENT_LEAVE_REQUESTS } from "@/lib/employee-mock-data";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export function LeaveSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Leave Request</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Request
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3.5">
        {/* Recent requests */}
        <div className="space-y-2">
          {RECENT_LEAVE_REQUESTS.slice(0, 3).map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{req.type}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(req.startDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                  {" — "}
                  {new Date(req.endDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                  {" · "}{req.days} day{req.days > 1 ? "s" : ""}
                </p>
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0",
                  STATUS_STYLES[req.status]
                )}
              >
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </div>
          ))}
        </div>

        <Link
          to="/employee/leave"
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          View all leave
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
