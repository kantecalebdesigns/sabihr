import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Check,
  Shield,
  ShieldOff,
  BarChart3,
  ClipboardList,
  Users,
  Settings2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_APPRAISALS,
  MOCK_COMPETENCIES,
  RATING_LABELS,
} from "@/lib/performance-mock-data";
import type { RatingValue } from "@/lib/performance-mock-data";

// ── Enhanced Mock Data ──

interface PeerNominee {
  id: string;
  name: string;
  department: string;
  nominated: boolean;
}

interface FeedbackRequestItem {
  id: string;
  reviewerName: string;
  status: "pending" | "submitted";
  submittedAt: string | null;
}

interface CompetencyRating {
  competency: string;
  selfRating: number;
  managerRating: number;
  peerAvg: number;
}

const MOCK_PEER_NOMINEES: PeerNominee[] = [
  { id: "pn-1", name: "Oluwaseun Afolabi", department: "Engineering", nominated: true },
  { id: "pn-2", name: "Damilola Osei", department: "Engineering", nominated: true },
  { id: "pn-3", name: "Emeka Okafor", department: "Sales", nominated: false },
  { id: "pn-4", name: "Kemi Adekunle", department: "Human Resources", nominated: true },
];

const MOCK_PENDING_REVIEWS: FeedbackRequestItem[] = [
  { id: "fr-1", reviewerName: "Oluwaseun Afolabi", status: "submitted", submittedAt: "2026-04-04" },
  { id: "fr-2", reviewerName: "Damilola Osei", status: "submitted", submittedAt: "2026-04-05" },
  { id: "fr-3", reviewerName: "Kemi Adekunle", status: "pending", submittedAt: null },
];

const MOCK_COMPETENCY_MATRIX: CompetencyRating[] = [
  { competency: "Communication", selfRating: 4, managerRating: 4, peerAvg: 3.8 },
  { competency: "Leadership", selfRating: 3, managerRating: 4, peerAvg: 3.5 },
  { competency: "Technical Skills", selfRating: 5, managerRating: 4, peerAvg: 4.2 },
  { competency: "Teamwork", selfRating: 4, managerRating: 5, peerAvg: 4.5 },
  { competency: "Problem Solving", selfRating: 4, managerRating: 3, peerAvg: 3.7 },
];

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

function ratingPill(r: number) {
  if (r >= 4) return "bg-emerald-50 text-emerald-700";
  if (r >= 3) return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
}

// ── Component ──

export default function Performance360Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<Record<string, RatingValue | null>>({});
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const appraisal = MOCK_APPRAISALS.find((a) => a.id === id);

  // If no ID param, show overview
  if (!id) {
    return <Performance360Overview />;
  }

  if (!appraisal) {
    return (
      <div className="max-w-[1500px] py-20 text-center">
        <p className="text-base font-bold text-slate-900 tracking-tight">Review not found</p>
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

  const setRating = (compId: string, value: RatingValue) => {
    setRatings((prev) => ({ ...prev, [compId]: value }));
  };

  const filledCount = Object.values(ratings).filter(Boolean).length;
  const canSubmit = filledCount === MOCK_COMPETENCIES.length && comments.trim().length > 0;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-[600px] mx-auto py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
          <Check className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Feedback submitted</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Thank you for providing feedback for {appraisal.employeeName}. Your responses are anonymous.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/performance/reviews")}
          className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
        >
          Back to reviews
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate("/performance/reviews")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to reviews
      </button>

      {/* Header */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shrink-0", paletteFor(appraisal.id))}>
            {initials(appraisal.employeeName)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">360° feedback</h1>
            <p className="text-sm text-slate-500 mt-1">
              Provide anonymous feedback for{" "}
              <span className="font-semibold text-slate-900">{appraisal.employeeName}</span>
              <span className="text-slate-400"> · </span>
              {appraisal.department}
            </p>
          </div>
        </div>
      </div>

      {/* Anonymity toggle */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            anonymous ? "bg-emerald-50" : "bg-amber-50"
          )}>
            {anonymous ? <Shield className="w-[18px] h-[18px] text-emerald-600" /> : <ShieldOff className="w-[18px] h-[18px] text-amber-600" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{anonymous ? "Anonymous mode" : "Identified mode"}</p>
            <p className="text-xs text-slate-500 mt-0.5">{anonymous ? "Your identity will be hidden from the reviewee" : "Your name will be visible on this feedback"}</p>
          </div>
        </div>
        <button
          onClick={() => setAnonymous(!anonymous)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            anonymous ? "bg-emerald-500" : "bg-slate-300"
          )}
        >
          <span className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            anonymous ? "translate-x-6" : "translate-x-1"
          )} />
        </button>
      </div>

      {/* Competency ratings */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/70">
          <p className="text-sm font-semibold text-slate-900">Competency ratings</p>
          <p className="text-xs text-slate-500 mt-0.5">Rate each competency on a scale of 1 (lowest) to 5 (highest).</p>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_COMPETENCIES.map((comp) => {
            const selected = ratings[comp.id] ?? null;
            return (
              <div key={comp.id} className="px-5 py-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{comp.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{comp.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {([1, 2, 3, 4, 5] as RatingValue[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(comp.id, r)}
                      className={cn(
                        "flex-1 h-10 rounded-lg text-sm font-semibold transition-colors tabular-nums",
                        selected === r
                          ? "bg-blue-600 text-white"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {selected && (
                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{RATING_LABELS[selected].label}</span>
                    {" — "}{RATING_LABELS[selected].description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-3">
        <p className="text-sm font-semibold text-slate-900">Additional comments</p>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Share specific examples of strengths, areas for improvement, or suggestions for development..."
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm min-h-[140px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>

      {/* Submit bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 tabular-nums">
          {filledCount} of {MOCK_COMPETENCIES.length} competencies rated
        </p>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 disabled:opacity-50"
        >
          <Send className="w-4 h-4 mr-1" />
          Submit feedback
        </Button>
      </div>
    </div>
  );
}

// ── Overview (no id param) ──

function Performance360Overview() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"requests" | "nominations" | "matrix">("requests");
  const [anonymous, setAnonymous] = useState(true);
  const [nominees, setNominees] = useState<PeerNominee[]>(MOCK_PEER_NOMINEES);

  const toggleNomination = (id: string) => {
    setNominees((prev) =>
      prev.map((n) => (n.id === id ? { ...n, nominated: !n.nominated } : n))
    );
  };

  const completed = MOCK_PENDING_REVIEWS.filter((r) => r.status === "submitted").length;
  const pending = MOCK_PENDING_REVIEWS.filter((r) => r.status === "pending").length;

  const kpis = [
    { label: "Feedback requests", value: MOCK_PENDING_REVIEWS.length, icon: ClipboardList, trend: 0 },
    { label: "Submitted", value: completed, icon: Check, trend: 2 },
    { label: "Pending", value: pending, icon: Send, trend: 0 },
    { label: "Nominated peers", value: nominees.filter((n) => n.nominated).length, icon: Users, trend: 1 },
  ];

  const sections = [
    { key: "requests" as const, label: "Feedback requests", count: MOCK_PENDING_REVIEWS.length },
    { key: "nominations" as const, label: "Peer nominations", count: nominees.length },
    { key: "matrix" as const, label: "Competency matrix", count: MOCK_COMPETENCY_MATRIX.length },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">360° feedback</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Manage peer reviews, nominations, and competency analysis — gather a multi-rater view of
            performance from peers, managers, and direct reports.
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
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none tabular-nums">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Anonymity setting */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            anonymous ? "bg-emerald-50" : "bg-amber-50"
          )}>
            {anonymous ? <Shield className="w-[18px] h-[18px] text-emerald-600" /> : <ShieldOff className="w-[18px] h-[18px] text-amber-600" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Anonymity {anonymous ? "enabled" : "disabled"}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {anonymous ? "All peer feedback is anonymous." : "Reviewer names are visible to the reviewee."}
            </p>
          </div>
        </div>
        <button
          onClick={() => setAnonymous(!anonymous)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            anonymous ? "bg-emerald-500" : "bg-slate-300"
          )}
        >
          <span className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            anonymous ? "translate-x-6" : "translate-x-1"
          )} />
        </button>
      </div>

      {/* Section chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {sections.map((s) => {
          const active = activeSection === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {s.label}
              <span className={cn("text-xs", active ? "text-white/80" : "text-slate-400")}>{s.count}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback requests */}
      {activeSection === "requests" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">Feedback requests</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                {MOCK_PENDING_REVIEWS.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Reviewer</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PENDING_REVIEWS.map((req) => {
                  const isSubmitted = req.status === "submitted";
                  return (
                    <tr key={req.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 pl-5 pr-5">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0", paletteFor(req.id))}>
                            {initials(req.reviewerName)}
                          </div>
                          <p className="font-semibold text-slate-900 leading-tight">{req.reviewerName}</p>
                        </div>
                      </td>
                      <td className="py-4 pr-5">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                          isSubmitted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", isSubmitted ? "bg-emerald-500" : "bg-amber-500")} />
                          {isSubmitted ? "Submitted" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4 pr-5 text-slate-600 text-xs tabular-nums">{req.submittedAt ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Peer nominations */}
      {activeSection === "nominations" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
            <div>
              <p className="text-sm font-semibold text-slate-900">Peer nominations</p>
              <p className="text-xs text-slate-500 mt-0.5">Select colleagues to review your performance.</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {nominees.map((peer) => (
              <label key={peer.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={peer.nominated}
                  onChange={() => toggleNomination(peer.id)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0", paletteFor(peer.id))}>
                  {initials(peer.name)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 leading-tight">{peer.name}</p>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">{peer.department}</p>
                </div>
                {peer.nominated && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Nominated
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Competency matrix */}
      {activeSection === "matrix" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
              <div>
                <p className="text-sm font-semibold text-slate-900">Competency ratings</p>
                <p className="text-xs text-slate-500 mt-0.5">Self, manager, and peer averages side-by-side.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200/70">
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Competency</th>
                    <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Self</th>
                    <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Manager</th>
                    <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Peer avg</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_COMPETENCY_MATRIX.map((row) => (
                    <tr key={row.competency} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 pl-5 pr-5 font-semibold text-slate-900">{row.competency}</td>
                      <td className="py-4 pr-5 text-center">
                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tabular-nums", ratingPill(row.selfRating))}>
                          {row.selfRating}/5
                        </span>
                      </td>
                      <td className="py-4 pr-5 text-center">
                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tabular-nums", ratingPill(row.managerRating))}>
                          {row.managerRating}/5
                        </span>
                      </td>
                      <td className="py-4 pr-5 text-center">
                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tabular-nums", ratingPill(row.peerAvg))}>
                          {row.peerAvg.toFixed(1)}/5
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bar comparison */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
            <div className="px-5 py-4 border-b border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <p className="text-sm font-semibold text-slate-900">Self-assessment vs peer average</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                  Self
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  Peer avg
                </div>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              {MOCK_COMPETENCY_MATRIX.map((row) => (
                <div key={row.competency} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-700">{row.competency}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${(row.selfRating / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-8 text-right tabular-nums">{row.selfRating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(row.peerAvg / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-8 text-right tabular-nums">{row.peerAvg.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
