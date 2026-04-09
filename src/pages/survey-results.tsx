import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_SURVEYS } from "@/lib/surveys-mock-data";
import type { SurveyQuestion } from "@/lib/surveys-mock-data";

// Simple inline mock results keyed by question type
function MockResult({ question }: { question: SurveyQuestion }) {
  switch (question.type) {
    case "rating": {
      const avg = 4.2;
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium">Average: {avg}/5</p>
          <div className="h-2 w-full max-w-xs rounded-full bg-[#f8fafc]">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${(avg / 5) * 100}%` }}
            />
          </div>
        </div>
      );
    }
    case "scale": {
      const avg = 3.8;
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium">Average: {avg}/5</p>
          <div className="h-2 w-full max-w-xs rounded-full bg-[#f8fafc]">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${(avg / 5) * 100}%` }}
            />
          </div>
        </div>
      );
    }
    case "multiple-choice": {
      const options = question.options ?? [];
      // Mock counts
      const counts = [7, 5, 3, 2, 1].slice(0, options.length);
      const max = Math.max(...counts);
      return (
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={opt} className="space-y-0.5">
              <div className="flex items-center justify-between text-sm">
                <span>{opt}</span>
                <span className="text-slate-500">{counts[i]}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#f8fafc]">
                <div
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${(counts[i] / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }
    case "yes-no": {
      const yPct = 72;
      return (
        <div className="flex items-center gap-6 text-sm">
          <span>
            <span className="font-medium text-emerald-700">Yes</span>{" "}
            <span className="text-slate-500">{yPct}%</span>
          </span>
          <span>
            <span className="font-medium text-red-700">No</span>{" "}
            <span className="text-slate-500">{100 - yPct}%</span>
          </span>
        </div>
      );
    }
    case "text":
      return (
        <div className="space-y-2">
          {[
            "Great team culture and supportive management.",
            "Would appreciate more flexible work hours.",
            "Overall happy, but onboarding could improve.",
          ].map((r, i) => (
            <p key={i} className="rounded-lg bg-[#f8fafc] px-3 py-2 text-sm">
              {r}
            </p>
          ))}
        </div>
      );
    default:
      return null;
  }
}

const TYPE_LABELS: Record<string, string> = {
  rating: "Rating",
  scale: "Scale",
  "multiple-choice": "Multiple Choice",
  "yes-no": "Yes / No",
  text: "Free Text",
};

export default function SurveyResultsPage() {
  const { id } = useParams<{ id: string }>();
  const survey = MOCK_SURVEYS.find((s) => s.id === id);

  if (!survey) {
    return (
      <div className="space-y-4">
        <Link
          to="/surveys"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Surveys
        </Link>
        <p className="text-slate-500">Survey not found.</p>
      </div>
    );
  }

  const pct =
    survey.totalRecipients > 0
      ? Math.round((survey.responseCount / survey.totalRecipients) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        to="/surveys"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Surveys
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">{survey.title}</h1>

      {/* Response rate card */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-2">
        <h2 className="text-sm font-semibold">Response Rate</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {survey.responseCount} of {survey.totalRecipients} recipients
          </span>
          <span className="font-medium">{pct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#f8fafc]">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {survey.questions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-xl border border-[#efefef] bg-white p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold">
                {idx + 1}. {q.text}
              </h3>
              <span className="shrink-0 text-xs text-slate-500">
                {TYPE_LABELS[q.type] ?? q.type}
              </span>
            </div>
            <MockResult question={q} />
          </div>
        ))}
      </div>
    </div>
  );
}
