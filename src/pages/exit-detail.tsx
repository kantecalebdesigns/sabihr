import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_EXITS,
  EXIT_TYPE_STYLES,
  EXIT_STAGE_STYLES,
  EXIT_STAGES_ORDER,
  formatExitCurrency,
} from "@/lib/exit-mock-data";

export default function ExitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const exit = MOCK_EXITS.find((e) => e.id === id);

  if (!exit) {
    return (
      <div className="max-w-[1400px] mx-auto py-20 text-center">
        <LogOut className="w-10 h-10 mx-auto mb-3 text-slate-500/30" />
        <p className="font-medium text-slate-900">Exit record not found</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/exit")}>Back to Exits</Button>
      </div>
    );
  }

  const typeStyle = EXIT_TYPE_STYLES[exit.exitType];
  const stageStyle = EXIT_STAGE_STYLES[exit.stage];
  const currentStageIndex = EXIT_STAGES_ORDER.indexOf(exit.stage);

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Back */}
      <button onClick={() => navigate("/exit")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Exit Management
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{exit.employeeName}</h1>
          <p className="text-sm text-slate-500">{exit.jobTitle} &middot; {exit.department}</p>
        </div>
        <span className={cn("text-sm font-medium", stageStyle.color)}>{stageStyle.label}</span>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-500">Exit Type</p>
            <p className={cn("font-medium mt-0.5", typeStyle.color)}>{typeStyle.label}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Last Working Day</p>
            <p className="font-medium mt-0.5">{new Date(exit.requestedLastDay).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Initiated By</p>
            <p className="font-medium mt-0.5">{exit.initiatedBy}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Initiated Date</p>
            <p className="font-medium mt-0.5">{new Date(exit.initiatedDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#efefef]">
          <p className="text-xs text-slate-500 mb-1">Reason</p>
          <p className="text-sm">{exit.reason}</p>
        </div>
      </div>

      {/* Stage Progress */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h3 className="text-sm font-semibold mb-4">Exit Progress</h3>
        <div className="flex items-center gap-1">
          {EXIT_STAGES_ORDER.map((stage, i) => {
            const s = EXIT_STAGE_STYLES[stage];
            const isCompleted = i < currentStageIndex;
            const isCurrent = i === currentStageIndex;
            return (
              <div key={stage} className="flex items-center gap-1 flex-1">
                <div className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium flex-1 justify-center",
                  isCompleted ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                  isCurrent ? "border-blue-200 bg-blue-50 text-blue-700" :
                  "border-[#efefef] bg-[#f8fafc] text-slate-500"
                )}>
                  {isCompleted && <Check className="w-3 h-3" />}
                  {isCurrent && <Clock className="w-3 h-3" />}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.label.split(" ")[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clearance Checklist */}
      {exit.clearanceItems.length > 0 && (
        <div className="rounded-xl border border-[#efefef] bg-white overflow-hidden">
          <div className="p-4 border-b border-[#efefef]">
            <h3 className="text-sm font-semibold">Clearance Checklist</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {exit.clearanceItems.filter((c) => c.status === "completed").length} of {exit.clearanceItems.length} completed
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                <th className="p-3 text-left text-xs font-medium text-slate-500">Activity</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Assignee</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Completed</th>
              </tr>
            </thead>
            <tbody>
              {exit.clearanceItems.map((item) => (
                <tr key={item.id} className="border-b border-[#efefef] last:border-0">
                  <td className="p-3 font-medium">{item.activity}</td>
                  <td className="p-3 text-slate-500">{item.assignee}</td>
                  <td className="p-3">
                    {item.status === "completed" ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                        <Check className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-amber-700">Pending</span>
                    )}
                  </td>
                  <td className="p-3 text-xs text-slate-500">
                    {item.completedDate ? new Date(item.completedDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Final Settlement */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h3 className="text-sm font-semibold mb-4">Final Settlement Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Unpaid Salary</span>
            <span>{formatExitCurrency(exit.unpaidSalary)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Leave Encashment</span>
            <span>{formatExitCurrency(exit.leaveEncashment)}</span>
          </div>
          {exit.gratuity > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Gratuity</span>
              <span>{formatExitCurrency(exit.gratuity)}</span>
            </div>
          )}
          {exit.deductions > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Deductions</span>
              <span className="text-red-600">-{formatExitCurrency(exit.deductions)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-[#efefef] font-semibold text-base">
            <span>Net Settlement</span>
            <span>{formatExitCurrency(exit.netSettlement)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
