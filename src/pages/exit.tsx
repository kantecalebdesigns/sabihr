import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Plus,
  Clock,
  Users,
  TrendingUp,
  Eye,
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

export default function ExitPage() {
  const navigate = useNavigate();

  const activeExits = MOCK_EXITS.filter((e) => e.stage !== "completed");
  const completedExits = MOCK_EXITS.filter((e) => e.stage === "completed");
  const exitsThisQuarter = MOCK_EXITS.filter((e) => e.initiatedDate >= "2026-01-01").length;

  // Group by stage for pipeline view
  const pipeline = useMemo(() => {
    const groups: Record<string, typeof MOCK_EXITS> = {};
    for (const stage of EXIT_STAGES_ORDER) {
      groups[stage] = MOCK_EXITS.filter((e) => e.stage === stage);
    }
    return groups;
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Exit Management</h1>
          <p className="text-sm text-slate-500">Manage employee offboarding, clearance, and final settlements</p>
        </div>
        <Button size="sm" onClick={() => navigate("/exit/initiate")}>
          <Plus className="w-4 h-4 mr-2" />
          Initiate Exit
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium">Active Exits</span>
          </div>
          <p className="text-xl font-semibold">{activeExits.length}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">In Clearance</span>
          </div>
          <p className="text-xl font-semibold">{pipeline["clearance"]?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Exits This Quarter</span>
          </div>
          <p className="text-xl font-semibold">{exitsThisQuarter}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Completed</span>
          </div>
          <p className="text-xl font-semibold">{completedExits.length}</p>
        </div>
      </div>

      {/* Pipeline View */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Exit Pipeline</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {EXIT_STAGES_ORDER.map((stage) => {
            const stageStyle = EXIT_STAGE_STYLES[stage];
            const exits = pipeline[stage] ?? [];
            return (
              <div key={stage} className="rounded-xl border border-[#efefef] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-semibold", stageStyle.color)}>{stageStyle.label}</span>
                  <span className="text-xs text-slate-500">{exits.length}</span>
                </div>
                {exits.length > 0 ? (
                  <div className="space-y-2">
                    {exits.map((exit) => {
                      const typeStyle = EXIT_TYPE_STYLES[exit.exitType];
                      return (
                        <div
                          key={exit.id}
                          className="p-2.5 rounded-lg border border-[#efefef] hover:border-slate-300 transition-colors cursor-pointer"
                          onClick={() => navigate(`/exit/${exit.id}`)}
                        >
                          <p className="text-sm font-medium truncate">{exit.employeeName}</p>
                          <p className="text-xs text-slate-500">{exit.department}</p>
                          <span className={cn("text-[11px] font-medium", typeStyle.color)}>{typeStyle.label}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-3">None</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All Exits Table */}
      <div>
        <h2 className="text-sm font-semibold mb-3">All Exits ({MOCK_EXITS.length})</h2>
        <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Type</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Last Day</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Stage</th>
                <th className="p-3 text-right text-xs font-medium text-slate-500">Settlement</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EXITS.map((exit) => {
                const typeStyle = EXIT_TYPE_STYLES[exit.exitType];
                const stageStyle = EXIT_STAGE_STYLES[exit.stage];
                return (
                  <tr key={exit.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-pointer" onClick={() => navigate(`/exit/${exit.id}`)}>
                    <td className="p-3">
                      <p className="font-medium">{exit.employeeName}</p>
                      <p className="text-xs text-slate-500">{exit.jobTitle}</p>
                    </td>
                    <td className="p-3 text-slate-500">{exit.department}</td>
                    <td className={cn("p-3 text-sm font-medium", typeStyle.color)}>{typeStyle.label}</td>
                    <td className="p-3 text-slate-500 text-xs">{new Date(exit.requestedLastDay).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className={cn("p-3 text-sm font-medium", stageStyle.color)}>{stageStyle.label}</td>
                    <td className="p-3 text-right font-medium">{formatExitCurrency(exit.netSettlement)}</td>
                    <td className="p-3">
                      <button className="p-1.5 rounded-md text-slate-500 hover:bg-[#f8fafc] transition-colors" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
