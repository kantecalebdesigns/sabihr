import { UserPlus, CalendarCheck, CalendarClock, DollarSign, FileCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RECENT_ACTIVITIES } from "@/lib/dashboard-data";
import type { ActivityType } from "@/types/dashboard";

const ACTIVITY_CONFIG: Record<ActivityType, { icon: typeof UserPlus; color: string; bg: string }> = {
  new_hire: { icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
  leave_approved: { icon: CalendarCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  leave_requested: { icon: CalendarClock, color: "text-amber-600", bg: "bg-amber-50" },
  payroll_processed: { icon: DollarSign, color: "text-violet-600", bg: "bg-violet-50" },
  document_generated: { icon: FileCheck, color: "text-cyan-600", bg: "bg-cyan-50" },
  probation_ending: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
  employee_exit: { icon: UserPlus, color: "text-red-600", bg: "bg-red-50" },
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Recent Activity</h3>
          <p className="text-xs text-muted-foreground">Latest updates across your organization</p>
        </div>
      </div>

      <div className="space-y-1">
        {RECENT_ACTIVITIES.map((activity) => {
          const config = ACTIVITY_CONFIG[activity.type];
          const Icon = config.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", config.bg)}>
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.employee}</span>{" "}
                  <span className="text-muted-foreground">{activity.description}</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
