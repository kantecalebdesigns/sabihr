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

const APPRAISAL_LABEL: Record<string, string> = {
  "pending-self": "Awaiting self",
  "pending-manager": "Awaiting manager",
  "in-review": "In review",
  "completed": "Completed",
  "cancelled": "Cancelled",
};

export default function PerformanceReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("goals");

  const appraisal = MOCK_APPRAISALS.find((a) => a.id === id);

  if (!appraisal) {
    return (
      <div className="max-w-[1500px] py-20 text-center">
        <p className="text-base font-bold text-slate-900 tracking-tight">Appraisal not found</p>
        <Button
          variant="outline"
          className="mt-4 h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
          onClick={() => navigate("/performance/reviews")}
        >
          Back to reviews
        </Button>
      </div>
    );
  }

  const statusLabel = APPRAISAL_LABEL[appraisal.status] ?? APPRAISAL_STATUS_STYLES[appraisal.status]?.label ?? "—";
  const employeeGoals = MOCK_GOALS.filter((g) => g.ownerId === appraisal.employeeId);

  const tabs: { key: Tab; label: string; icon: typeof Target }[] = [
    { key: "goals", label: "Goals", icon: Target },
    { key: "competencies", label: "Competencies", icon: Star },
    { key: "summary", label: "Overall rating", icon: Users },
    { key: "comments", label: "Comments", icon: MessageSquare },
  ];

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      {/* Back link */}
      <button
        onClick={() => navigate("/performance/reviews")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to reviews
      </button>

      {/* Header card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <div className="flex items-start gap-4">
          <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0", paletteFor(appraisal.id))}>
            {initials(appraisal.employeeName)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {appraisal.employeeName}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {appraisal.department} <span className="text-slate-400">·</span> Manager · {appraisal.managerName}
            </p>
            <div className="flex items-center gap-3 mt-3 text-sm text-slate-600">
              <span>{statusLabel}</span>
              {appraisal.finalRating != null && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="tabular-nums">Final {appraisal.finalRating}/5</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Goals review tab */}
      {activeTab === "goals" && (
        <div className="space-y-4">
          {employeeGoals.length > 0 ? (
            <div className="space-y-3">
              {employeeGoals.map((goal) => (
                <GoalReviewCard key={goal.id} goal={goal} readOnly={appraisal.status === "completed"} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 mx-auto flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-base font-bold text-slate-900 tracking-tight">No goals assigned</p>
              <p className="text-sm text-slate-500 mt-1">There are no goals tied to this employee for the cycle.</p>
            </div>
          )}
        </div>
      )}

      {/* Competencies tab */}
      {activeTab === "competencies" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/70">
            <p className="text-sm font-semibold text-slate-900">Competency assessment</p>
            <p className="text-xs text-slate-500 mt-0.5">Rate performance across core competencies on the 1–5 scale.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Competency</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Description</th>
                  <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 w-32">Self</th>
                  <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 w-32">Manager</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_COMPETENCIES.map((comp, i) => (
                  <tr key={comp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 pl-5 pr-5 font-semibold text-slate-900 leading-tight">{comp.name}</td>
                    <td className="py-4 pr-5 text-slate-500 text-xs leading-relaxed">{comp.description}</td>
                    <td className="py-4 pr-5 text-center">
                      <RatingChip
                        value={appraisal.selfRating ? Math.min(5, Math.max(1, appraisal.selfRating + (i % 2 === 0 ? 0 : -1))) as RatingValue : null}
                      />
                    </td>
                    <td className="py-4 pr-5 text-center">
                      <RatingChip
                        value={appraisal.managerRating ? Math.min(5, Math.max(1, appraisal.managerRating + (i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : -1))) as RatingValue : null}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary tab */}
      {activeTab === "summary" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RatingCard label="Self assessment" rating={appraisal.selfRating} />
            <RatingCard label="Manager assessment" rating={appraisal.managerRating} />
            <RatingCard label="Final rating" rating={appraisal.finalRating} highlighted />
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200/70">
              <p className="text-sm font-semibold text-slate-900">Rating scale</p>
              <p className="text-xs text-slate-500 mt-0.5">How ratings are interpreted across the company.</p>
            </div>
            <div className="px-5 py-4 space-y-2">
              {([5, 4, 3, 2, 1] as RatingValue[]).map((r) => (
                <div key={r} className="flex items-baseline gap-3 py-1">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold tabular-nums shrink-0 bg-slate-100 text-slate-700">
                    {r}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{RATING_LABELS[r].label}</span>
                  <span className="text-xs text-slate-500">— {RATING_LABELS[r].description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comments tab */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-2">
            <p className="text-sm font-semibold text-slate-900">Employee comments</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {appraisal.selfReviewStatus === "submitted"
                ? "I feel I've made strong progress on my assigned goals this quarter. The key challenge was balancing project delivery with the new requirements. I'd like to focus on improving my technical leadership skills next quarter."
                : "Self-review not yet submitted."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-2">
            <p className="text-sm font-semibold text-slate-900">Manager comments</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {appraisal.managerReviewStatus === "submitted"
                ? "Strong performer who consistently delivers quality work. Demonstrated good problem-solving skills and collaboration. Recommend focusing on mentoring junior team members to develop leadership capacity."
                : "Manager review not yet submitted."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Development plan</p>
            {appraisal.status === "completed" ? (
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  Complete leadership training program by Q2 2026
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  Mentor 1–2 junior team members
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
  const [rating, setRating] = useState<RatingValue | null>(
    readOnly ? ((goal.progress >= 80 ? 4 : goal.progress >= 50 ? 3 : 2) as RatingValue) : null
  );

  const barColor = "bg-blue-600";

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-tight">{goal.title}</p>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">{goal.description}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium shrink-0">
          {goal.weight}% weight
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className={cn("h-full rounded-full", barColor)} style={{ width: `${goal.progress}%` }} />
        </div>
        <span className="text-xs font-semibold text-slate-700 w-10 text-right tabular-nums">{goal.progress}%</span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs font-medium text-slate-500">Achievement rating</span>
        <div className="flex items-center gap-1">
          {([1, 2, 3, 4, 5] as RatingValue[]).map((r) => (
            <button
              key={r}
              onClick={() => !readOnly && setRating(r)}
              className={cn(
                "w-8 h-8 rounded-md text-xs font-semibold transition-colors tabular-nums",
                rating === r
                  ? "bg-blue-600 text-white"
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

/* ── Rating Chip (for competency matrix) ── */
function RatingChip({ value }: { value: RatingValue | null }) {
  if (value === null) return <span className="text-slate-400">—</span>;
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-md text-sm font-bold tabular-nums bg-slate-100 text-slate-700">
      {value}
    </span>
  );
}

/* ── Rating Card ── */
function RatingCard({ label, rating, highlighted }: { label: string; rating: RatingValue | null; highlighted?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl border p-5 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]",
      highlighted ? "border-blue-200 bg-blue-50/40" : "border-slate-200/70 bg-white"
    )}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      {rating ? (
        <>
          <p className="text-4xl font-bold tracking-tight text-slate-900 mt-2 leading-none tabular-nums">
            {rating}<span className="text-xl text-slate-400 font-normal">/5</span>
          </p>
          <p className="text-xs font-semibold mt-2 text-slate-600">
            {RATING_LABELS[rating].label}
          </p>
        </>
      ) : (
        <p className="text-3xl font-bold text-slate-300 mt-2 leading-none">—</p>
      )}
    </div>
  );
}
