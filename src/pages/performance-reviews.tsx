import { useState, useMemo } from "react";
import {
  Search,
  ClipboardList,
  FileText,
  Plus,
  X,
  Calendar,
  Users,
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

const SELF_REVIEW_STYLES: Record<"pending" | "submitted", { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-amber-700" },
  submitted: { label: "Submitted", color: "text-emerald-700" },
};

const MANAGER_REVIEW_STYLES: Record<"pending" | "submitted", { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-amber-700" },
  submitted: { label: "Submitted", color: "text-emerald-700" },
};

// ── Component ──

export default function PerformanceReviewsPage() {
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

  const summaryCards = [
    { label: "Total Appraisals", value: counts.total },
    { label: "Completed", value: counts.completed },
    { label: "Awaiting Self Review", value: counts.pendingSelf },
    { label: "Awaiting Manager", value: counts.pendingManager },
  ];

  const addSection = () => {
    setTplSections((prev) => [...prev, { name: "", weight: 0 }]);
  };

  const updateSection = (index: number, field: keyof TemplateSection, value: string | number) => {
    setTplSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const views = [
    { key: "appraisals" as const, label: "Appraisals" },
    { key: "templates" as const, label: "Review Templates" },
    { key: "cycle" as const, label: "Review Cycle" },
    { key: "calibration" as const, label: "Calibration" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Appraisal Management
        </h1>
        <p className="text-sm text-slate-500">
          {MOCK_APPRAISALS.length} total appraisals &middot; {filtered.length} shown
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2"
          >
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* View Tabs */}
      <div className="flex gap-1 border-b border-[#efefef]">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setActiveView(v.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeView === v.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* ═══════ APPRAISALS TAB ═══════ */}
      {activeView === "appraisals" && (
        <>
          {/* Search + Department Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search employees, managers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Manager</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Self Review</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Manager Review</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Final Rating</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appraisal) => {
                  const statusStyle = APPRAISAL_STATUS_STYLES[appraisal.status];
                  const selfStyle = SELF_REVIEW_STYLES[appraisal.selfReviewStatus];
                  const mgrStyle = MANAGER_REVIEW_STYLES[appraisal.managerReviewStatus];
                  return (
                    <tr
                      key={appraisal.id}
                      className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="p-3 font-medium text-slate-900">
                        {appraisal.employeeName}
                      </td>
                      <td className="p-3 text-slate-500">{appraisal.department}</td>
                      <td className="p-3 text-slate-500">{appraisal.managerName}</td>
                      <td className={cn("p-3 text-sm font-medium", selfStyle.color)}>
                        {selfStyle.label}
                      </td>
                      <td className={cn("p-3 text-sm font-medium", mgrStyle.color)}>
                        {mgrStyle.label}
                      </td>
                      <td className="p-3 font-medium text-slate-900">
                        {appraisal.finalRating ? `${appraisal.finalRating}/5` : "\u2014"}
                      </td>
                      <td className={cn("p-3 text-sm font-medium", statusStyle.color)}>
                        {statusStyle.label}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium text-slate-900">No appraisals found</p>
                      <p className="text-xs mt-1 text-slate-500">
                        Try adjusting your search or filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ═══════ REVIEW TEMPLATES TAB ═══════ */}
      {activeView === "templates" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowTemplateForm(!showTemplateForm)}>
              {showTemplateForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {showTemplateForm ? "Cancel" : "Create Template"}
            </Button>
          </div>

          {/* Inline Form */}
          {showTemplateForm && (
            <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
              <h3 className="text-sm font-semibold">New Review Template</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Template Name</label>
                  <Input value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="e.g. Annual Performance Review" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Type</label>
                  <select
                    value={tplType}
                    onChange={(e) => setTplType(e.target.value as "Annual" | "Quarterly" | "Probation")}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-500">Sections</label>
                  <button onClick={addSection} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Section</button>
                </div>
                {tplSections.map((section, i) => (
                  <div key={i} className="flex gap-3">
                    <Input
                      value={section.name}
                      onChange={(e) => updateSection(i, "name", e.target.value)}
                      placeholder="Section name"
                      className="flex-1"
                    />
                    <div className="w-24">
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
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setShowTemplateForm(false)}>Create Template</Button>
              </div>
            </div>
          )}

          {/* Templates Table */}
          <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Template Name</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Type</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500">Sections</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TEMPLATES.map((tpl) => (
                  <tr key={tpl.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3 font-medium text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      {tpl.name}
                    </td>
                    <td className="p-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        tpl.type === "Annual" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        tpl.type === "Quarterly" ? "bg-violet-50 text-violet-700 border-violet-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {tpl.type}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-700">{tpl.sectionsCount}</td>
                    <td className="p-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        tpl.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      )}>
                        {tpl.status === "active" ? "Active" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════ REVIEW CYCLE TAB ═══════ */}
      {activeView === "cycle" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Q1 2026 Performance Review</h3>
                <p className="text-xs text-slate-500">Active Cycle</p>
              </div>
              <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500">Start Date</p>
                <p className="text-sm font-medium text-slate-900">Jan 1, 2026</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">End Date</p>
                <p className="text-sm font-medium text-slate-900">Mar 31, 2026</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Self Review Deadline</p>
                <p className="text-sm font-medium text-slate-900">Apr 7, 2026</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Manager Review Deadline</p>
                <p className="text-sm font-medium text-slate-900">Apr 14, 2026</p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Completion</span>
                <span className="font-medium text-slate-900">6 / 20 employees (30%)</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: "30%" }} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-500">14 employees pending review</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ CALIBRATION TAB ═══════ */}
      {activeView === "calibration" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Review and calibrate employee ratings across departments for consistency.</p>
          <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Manager</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500">Self</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500">Manager</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500">Preliminary</th>
                  <th className="p-3 text-center text-xs font-medium text-slate-500">Calibrated</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CALIBRATION.map((row) => (
                  <tr key={row.employeeName} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3 font-medium text-slate-900">{row.employeeName}</td>
                    <td className="p-3 text-slate-500">{row.department}</td>
                    <td className="p-3 text-slate-500">{row.manager}</td>
                    <td className="p-3 text-center text-slate-700">{row.selfRating ? `${row.selfRating}/5` : "\u2014"}</td>
                    <td className="p-3 text-center text-slate-700">{row.managerRating ? `${row.managerRating}/5` : "\u2014"}</td>
                    <td className="p-3 text-center">
                      {row.preliminaryRating ? (
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold",
                          row.preliminaryRating >= 4 ? "bg-emerald-50 text-emerald-700" :
                          row.preliminaryRating >= 3 ? "bg-amber-50 text-amber-700" :
                          "bg-red-50 text-red-700"
                        )}>
                          {row.preliminaryRating}/5
                        </span>
                      ) : "\u2014"}
                    </td>
                    <td className="p-3 text-center">
                      {row.calibratedRating ? (
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold",
                          row.calibratedRating >= 4 ? "bg-emerald-50 text-emerald-700" :
                          row.calibratedRating >= 3 ? "bg-amber-50 text-amber-700" :
                          "bg-red-50 text-red-700"
                        )}>
                          {row.calibratedRating}/5
                        </span>
                      ) : "\u2014"}
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
