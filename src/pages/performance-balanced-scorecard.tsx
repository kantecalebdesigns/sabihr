import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Users,
  Settings,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ──

type ObjectiveStatus = "on-track" | "at-risk" | "behind";

interface ScorecardObjective {
  measure: string;
  target: string;
  actual: string;
  score: number;
  status: ObjectiveStatus;
}

interface Perspective {
  name: string;
  icon: React.ElementType;
  overallScore: number;
  objectives: ScorecardObjective[];
}

// ── Mock Data ──

const PERSPECTIVES: Perspective[] = [
  {
    name: "Financial",
    icon: DollarSign,
    overallScore: 76,
    objectives: [
      { measure: "Revenue growth", target: "40%", actual: "32%", score: 80, status: "on-track" },
      { measure: "Profit margin", target: "25%", actual: "21%", score: 84, status: "on-track" },
      { measure: "Cost reduction", target: "15%", actual: "9%", score: 60, status: "at-risk" },
    ],
  },
  {
    name: "Customer",
    icon: Users,
    overallScore: 82,
    objectives: [
      { measure: "Customer satisfaction", target: "90%", actual: "87%", score: 97, status: "on-track" },
      { measure: "Retention rate", target: "95%", actual: "92%", score: 97, status: "on-track" },
      { measure: "NPS score", target: "75", actual: "58", score: 77, status: "at-risk" },
    ],
  },
  {
    name: "Internal process",
    icon: Settings,
    overallScore: 68,
    objectives: [
      { measure: "Cycle time", target: "5 days", actual: "6.2 days", score: 81, status: "on-track" },
      { measure: "Quality rate", target: "99%", actual: "96.5%", score: 97, status: "on-track" },
      { measure: "Innovation index", target: "8/10", actual: "5/10", score: 63, status: "behind" },
    ],
  },
  {
    name: "Learning & growth",
    icon: GraduationCap,
    overallScore: 71,
    objectives: [
      { measure: "Employee training", target: "40 hrs/yr", actual: "32 hrs/yr", score: 80, status: "on-track" },
      { measure: "Skill development", target: "85%", actual: "68%", score: 80, status: "at-risk" },
      { measure: "Knowledge sharing", target: "12 sessions", actual: "7 sessions", score: 58, status: "behind" },
    ],
  },
];

// ── Helpers ──

function scorePill(_score: number): string {
  return "bg-slate-100 text-slate-700";
}

function scoreColor(_score: number): string {
  return "text-slate-900";
}

function scoreBar(_score: number): string {
  return "bg-blue-600";
}

const STATUS_LABEL: Record<ObjectiveStatus, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  "behind": "Behind",
};

// ── Component ──

export default function PerformanceBalancedScorecardPage() {
  const navigate = useNavigate();
  const overallScore = Math.round(
    PERSPECTIVES.reduce((sum, p) => sum + p.overallScore, 0) / PERSPECTIVES.length
  );

  const onTrackCount = PERSPECTIVES.filter((p) => p.overallScore >= 70).length;
  const actionItems = PERSPECTIVES.reduce(
    (sum, p) => sum + p.objectives.filter((o) => o.status !== "on-track").length,
    0
  );
  const allObjectives = PERSPECTIVES.flatMap((p) => p.objectives);

  const kpis = [
    { label: "Overall score", value: `${overallScore}%`, icon: TrendingUp, trend: 3 },
    { label: "Perspectives on track", value: `${onTrackCount}/${PERSPECTIVES.length}`, icon: CheckCircle2, trend: 1 },
    { label: "Action items", value: String(actionItems), icon: AlertTriangle, trend: 0 },
    { label: "Total measures", value: String(allObjectives.length), icon: Settings, trend: 0 },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Balanced scorecard</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Measure strategic performance across the four classic perspectives — financial, customer,
            internal process, and learning & growth.
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

      {/* 2x2 perspective grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERSPECTIVES.map((perspective) => {
          const Icon = perspective.icon;
          return (
            <div
              key={perspective.name}
              className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden"
            >
              {/* Perspective header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Icon className="w-[18px] h-[18px] text-blue-600" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900 tracking-tight">{perspective.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{perspective.objectives.length} measures</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-2xl font-bold tracking-tight tabular-nums", scoreColor(perspective.overallScore))}>
                    {perspective.overallScore}%
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Score</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", scoreBar(perspective.overallScore))}
                    style={{ width: `${perspective.overallScore}%` }}
                  />
                </div>
              </div>

              {/* Objectives */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/70">
                      <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Measure</th>
                      <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Target</th>
                      <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Actual</th>
                      <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Score</th>
                      <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perspective.objectives.map((obj) => (
                      <tr key={obj.measure} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 pl-5 pr-5 font-semibold text-slate-900 leading-tight">{obj.measure}</td>
                        <td className="py-4 pr-5 text-right text-slate-500 tabular-nums">{obj.target}</td>
                        <td className="py-4 pr-5 text-right text-slate-900 tabular-nums">{obj.actual}</td>
                        <td className="py-4 pr-5 text-right">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tabular-nums", scorePill(obj.score))}>
                            {obj.score}%
                          </span>
                        </td>
                        <td className="py-4 pr-5 text-sm text-slate-600">{STATUS_LABEL[obj.status]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
