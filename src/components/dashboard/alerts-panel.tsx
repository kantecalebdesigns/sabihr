import { useState } from "react";
import { AlertTriangle, Info, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_ALERTS } from "@/lib/dashboard-data";
import type { AlertSeverity } from "@/types/dashboard";

const SEVERITY_CONFIG: Record<AlertSeverity, { icon: typeof Info; color: string; border: string }> = {
  info: {
    icon: Info,
    color: "text-blue-500",
    border: "border-[#bedbff]",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-[#ad6c21]",
    border: "border-[#ad6c21]",
  },
  urgent: {
    icon: AlertCircle,
    color: "text-[#b42121]",
    border: "border-[#b42121]",
  },
};

export function AlertsPanel() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleAlerts = DASHBOARD_ALERTS.filter((a) => !dismissed.has(a.id));

  function dismiss(id: string) {
    setDismissed((prev) => new Set(prev).add(id));
  }

  if (visibleAlerts.length === 0) {
    return (
      <div className="rounded-xl border border-[#efefef] bg-white pt-[21px] px-[21px] pb-4 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Alerts & Actions</h3>
          <p className="text-xs text-slate-500">Items requiring your attention</p>
        </div>
        <div className="flex items-center justify-center py-8 text-sm text-slate-400">
          No pending alerts
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#efefef] bg-white pt-[21px] px-[21px] pb-4 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Alerts & Actions</h3>
        <p className="text-xs text-slate-500">Items requiring your attention</p>
      </div>

      <div className="flex flex-col gap-2">
        {visibleAlerts.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3",
                config.border
              )}
            >
              <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", config.color)} />
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                <p className="text-xs text-slate-500 leading-4">{alert.description}</p>
              </div>
              <button
                onClick={() => dismiss(alert.id)}
                className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
