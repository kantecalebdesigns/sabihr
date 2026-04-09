import { TrendingUp, TrendingDown } from "lucide-react";
import { DASHBOARD_KPI } from "@/lib/dashboard-data";

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {DASHBOARD_KPI.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex gap-[14px] items-start"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#f0f4f8] flex items-center justify-center shrink-0">
              <Icon className="w-[18px] h-[18px] text-slate-500" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">{kpi.value}</p>
                <div className="flex items-center gap-1">
                  {kpi.changeType === "up" && <TrendingUp className="w-3.5 h-3.5 text-[#009966]" />}
                  {kpi.changeType === "down" && <TrendingDown className="w-3.5 h-3.5 text-[#009966]" />}
                  <span className="text-xs font-medium text-[#009966]">
                    {kpi.changeType === "down" ? "-" : "+"}{kpi.change}%
                  </span>
                  <span className="text-[11px] text-slate-500">vs last month</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
