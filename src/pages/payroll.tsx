import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  DollarSign,
  Download,
  Play,
  Search,
  Users,
  TrendingUp,
  Banknote,
  AlertCircle,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type StatusFilter = "all" | PayrollStatus;
type TypeFilter = "all" | PayrollRunType;

export default function PayrollPage() {
  const navigate = useNavigate();
  const [runs] = useState<PayrollRun[]>(INITIAL_RUNS);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [yearFilter, setYearFilter] = useState<"all" | number>("all");

  const years = useMemo(() => {
    const set = new Set<number>();
    for (const r of runs) set.add(r.year);
    return [...set].sort((a, b) => b - a);
  }, [runs]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = { all: runs.length, draft: 0, processing: 0, completed: 0, failed: 0 };
    for (const r of runs) counts[r.status] += 1;
    return counts;
  }, [runs]);

  const filteredRuns = useMemo(() => {
    const q = search.trim().toLowerCase();
    return runs.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (typeFilter !== "all" && r.runType !== typeFilter) return false;
      if (yearFilter !== "all" && r.year !== yearFilter) return false;
      if (!q) return true;
      return (
        r.period.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.approvedBy?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [runs, search, statusFilter, typeFilter, yearFilter]);

  const completedRuns = runs.filter((r) => r.status === "completed");
  const lastCompletedRun = completedRuns.find((r) => MOCK_PAYSLIPS.some((p) => p.payrollRunId === r.id)) ?? completedRuns[0];

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setYearFilter("all");
  };
  const filtersActive = !!search || statusFilter !== "all" || typeFilter !== "all" || yearFilter !== "all";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Payroll</h1>
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
        <div className="flex flex-col gap-3 px-5 py-4 border-b border-slate-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-semibold text-slate-900">Payroll runs</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                {filteredRuns.length}
                {filteredRuns.length !== runs.length && (
                  <span className="text-blue-400 font-normal">/{runs.length}</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1 sm:max-w-md sm:justify-end">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search period, ID, approver..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white border-slate-200 h-10 rounded-lg"
                />
              </div>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="h-10 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 font-medium px-3 cursor-pointer"
              >
                <option value="all">All years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                className="h-10 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 font-medium px-3 cursor-pointer"
              >
                <option value="all">All types</option>
                <option value="regular">Regular</option>
                <option value="off-cycle">Off-cycle</option>
                <option value="bonus">Bonus</option>
                <option value="13th-month">13th month</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto -mx-1 px-1 scrollbar-thin">
            {(["all", "completed", "draft", "processing", "failed"] as StatusFilter[]).map((s) => {
              const active = statusFilter === s;
              const label = s === "all" ? "All" : RUN_STATUS_PILL[s].label;
              const count = statusCounts[s];
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0",
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {label}
                  <span className={cn("text-xs", active ? "text-white/80" : "text-slate-400")}>
                    {count}
                  </span>
                </button>
              );
            })}
            {filtersActive && (
              <button
                onClick={clearFilters}
                className="h-9 px-3 rounded-full text-sm font-medium inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 whitespace-nowrap shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
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
                <th className="w-10 px-2" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filteredRuns.map((run) => {
                const style = RUN_STATUS_PILL[run.status];
                const typePill = RUN_TYPE_PILL[run.runType];
                return (
                  <tr
                    key={run.id}
                    onClick={() => navigate(`/payroll/run/${run.id}`)}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
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
                    <td className="px-2 py-4 text-right text-slate-400">
                      <ChevronRight className="w-4 h-4 inline" />
                    </td>
                  </tr>
                );
              })}
              {filteredRuns.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-slate-400 text-sm">
                    No payroll runs match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <ul className="md:hidden divide-y divide-slate-100">
          {filteredRuns.length === 0 && (
            <li className="px-4 py-12 text-center text-slate-400 text-sm">
              No payroll runs match your filters.
            </li>
          )}
          {filteredRuns.map((run) => {
            const style = RUN_STATUS_PILL[run.status];
            const typePill = RUN_TYPE_PILL[run.runType];
            return (
              <li
                key={run.id}
                onClick={() => navigate(`/payroll/run/${run.id}`)}
                className="px-4 py-3.5 cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 leading-tight">{run.period}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5 font-mono">{run.id.toUpperCase()}</p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0", style.pill)}>
                    {run.status === "processing" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
                    )}
                    {style.label}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium", typePill.pill)}>
                    {typePill.label}
                  </span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {run.totalNet > 0 ? formatNaira(run.totalNet) : "—"}
                  </span>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between gap-2">
                    <dt>Gross</dt>
                    <dd className="text-slate-700 tabular-nums">
                      {run.totalGross > 0 ? formatNaira(run.totalGross) : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Employees</dt>
                    <dd className="text-slate-700 tabular-nums">{run.employeeCount}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Tax</dt>
                    <dd className="text-slate-700 tabular-nums">
                      {run.totalTax > 0 ? `-${formatNaira(run.totalTax)}` : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Pay date</dt>
                    <dd className="text-slate-700 tabular-nums">{formatDateShort(run.payDate)}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
