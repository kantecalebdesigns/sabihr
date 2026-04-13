import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Check,
  Copy,
  Type,
  ListChecks,
  Star,
  ThumbsUp,
  Hash,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { QuestionType } from "@/lib/surveys-mock-data";

interface QuestionDraft {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options: string[];
}

type SurveyAudienceType = "all" | "departments" | "specific";

interface SurveyAudience {
  type: SurveyAudienceType;
  departments: string[];
  employees: string[];
}

const SURVEY_DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Operations", "Legal", "IT"];
const SURVEY_DEPT_SIZE: Record<string, number> = {
  Engineering: 25,
  Sales: 18,
  Marketing: 12,
  Finance: 10,
  HR: 8,
  Operations: 15,
  Legal: 6,
  IT: 14,
};
const SURVEY_MOCK_EMPLOYEES = [
  { id: "emp-001", name: "Adebayo Ogunlesi", department: "Engineering" },
  { id: "emp-002", name: "Oluwaseun Afolabi", department: "Engineering" },
  { id: "emp-003", name: "Emeka Okafor", department: "Sales" },
  { id: "emp-004", name: "Fatima Abdullahi", department: "HR" },
  { id: "emp-005", name: "Bukola Adeyemi", department: "Marketing" },
  { id: "emp-006", name: "Aisha Mohammed", department: "Finance" },
  { id: "emp-007", name: "Ibrahim Musa", department: "Operations" },
  { id: "emp-008", name: "Halima Yusuf", department: "Legal" },
];
const SURVEY_TOTAL_EMPLOYEES = 108;

const QUESTION_TYPES: { value: QuestionType; label: string; icon: typeof Type }[] = [
  { value: "multiple-choice", label: "Multiple Choice", icon: ListChecks },
  { value: "rating", label: "Rating (1-5)", icon: Star },
  { value: "text", label: "Free Text", icon: Type },
  { value: "yes-no", label: "Yes / No", icon: ThumbsUp },
  { value: "scale", label: "Scale (1-10)", icon: Hash },
];

let nextId = 1;
function genId() {
  return `q-new-${nextId++}`;
}

export default function SurveyCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [audience, setAudience] = useState<SurveyAudience>({
    type: "all",
    departments: [],
    employees: [],
  });
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    { id: genId(), text: "", type: "multiple-choice", required: true, options: ["Option 1", "Option 2"] },
  ]);
  const [saved, setSaved] = useState(false);

  const filteredEmployees = useMemo(() => {
    if (!employeeSearch) return SURVEY_MOCK_EMPLOYEES;
    const q = employeeSearch.toLowerCase();
    return SURVEY_MOCK_EMPLOYEES.filter(
      (e) => e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)
    );
  }, [employeeSearch]);

  const recipientCount = useMemo(() => {
    switch (audience.type) {
      case "all":
        return SURVEY_TOTAL_EMPLOYEES;
      case "departments":
        return audience.departments.reduce((sum, d) => sum + (SURVEY_DEPT_SIZE[d] || 0), 0);
      case "specific":
        return audience.employees.length;
    }
  }, [audience]);

  const toggleDepartment = (dept: string) => {
    setAudience((prev) => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter((d) => d !== dept)
        : [...prev.departments, dept],
    }));
  };

  const toggleEmployee = (empId: string) => {
    setAudience((prev) => ({
      ...prev,
      employees: prev.employees.includes(empId)
        ? prev.employees.filter((id) => id !== empId)
        : [...prev.employees, empId],
    }));
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { id: genId(), text: "", type: "multiple-choice", required: false, options: ["Option 1"] }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const duplicateQuestion = (id: string) => {
    const source = questions.find((q) => q.id === id);
    if (source) {
      const dupe: QuestionDraft = { ...source, id: genId(), options: [...source.options] };
      const idx = questions.findIndex((q) => q.id === id);
      setQuestions((prev) => [...prev.slice(0, idx + 1), dupe, ...prev.slice(idx + 1)]);
    }
  };

  const updateQuestion = (id: string, updates: Partial<QuestionDraft>) => {
    setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, ...updates } : q));
  };

  const updateOption = (qId: string, optIdx: number, value: string) => {
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== qId) return q;
      const opts = [...q.options];
      opts[optIdx] = value;
      return { ...q, options: opts };
    }));
  };

  const addOption = (qId: string) => {
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== qId) return q;
      return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
    }));
  };

  const removeOption = (qId: string, optIdx: number) => {
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== qId) return q;
      return { ...q, options: q.options.filter((_, i) => i !== optIdx) };
    }));
  };

  const handleSave = () => {
    setSaved(true);
  };

  const hasOptions = (type: QuestionType) => type === "multiple-choice";

  if (saved) {
    return (
      <div className="max-w-[600px] mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <Check className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold">Survey Created</h2>
        <p className="text-sm text-slate-500">
          Your survey has been created with {questions.length} question{questions.length !== 1 ? "s" : ""}. You can publish it from the surveys dashboard.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate("/surveys")}>
          Back to Surveys
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6 pb-12">
      {/* Back */}
      <button onClick={() => navigate("/surveys")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Surveys
      </button>

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Create Survey</h1>
        <p className="text-sm text-slate-500">Build your survey by adding questions below</p>
      </div>

      {/* Survey Settings */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Survey Title</label>
          <Input placeholder="e.g. Employee Satisfaction Survey Q2 2026" value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description</label>
          <Input placeholder="Brief description of what this survey is about" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Deadline</label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <button
                onClick={() => setAnonymous(!anonymous)}
                className={cn(
                  "w-9 h-5 rounded-full transition-colors relative",
                  anonymous ? "bg-emerald-500" : "bg-slate-200"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                  anonymous ? "left-[18px]" : "left-0.5"
                )} />
              </button>
              Anonymous responses
            </label>
          </div>
        </div>
      </div>

      {/* Audience Section */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Audience</h2>
        <div className="flex flex-wrap gap-3">
          {([
            { value: "all" as SurveyAudienceType, label: "All Employees" },
            { value: "departments" as SurveyAudienceType, label: "By Department" },
            { value: "specific" as SurveyAudienceType, label: "Specific Employees" },
          ]).map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="surveyAudienceType"
                value={opt.value}
                checked={audience.type === opt.value}
                onChange={() => setAudience({ type: opt.value, departments: [], employees: [] })}
                className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Department checkboxes */}
        {audience.type === "departments" && (
          <div className="rounded-lg border border-[#efefef] p-3 space-y-2">
            <p className="text-xs font-medium text-slate-500 mb-2">Select departments</p>
            <div className="grid grid-cols-2 gap-2">
              {SURVEY_DEPARTMENTS.map((dept) => (
                <label key={dept} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audience.departments.includes(dept)}
                    onChange={() => toggleDepartment(dept)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{dept}</span>
                  <span className="text-xs text-slate-400">({SURVEY_DEPT_SIZE[dept]})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Specific employees */}
        {audience.type === "specific" && (
          <div className="rounded-lg border border-[#efefef] p-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#efefef] bg-white pl-9 pr-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredEmployees.map((emp) => (
                <label key={emp.id} className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={audience.employees.includes(emp.id)}
                    onChange={() => toggleEmployee(emp.id)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{emp.name}</span>
                  <span className="text-xs text-slate-400">{emp.department}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Recipient count */}
        <p className="text-xs text-slate-500">
          Estimated recipients: <span className="font-medium text-slate-700">{recipientCount}</span> employee{recipientCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, qIdx) => {
          return (
            <div key={q.id} className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
              {/* Question header */}
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-1 pt-2 text-slate-500">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-xs font-medium w-5">{qIdx + 1}</span>
                </div>
                <div className="flex-1 space-y-3">
                  {/* Question text */}
                  <Input
                    placeholder="Question text..."
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                    className="text-sm font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                  />

                  {/* Type selector */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {QUESTION_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => updateQuestion(q.id, { type: type.value })}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                            q.type === type.value
                              ? "bg-slate-900 text-white"
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          <Icon className="w-3 h-3" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Options (for multiple choice) */}
                  {hasOptions(q.type) && (
                    <div className="space-y-2 pl-1">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                          <Input
                            value={opt}
                            onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                            className="h-8 text-sm flex-1"
                          />
                          {q.options.length > 1 && (
                            <button onClick={() => removeOption(q.id, optIdx)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => addOption(q.id)} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 pl-6">
                        <Plus className="w-3 h-3" />
                        Add option
                      </button>
                    </div>
                  )}

                  {/* Rating/Scale preview */}
                  {q.type === "rating" && (
                    <div className="flex items-center gap-1 pl-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-xs text-slate-400">{n}</span>
                      ))}
                    </div>
                  )}
                  {q.type === "scale" && (
                    <div className="flex items-center gap-3 pl-1 text-xs text-slate-500">
                      <span>1</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100" />
                      <span>10</span>
                    </div>
                  )}
                  {q.type === "yes-no" && (
                    <div className="flex items-center gap-2 pl-1">
                      <span className="px-3 py-1.5 rounded-md bg-slate-50 text-xs text-slate-500">Yes</span>
                      <span className="px-3 py-1.5 rounded-md bg-slate-50 text-xs text-slate-500">No</span>
                    </div>
                  )}
                  {q.type === "text" && (
                    <div className="pl-1">
                      <div className="h-16 rounded-md border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-500">
                        Free text response area
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Question footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#efefef]">
                <div className="flex items-center gap-2">
                  <button onClick={() => duplicateQuestion(q.id)} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </button>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(q.id)} className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <button
                    onClick={() => updateQuestion(q.id, { required: !q.required })}
                    className={cn(
                      "w-8 h-[18px] rounded-full transition-colors relative",
                      q.required ? "bg-blue-500" : "bg-slate-200"
                    )}
                  >
                    <span className={cn(
                      "absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform shadow-sm",
                      q.required ? "left-[16px]" : "left-[2px]"
                    )} />
                  </button>
                  <span className="text-slate-500">Required</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Question */}
      <button
        onClick={addQuestion}
        className="w-full rounded-xl border border-dashed border-[#efefef] p-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Question
      </button>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#efefef]">
        <p className="text-xs text-slate-500">{questions.length} question{questions.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/surveys")}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim() || questions.length === 0}>
            Create Survey
          </Button>
        </div>
      </div>
    </div>
  );
}
