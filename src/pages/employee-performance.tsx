import { useMemo } from "react";
import {
  Target,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_CYCLE,
  MOCK_GOALS,
  MOCK_APPRAISALS,
  GOAL_STATUS_STYLES,
  APPRAISAL_STATUS_STYLES,
} from "@/lib/performance-mock-data";

// Simulate current logged-in employee
const CURRENT_EMPLOYEE_ID = "emp-001";

export default function EmployeePerformancePage() {
  const cycle = MOCK_CYCLE;

  const myGoals = useMemo(
    () => MOCK_GOALS.filter((g) => g.ownerId === CURRENT_EMPLOYEE_ID),
    []
  );

  const myAppraisal = MOCK_APPRAISALS.find(
    (a) => a.employeeId === CURRENT_EMPLOYEE_ID && a.cycleId === cycle.id
  );

  const appraisalStatus = myAppraisal
    ? APPRAISAL_STATUS_STYLES[myAppraisal.status]
    : null;

  const avgProgress = myGoals.length > 0
    ? Math.round(myGoals.reduce((s, g) => s + g.progress, 0) / myGoals.length)
    : 0;

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Performance</h1>
        <p className="text-sm text-slate-500">
          {cycle.name} &middot; {cycle.period}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium">My Goals</span>
          </div>
          <p className="text-xl font-semibold">{myGoals.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium">Avg Progress</span>
          </div>
          <p className="text-xl font-semibold">{avgProgress}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Review Status</span>
          </div>
          <p className={cn("text-sm font-medium mt-1", appraisalStatus?.color ?? "text-slate-500")}>
            {appraisalStatus?.label ?? "No Review"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Star className="w-4 h-4" />
            <span className="text-xs font-medium">My Rating</span>
          </div>
          {myAppraisal?.finalRating ? (
            <p className="text-xl font-semibold">{myAppraisal.finalRating}<span className="text-sm text-slate-500 font-normal">/5</span></p>
          ) : (
            <p className="text-sm text-slate-500 mt-1">Pending</p>
          )}
        </div>
      </div>

      {/* Review Status Card */}
      {myAppraisal && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-3">
          <h2 className="text-sm font-semibold">Review Progress</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-500">Self Review</p>
              <p className={cn("font-medium mt-0.5", myAppraisal.selfReviewStatus === "submitted" ? "text-emerald-700" : "text-amber-700")}>
                {myAppraisal.selfReviewStatus === "submitted" ? "Submitted" : "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Manager Review</p>
              <p className={cn("font-medium mt-0.5", myAppraisal.managerReviewStatus === "submitted" ? "text-emerald-700" : "text-amber-700")}>
                {myAppraisal.managerReviewStatus === "submitted" ? "Submitted" : "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Self Rating</p>
              <p className="font-medium mt-0.5">{myAppraisal.selfRating ? `${myAppraisal.selfRating}/5` : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Final Rating</p>
              <p className="font-medium mt-0.5">{myAppraisal.finalRating ? `${myAppraisal.finalRating}/5` : "—"}</p>
            </div>
          </div>
          {myAppraisal.selfReviewStatus === "pending" && (
            <p className="text-xs text-amber-700">
              Self-review deadline: {new Date(cycle.selfReviewDeadline).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
      )}

      {/* My Goals */}
      <div>
        <h2 className="text-sm font-semibold mb-3">My Goals ({myGoals.length})</h2>
        {myGoals.length > 0 ? (
          <div className="space-y-3">
            {myGoals.map((goal) => {
              const style = GOAL_STATUS_STYLES[goal.status];
              return (
                <div key={goal.id} className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{goal.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{goal.description}</p>
                    </div>
                    <span className={cn("text-xs font-medium shrink-0", style.color)}>{style.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          goal.progress >= 70 ? "bg-emerald-500" : goal.progress >= 40 ? "bg-amber-500" : "bg-red-400"
                        )}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{goal.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Weight: {goal.weight}%</span>
                    <span>Due: {new Date(goal.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
                  </div>
                  {goal.keyResults.length > 0 && (
                    <div className="pt-2 border-t border-[#efefef]">
                      <p className="text-xs font-medium text-slate-500 mb-1">Key Results</p>
                      <ul className="space-y-1">
                        {goal.keyResults.map((kr, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                            <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                            {kr}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#efefef] p-8 text-center text-slate-500">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No goals assigned yet</p>
            <p className="text-xs mt-1">Your manager will assign goals for the current review cycle</p>
          </div>
        )}
      </div>
    </div>
  );
}
