import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Users,
  Settings,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
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
  color: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  overallScore: number;
  objectives: ScorecardObjective[];
}

// ── Mock Data ──

const PERSPECTIVES: Perspective[] = [
  {
    name: "Financial",
    icon: DollarSign,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconColor: "text-emerald-600",
    overallScore: 76,
    objectives: [
      { measure: "Revenue Growth", target: "40%", actual: "32%", score: 80, status: "on-track" },
      { measure: "Profit Margin", target: "25%", actual: "21%", score: 84, status: "on-track" },
      { measure: "Cost Reduction", target: "15%", actual: "9%", score: 60, status: "at-risk" },
    ],
  },
  {
    name: "Customer",
    icon: Users,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    overallScore: 82,
    objectives: [
      { measure: "Customer Satisfaction", target: "90%", actual: "87%", score: 97, status: "on-track" },
      { measure: "Retention Rate", target: "95%", actual: "92%", score: 97, status: "on-track" },
      { measure: "NPS Score", target: "75", actual: "58", score: 77, status: "at-risk" },
    ],
  },
  {
    name: "Internal Process",
    icon: Settings,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    iconColor: "text-violet-600",
    overallScore: 68,
    objectives: [
      { measure: "Cycle Time", target: "5 days", actual: "6.2 days", score: 81, status: "on-track" },
      { measure: "Quality Rate", target: "99%", actual: "96.5%", score: 97, status: "on-track" },
      { measure: "Innovation Index", target: "8/10", actual: "5/10", score: 63, status: "behind" },
    ],
  },
  {
    name: "Learning & Growth",
    icon: GraduationCap,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconColor: "text-amber-600",
    overallScore: 71,
    objectives: [
      { measure: "Employee Training", target: "40 hrs/yr", actual: "32 hrs/yr", score: 80, status: "on-track" },
      { measure: "Skill Development", target: "85%", actual: "68%", score: 80, status: "at-risk" },
      { measure: "Knowledge Sharing", target: "12 sessions", actual: "7 sessions", score: 58, status: "behind" },
    ],
  },
];

// ── Helpers ──

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-700";
  return "text-red-700";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-50";
  if (score >= 60) return "bg-amber-50";
  return "bg-red-50";
}

const STATUS_CONFIG: Record<ObjectiveStatus, { label: string; icon: React.ElementType; cls: string }> = {
  "on-track": { label: "On Track", icon: CheckCircle2, cls: "text-emerald-600" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, cls: "text-amber-600" },
  "behind": { label: "Behind", icon: XCircle, cls: "text-red-600" },
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

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Balanced Scorecard</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f0f4f8] text-xs font-medium text-slate-500">
              <BarChart3 className="w-3.5 h-3.5" />
              BSC
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Strategic performance across all four perspectives</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { localStorage.removeItem("sabi-hr-performance-system"); navigate("/performance"); }}>
          Change System
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-medium text-slate-500">Overall Score</p>
          </div>
          <p className={cn("text-2xl font-bold tracking-[-0.6px]", scoreColor(overallScore))}>{overallScore}%</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-medium text-slate-500">Perspectives On Track</p>
          </div>
          <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">{onTrackCount} / {PERSPECTIVES.length}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-medium text-slate-500">Action Items</p>
          </div>
          <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">{actionItems}</p>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERSPECTIVES.map((perspective) => {
          const Icon = perspective.icon;
          return (
            <div key={perspective.name} className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
              {/* Perspective Header */}
              <div className={cn("flex items-center justify-between px-5 py-4 border-b", perspective.borderColor, perspective.bgColor)}>
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("w-5 h-5", perspective.iconColor)} />
                  <h3 className={cn("text-sm font-semibold", perspective.color)}>{perspective.name}</h3>
                </div>
                <span className={cn("text-lg font-bold", scoreColor(perspective.overallScore))}>
                  {perspective.overallScore}%
                </span>
              </div>

              {/* Objectives Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/70">
                      <th className="p-3 text-left text-xs font-medium text-slate-500">Measure</th>
                      <th className="p-3 text-right text-xs font-medium text-slate-500">Target</th>
                      <th className="p-3 text-right text-xs font-medium text-slate-500">Actual</th>
                      <th className="p-3 text-right text-xs font-medium text-slate-500">Score</th>
                      <th className="p-3 text-center text-xs font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perspective.objectives.map((obj) => {
                      const statusCfg = STATUS_CONFIG[obj.status];
                      const StatusIcon = statusCfg.icon;
                      return (
                        <tr key={obj.measure} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                          <td className="p-3 font-medium text-slate-900">{obj.measure}</td>
                          <td className="p-3 text-right text-slate-500">{obj.target}</td>
                          <td className="p-3 text-right text-slate-900">{obj.actual}</td>
                          <td className="p-3 text-right">
                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold", scoreColor(obj.score), scoreBg(obj.score))}>
                              {obj.score}%
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <StatusIcon className={cn("w-3.5 h-3.5", statusCfg.cls)} />
                              <span className={cn("text-xs font-medium", statusCfg.cls)}>{statusCfg.label}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
