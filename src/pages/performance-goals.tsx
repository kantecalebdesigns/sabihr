import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_GOALS,
  GOAL_STATUS_STYLES,
} from "@/lib/performance-mock-data";
import type { GoalLevel } from "@/lib/performance-mock-data";

const AVATAR_PALETTE = [
  "bg-blue-500", "bg-violet-500", "bg-teal-500", "bg-amber-500", "bg-rose-500",
  "bg-emerald-500", "bg-indigo-500", "bg-pink-500", "bg-orange-500", "bg-cyan-500",
];

function paletteFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0] ?? "").join("").toUpperCase();
}

const STATUS_LABEL: Record<string, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  "behind": "Behind",
  "completed": "Completed",
  "not-started": "Not started",
};

const LEVEL_PILL = "bg-slate-100 text-slate-700";

export default function PerformanceGoalsPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | GoalLevel>("all");

  const filtered = useMemo(() => {
    return MOCK_GOALS.filter((g) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.ownerName.toLowerCase().includes(q) ||
        g.department.toLowerCase().includes(q);
      const matchesLevel = levelFilter === "all" || g.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [search, levelFilter]);

  const counts = useMemo(() => {
    const c = { total: MOCK_GOALS.length, onTrack: 0, atRisk: 0, completed: 0 };
    MOCK_GOALS.forEach((g) => {
      if (g.status === "on-track") c.onTrack++;
      else if (g.status === "at-risk") c.atRisk++;
      else if (g.status === "completed") c.completed++;
    });
    return c;
  }, []);

  const levelCounts = useMemo(() => {
    const c: Record<string, number> = { all: MOCK_GOALS.length };
    MOCK_GOALS.forEach((g) => {
      c[g.level] = (c[g.level] || 0) + 1;
    });
    return c;
  }, []);

  const kpis = [
    { label: "Total goals", value: counts.total, icon: Target, trend: 3 },
    { label: "On track", value: counts.onTrack, icon: TrendingUp, trend: 2 },
    { label: "At risk", value: counts.atRisk, icon: AlertTriangle, trend: 0 },
    { label: "Completed", value: counts.completed, icon: CheckCircle2, trend: 1 },
  ];

  const tabs: { key: "all" | GoalLevel; label: string }[] = [
    { key: "all", label: "All" },
    { key: "company", label: "Company" },
    { key: "department", label: "Department" },
    { key: "individual", label: "Individual" },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Goals</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Track every company, team, and individual goal — see what's on track, where attention
            is needed, and how progress is rolling up.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            <Plus className="w-4 h-4 mr-1" />
            New goal
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/70 bg-white px-5 pt-5 pb-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-7"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none tabular-nums">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chip filters */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const active = levelFilter === tab.key;
          const count = levelCounts[tab.key] ?? 0;
          return (
            <button
              key={tab.key}
              onClick={() => setLevelFilter(tab.key)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {tab.label}
              <span className={cn("text-xs", active ? "text-white/80" : "text-slate-400")}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search goals, owners, departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 rounded-lg"
        />
      </div>

      {/* Goal cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 mx-auto flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-base font-bold text-slate-900 tracking-tight">No goals found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((goal) => {
            const statusLabel = STATUS_LABEL[goal.status] ?? GOAL_STATUS_STYLES[goal.status]?.label ?? "—";
            const dueDate = new Date(goal.dueDate).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            return (
              <div
                key={goal.id}
                className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] px-5 py-4 hover:bg-slate-50/40 transition-colors cursor-pointer"
              >
                {/* Top row: pill + title + percentage */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium capitalize shrink-0", LEVEL_PILL)}>
                        {goal.level}
                      </span>
                      <h3 className="font-semibold text-slate-900 leading-tight truncate">{goal.title}</h3>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums shrink-0">
                    {goal.progress}%
                  </span>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center shrink-0"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                {/* Meta row */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                  <div className="inline-flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-[10px] shrink-0", paletteFor(goal.id))}>
                      {initials(goal.ownerName)}
                    </div>
                    <span className="text-slate-700">{goal.ownerName}</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span>{goal.department}</span>
                  <span className="text-slate-300">·</span>
                  <span className="tabular-nums">Due {dueDate}</span>
                  <span className="text-slate-300">·</span>
                  <span>{statusLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
