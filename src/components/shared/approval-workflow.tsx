import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ──

export type ApprovalStatus = "pending" | "approved" | "rejected" | "skipped";

export interface ApprovalStep {
  id: string;
  role: "employee" | "line_manager" | "admin";
  roleLabel: string;
  assignee: string;
  status: ApprovalStatus;
  date: string | null;
  comment: string | null;
}

export interface ApprovalWorkflow {
  id: string;
  module: string;
  requestId: string;
  requestType: string;
  requestedBy: string;
  requestedAt: string;
  currentStep: number;
  steps: ApprovalStep[];
  overallStatus: "in_progress" | "approved" | "rejected";
}

// ── Helpers ──

export function createDefaultWorkflow(
  module: string,
  requestId: string,
  requestType: string,
  requestedBy: string,
  lineManager: string = "Emeka Nwosu",
  admin: string = "Fatima Abdullahi"
): ApprovalWorkflow {
  return {
    id: `wf-${Date.now()}`,
    module,
    requestId,
    requestType,
    requestedBy,
    requestedAt: new Date().toISOString(),
    currentStep: 0,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: requestedBy, status: "approved", date: new Date().toISOString(), comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: lineManager, status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: admin, status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  };
}

const STEP_ROLE_ICONS = {
  employee: User,
  line_manager: UserCheck,
  admin: Shield,
};

const STATUS_CONFIG: Record<ApprovalStatus, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", label: "Pending" },
  approved: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Rejected" },
  skipped: { icon: Clock, color: "text-slate-400", bg: "bg-slate-50 border-slate-200", label: "Skipped" },
};

// ── Components ──

/** Compact inline badge showing overall workflow status */
export function ApprovalBadge({ workflow }: { workflow: ApprovalWorkflow }) {
  const completedSteps = workflow.steps.filter((s) => s.status === "approved").length;
  const totalSteps = workflow.steps.length;
  const rejected = workflow.steps.some((s) => s.status === "rejected");

  if (rejected) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-red-50 border-red-200 text-red-700">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  }

  if (completedSteps === totalSteps) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">
        <CheckCircle2 className="w-3 h-3" /> Fully Approved
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-50 border-amber-200 text-amber-700">
      <Clock className="w-3 h-3" /> {completedSteps}/{totalSteps} Approved
    </span>
  );
}

/** Mini step indicator (dots) */
export function ApprovalStepDots({ workflow }: { workflow: ApprovalWorkflow }) {
  return (
    <div className="flex items-center gap-1">
      {workflow.steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              step.status === "approved" && "bg-emerald-500",
              step.status === "rejected" && "bg-red-500",
              step.status === "pending" && "bg-amber-400",
              step.status === "skipped" && "bg-slate-300"
            )}
            title={`${step.roleLabel}: ${STATUS_CONFIG[step.status].label}`}
          />
          {i < workflow.steps.length - 1 && (
            <div className={cn("w-3 h-0.5 rounded-full", step.status === "approved" ? "bg-emerald-300" : "bg-slate-200")} />
          )}
        </div>
      ))}
    </div>
  );
}

/** Full workflow timeline with approval actions */
export function ApprovalTimeline({
  workflow,
  onApprove,
  onReject,
  canActOnStep,
}: {
  workflow: ApprovalWorkflow;
  onApprove?: (stepId: string, comment: string) => void;
  onReject?: (stepId: string, comment: string) => void;
  canActOnStep?: (step: ApprovalStep) => boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [actionComment, setActionComment] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-[#efefef] bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold">Approval Workflow</h4>
          <ApprovalBadge workflow={workflow} />
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="space-y-0">
            {workflow.steps.map((step, i) => {
              const config = STATUS_CONFIG[step.status];
              const StatusIcon = config.icon;
              const RoleIcon = STEP_ROLE_ICONS[step.role];
              const isActionable = canActOnStep?.(step) && step.status === "pending";
              const isLast = i === workflow.steps.length - 1;

              return (
                <div key={step.id} className="flex gap-3">
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0", config.bg)}>
                      <StatusIcon className={cn("w-4 h-4", config.color)} />
                    </div>
                    {!isLast && (
                      <div className={cn("w-0.5 flex-1 min-h-[24px]", step.status === "approved" ? "bg-emerald-200" : "bg-slate-200")} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
                    <div className="flex items-center gap-2">
                      <RoleIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-medium">{step.roleLabel}</span>
                      <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border", config.bg, config.color)}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {step.assignee}
                      {step.date && ` · ${new Date(step.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`}
                    </p>
                    {step.comment && (
                      <p className="text-xs text-slate-600 mt-1 bg-[#f8fafc] rounded-lg px-3 py-2 italic">"{step.comment}"</p>
                    )}

                    {/* Action buttons */}
                    {isActionable && (
                      <div className="mt-2 space-y-2">
                        {activeAction === step.id ? (
                          <div className="space-y-2">
                            <textarea
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[60px] resize-none"
                              placeholder="Add a comment (optional)..."
                              value={actionComment}
                              onChange={(e) => setActionComment(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => { onApprove?.(step.id, actionComment); setActiveAction(null); setActionComment(""); }}>
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => { onReject?.(step.id, actionComment); setActiveAction(null); setActionComment(""); }}>
                                <XCircle className="w-3 h-3 mr-1" /> Reject
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setActiveAction(null); setActionComment(""); }}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setActiveAction(step.id)}>
                            Take Action
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Compact workflow summary for tables — shows as a row of step badges */
export function ApprovalSummaryRow({ workflow }: { workflow: ApprovalWorkflow }) {
  return (
    <div className="flex items-center gap-2">
      {workflow.steps.map((step, i) => {
        const config = STATUS_CONFIG[step.status];
        return (
          <div key={step.id} className="flex items-center gap-1">
            <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border", config.bg, config.color)} title={`${step.roleLabel}: ${config.label}`}>
              {step.role === "employee" ? "E" : step.role === "line_manager" ? "LM" : "A"}
            </div>
            {i < workflow.steps.length - 1 && <div className="w-2 h-px bg-slate-300" />}
          </div>
        );
      })}
    </div>
  );
}
