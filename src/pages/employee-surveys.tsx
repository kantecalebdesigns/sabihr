import { useState } from "react";
import { ClipboardList, Star, Check, Lock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_SURVEYS,
  SURVEY_STATUS_STYLES,
  type Survey,
  type SurveyQuestion,
} from "@/lib/surveys-mock-data";

type Tab = "active" | "completed";

export default function EmployeeSurveysPage() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: "active", label: "Active Surveys" },
    { key: "completed", label: "Completed" },
  ];

  const filteredSurveys = MOCK_SURVEYS.filter((s) => s.status === activeTab);

  function handleTakeSurvey(survey: Survey) {
    setActiveSurvey(survey);
    setAnswers({});
    setSubmitted(false);
  }

  function handleBack() {
    setActiveSurvey(null);
    setAnswers({});
    setSubmitted(false);
  }

  function setAnswer(questionId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function toggleMultipleChoice(questionId: string, option: string) {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [questionId]: next };
    });
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  // --- Success state after submission ---
  if (activeSurvey && submitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-[#efefef] bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Survey Submitted
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Thank you for completing "{activeSurvey.title}". Your response has
              been recorded.
            </p>
            <button
              onClick={handleBack}
              className="mt-6 inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            >
              Back to Surveys
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Survey form ---
  if (activeSurvey) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={handleBack}
            className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            &larr; Back to Surveys
          </button>

          <div className="rounded-xl border border-[#efefef] bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {activeSurvey.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {activeSurvey.description}
            </p>
            {activeSurvey.anonymous && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="h-3.5 w-3.5" />
                Your response is anonymous
              </div>
            )}

            <div className="mt-6 space-y-6">
              {activeSurvey.questions.map((q, idx) => (
                <QuestionBlock
                  key={q.id}
                  question={q}
                  index={idx}
                  value={answers[q.id]}
                  onChange={(val) => setAnswer(q.id, val)}
                  onToggleChoice={(opt) => toggleMultipleChoice(q.id, opt)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Submit Survey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Survey list ---
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">Surveys</h1>
          <p className="mt-1 text-sm text-slate-500">
            Share your feedback through company surveys
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-6 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "-mb-px border-b-2 pb-2 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Survey cards */}
        {filteredSurveys.length === 0 ? (
          <div className="rounded-xl border border-[#efefef] bg-white px-6 py-16 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-3 text-sm font-medium text-slate-900">
              No surveys found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "active"
                ? "There are no active surveys at the moment."
                : "You haven't completed any surveys yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSurveys.map((survey) => {
              const style = SURVEY_STATUS_STYLES[survey.status];
              return (
                <div
                  key={survey.id}
                  className="rounded-xl border border-[#efefef] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {survey.title}
                        </h3>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium",
                            style.color
                          )}
                        >
                          {style.label}
                        </span>
                        {survey.anonymous && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <Lock className="h-3 w-3" />
                            Anonymous
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {survey.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        {survey.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            Deadline:{" "}
                            {new Date(survey.deadline).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        )}
                        <span>
                          {survey.responseCount}/{survey.totalRecipients}{" "}
                          responses
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {survey.status === "active" ? (
                        <button
                          onClick={() => handleTakeSurvey(survey)}
                          className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Take Survey
                        </button>
                      ) : (
                        <span className="text-sm font-medium text-blue-600">
                          View Results
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Question renderer ---

function QuestionBlock({
  question,
  index,
  value,
  onChange,
  onToggleChoice,
}: {
  question: SurveyQuestion;
  index: number;
  value: string | string[] | undefined;
  onChange: (val: string | string[]) => void;
  onToggleChoice: (option: string) => void;
}) {
  return (
    <div className="rounded-lg border border-[#efefef] bg-[#f8fafc] p-4">
      <p className="text-sm font-medium text-slate-900">
        {index + 1}. {question.text}
        {question.required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </p>

      <div className="mt-3">
        {question.type === "rating" && (
          <RatingInput
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
          />
        )}
        {question.type === "yes-no" && (
          <YesNoInput
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
          />
        )}
        {question.type === "scale" && (
          <ScaleInput
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
          />
        )}
        {question.type === "multiple-choice" && (
          <MultipleChoiceInput
            options={question.options || []}
            value={Array.isArray(value) ? value : []}
            onToggle={onToggleChoice}
          />
        )}
        {question.type === "text" && (
          <textarea
            className="w-full rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            rows={3}
            placeholder="Type your answer..."
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

function RatingInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const selected = value ? parseInt(value, 10) : 0;
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(String(n))}
          className="group"
          type="button"
        >
          <Star
            className={cn(
              "h-7 w-7 transition-colors",
              n <= selected
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300 hover:text-amber-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function YesNoInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "inline-flex h-9 items-center rounded-lg border px-5 text-sm font-medium transition-colors",
            value === opt
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-[#efefef] bg-white text-slate-500 hover:border-slate-300"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ScaleInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const selected = value ? parseInt(value, 10) : 0;
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(String(n))}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
              selected === n
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-[#efefef] bg-white text-slate-500 hover:border-slate-300"
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-slate-400">
        <span>Not at all</span>
        <span>Extremely</span>
      </div>
    </div>
  );
}

function MultipleChoiceInput({
  options,
  value,
  onToggle,
}: {
  options: string[];
  value: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = value.includes(opt);
        return (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-900"
          >
            <span
              className={cn(
                "flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors",
                checked
                  ? "border-blue-600 bg-blue-600"
                  : "border-[#efefef] bg-white"
              )}
            >
              {checked && <Check className="h-3 w-3 text-white" />}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() => onToggle(opt)}
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
}
