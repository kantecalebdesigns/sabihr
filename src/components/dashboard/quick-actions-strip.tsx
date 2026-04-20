import { Link } from "react-router-dom";
import { QUICK_ACTIONS } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export function QuickActionsStrip() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Quick actions</h3>
        <p className="text-xs text-slate-500">Jump into your most-used HR workflows</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.key}
              to={action.path}
              className="group relative rounded-xl border border-slate-200/70 bg-white px-4 py-4 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col items-center text-center gap-2.5">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                    action.iconBg
                  )}
                >
                  <Icon className={cn("w-5 h-5", action.iconColor)} />
                </div>
                <div className="space-y-0.5 w-full min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 truncate">
                    {action.label}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {action.count !== undefined ? (
                      <>
                        <span className="font-semibold text-slate-900">{action.count}</span>{" "}
                        {action.countLabel}
                      </>
                    ) : (
                      action.countLabel
                    )}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
