import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Download,
  Play,
  Users,
  TrendingUp,
  Banknote,
  AlertCircle,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_PAYROLL_RUNS as INITIAL_RUNS,
  MOCK_PAYSLIPS,
  formatNaira,
} from "@/lib/payroll-mock-data";
import type { PayrollStatus, PayrollRun, PayrollRunType } from "@/lib/payroll-mock-data";

const RUN_STATUS_PILL: Record<PayrollStatus, { label: string; dot: string; pill: string }> = {
  draft: { label: "Draft", dot: "bg-slate-400", pill: "bg-slate-100 text-slate-600" },
  processing: { label: "Processing", dot: "bg-blue-500", pill: "bg-blue-50 text-blue-700" },
  completed: { label: "Completed", dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700" },
  failed: { label: "Failed", dot: "bg-rose-500", pill: "bg-rose-50 text-rose-700" },
};

const RUN_TYPE_PILL: Record<PayrollRunType, { label: string; pill: string }> = {
  regular: { label: "Regular", pill: "bg-slate-100 text-slate-700" },
  "off-cycle": { label: "Off-cycle", pill: "bg-violet-50 text-violet-700" },
  bonus: { label: "Bonus", pill: "bg-indigo-50 text-indigo-700" },
  "13th-month": { label: "13th month", pill: "bg-amber-50 text-amber-700" },
};

function formatDateShort(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function Toast({ message, type = "success", onDismiss }: { message: string; type?: "success" | "info"; onDismiss: () => void }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm",
        type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-blue-50 border-blue-200 text-blue-800"
      )}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
        {message}
      </div>
      <button onClick={onDismiss} className="p-0.5 hover:opacity-70">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function PayrollPage() {
  const [runs] = useState<PayrollRun[]>(INITIAL_RUNS);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const completedRuns = runs.filter((r) => r.status === "completed");
  const lastCompletedRun = completedRuns.find((r) => MOCK_PAYSLIPS.some((p) => p.payrollRunId === r.id)) ?? completedRuns[0];

  const handleExport = () => {
    setToast({ message: "Payroll data exported to CSV.", type: "success" });
  };

  const kpis = lastCompletedRun
    ? [
        { value: formatNaira(lastCompletedRun.totalGross), label: "Last gross pay", icon: Banknote, trend: 4 },
        { value: formatNaira(lastCompletedRun.totalNet), label: "Last net pay", icon: DollarSign, trend: 3 },
        { value: formatNaira(lastCompletedRun.totalDeductions), label: "Total deductions", icon: TrendingUp, trend: 1 },
        { value: lastCompletedRun.employeeCount, label: "Employees paid", icon: Users, trend: 2 },
      ]
    : [];

  return (
    <div className="max-w-[1500px] space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payroll</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Review, process, and disburse pay to your workforce — track runs, gross and net pay,
            deductions, and employees paid each cycle.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button asChild className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4">
            <Link to="/payroll/process">
              <Play className="w-4 h-4 mr-1" />
              Process payroll
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      {lastCompletedRun ? (
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
                  <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{kpi.trend}</span>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{kpi.value}</p>
                  <p className="text-sm text-slate-500 mt-2">
                    {kpi.label}
                    <span className="text-slate-400"> · {lastCompletedRun.period}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <Banknote className="w-10 h-10 mx-auto mb-3 text-slate-400" />
          <p className="text-sm font-semibold text-slate-900">No payroll processed yet</p>
          <p className="text-xs text-slate-500 mt-1">Process your first payroll run to see summary data here</p>
        </div>
      )}

      {/* Payroll Runs table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">Payroll runs</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
              {runs.length}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Period</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Type</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Gross</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Tax</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Pension</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Deductions</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Net</th>
                <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Employees</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Pay date</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Approved by</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => {
                const style = RUN_STATUS_PILL[run.status];
                const typePill = RUN_TYPE_PILL[run.runType];
                return (
                  <tr key={run.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 pl-5 pr-5">
                      <p className="font-semibold text-slate-900 leading-tight">{run.period}</p>
                      <p className="text-xs text-slate-500 leading-tight mt-0.5 font-mono">{run.id.toUpperCase()}</p>
                    </td>
                    <td className="py-4 pr-5">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium", typePill.pill)}>
                        {typePill.label}
                      </span>
                    </td>
                    <td className="py-4 pr-5">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", style.pill)}>
                        {run.status === "processing" ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
                        )}
                        {style.label}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-right font-semibold text-slate-900 tabular-nums">
                      {run.totalGross > 0 ? formatNaira(run.totalGross) : "—"}
                    </td>
                    <td className="py-4 pr-5 text-right text-slate-600 tabular-nums">
                      {run.totalTax > 0 ? `-${formatNaira(run.totalTax)}` : "—"}
                    </td>
                    <td className="py-4 pr-5 text-right text-slate-600 tabular-nums">
                      {run.totalPension > 0 ? `-${formatNaira(run.totalPension)}` : "—"}
                    </td>
                    <td className="py-4 pr-5 text-right text-slate-600 tabular-nums">
                      {run.totalDeductions > 0 ? `-${formatNaira(run.totalDeductions)}` : "—"}
                    </td>
                    <td className="py-4 pr-5 text-right font-bold text-slate-900 tabular-nums">
                      {run.totalNet > 0 ? formatNaira(run.totalNet) : "—"}
                    </td>
                    <td className="py-4 pr-5 text-right text-slate-700 tabular-nums">{run.employeeCount}</td>
                    <td className="py-4 pr-5 text-slate-600 text-xs tabular-nums">{formatDateShort(run.payDate)}</td>
                    <td className="py-4 pr-5 text-slate-600 text-xs">{run.approvedBy ?? "—"}</td>
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
