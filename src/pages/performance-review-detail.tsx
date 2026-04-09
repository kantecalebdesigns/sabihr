import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  Users,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_APPRAISALS,
  MOCK_GOALS,
  MOCK_COMPETENCIES,
  RATING_LABELS,
  APPRAISAL_STATUS_STYLES,
} from "@/lib/performance-mock-data";
import type { RatingValue } from "@/lib/performance-mock-data";

type Tab = "goals" | "competencies" | "summary" | "comments";

export default function PerformanceReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("goals");

  const appraisal = MOCK_APPRAISALS.find((a) => a.id === id);

  if (!appraisal) {
    return (
      <div className="max-w-[1400px] mx-auto py-20 text-center">
        <p className="font-medium text-slate-900">Appraisal not found</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/performance/reviews")}>
          Back to Reviews
        </Button>
      </div>
    );
  }

  const statusStyle = APPRAISAL_STATUS_STYLES[appraisal.status];
  const employeeGoals = MOCK_GOALS.filter((g) => g.ownerId === appraisal.employeeId);

  const tabs: { key: Tab; label: string; icon: typeof Target }[] = [
    { key: "goals", label: "Goals Review", icon: Target },
    { key: "competencies", label: "Competencies", icon: Star },
    { key: "summary", label: "Overall Rating", icon: Users },
    { key: "comments", label: "Comments & Dev Plan", icon: MessageSquare },
  ];

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate("/performance/reviews")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reviews
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {appraisal.employeeName} — Performance Review
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {appraisal.department} &middot; Manager: {appraisal.managerName}
            </p>
          </div>
          <span className={cn("text-sm font-medium", statusStyle.color)}>{statusStyle.label}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#efefef]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Goals Review Tab */}
      {activeTab === "goals" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Rate achievement on each goal assigned for this review period.</p>
          {employeeGoals.length > 0 ? (
            <div className="space-y-3">
              {employeeGoals.map((goal) => (
                <GoalReviewCard key={goal.id} goal={goal} readOnly={appraisal.status === "completed"} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#efefef] p-8 text-center text-slate-500">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No goals assigned for this employee</p>
            </div>
          )}
        </div>
      )}

      {/* Competencies Tab */}
      {activeTab === "competencies" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Assess performance across core competencies using the 1-5 rating scale.</p>
          <div className="rounded-xl border border-[#efefef] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Competency</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Description</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500 w-32">Self</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500 w-32">Manager</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_COMPETENCIES.map((comp, i) => (
                  <tr key={comp.id} className="border-b border-[#efefef] last:border-0">
                    <td className="p-3 font-medium">{comp.name}</td>
                    <td className="p-3 text-slate-500 text-xs">{comp.description}</td>
                    <td className="p-3 text-center">
                      <RatingSelect
                        value={appraisal.selfRating ? Math.min(5, Math.max(1, appraisal.selfRating + (i % 2 === 0 ? 0 : -1))) as RatingValue : null}
                        readOnly={appraisal.selfReviewStatus === "submitted"}
                      />
                    </td>
                    <td className="p-3 text-center">
                      <RatingSelect
                        value={appraisal.managerRating ? Math.min(5, Math.max(1, appraisal.managerRating + (i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : -1))) as RatingValue : null}
                        readOnly={appraisal.managerReviewStatus === "submitted"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          <p className="text-sm text-slate-500">Overall performance rating summary for this review cycle.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RatingCard label="Self Assessment" rating={appraisal.selfRating} />
            <RatingCard label="Manager Assessment" rating={appraisal.managerRating} />
            <RatingCard label="Final Rating" rating={appraisal.finalRating} highlighted />
          </div>

          {/* Rating scale reference */}
          <div className="rounded-xl border border-[#efefef] bg-white p-5">
            <h3 className="text-sm font-semibold mb-3">Rating Scale</h3>
            <div className="space-y-2">
              {([5, 4, 3, 2, 1] as RatingValue[]).map((r) => (
                <div key={r} className="flex items-baseline gap-3">
                  <span className="text-sm font-semibold w-4">{r}</span>
                  <span className="text-sm font-medium">{RATING_LABELS[r].label}</span>
                  <span className="text-xs text-slate-500">— {RATING_LABELS[r].description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === "comments" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <h3 className="text-sm font-semibold">Employee Comments</h3>
            <p className="text-sm text-slate-500">
              {appraisal.selfReviewStatus === "submitted"
                ? "I feel I've made strong progress on my assigned goals this quarter. The key challenge was balancing project delivery with the new requirements. I'd like to focus on improving my technical leadership skills next quarter."
                : "Self-review not yet submitted."}
            </p>
          </div>

          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <h3 className="text-sm font-semibold">Manager Comments</h3>
            <p className="text-sm text-slate-500">
              {appraisal.managerReviewStatus === "submitted"
                ? "Strong performer who consistently delivers quality work. Demonstrated good problem-solving skills and collaboration. Recommend focusing on mentoring junior team members to develop leadership capacity."
                : "Manager review not yet submitted."}
            </p>
          </div>

          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <h3 className="text-sm font-semibold">Development Plan</h3>
            {appraisal.status === "completed" ? (
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  Complete leadership training program by Q2 2026
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  Mentor 1-2 junior team members
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  Present at least 1 tech talk or knowledge-sharing session
                </li>
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Development plan will be set after review completion.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Goal Review Card ── */
function GoalReviewCard({ goal, readOnly }: { goal: typeof MOCK_GOALS[0]; readOnly: boolean }) {
  const [rating, setRating] = useState<RatingValue | null>(readOnly ? (goal.progress >= 80 ? 4 : goal.progress >= 50 ? 3 : 2) as RatingValue : null);

  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{goal.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{goal.description}</p>
        </div>
        <span className="text-xs text-slate-500 shrink-0">Weight: {goal.weight}%</span>
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
      <div className="flex items-center justify-between pt-2 border-t border-[#efefef]">
        <span className="text-xs text-slate-500">Achievement Rating</span>
        <div className="flex items-center gap-1">
          {([1, 2, 3, 4, 5] as RatingValue[]).map((r) => (
            <button
              key={r}
              onClick={() => !readOnly && setRating(r)}
              className={cn(
                "w-7 h-7 rounded-md text-xs font-medium transition-colors",
                rating === r
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100",
                readOnly && "cursor-default"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Rating Select (for competency matrix) ── */
function RatingSelect({ value }: { value: RatingValue | null; readOnly: boolean }) {
  if (value === null) return <span className="text-slate-500">—</span>;
  return (
    <span className={cn(
      "inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-medium",
      value >= 4 ? "bg-emerald-50 text-emerald-700" :
      value === 3 ? "bg-amber-50 text-amber-700" :
      "bg-red-50 text-red-700"
    )}>
      {value}
    </span>
  );
}

/* ── Rating Card ── */
function RatingCard({ label, rating, highlighted }: { label: string; rating: RatingValue | null; highlighted?: boolean }) {
  return (
    <div className={cn("rounded-xl border p-5 text-center", highlighted ? "border-slate-300 bg-slate-50" : "border-[#efefef] bg-white")}>
      <p className="text-xs font-medium text-slate-500 mb-2">{label}</p>
      {rating ? (
        <>
          <p className="text-3xl font-bold">{rating}<span className="text-lg text-slate-500 font-normal">/5</span></p>
          <p className={cn(
            "text-xs font-medium mt-1",
            rating >= 4 ? "text-emerald-700" : rating === 3 ? "text-amber-700" : "text-red-700"
          )}>
            {RATING_LABELS[rating].label}
          </p>
        </>
      ) : (
        <p className="text-2xl font-bold text-slate-500">—</p>
      )}
    </div>
  );
}
