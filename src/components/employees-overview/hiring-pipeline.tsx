import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HIRING_PIPELINE } from "@/lib/employees-overview-data";
import { cn } from "@/lib/utils";

export function HiringPipeline() {
  const totalCandidates = HIRING_PIPELINE.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Hiring pipeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {HIRING_PIPELINE.filter((s) => s.id !== "offer").length + 10} open roles · {totalCandidates} active candidates
          </p>
        </div>
        <Link
          to="/hiring"
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Open board
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {HIRING_PIPELINE.map((stage) => (
          <div key={stage.id} className="rounded-xl bg-slate-50 p-3 flex flex-col gap-3 min-h-[200px]">
            <div className="flex items-center justify-between px-1">
              <div className="inline-flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", stage.color)} />
                <span className="text-xs font-semibold text-slate-700">{stage.label}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">{stage.count}</span>
            </div>

            <div className="flex flex-col gap-2">
              {stage.candidates.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg bg-white border border-slate-200/80 px-2.5 py-2 flex items-center gap-2"
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
                      c.avatarColor
                    )}
                  >
                    {c.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-slate-900 truncate leading-tight">{c.name}</p>
                    <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
