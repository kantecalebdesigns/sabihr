import { useState } from "react";
import { AlertTriangle, Info, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_ALERTS } from "@/lib/dashboard-data";
import type { AlertSeverity } from "@/types/dashboard";

const SEVERITY_CONFIG: Record<AlertSeverity, { icon: typeof Info; color: string; bg: string; border: string }> = {
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  urgent: {
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
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
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Alerts & Actions</h3>
          <p className="text-xs text-muted-foreground">Items requiring your attention</p>
        </div>
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          No pending alerts
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Alerts & Actions</h3>
          <p className="text-xs text-muted-foreground">Items requiring your attention</p>
        </div>
        <span className="text-xs font-medium bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
          {visibleAlerts.length}
        </span>
      </div>

      <div className="space-y-2">
        {visibleAlerts.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                config.border,
                config.bg
              )}
            >
              <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", config.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
              </div>
              <button
                onClick={() => dismiss(alert.id)}
                className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
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
