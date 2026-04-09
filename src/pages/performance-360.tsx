import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_APPRAISALS,
  MOCK_COMPETENCIES,
  RATING_LABELS,
} from "@/lib/performance-mock-data";
import type { RatingValue } from "@/lib/performance-mock-data";

export default function Performance360Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<Record<string, RatingValue | null>>({});
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const appraisal = MOCK_APPRAISALS.find((a) => a.id === id);

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
