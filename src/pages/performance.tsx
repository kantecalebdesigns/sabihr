import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
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

export default function PerformancePage() {
  const navigate = useNavigate();
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

  // Rating distribution from completed appraisals
  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    MOCK_APPRAISALS.forEach((a) => {
      if (a.finalRating) dist[a.finalRating]++;
    });
    return dist;
  }, []);

  const maxRatingCount = Math.max(...Object.values(ratingDistribution), 1);

  const completionPercent = cycle.totalEmployees > 0
    ? Math.round((cycle.completedReviews / cycle.totalEmployees) * 100)
    : 0;

  // Upcoming deadlines
  const deadlines = [
    { label: "Self-review deadline", date: cycle.selfReviewDeadline, urgent: new Date(cycle.selfReviewDeadline) <= new Date("2026-04-10") },
    { label: "Manager review deadline", date: cycle.managerReviewDeadline, urgent: false },
    { label: "Cycle end date", date: cycle.endDate, urgent: false },
  ];

  // Recent goals at risk
  const goalsAtRisk = MOCK_GOALS.filter((g) => g.status === "at-risk" || g.status === "behind").slice(0, 4);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Performance Management</h1>
          <p className="text-sm text-slate-500">Track goals, reviews, and team performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/performance/goals")}>
            <Target className="w-4 h-4 mr-2" />
            Goals
          </Button>
          <Button size="sm" onClick={() => navigate("/performance/reviews")}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Reviews
          </Button>
        </div>
      </div>

      {/* Active Cycle Card */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Active Cycle</p>
            <h2 className="text-lg font-semibold mt-0.5">{cycle.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {cycle.startDate} — {cycle.endDate}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Progress ring (simplified as bar) */}
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight">{completionPercent}%</p>
              <p className="text-xs text-slate-500">Reviews Complete</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight">{cycle.completedReviews}/{cycle.totalEmployees}</p>
              <p className="text-xs text-slate-500">Employees</p>
            </div>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completionPercent}%` }} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium">Total Goals</span>
          </div>
          <p className="text-xl font-semibold">{goalStats.total}</p>
          <p className="text-xs text-slate-500 mt-0.5">{goalStats.avgProgress}% avg progress</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">On Track</span>
          </div>
          <p className="text-xl font-semibold">{goalStats.onTrack}</p>
          <p className="text-xs text-emerald-700 mt-0.5">{goalStats.completed} completed</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Needs Attention</span>
          </div>
          <p className="text-xl font-semibold">{goalStats.atRisk + goalStats.behind}</p>
          <p className="text-xs text-amber-700 mt-0.5">{goalStats.atRisk} at risk, {goalStats.behind} behind</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Reviews Pending</span>
          </div>
          <p className="text-xl font-semibold">{reviewStats.pendingSelf + reviewStats.pendingManager}</p>
          <p className="text-xs text-slate-500 mt-0.5">{reviewStats.pendingSelf} self, {reviewStats.pendingManager} manager</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h3 className="text-sm font-semibold mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {([5, 4, 3, 2, 1] as RatingValue[]).map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500 w-6 text-right">{rating}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      rating >= 4 ? "bg-emerald-500" : rating === 3 ? "bg-amber-500" : "bg-red-400"
                    )}
                    style={{ width: `${(ratingDistribution[rating] / maxRatingCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-4">{ratingDistribution[rating]}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {MOCK_APPRAISALS.filter((a) => a.finalRating).length} of {MOCK_APPRAISALS.length} reviews rated
          </p>
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h3 className="text-sm font-semibold mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {deadlines.map((d) => (
              <div key={d.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={cn("w-4 h-4", d.urgent ? "text-amber-600" : "text-slate-500")} />
                  <span className="text-sm">{d.label}</span>
                </div>
                <span className={cn("text-xs font-medium", d.urgent ? "text-amber-700" : "text-slate-500")}>
                  {new Date(d.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Needing Attention */}
        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Goals Needing Attention</h3>
            <button onClick={() => navigate("/performance/goals")} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {goalsAtRisk.map((goal) => {
              const style = GOAL_STATUS_STYLES[goal.status];
              return (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate flex-1 mr-2">{goal.title}</p>
                    <span className={cn("text-xs font-medium shrink-0", style.color)}>{style.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          goal.status === "at-risk" ? "bg-amber-500" : "bg-red-400"
                        )}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{goal.progress}%</span>
                  </div>
                  <p className="text-xs text-slate-500">{goal.ownerName} &middot; {goal.department}</p>
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
