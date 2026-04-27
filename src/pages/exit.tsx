import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Plus,
  Clock,
  Users,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_EXITS,
  EXIT_STAGES_ORDER,
  formatExitCurrency,
} from "@/lib/exit-mock-data";
import type { ExitType, ExitStage } from "@/lib/exit-mock-data";

const AVATAR_PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const TYPE_PILL: Record<ExitType, { label: string; cls: string; dot: string }> = {
  resignation: {
    label: "Resignation",
    cls: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  termination: {
    label: "Termination",
    cls: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
  retirement: {
    label: "Retirement",
    cls: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  redundancy: {
    label: "Redundancy",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  "end-of-contract": {
    label: "End of contract",
    cls: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

const STAGE_PILL: Record<ExitStage, { label: string; cls: string; dot: string }> = {
  "pending-approval": {
    label: "Pending approval",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  "notice-period": {
    label: "Notice period",
    cls: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  clearance: {
    label: "Clearance",
    cls: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  "final-settlement": {
    label: "Final settlement",
    cls: "bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
  },
  completed: {
    label: "Completed",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const CARD_SHELL =
  "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]";

export default function ExitPage() {
  const navigate = useNavigate();

  const activeExits = MOCK_EXITS.filter((e) => e.stage !== "completed");
  const completedExits = MOCK_EXITS.filter((e) => e.stage === "completed");
  const exitsThisQuarter = MOCK_EXITS.filter(
    (e) => e.initiatedDate >= "2026-01-01"
  ).length;

  // Group by stage for pipeline view
  const pipeline = useMemo(() => {
    const groups: Record<string, typeof MOCK_EXITS> = {};
    for (const stage of EXIT_STAGES_ORDER) {
      groups[stage] = MOCK_EXITS.filter((e) => e.stage === stage);
    }
    return groups;
  }, []);

  const summaryCards = [
    { label: "Active Exits", value: activeExits.length, icon: LogOut },
    {
      label: "In Clearance",
      value: pipeline["clearance"]?.length ?? 0,
      icon: Clock,
    },
    { label: "Exits This Quarter", value: exitsThisQuarter, icon: TrendingUp },
    { label: "Completed", value: completedExits.length, icon: Users },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Exit Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage employee offboarding, clearance, and final settlements.
          </p>
        </div>
        <Button
          onClick={() => navigate("/exit/initiate")}
          className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
        >
          <Plus className="w-4 h-4 mr-1" />
          Initiate exit
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={cn(CARD_SHELL, "px-5 pt-5 pb-5 flex flex-col gap-7")}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="text-blue-600 w-[18px] h-[18px]" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none tabular-nums">
                  {c.value}
                </p>
                <p className="text-sm text-slate-500 mt-2">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline */}
      <div className={cn(CARD_SHELL, "p-5 space-y-4")}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Exit pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Active exits grouped by stage of the offboarding workflow.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {EXIT_STAGES_ORDER.map((stage) => {
            const stagePill = STAGE_PILL[stage];
            const exits = pipeline[stage] ?? [];
            return (
              <div
                key={stage}
                className="rounded-xl bg-slate-50 p-3 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium",
                      stagePill.cls
                    )}
                  >
                    <span
                      className={cn("w-1.5 h-1.5 rounded-full", stagePill.dot)}
                    />
                    {stagePill.label}
                  </span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {exits.length}
                  </span>
                </div>

                {exits.length > 0 ? (
                  <div className="space-y-2">
                    {exits.map((exit) => {
                      const typePill = TYPE_PILL[exit.exitType];
                      return (
                        <button
                          key={exit.id}
                          type="button"
                          onClick={() => navigate(`/exit/${exit.id}`)}
                          className="w-full text-left p-3 rounded-lg bg-white border border-slate-200/70 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-[10px] shrink-0",
                                avatarColor(exit.id)
                              )}
                            >
                              {initials(exit.employeeName)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
                                {exit.employeeName}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                                {exit.department}
                              </p>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium",
                              typePill.cls
                            )}
                          >
                            <span
                              className={cn(
                                "w-1 h-1 rounded-full",
                                typePill.dot
                              )}
                            />
                            {typePill.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">None</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All Exits Table */}
      <div className={cn(CARD_SHELL, "overflow-hidden")}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              All exits
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete history including completed offboardings.
            </p>
          </div>
          <span className="text-sm text-slate-500">
            {MOCK_EXITS.length} record{MOCK_EXITS.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
                  Employee
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                  Department
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                  Type
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                  Last day
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                  Stage
                </th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                  Settlement
                </th>
                <th className="w-12 py-3 pr-5" />
              </tr>
            </thead>
            <tbody>
              {MOCK_EXITS.map((exit) => {
                const typePill = TYPE_PILL[exit.exitType];
                const stagePill = STAGE_PILL[exit.stage];
                return (
                  <tr
                    key={exit.id}
                    onClick={() => navigate(`/exit/${exit.id}`)}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-4 pl-5 pr-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0",
                            avatarColor(exit.id)
                          )}
                        >
                          {initials(exit.employeeName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {exit.employeeName}
                          </p>
                          <p className="text-xs text-slate-500 leading-tight mt-0.5">
                            {exit.jobTitle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-5 text-sm text-slate-700">
                      {exit.department}
                    </td>
                    <td className="py-4 pr-5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                          typePill.cls
                        )}
                      >
                        <span
                          className={cn("w-1.5 h-1.5 rounded-full", typePill.dot)}
                        />
                        {typePill.label}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-sm text-slate-700">
                      {new Date(exit.requestedLastDay).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 pr-5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                          stagePill.cls
                        )}
                      >
                        <span
                          className={cn("w-1.5 h-1.5 rounded-full", stagePill.dot)}
                        />
                        {stagePill.label}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-sm font-semibold text-slate-900 text-right tabular-nums">
                      {formatExitCurrency(exit.netSettlement)}
                    </td>
                    <td className="py-4 pr-5">
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
