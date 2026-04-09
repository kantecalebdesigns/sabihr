import { UserPlus, CalendarCheck, CalendarClock, DollarSign, FileCheck, AlertTriangle } from "lucide-react";
import { RECENT_ACTIVITIES } from "@/lib/dashboard-data";
import type { ActivityType } from "@/types/dashboard";

const ACTIVITY_CONFIG: Record<ActivityType, { icon: typeof UserPlus }> = {
  new_hire: { icon: UserPlus },
  leave_approved: { icon: CalendarCheck },
  leave_requested: { icon: CalendarClock },
  payroll_processed: { icon: DollarSign },
  document_generated: { icon: FileCheck },
  probation_ending: { icon: AlertTriangle },
  employee_exit: { icon: UserPlus },
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white pt-[21px] px-[21px] pb-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
        <p className="text-xs text-slate-500">Latest updates across your organization</p>
      </div>

      <div className="space-y-1">
        {RECENT_ACTIVITIES.map((activity) => {
          const config = ACTIVITY_CONFIG[activity.type];
          const Icon = config.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-[#f8fafc] transition-colors"
            >
              <div className="w-8 h-8 rounded-[8px] bg-[#f0f4f8] flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium text-slate-900">{activity.employee}</span>{" "}
                  <span className="text-slate-500">{activity.description}</span>
                </p>
                <p className="text-[11px] text-[#90a1b9] mt-0.5">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
