import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Crosshair,
  BarChart3,
  ClipboardList,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_CYCLE,
  MOCK_GOALS,
  MOCK_APPRAISALS,
  GOAL_STATUS_STYLES,
} from "@/lib/performance-mock-data";
import type { RatingValue } from "@/lib/performance-mock-data";

export type PerformanceSystem = "okr" | "balanced-scorecard" | "goals-reviews" | "360-feedback";

const PERFORMANCE_SYSTEMS: {
  id: PerformanceSystem;
  name: string;
  description: string;
  icon: React.ElementType;
  features: string[];
}[] = [
  {
    id: "okr",
    name: "OKRs",
    description: "Objectives and Key Results — set ambitious goals with measurable outcomes at company, team, and individual levels.",
    icon: Crosshair,
    features: ["Company, team & individual OKRs", "Quarterly goal cycles", "Key result tracking", "Alignment & cascading"],
  },
  {
    id: "balanced-scorecard",
    name: "Balanced Scorecard",
    description: "A strategic planning framework measuring performance across four perspectives: Financial, Customer, Internal Process, and Learning & Growth.",
    icon: BarChart3,
    features: ["4 strategic perspectives", "KPI tracking & scoring", "Strategic objective mapping", "Weighted performance metrics"],
  },
  {
    id: "goals-reviews",
    name: "Goals & Reviews",
    description: "Traditional goal setting with periodic performance reviews, manager appraisals, and calibration.",
    icon: ClipboardList,
    features: ["Goal setting & tracking", "Self & manager reviews", "Review cycles & templates", "Rating calibration"],
  },
  {
    id: "360-feedback",
    name: "360° Feedback",
    description: "Multi-rater feedback from peers, managers, and direct reports for a holistic view of performance.",
    icon: Star,
    features: ["Multi-rater assessments", "Peer nominations", "Competency-based ratings", "Anonymous feedback option"],
  },
];

const STORAGE_KEY = "sabi-hr-performance-system";

function getStoredSystem(): PerformanceSystem | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val as PerformanceSystem | null;
  } catch {
    return null;
  }
}

function storeSystem(system: PerformanceSystem) {
  localStorage.setItem(STORAGE_KEY, system);
}

function PerformanceSetup({ onSelect }: { onSelect: (system: PerformanceSystem) => void }) {
  const [selected, setSelected] = useState<PerformanceSystem | null>(null);

  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Choose your performance system</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Select the performance management framework that best fits your organization. You can change this later from settings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PERFORMANCE_SYSTEMS.map((system) => {
          const isSelected = selected === system.id;
          return (
            <button
              key={system.id}
              onClick={() => setSelected(system.id)}
              className={cn(
                "rounded-2xl border bg-white p-5 text-left transition-all shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]",
                isSelected
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-slate-200/70 hover:border-slate-300"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    isSelected ? "bg-blue-600" : "bg-blue-50"
                  )}
                >
                  <system.icon className={cn("w-[18px] h-[18px]", isSelected ? "text-white" : "text-blue-600")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">{system.name}</h3>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{system.description}</p>
                  <ul className="mt-3 space-y-1.5">
                    {system.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
        >
          Continue with {selected ? PERFORMANCE_SYSTEMS.find((s) => s.id === selected)?.name : "..."}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const navigate = useNavigate();
  const [activeSystem, setActiveSystem] = useState<PerformanceSystem | null>(getStoredSystem());

  const cycle = MOCK_CYCLE;

  const goalStats = useMemo(() => {
    return {
      total: MOCK_GOALS.length,
      onTrack: MOCK_GOALS.filter((g) => g.status === "on-track").length,
      atRisk: MOCK_GOALS.filter((g) => g.status === "at-risk").length,
      behind: MOCK_GOALS.filter((g) => g.status === "behind").length,
      completed: MOCK_GOALS.filter((g) => g.status === "completed").length,
      avgProgress: Math.round(MOCK_GOALS.reduce((s, g) => s + g.progress, 0) / MOCK_GOALS.length),
    };
  }, []);

  const reviewStats = useMemo(() => {
    return {
      total: MOCK_APPRAISALS.length,
      completed: MOCK_APPRAISALS.filter((a) => a.status === "completed").length,
      pendingSelf: MOCK_APPRAISALS.filter((a) => a.status === "pending-self").length,
      pendingManager: MOCK_APPRAISALS.filter((a) => a.status === "pending-manager").length,
    };
  }, []);

  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    MOCK_APPRAISALS.forEach((a) => {
      if (a.finalRating) dist[a.finalRating]++;
    });
    return dist;
  }, []);

  useEffect(() => {
    if (!activeSystem) return;
    if (activeSystem === "okr") navigate("/performance/okrs", { replace: true });
    else if (activeSystem === "balanced-scorecard") navigate("/performance/balanced-scorecard", { replace: true });
    else if (activeSystem === "360-feedback") navigate("/performance/360", { replace: true });
  }, [activeSystem, navigate]);

  const handleSelectSystem = (system: PerformanceSystem) => {
    storeSystem(system);
    setActiveSystem(system);
  };

  if (!activeSystem) {
    return <PerformanceSetup onSelect={handleSelectSystem} />;
  }

  const maxRatingCount = Math.max(...Object.values(ratingDistribution), 1);
  const completionPercent = cycle.totalEmployees > 0
    ? Math.round((cycle.completedReviews / cycle.totalEmployees) * 100)
    : 0;

  const deadlines = [
    { label: "Self-review deadline", date: cycle.selfReviewDeadline, urgent: new Date(cycle.selfReviewDeadline) <= new Date("2026-04-10") },
    { label: "Manager review deadline", date: cycle.managerReviewDeadline, urgent: false },
    { label: "Cycle end date", date: cycle.endDate, urgent: false },
  ];

  const goalsAtRisk = MOCK_GOALS.filter((g) => g.status === "at-risk" || g.status === "behind").slice(0, 4);

  const kpis = [
    { value: goalStats.total, label: "Total goals", icon: Target, trend: 3 },
    { value: goalStats.onTrack, label: "On track", icon: TrendingUp, trend: 2 },
    { value: goalStats.atRisk + goalStats.behind, label: "Needs attention", icon: AlertCircle, trend: 1 },
    { value: reviewStats.pendingSelf + reviewStats.pendingManager, label: "Reviews pending", icon: Users, trend: 1 },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performance</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Track goals, reviews, and team performance across the active cycle — Goals & Reviews framework.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setActiveSystem(null);
            }}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
          >
            Change system
          </Button>
          <Button
            onClick={() => navigate("/performance/reviews")}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Reviews
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
                <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{kpi.trend}</span>
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

      {/* Active cycle card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Active cycle</h3>
            <p className="text-xs text-slate-500 mt-0.5">{cycle.name}</p>
          </div>
          <span className="text-xs text-slate-500 tabular-nums">
            {cycle.startDate} — {cycle.endDate}
          </span>
        </div>
        <div className="px-5 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">{completionPercent}%</p>
              <p className="text-sm text-slate-500 mt-2">Reviews complete</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">
                {cycle.completedReviews}<span className="text-slate-400">/{cycle.totalEmployees}</span>
              </p>
              <p className="text-sm text-slate-500 mt-2">Employees reviewed</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">{goalStats.avgProgress}%</p>
              <p className="text-sm text-slate-500 mt-2">Avg goal progress</p>
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completionPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Three-panel row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rating distribution */}
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/70">
            <h3 className="text-sm font-semibold text-slate-900">Rating distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {MOCK_APPRAISALS.filter((a) => a.finalRating).length} of {MOCK_APPRAISALS.length} reviews rated
            </p>
          </div>
          <div className="px-5 py-5 space-y-3">
            {([5, 4, 3, 2, 1] as RatingValue[]).map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600 w-6 text-right tabular-nums">{rating}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      rating >= 4 ? "bg-emerald-500" : rating === 3 ? "bg-amber-500" : "bg-rose-500"
                    )}
                    style={{ width: `${(ratingDistribution[rating] / maxRatingCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-4 tabular-nums">{ratingDistribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/70">
            <h3 className="text-sm font-semibold text-slate-900">Upcoming deadlines</h3>
            <p className="text-xs text-slate-500 mt-0.5">Key dates for the active cycle</p>
          </div>
          <div className="px-5 py-3">
            {deadlines.map((d) => (
              <div key={d.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Clock className={cn("w-4 h-4 shrink-0", d.urgent ? "text-amber-600" : "text-slate-400")} />
                  <span className="text-sm text-slate-700 truncate">{d.label}</span>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium shrink-0",
                    d.urgent ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", d.urgent ? "bg-amber-500" : "bg-slate-400")} />
                  {new Date(d.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals needing attention */}
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Needs attention</h3>
              <p className="text-xs text-slate-500 mt-0.5">Goals at risk or behind</p>
            </div>
            <button
              onClick={() => navigate("/performance/goals")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 shrink-0"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-5 py-5 space-y-4">
            {goalsAtRisk.map((goal) => {
              const style = GOAL_STATUS_STYLES[goal.status];
              const pillClass = goal.status === "at-risk"
                ? "bg-amber-50 text-amber-700"
                : "bg-rose-50 text-rose-700";
              const dotClass = goal.status === "at-risk" ? "bg-amber-500" : "bg-rose-500";
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{goal.title}</p>
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium shrink-0", pillClass)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", dotClass)} />
                      {style.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          goal.status === "at-risk" ? "bg-amber-500" : "bg-rose-500"
                        )}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right tabular-nums">{goal.progress}%</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {goal.ownerName} <span className="text-slate-400">·</span> {goal.department}
                  </p>
                </div>
              );
            })}
            {goalsAtRisk.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">All goals are on track</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
