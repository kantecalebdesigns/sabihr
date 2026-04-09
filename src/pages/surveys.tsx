import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_SURVEYS,
  SURVEY_STATUS_STYLES,
} from "@/lib/surveys-mock-data";
import type { SurveyStatus } from "@/lib/surveys-mock-data";

const TABS: { value: SurveyStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Drafts" },
  { value: "completed", label: "Completed" },
];

export default function SurveysPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<SurveyStatus>("active");

  const filtered = useMemo(
    () => MOCK_SURVEYS.filter((s) => s.status === tab),
    [tab]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Surveys</h1>
        <Button onClick={() => navigate("/surveys/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Survey
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#efefef]">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2",
              tab === t.value
                ? "border-blue-600 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#efefef] p-12 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-slate-500" />
          <p className="mt-3 text-sm text-slate-500">
            No {tab} surveys
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const status = SURVEY_STATUS_STYLES[s.status];
            const pct =
              s.totalRecipients > 0
                ? Math.round((s.responseCount / s.totalRecipients) * 100)
                : 0;
            return (
              <div
                key={s.id}
                className="rounded-xl border border-[#efefef] bg-white p-5 space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-medium", status.color)}>
                      {status.label}
                    </span>
                    {s.anonymous && (
                      <span className="text-xs text-slate-500">
                        Anonymous
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold leading-snug">{s.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {s.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {s.responseCount}/{s.totalRecipients} responses
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#f8fafc]">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {s.deadline && (
                  <p className="text-xs text-slate-500">
                    Deadline:{" "}
                    {new Date(s.deadline).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}

                {s.status === "completed" && (
                  <Link
                    to={`/surveys/${s.id}/results`}
                    className="inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    View Results
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
