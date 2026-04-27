import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ClipboardList,
  FileText,
  Plus,
  X,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  MOCK_APPRAISALS,
  APPRAISAL_STATUS_STYLES,
} from "@/lib/performance-mock-data";

// ── Types ──

interface ReviewTemplate {
  id: string;
  name: string;
  type: "Annual" | "Quarterly" | "Probation";
  sectionsCount: number;
  status: "active" | "draft";
}

interface TemplateSection {
  name: string;
  weight: number;
}

interface CalibrationRow {
  employeeName: string;
  department: string;
  manager: string;
  selfRating: number | null;
  managerRating: number | null;
  preliminaryRating: number | null;
  calibratedRating: number | null;
}

// ── Mock Data ──

const MOCK_TEMPLATES: ReviewTemplate[] = [
  { id: "tpl-1", name: "Annual Performance Review", type: "Annual", sectionsCount: 5, status: "active" },
  { id: "tpl-2", name: "Quarterly Check-In", type: "Quarterly", sectionsCount: 3, status: "active" },
  { id: "tpl-3", name: "Probation Assessment", type: "Probation", sectionsCount: 4, status: "draft" },
];

const MOCK_CALIBRATION: CalibrationRow[] = [
  { employeeName: "Adebayo Ogunlesi", department: "Engineering", manager: "Chiamaka Eze", selfRating: 4, managerRating: 4, preliminaryRating: 4, calibratedRating: 4 },
  { employeeName: "Oluwaseun Afolabi", department: "Engineering", manager: "Chiamaka Eze", selfRating: 5, managerRating: 4, preliminaryRating: 5, calibratedRating: 4 },
  { employeeName: "Emeka Okafor", department: "Sales", manager: "Ngozi Ibe", selfRating: 3, managerRating: 3, preliminaryRating: 3, calibratedRating: 3 },
  { employeeName: "Aisha Mohammed", department: "Finance", manager: "Chibueze Okoro", selfRating: 4, managerRating: null, preliminaryRating: null, calibratedRating: null },
  { employeeName: "Bukola Adeyemi", department: "Marketing", manager: "CEO", selfRating: 4, managerRating: 5, preliminaryRating: 5, calibratedRating: 4 },
  { employeeName: "Kemi Adekunle", department: "Human Resources", manager: "Fatima Abdullahi", selfRating: 3, managerRating: null, preliminaryRating: null, calibratedRating: null },
  { employeeName: "Usman Bello", department: "IT", manager: "Ibrahim Musa", selfRating: null, managerRating: null, preliminaryRating: null, calibratedRating: null },
  { employeeName: "Amara Obi", department: "Marketing", manager: "Bukola Adeyemi", selfRating: 4, managerRating: 4, preliminaryRating: 4, calibratedRating: 4 },
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

const APPRAISAL_LABEL: Record<string, string> = {
  "pending-self": "Awaiting self",
  "pending-manager": "Awaiting manager",
  "in-review": "In review",
  "completed": "Completed",
  "cancelled": "Cancelled",
};

const REVIEW_STATE_LABEL: Record<"pending" | "submitted", string> = {
  pending: "Pending",
  submitted: "Submitted",
};

const TEMPLATE_TYPE_PILL: Record<ReviewTemplate["type"], string> = {
  Annual: "bg-blue-50 text-blue-700",
  Quarterly: "bg-violet-50 text-violet-700",
  Probation: "bg-amber-50 text-amber-700",
};

function ratingPill(_rating: number): string {
  return "bg-slate-100 text-slate-700";
}

// ── Component ──

export default function PerformanceReviewsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [activeView, setActiveView] = useState<"appraisals" | "templates" | "cycle" | "calibration">("appraisals");
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  // Template form state
  const [tplName, setTplName] = useState("");
  const [tplType, setTplType] = useState<"Annual" | "Quarterly" | "Probation">("Annual");
  const [tplSections, setTplSections] = useState<TemplateSection[]>([
    { name: "", weight: 0 },
  ]);

  const departments = useMemo(
    () => [...new Set(MOCK_APPRAISALS.map((a) => a.department))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return MOCK_APPRAISALS.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        a.employeeName.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        a.managerName.toLowerCase().includes(q);
      const matchesDept =
        departmentFilter === "all" || a.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [search, departmentFilter]);

  const counts = useMemo(() => {
    const c = { total: MOCK_APPRAISALS.length, completed: 0, pendingSelf: 0, pendingManager: 0 };
    MOCK_APPRAISALS.forEach((a) => {
      if (a.status === "completed") c.completed++;
      else if (a.status === "pending-self") c.pendingSelf++;
      else if (a.status === "pending-manager") c.pendingManager++;
    });
    return c;
  }, []);

  const kpis = [
    { label: "Total appraisals", value: counts.total, icon: ClipboardList, trend: 2 },
    { label: "Completed", value: counts.completed, icon: CheckCircle2, trend: 4 },
    { label: "Awaiting self review", value: counts.pendingSelf, icon: Clock, trend: 0 },
    { label: "Awaiting manager", value: counts.pendingManager, icon: Users, trend: 0 },
  ];

  const addSection = () => {
    setTplSections((prev) => [...prev, { name: "", weight: 0 }]);
  };

  const updateSection = (index: number, field: keyof TemplateSection, value: string | number) => {
    setTplSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const resetTemplateForm = () => {
    setTplName("");
    setTplType("Annual");
    setTplSections([{ name: "", weight: 0 }]);
    setShowTemplateForm(false);
  };

  const views = [
    { key: "appraisals" as const, label: "Appraisals", count: MOCK_APPRAISALS.length },
    { key: "templates" as const, label: "Templates", count: MOCK_TEMPLATES.length },
    { key: "cycle" as const, label: "Cycle", count: 1 },
    { key: "calibration" as const, label: "Calibration", count: MOCK_CALIBRATION.length },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reviews</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Manage appraisals, review templates, and rating calibration — keep the active review
            cycle moving and visible across teams.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {activeView === "templates" && (
            <Button
              onClick={() => (showTemplateForm ? resetTemplateForm() : setShowTemplateForm(true))}
              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
            >
              {showTemplateForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
              {showTemplateForm ? "Cancel" : "New template"}
            </Button>
          )}
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

      {/* View chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {views.map((v) => {
          const active = activeView === v.key;
          return (
            <button
              key={v.key}
              onClick={() => setActiveView(v.key)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {v.label}
              <span className={cn("text-xs", active ? "text-white/80" : "text-slate-400")}>{v.count}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════ APPRAISALS VIEW ═══════ */}
      {activeView === "appraisals" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">Appraisals</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search employees, managers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Employee</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Department</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Manager</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Self review</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Manager review</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Final rating</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appraisal) => {
                  const statusLabel = APPRAISAL_LABEL[appraisal.status] ?? APPRAISAL_STATUS_STYLES[appraisal.status]?.label ?? "—";
                  return (
                    <tr
                      key={appraisal.id}
                      onClick={() => navigate(`/performance/reviews/${appraisal.id}`)}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                    >
                      <td className="py-4 pl-5 pr-5">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0", paletteFor(appraisal.id))}>
                            {initials(appraisal.employeeName)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{appraisal.employeeName}</p>
                            <p className="text-xs text-slate-500 leading-tight mt-0.5">{appraisal.id.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {appraisal.department}
                        </span>
                      </td>
                      <td className="py-4 pr-5 text-slate-600">{appraisal.managerName}</td>
                      <td className="py-4 pr-5 text-sm text-slate-600">{REVIEW_STATE_LABEL[appraisal.selfReviewStatus]}</td>
                      <td className="py-4 pr-5 text-sm text-slate-600">{REVIEW_STATE_LABEL[appraisal.managerReviewStatus]}</td>
                      <td className="py-4 pr-5">
                        {appraisal.finalRating ? (
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tabular-nums", ratingPill(appraisal.finalRating))}>
                            {appraisal.finalRating}/5
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-4 pr-5 text-sm text-slate-600">{statusLabel}</td>
                      <td className="py-4 pr-5">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 mx-auto flex items-center justify-center mb-3">
                        <ClipboardList className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-base font-bold text-slate-900 tracking-tight">No appraisals found</p>
                      <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════ TEMPLATES VIEW ═══════ */}
      {activeView === "templates" && (
        <div className="space-y-5">
          {showTemplateForm && (
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileText className="w-[18px] h-[18px] text-blue-600" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900 tracking-tight">New review template</p>
                    <p className="text-xs text-slate-500 mt-0.5">Define sections and their weights for this appraisal.</p>
                  </div>
                </div>
                <button
                  onClick={resetTemplateForm}
                  className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Template name</label>
                    <Input value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="e.g. Annual Performance Review" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Type</label>
                    <Select value={tplType} onValueChange={(v) => setTplType(v as "Annual" | "Quarterly" | "Probation")}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Annual">Annual</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Probation">Probation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-500">Sections</label>
                    <button onClick={addSection} className="text-[11px] font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add section
                    </button>
                  </div>
                  {tplSections.map((section, i) => (
                    <div key={i} className="flex gap-3">
                      <Input
                        value={section.name}
                        onChange={(e) => updateSection(i, "name", e.target.value)}
                        placeholder={`Section ${i + 1} name`}
                        className="flex-1"
                      />
                      <div className="w-28">
                        <Input
                          type="number"
                          value={section.weight || ""}
                          onChange={(e) => updateSection(i, "weight", Number(e.target.value))}
                          placeholder="Weight %"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={resetTemplateForm}
                  className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={resetTemplateForm}
                  className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
                >
                  Create template
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">Review templates</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                  {MOCK_TEMPLATES.length}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200/70">
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Template</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Type</th>
                    <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Sections</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TEMPLATES.map((tpl) => (
                    <tr key={tpl.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 pl-5 pr-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <FileText className="w-[18px] h-[18px] text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{tpl.name}</p>
                            <p className="text-xs text-slate-500 leading-tight mt-0.5">{tpl.id.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-5">
                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium", TEMPLATE_TYPE_PILL[tpl.type])}>
                          {tpl.type}
                        </span>
                      </td>
                      <td className="py-4 pr-5 text-right font-semibold text-slate-900 tabular-nums">{tpl.sectionsCount}</td>
                      <td className="py-4 pr-5 text-sm text-slate-600">
                        {tpl.status === "active" ? "Active" : "Draft"}
                      </td>
                      <td className="py-4 pr-5">
                        <button className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ CYCLE VIEW ═══════ */}
      {activeView === "cycle" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Calendar className="w-[18px] h-[18px] text-blue-600" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 tracking-tight">Q1 2026 performance review</p>
                <p className="text-xs text-slate-500 mt-0.5">Active cycle</p>
              </div>
            </div>
            <span className="text-sm text-slate-600">Active</span>
          </div>
          <div className="px-5 py-5 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Start date</p>
                <p className="text-base font-bold text-slate-900 tracking-tight mt-1 tabular-nums">Jan 1, 2026</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">End date</p>
                <p className="text-base font-bold text-slate-900 tracking-tight mt-1 tabular-nums">Mar 31, 2026</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Self review deadline</p>
                <p className="text-base font-bold text-slate-900 tracking-tight mt-1 tabular-nums">Apr 7, 2026</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Manager review deadline</p>
                <p className="text-base font-bold text-slate-900 tracking-tight mt-1 tabular-nums">Apr 14, 2026</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Completion</span>
                <span className="font-semibold text-slate-900 tabular-nums">6 / 20 employees · 30%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: "30%" }} />
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 flex items-center gap-2.5">
              <Users className="w-4 h-4 text-slate-500" />
              <p className="text-sm text-slate-700">14 employees pending review</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ CALIBRATION VIEW ═══════ */}
      {activeView === "calibration" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
            <div>
              <p className="text-sm font-semibold text-slate-900">Calibration</p>
              <p className="text-xs text-slate-500 mt-0.5">Review and adjust ratings across departments for fairness.</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
              {MOCK_CALIBRATION.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Employee</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Department</th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Manager</th>
                  <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Self</th>
                  <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Manager</th>
                  <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Preliminary</th>
                  <th className="text-center font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Calibrated</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CALIBRATION.map((row) => (
                  <tr key={row.employeeName} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 pl-5 pr-5">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0", paletteFor(row.employeeName))}>
                          {initials(row.employeeName)}
                        </div>
                        <p className="font-semibold text-slate-900 leading-tight">{row.employeeName}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {row.department}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-slate-600">{row.manager}</td>
                    <td className="py-4 pr-5 text-center text-slate-700 tabular-nums">{row.selfRating ? `${row.selfRating}/5` : "—"}</td>
                    <td className="py-4 pr-5 text-center text-slate-700 tabular-nums">{row.managerRating ? `${row.managerRating}/5` : "—"}</td>
                    <td className="py-4 pr-5 text-center">
                      {row.preliminaryRating ? (
                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tabular-nums", ratingPill(row.preliminaryRating))}>
                          {row.preliminaryRating}/5
                        </span>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-4 pr-5 text-center">
                      {row.calibratedRating ? (
                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tabular-nums", ratingPill(row.calibratedRating))}>
                          {row.calibratedRating}/5
                        </span>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
