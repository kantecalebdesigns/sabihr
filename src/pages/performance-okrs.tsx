import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Types ──

interface KeyResult {
  id: string;
  description: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: "on-track" | "at-risk" | "behind" | "completed";
}

interface Objective {
  id: string;
  title: string;
  description: string;
  owner: string;
  period: string;
  progress: number;
  keyResults: KeyResult[];
}

type TabKey = "company" | "team" | "my";

// ── Mock Data ──

const PERIODS = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];

const MOCK_OKRS: Record<TabKey, Objective[]> = {
  company: [
    {
      id: "obj-c1", title: "Increase annual revenue by 40%", description: "Drive aggressive revenue growth through expansion and upselling", owner: "CEO", period: "Q1 2026", progress: 62,
      keyResults: [
        { id: "kr-c1a", description: "Close 10 enterprise deals worth >5M ARR each", targetMetric: "Deals closed", currentValue: 6, targetValue: 10, unit: "deals", status: "on-track" },
        { id: "kr-c1b", description: "Increase MRR to 80M", targetMetric: "Monthly recurring revenue", currentValue: 52, targetValue: 80, unit: "M", status: "at-risk" },
        { id: "kr-c1c", description: "Reduce customer churn below 3%", targetMetric: "Churn rate", currentValue: 3.8, targetValue: 3, unit: "%", status: "behind" },
      ],
    },
    {
      id: "obj-c2", title: "Achieve world-class customer satisfaction", description: "Build a customer-obsessed culture across all touchpoints", owner: "COO", period: "Q1 2026", progress: 78,
      keyResults: [
        { id: "kr-c2a", description: "Reach NPS score of 75+", targetMetric: "NPS score", currentValue: 68, targetValue: 75, unit: "pts", status: "on-track" },
        { id: "kr-c2b", description: "Reduce average support response time to 2 hours", targetMetric: "Avg response time", currentValue: 2.5, targetValue: 2, unit: "hrs", status: "at-risk" },
      ],
    },
    {
      id: "obj-c3", title: "Launch next-gen product platform", description: "Ship the new platform with AI-powered features", owner: "CTO", period: "Q1 2026", progress: 45,
      keyResults: [
        { id: "kr-c3a", description: "Ship AI reporting module", targetMetric: "Module shipped", currentValue: 0, targetValue: 1, unit: "module", status: "behind" },
        { id: "kr-c3b", description: "Achieve 99.9% uptime SLA", targetMetric: "Uptime", currentValue: 99.7, targetValue: 99.9, unit: "%", status: "at-risk" },
        { id: "kr-c3c", description: "Onboard 500 beta users", targetMetric: "Beta users", currentValue: 380, targetValue: 500, unit: "users", status: "on-track" },
      ],
    },
  ],
  team: [
    {
      id: "obj-t1", title: "Deliver performance module on time", description: "Complete all performance management features by end of Q1", owner: "Chiamaka Eze", period: "Q1 2026", progress: 55,
      keyResults: [
        { id: "kr-t1a", description: "Build dashboard and goals page", targetMetric: "Pages built", currentValue: 2, targetValue: 3, unit: "pages", status: "on-track" },
        { id: "kr-t1b", description: "Complete 360 feedback flow", targetMetric: "Completion", currentValue: 40, targetValue: 100, unit: "%", status: "at-risk" },
        { id: "kr-t1c", description: "Pass QA with zero critical bugs", targetMetric: "Critical bugs", currentValue: 2, targetValue: 0, unit: "bugs", status: "behind" },
      ],
    },
    {
      id: "obj-t2", title: "Improve engineering velocity by 25%", description: "Increase team throughput and reduce cycle time", owner: "Chiamaka Eze", period: "Q1 2026", progress: 72,
      keyResults: [
        { id: "kr-t2a", description: "Reduce PR review time to under 4 hours", targetMetric: "Avg PR review time", currentValue: 4.5, targetValue: 4, unit: "hrs", status: "at-risk" },
        { id: "kr-t2b", description: "Achieve 80% test coverage", targetMetric: "Test coverage", currentValue: 76, targetValue: 80, unit: "%", status: "on-track" },
      ],
    },
  ],
  my: [
    {
      id: "obj-m1", title: "Build appraisal form component", description: "Create the multi-tab appraisal form with rating matrix", owner: "Adebayo Ogunlesi", period: "Q1 2026", progress: 70,
      keyResults: [
        { id: "kr-m1a", description: "Complete goals review tab", targetMetric: "Completion", currentValue: 100, targetValue: 100, unit: "%", status: "completed" },
        { id: "kr-m1b", description: "Build competency matrix UI", targetMetric: "Completion", currentValue: 60, targetValue: 100, unit: "%", status: "on-track" },
        { id: "kr-m1c", description: "Implement summary view with export", targetMetric: "Completion", currentValue: 30, targetValue: 100, unit: "%", status: "at-risk" },
      ],
    },
    {
      id: "obj-m2", title: "Improve personal technical skills", description: "Level up on React performance and system design", owner: "Adebayo Ogunlesi", period: "Q1 2026", progress: 50,
      keyResults: [
        { id: "kr-m2a", description: "Complete advanced React course", targetMetric: "Modules completed", currentValue: 6, targetValue: 12, unit: "modules", status: "on-track" },
        { id: "kr-m2b", description: "Give 2 tech talks to the team", targetMetric: "Talks given", currentValue: 1, targetValue: 2, unit: "talks", status: "on-track" },
      ],
    },
  ],
};

// ── Helpers ──

function progressBarColor(_pct: number): string {
  return "bg-blue-600";
}

function progressTextColor(_pct: number): string {
  return "text-slate-700";
}

const STATUS_PILL: Record<string, { label: string; pill: string; dot: string }> = {
  "on-track": { label: "On track", pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  "at-risk": { label: "At risk", pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  "behind": { label: "Behind", pill: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
  "completed": { label: "Completed", pill: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
};

const SCOPE_PILL: Record<TabKey, { label: string; cls: string }> = {
  company: { label: "Company", cls: "bg-violet-50 text-violet-700" },
  team: { label: "Team", cls: "bg-indigo-50 text-indigo-700" },
  my: { label: "Individual", cls: "bg-slate-100 text-slate-700" },
};

// ── Component ──

export default function PerformanceOKRsPage() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("Q1 2026");
  const [expandedObj, setExpandedObj] = useState<Set<string>>(new Set(["obj-c1", "obj-t1", "obj-m1"]));
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [fTitle, setFTitle] = useState("");
  const [fDesc, setFDesc] = useState("");
  const [fOwner, setFOwner] = useState("");

  const objectives = useMemo(() => {
    const scopes: TabKey[] = ["company", "team", "my"];
    return scopes.flatMap((scope) =>
      MOCK_OKRS[scope]
        .filter((o) => o.period === selectedPeriod)
        .map((o) => ({ ...o, scope }))
    );
  }, [selectedPeriod]);

  const kpis = useMemo(() => {
    const total = objectives.length;
    const allKrs = objectives.flatMap((o) => o.keyResults);
    const onTrack = allKrs.filter((kr) => kr.status === "on-track" || kr.status === "completed").length;
    const atRisk = allKrs.filter((kr) => kr.status === "at-risk" || kr.status === "behind").length;
    const avgProgress = total === 0 ? 0 : Math.round(objectives.reduce((s, o) => s + o.progress, 0) / total);
    return [
      { label: "Total objectives", value: String(total), icon: Target, trend: 0 },
      { label: "Key results on track", value: String(onTrack), icon: CheckCircle2, trend: 3 },
      { label: "At risk or behind", value: String(atRisk), icon: AlertTriangle, trend: 0 },
      { label: "Avg progress", value: `${avgProgress}%`, icon: TrendingUp, trend: 4 },
    ];
  }, [objectives]);

  const toggleExpand = (id: string) => {
    setExpandedObj((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetForm = () => {
    setFTitle(""); setFDesc(""); setFOwner("");
    setShowForm(false);
  };

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">OKRs</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Set and track objectives and key results across the company — keep teams aligned to
            quarterly outcomes and surface what's on track, at risk, or behind.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("sabi-hr-performance-system");
              navigate("/performance");
            }}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
          >
            <Settings2 className="w-4 h-4 mr-1" />
            Change system
          </Button>
          <Button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
            {showForm ? "Cancel" : "New objective"}
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
                {kpi.trend > 0 && (
                  <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{kpi.trend}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2">
                  {kpi.label}
                  <span className="text-slate-400"> · {selectedPeriod}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Period chips */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500 mr-1">Period</span>
        {PERIODS.map((p) => {
          const active = selectedPeriod === p;
          return (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* New objective form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target className="w-[18px] h-[18px] text-blue-600" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 tracking-tight">New objective</p>
                <p className="text-xs text-slate-500 mt-0.5">For {selectedPeriod}. Add key results after creation.</p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-500">Title</label>
              <Input value={fTitle} onChange={(e) => setFTitle(e.target.value)} placeholder="e.g. Increase annual revenue by 40%" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Owner</label>
              <Input value={fOwner} onChange={(e) => setFOwner(e.target.value)} placeholder="Owner name" />
            </div>
            <div className="space-y-1.5 sm:col-span-3">
              <label className="text-xs font-medium text-slate-500">Description</label>
              <Input value={fDesc} onChange={(e) => setFDesc(e.target.value)} placeholder="Brief description" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={resetForm}
              className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
            >
              Cancel
            </Button>
            <Button
              onClick={resetForm}
              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
            >
              Create objective
            </Button>
          </div>
        </div>
      )}

      {/* Objectives list */}
      {objectives.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 mx-auto flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-base font-bold text-slate-900 tracking-tight">No objectives for {selectedPeriod}</p>
          <p className="text-sm text-slate-500 mt-1">Create your first objective to start tracking outcomes.</p>
          <Button
            onClick={() => setShowForm(true)}
            className="mt-4 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            <Plus className="w-4 h-4 mr-1" />
            New objective
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {objectives.map((obj) => {
            const isExpanded = expandedObj.has(obj.id);
            const pct = obj.progress;
            return (
              <div
                key={obj.id}
                className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden"
              >
                {/* Objective header */}
                <button
                  onClick={() => toggleExpand(obj.id)}
                  className="w-full px-5 py-4 text-left hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0", SCOPE_PILL[obj.scope].cls)}>
                          {SCOPE_PILL[obj.scope].label}
                        </span>
                        <h3 className="font-semibold text-slate-900 leading-tight truncate">{obj.title}</h3>
                      </div>
                    </div>
                    <span className={cn("text-2xl font-bold tracking-tight tabular-nums shrink-0", progressTextColor(pct))}>
                      {pct}%
                    </span>
                    <div className="text-slate-400 inline-flex items-center justify-center shrink-0">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", progressBarColor(pct))}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>

                {/* Key results */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/40">
                    {(obj.description || obj.owner) && (
                      <div className="px-5 py-3 border-b border-slate-100">
                        {obj.description && (
                          <p className="text-sm text-slate-600 leading-relaxed">{obj.description}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          Owner · {obj.owner} <span className="text-slate-300">·</span> {obj.keyResults.length} key result{obj.keyResults.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    )}
                    <div className="px-5 py-3 flex items-center justify-between">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Key results</p>
                      <button className="text-[11px] font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        Add KR
                      </button>
                    </div>
                    <div className="bg-white">
                      {obj.keyResults.map((kr, i) => {
                        const krPct = kr.targetValue === 0 ? 100 : Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100));
                        const style = STATUS_PILL[kr.status];
                        return (
                          <div
                            key={kr.id}
                            className={cn(
                              "px-5 py-4 flex items-center gap-4",
                              i > 0 && "border-t border-slate-100"
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 leading-tight">{kr.description}</p>
                              <p className="text-xs text-slate-500 leading-tight mt-1 tabular-nums">
                                {kr.targetMetric}: {kr.currentValue} / {kr.targetValue} {kr.unit}
                              </p>
                            </div>
                            <div className="w-32 shrink-0 hidden md:block">
                              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full", progressBarColor(krPct))}
                                  style={{ width: `${krPct}%` }}
                                />
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 text-right tabular-nums">{krPct}%</p>
                            </div>
                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium shrink-0", style.pill)}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
                              {style.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
