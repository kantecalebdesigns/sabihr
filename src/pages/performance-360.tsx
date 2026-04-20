import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Check,
  Shield,
  ShieldOff,
  BarChart3,
  Star,
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

// ── Component ──

export default function Performance360Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<Record<string, RatingValue | null>>({});
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const appraisal = MOCK_APPRAISALS.find((a) => a.id === id);

  // If no ID param, show the enhanced overview
  if (!id) {
    return <Performance360Overview />;
  }

  if (!appraisal) {
    return (
      <div className="max-w-[1400px] mx-auto py-20 text-center">
        <p className="font-medium text-slate-900">Review not found</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/performance/reviews")}>
          Back to Reviews
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
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <Check className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold">Feedback Submitted</h2>
        <p className="text-sm text-slate-500">
          Thank you for providing feedback for {appraisal.employeeName}. Your responses are anonymous.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate("/performance/reviews")}>
          Back to Reviews
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/performance/reviews")}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reviews
      </button>

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">360 Feedback</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Provide anonymous feedback for <span className="font-medium text-slate-900">{appraisal.employeeName}</span> &middot; {appraisal.department}
        </p>
      </div>

      {/* Anonymity Toggle */}
      <div className="rounded-xl border border-[#efefef] bg-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {anonymous ? <Shield className="w-5 h-5 text-emerald-600" /> : <ShieldOff className="w-5 h-5 text-amber-600" />}
          <div>
            <p className="text-sm font-medium text-slate-900">{anonymous ? "Anonymous Mode" : "Identified Mode"}</p>
            <p className="text-xs text-slate-500">{anonymous ? "Your identity will be hidden from the reviewee" : "Your name will be visible on this feedback"}</p>
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

      <div className="rounded-xl border border-[#efefef] bg-white p-4 text-sm text-slate-500">
        Your feedback is completely anonymous. Rate each competency honestly and provide constructive comments to help your colleague grow.
      </div>

      {/* Competency Ratings */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold">Competency Ratings</h2>
        <div className="space-y-3">
          {MOCK_COMPETENCIES.map((comp) => {
            const selected = ratings[comp.id] ?? null;
            return (
              <div key={comp.id} className="rounded-xl border border-[#efefef] bg-white p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium">{comp.name}</p>
                  <p className="text-xs text-slate-500">{comp.description}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {([1, 2, 3, 4, 5] as RatingValue[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(comp.id, r)}
                      className={cn(
                        "flex-1 py-2 rounded-md text-xs font-medium transition-colors",
                        selected === r
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {selected && (
                  <p className="text-xs text-slate-500">{RATING_LABELS[selected].label}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Additional Comments</h2>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Share specific examples of strengths, areas for improvement, or suggestions for development..."
          className="w-full rounded-xl border border-[#efefef] bg-white p-4 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>

      {/* Progress + Submit */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-500">{filledCount} of {MOCK_COMPETENCIES.length} competencies rated</p>
        <Button size="sm" onClick={handleSubmit} disabled={!canSubmit}>
          <Send className="w-4 h-4 mr-2" />
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}

// ── Enhanced 360 Overview (no id param) ──

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

  const sections = [
    { key: "requests" as const, label: "Feedback Requests" },
    { key: "nominations" as const, label: "Peer Nominations" },
    { key: "matrix" as const, label: "Competency Matrix" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">360-Degree Feedback</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f0f4f8] text-xs font-medium text-slate-500">
              <Star className="w-3.5 h-3.5" />
              360°
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Manage peer reviews, nominations, and competency analysis</p>
        </div>
        <button
          onClick={() => { localStorage.removeItem("sabi-hr-performance-system"); navigate("/performance"); }}
          className="h-8 rounded-lg border border-[#efefef] bg-white px-3 text-xs font-medium text-slate-700 hover:bg-[#f8fafc] transition-colors"
        >
          Change System
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500">Feedback Requests</p>
          <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">{MOCK_PENDING_REVIEWS.length}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500">Completed</p>
          <p className="text-2xl font-bold tracking-[-0.6px] text-emerald-700">{MOCK_PENDING_REVIEWS.filter((r) => r.status === "submitted").length}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500">Pending</p>
          <p className="text-2xl font-bold tracking-[-0.6px] text-amber-700">{MOCK_PENDING_REVIEWS.filter((r) => r.status === "pending").length}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500">Nominated Peers</p>
          <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">{nominees.filter((n) => n.nominated).length}</p>
        </div>
      </div>

      {/* Anonymity Setting */}
      <div className="rounded-xl border border-[#efefef] bg-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {anonymous ? <Shield className="w-5 h-5 text-emerald-600" /> : <ShieldOff className="w-5 h-5 text-amber-600" />}
          <div>
            <p className="text-sm font-medium text-slate-900">Anonymity: {anonymous ? "Enabled" : "Disabled"}</p>
            <p className="text-xs text-slate-500">{anonymous ? "All peer feedback is anonymous" : "Reviewer names are visible to the reviewee"}</p>
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

      {/* Section Tabs */}
      <div className="flex gap-1 border-b border-[#efefef]">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeSection === s.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Feedback Requests ── */}
      {activeSection === "requests" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="p-3 text-left text-xs font-medium text-slate-500">Reviewer</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PENDING_REVIEWS.map((req) => (
                <tr key={req.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-medium text-slate-900">{req.reviewerName}</td>
                  <td className="p-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                      req.status === "submitted"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {req.status === "submitted" ? "Submitted" : "Pending"}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{req.submittedAt ?? "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Peer Nominations ── */}
      {activeSection === "nominations" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Select colleagues to nominate as reviewers for your 360-degree feedback.</p>
          <div className="rounded-xl border border-[#efefef] bg-white divide-y divide-[#efefef]">
            {nominees.map((peer) => (
              <label key={peer.id} className="flex items-center gap-4 p-4 hover:bg-[#f8fafc] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={peer.nominated}
                  onChange={() => toggleNomination(peer.id)}
                  className="rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{peer.name}</p>
                  <p className="text-xs text-slate-500">{peer.department}</p>
                </div>
                {peer.nominated && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                    Nominated
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Competency Matrix ── */}
      {activeSection === "matrix" && (
        <div className="space-y-6">
          {/* Table */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Competency</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500">Self</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500">Manager</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500">Peer Avg</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_COMPETENCY_MATRIX.map((row) => (
                  <tr key={row.competency} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-medium text-slate-900">{row.competency}</td>
                    <td className="p-3 text-center text-slate-700">{row.selfRating}/5</td>
                    <td className="p-3 text-center text-slate-700">{row.managerRating}/5</td>
                    <td className="p-3 text-center text-slate-700">{row.peerAvg.toFixed(1)}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Comparison */}
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">Self-Assessment vs Peer Average</h3>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span>Self Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span>Peer Average</span>
              </div>
            </div>
            {MOCK_COMPETENCY_MATRIX.map((row) => (
              <div key={row.competency} className="space-y-1">
                <p className="text-xs font-medium text-slate-700">{row.competency}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 rounded bg-blue-500" style={{ width: `${(row.selfRating / 5) * 100}%` }} />
                    <span className="text-xs text-slate-500 w-8">{row.selfRating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 rounded bg-emerald-500" style={{ width: `${(row.peerAvg / 5) * 100}%` }} />
                    <span className="text-xs text-slate-500 w-8">{row.peerAvg.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
