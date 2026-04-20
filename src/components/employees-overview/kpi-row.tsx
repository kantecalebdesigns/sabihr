import { Users, Briefcase, Calendar, Trophy, TrendingUp, TrendingDown, Bell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { OVERVIEW_KPIS } from "@/lib/employees-overview-data";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  users: Users,
  briefcase: Briefcase,
  calendar: Calendar,
  trophy: Trophy,
} as const;

export function KpiRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {OVERVIEW_KPIS.map((kpi) => {
        const Icon = ICON_MAP[kpi.iconName];
        const up = kpi.trendDirection === "up";
        return (
          <div
            key={kpi.key}
            className="rounded-2xl border border-slate-200/70 bg-white px-5 pt-5 pb-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-8"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Icon className="w-[18px] h-[18px] text-slate-700" />
              </div>
              <div
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-semibold",
                  up ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>
                  {up ? "+" : "-"}
                  {kpi.trend}
                  {kpi.key === "retention" ? "%" : ""}
                </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{kpi.value}</p>
              <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
            </div>
          </div>
        );
      })}

      <div className="rounded-2xl bg-gradient-to-br from-[#2763eb] via-[#1e4fd4] to-[#1d3fb1] text-white px-5 pt-5 pb-5 relative overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-4">
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.1em] text-white/75 uppercase">Needs your approval</p>
            <p className="text-3xl font-bold tracking-tight leading-none mt-2">3 requests</p>
          </div>
          <Bell className="w-5 h-5 text-white/80" />
        </div>
        <p className="relative text-xs text-white/80 leading-relaxed">
          Time off (2), expense report (1) — est. 4 min to review.
        </p>
        <div className="relative">
          <Link
            to="/approvals"
            className="inline-flex items-center gap-1 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 px-3 py-1.5 text-xs font-semibold backdrop-blur transition-colors"
          >
            Review now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
