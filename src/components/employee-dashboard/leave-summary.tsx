import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RECENT_LEAVE_REQUESTS } from "@/lib/employee-mock-data";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export function LeaveSummary() {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Leave Requests</h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-slate-500 hover:text-slate-900">
          <Plus className="w-3.5 h-3.5" />
          Request
        </Button>
      </div>

      <div className="space-y-2">
        {RECENT_LEAVE_REQUESTS.slice(0, 3).map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between py-2.5 border-b border-[#efefef] last:border-0"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate">{req.type}</p>
              <p className="text-[11px] text-slate-500">
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
        className="flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 mt-4"
      >
        View all leave
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
