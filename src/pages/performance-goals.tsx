import { useState, useMemo } from "react";
import { Search, Plus, Target, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_GOALS,
  GOAL_STATUS_STYLES,
} from "@/lib/performance-mock-data";
import type { GoalLevel } from "@/lib/performance-mock-data";

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

  const summaryCards = [
    { label: "Total Goals", value: counts.total, icon: Target },
    { label: "On Track", value: counts.onTrack, icon: TrendingUp },
    { label: "At Risk", value: counts.atRisk, icon: AlertTriangle },
    { label: "Completed", value: counts.completed, icon: CheckCircle2 },
  ];

  const progressColor = (status: string) => {
    switch (status) {
      case "on-track": return "bg-emerald-500";
      case "at-risk": return "bg-amber-500";
      case "behind": return "bg-red-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Goal Management
          </h1>
          <p className="text-sm text-slate-500">
            {MOCK_GOALS.length} total goals &middot; {filtered.length} shown
          </p>
        </div>
        <Button
          onClick={() => {}}
          className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex gap-[14px] items-start"
          >
            <div className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center shrink-0">
              <card.icon className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Level Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {(
          [
            { key: "all", label: "All" },
            { key: "company", label: "Company" },
            { key: "department", label: "Department" },
            { key: "individual", label: "Individual" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setLevelFilter(tab.key)}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              levelFilter === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {tab.label}
            {levelCounts[tab.key] ? (
              <span className="ml-1.5 text-xs bg-[#f8fafc] px-1.5 py-0.5 rounded-full">
                {levelCounts[tab.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search goals, owners, departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Goal</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Owner</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500 w-[140px]">Progress</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Due Date</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((goal) => {
              const style = GOAL_STATUS_STYLES[goal.status];
              return (
                <tr
                  key={goal.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="p-3">
                    <p className="font-medium text-slate-900">{goal.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{goal.level}</p>
                  </td>
                  <td className="p-3 text-slate-900">{goal.ownerName}</td>
                  <td className="p-3 text-slate-500">{goal.department}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                        <div
                          className={cn("h-1.5 rounded-full", progressColor(goal.status))}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-8 text-right">
                        {goal.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-500">
                    {new Date(goal.dueDate).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className={cn("p-3 text-sm font-medium", style.color)}>
                    {style.label}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400">
                  <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-slate-900">No goals found</p>
                  <p className="text-xs mt-1 text-slate-500">
                    Try adjusting your search or filters
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
