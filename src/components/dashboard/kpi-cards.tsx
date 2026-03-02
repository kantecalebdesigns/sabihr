import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_KPI } from "@/lib/dashboard-data";

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {DASHBOARD_KPI.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="rounded-xl border border-border bg-card p-5 flex items-start gap-4"
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", kpi.bgColor)}>
              <Icon className={cn("w-5 h-5", kpi.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
              <p className="text-2xl font-bold mt-0.5 tracking-tight">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {kpi.changeType === "up" && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                {kpi.changeType === "down" && <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />}
                {kpi.changeType === "neutral" && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
                <span className={cn(
                  "text-xs font-medium",
                  kpi.label === "Turnover Rate"
                    ? (kpi.changeType === "down" ? "text-emerald-600" : "text-destructive")
                    : (kpi.changeType === "up" ? "text-emerald-600" : "text-destructive")
                )}>
                  {kpi.changeType === "down" ? "-" : "+"}{kpi.change}%
                </span>
                <span className="text-[11px] text-muted-foreground">vs last month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
