import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  User,
  Crosshair,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Types ──

interface KeyResult {
  id: string;
  description: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: "on-track" | "at-risk" | "behind" | "completed";
}

interface Objective {
  id: string;
  title: string;
  description: string;
  owner: string;
  period: string;
  progress: number;
  keyResults: KeyResult[];
}

type TabKey = "company" | "team" | "my";

// ── Mock Data ──

const PERIODS = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];

const MOCK_OKRS: Record<TabKey, Objective[]> = {
  company: [
    {
      id: "obj-c1", title: "Increase Annual Revenue by 40%", description: "Drive aggressive revenue growth through expansion and upselling", owner: "CEO", period: "Q1 2026", progress: 62,
      keyResults: [
        { id: "kr-c1a", description: "Close 10 enterprise deals worth >5M ARR each", targetMetric: "Deals Closed", currentValue: 6, targetValue: 10, unit: "deals", status: "on-track" },
        { id: "kr-c1b", description: "Increase MRR to 80M", targetMetric: "Monthly Recurring Revenue", currentValue: 52, targetValue: 80, unit: "M", status: "at-risk" },
        { id: "kr-c1c", description: "Reduce customer churn below 3%", targetMetric: "Churn Rate", currentValue: 3.8, targetValue: 3, unit: "%", status: "behind" },
      ],
    },
    {
      id: "obj-c2", title: "Achieve World-Class Customer Satisfaction", description: "Build a customer-obsessed culture across all touchpoints", owner: "COO", period: "Q1 2026", progress: 78,
      keyResults: [
        { id: "kr-c2a", description: "Reach NPS score of 75+", targetMetric: "NPS Score", currentValue: 68, targetValue: 75, unit: "pts", status: "on-track" },
        { id: "kr-c2b", description: "Reduce average support response time to 2 hours", targetMetric: "Avg Response Time", currentValue: 2.5, targetValue: 2, unit: "hrs", status: "at-risk" },
      ],
    },
    {
      id: "obj-c3", title: "Launch Next-Gen Product Platform", description: "Ship the new platform with AI-powered features", owner: "CTO", period: "Q1 2026", progress: 45,
      keyResults: [
        { id: "kr-c3a", description: "Ship AI reporting module", targetMetric: "Module Shipped", currentValue: 0, targetValue: 1, unit: "module", status: "behind" },
        { id: "kr-c3b", description: "Achieve 99.9% uptime SLA", targetMetric: "Uptime", currentValue: 99.7, targetValue: 99.9, unit: "%", status: "at-risk" },
        { id: "kr-c3c", description: "Onboard 500 beta users", targetMetric: "Beta Users", currentValue: 380, targetValue: 500, unit: "users", status: "on-track" },
      ],
    },
  ],
  team: [
    {
      id: "obj-t1", title: "Deliver Performance Module on Time", description: "Complete all performance management features by end of Q1", owner: "Chiamaka Eze", period: "Q1 2026", progress: 55,
      keyResults: [
        { id: "kr-t1a", description: "Build dashboard and goals page", targetMetric: "Pages Built", currentValue: 2, targetValue: 3, unit: "pages", status: "on-track" },
        { id: "kr-t1b", description: "Complete 360 feedback flow", targetMetric: "Completion", currentValue: 40, targetValue: 100, unit: "%", status: "at-risk" },
        { id: "kr-t1c", description: "Pass QA with zero critical bugs", targetMetric: "Critical Bugs", currentValue: 2, targetValue: 0, unit: "bugs", status: "behind" },
      ],
    },
    {
      id: "obj-t2", title: "Improve Engineering Velocity by 25%", description: "Increase team throughput and reduce cycle time", owner: "Chiamaka Eze", period: "Q1 2026", progress: 72,
      keyResults: [
        { id: "kr-t2a", description: "Reduce PR review time to under 4 hours", targetMetric: "Avg PR Review Time", currentValue: 4.5, targetValue: 4, unit: "hrs", status: "at-risk" },
        { id: "kr-t2b", description: "Achieve 80% test coverage", targetMetric: "Test Coverage", currentValue: 76, targetValue: 80, unit: "%", status: "on-track" },
      ],
    },
  ],
  my: [
    {
      id: "obj-m1", title: "Build Appraisal Form Component", description: "Create the multi-tab appraisal form with rating matrix", owner: "Adebayo Ogunlesi", period: "Q1 2026", progress: 70,
      keyResults: [
        { id: "kr-m1a", description: "Complete goals review tab", targetMetric: "Completion", currentValue: 100, targetValue: 100, unit: "%", status: "completed" },
        { id: "kr-m1b", description: "Build competency matrix UI", targetMetric: "Completion", currentValue: 60, targetValue: 100, unit: "%", status: "on-track" },
        { id: "kr-m1c", description: "Implement summary view with export", targetMetric: "Completion", currentValue: 30, targetValue: 100, unit: "%", status: "at-risk" },
      ],
    },
    {
      id: "obj-m2", title: "Improve Personal Technical Skills", description: "Level up on React performance and system design", owner: "Adebayo Ogunlesi", period: "Q1 2026", progress: 50,
      keyResults: [
        { id: "kr-m2a", description: "Complete advanced React course", targetMetric: "Modules Completed", currentValue: 6, targetValue: 12, unit: "modules", status: "on-track" },
        { id: "kr-m2b", description: "Give 2 tech talks to the team", targetMetric: "Talks Given", currentValue: 1, targetValue: 2, unit: "talks", status: "on-track" },
      ],
    },
  ],
};

// ── Helpers ──

function progressColor(pct: number): string {
  if (pct > 70) return "bg-emerald-500";
  if (pct >= 40) return "bg-amber-500";
  return "bg-red-500";
}

function progressTextColor(pct: number): string {
  if (pct > 70) return "text-emerald-700";
  if (pct >= 40) return "text-amber-700";
  return "text-red-700";
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  "on-track": { label: "On Track", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "at-risk": { label: "At Risk", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  "behind": { label: "Behind", cls: "bg-red-50 text-red-700 border-red-200" },
  "completed": { label: "Completed", cls: "bg-blue-50 text-blue-700 border-blue-200" },
};

// ── Component ──

export default function PerformanceOKRsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("company");
  const [selectedPeriod, setSelectedPeriod] = useState("Q1 2026");
  const [expandedObj, setExpandedObj] = useState<Set<string>>(new Set(["obj-c1", "obj-t1", "obj-m1"]));
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [fTitle, setFTitle] = useState("");
  const [fDesc, setFDesc] = useState("");
  const [fOwner, setFOwner] = useState("");

  const objectives = MOCK_OKRS[activeTab].filter((o) => o.period === selectedPeriod);

  const toggleExpand = (id: string) => {
    setExpandedObj((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "company", label: "Company OKRs" },
    { key: "team", label: "Team OKRs" },
    { key: "my", label: "My OKRs" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">OKR Management</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f0f4f8] text-xs font-medium text-slate-500">
              <Crosshair className="w-3.5 h-3.5" />
              OKRs
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Set and track Objectives and Key Results across the organization</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { localStorage.removeItem("sabi-hr-performance-system"); navigate("/performance"); }}>
          Change System
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#efefef]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === t.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Period selector + Add */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                selectedPeriod === p
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? "Cancel" : "Add Objective"}
        </Button>
      </div>

      {/* Add Objective Form */}
      {showForm && (
        <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
          <h3 className="text-sm font-semibold">New Objective</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Title</label>
              <Input value={fTitle} onChange={(e) => setFTitle(e.target.value)} placeholder="Objective title" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Description</label>
              <Input value={fDesc} onChange={(e) => setFDesc(e.target.value)} placeholder="Brief description" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Owner</label>
              <Input value={fOwner} onChange={(e) => setFOwner(e.target.value)} placeholder="Owner name" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Period: {selectedPeriod} -- Key results can be added after creation.</p>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowForm(false)}>Create Objective</Button>
          </div>
        </div>
      )}

      {/* Objectives */}
      {objectives.length === 0 ? (
        <div className="rounded-xl border border-[#efefef] bg-white p-12 text-center">
          <Target className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-medium text-slate-900">No objectives for {selectedPeriod}</p>
          <p className="text-xs mt-1 text-slate-500">Click "Add Objective" to create one</p>
        </div>
      ) : (
        <div className="space-y-4">
          {objectives.map((obj) => {
            const isExpanded = expandedObj.has(obj.id);
            const pct = obj.progress;
            return (
              <div key={obj.id} className="rounded-xl border border-[#efefef] bg-white overflow-hidden">
                {/* Objective Header */}
                <button
                  onClick={() => toggleExpand(obj.id)}
                  className="w-full flex items-start gap-3 p-4 text-left hover:bg-[#f8fafc] transition-colors"
                >
                  <div className="mt-0.5">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{obj.title}</h3>
                      <span className={cn("text-xs font-bold", progressTextColor(pct))}>{pct}%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{obj.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">{obj.owner}</span>
                    </div>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", progressColor(pct))}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>

                {/* Key Results */}
                {isExpanded && (
                  <div className="border-t border-[#efefef] bg-[#fafafa]">
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Key Results</p>
                    </div>
                    {obj.keyResults.map((kr) => {
                      const krPct = kr.targetValue === 0 ? 100 : Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100));
                      const style = STATUS_STYLES[kr.status];
                      return (
                        <div key={kr.id} className="px-4 py-3 border-t border-[#efefef] flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900">{kr.description}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {kr.targetMetric}: {kr.currentValue}{kr.unit !== "%" && kr.unit !== "pts" && kr.unit !== "hrs" ? "" : ""} / {kr.targetValue} {kr.unit}
                            </p>
                          </div>
                          <div className="w-32 flex-shrink-0">
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={cn("h-full rounded-full", progressColor(krPct))}
                                style={{ width: `${krPct}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-1 text-right">{krPct}%</p>
                          </div>
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0", style.cls)}>
                            {style.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
