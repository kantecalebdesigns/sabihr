import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_PAYROLL_RUNS,
  formatNaira,
  getPayslipsForRun,
} from "@/lib/payroll-mock-data";
import type {
  EmployeePayslip,
  PayrollRun,
  PayrollRunType,
  PayrollStatus,
} from "@/lib/payroll-mock-data";

const AVATAR_PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const STATUS_PILL: Record<PayrollStatus, { label: string; dot: string; pill: string }> = {
  draft: { label: "Draft", dot: "bg-slate-400", pill: "bg-slate-100 text-slate-600" },
  processing: { label: "Processing", dot: "bg-blue-500", pill: "bg-blue-50 text-blue-700" },
  completed: { label: "Completed", dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700" },
  failed: { label: "Failed", dot: "bg-rose-500", pill: "bg-rose-50 text-rose-700" },
};

const TYPE_PILL: Record<PayrollRunType, { label: string; pill: string }> = {
  regular: { label: "Regular", pill: "bg-slate-100 text-slate-700" },
  "off-cycle": { label: "Off-cycle", pill: "bg-violet-50 text-violet-700" },
  bonus: { label: "Bonus", pill: "bg-indigo-50 text-indigo-700" },
  "13th-month": { label: "13th month", pill: "bg-amber-50 text-amber-700" },
};

function formatDateLong(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PayrollRunDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const run = useMemo(() => MOCK_PAYROLL_RUNS.find((r) => r.id === id) ?? null, [id]);

  const payslips = useMemo(() => (run ? getPayslipsForRun(run) : []), [run]);

  const [search, setSearch] = useState("");
  const filteredPayslips = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payslips;
    return payslips.filter(
      (p) =>
        p.employeeName.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.employeeId.toLowerCase().includes(q)
    );
  }, [payslips, search]);

  const [selectedSlip, setSelectedSlip] = useState<EmployeePayslip | null>(null);

  if (!run) {
    return (
      <div className="max-w-[1500px] space-y-5">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center">
          <p className="text-base font-bold text-slate-900">Payroll run not found</p>
          <p className="text-sm text-slate-500 mt-1">The run ID “{id}” doesn't exist.</p>
          <Button
            asChild
            className="mt-4 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            <Link to="/payroll">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to payroll
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (selectedSlip) {
    return <PayslipDetailView slip={selectedSlip} run={run} onBack={() => setSelectedSlip(null)} />;
  }

  const statusStyle = STATUS_PILL[run.status];
  const typeStyle = TYPE_PILL[run.runType];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Breadcrumb + header */}
      <div className="space-y-3">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/payroll" className="hover:text-slate-900 transition-colors">Payroll</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">{run.period}</span>
        </nav>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{run.period}</h1>
              <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", statusStyle.pill)}>
                {run.status === "processing" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <span className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
                )}
                {statusStyle.label}
              </span>
              <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium", typeStyle.pill)}>
                {typeStyle.label}
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-mono">{run.id.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/payroll")}
              className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Run metadata strip */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/70">
        <MetaCell label="Pay date" value={formatDateLong(run.payDate)} />
        <MetaCell label="Processed" value={formatDateLong(run.processedDate)} />
        <MetaCell label="Employees" value={`${run.employeeCount}`} />
        <MetaCell label="Approved by" value={run.approvedBy ?? "—"} />
      </div>

      {/* Earnings/Deductions ledger */}
      {run.totalGross > 0 ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/70">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Run summary</h3>
              <p className="text-xs text-slate-500 mt-0.5">Combined earnings and deductions across {run.employeeCount} employees</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/70">
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Earnings</h4>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-sm font-bold text-slate-900">Gross pay</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">{formatNaira(run.totalGross)}</span>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Deductions</h4>
              </div>
              <dl className="space-y-2.5 text-sm">
                <LedgerRow label="PAYE tax" value={`-${formatNaira(run.totalTax)}`} negative />
                <LedgerRow label="Pension" value={`-${formatNaira(run.totalPension)}`} negative />
                <LedgerRow
                  label="Other"
                  value={`-${formatNaira(Math.max(0, run.totalDeductions - run.totalTax - run.totalPension))}`}
                  negative
                />
              </dl>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-900">Total deductions</span>
                <span className="text-base font-bold text-rose-700 tabular-nums">-{formatNaira(run.totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Total net pay</p>
              <p className="text-xs text-blue-700/80 mt-0.5">Disbursement across {run.employeeCount} employees</p>
            </div>
            <p className="text-2xl font-bold text-blue-900 tabular-nums leading-none">{formatNaira(run.totalNet)}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-slate-900">No totals recorded</p>
          <p className="text-xs text-slate-500 mt-1">This run hasn't been processed yet.</p>
        </div>
      )}

      {/* Payslips table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between px-5 py-4 border-b border-slate-200/70">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-semibold text-slate-900">Payslips</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
              {filteredPayslips.length}
              {filteredPayslips.length !== payslips.length && (
                <span className="text-blue-400 font-normal">/{payslips.length}</span>
              )}
            </span>
          </div>
          {payslips.length > 0 && (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search employee or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-slate-200 h-10 rounded-lg"
              />
            </div>
          )}
        </div>

        {payslips.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-900">No per-employee payslips on file</p>
            <p className="text-xs text-slate-500 mt-1">This run's totals are summary-only.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Employee</th>
                  <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Gross</th>
                  <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Tax</th>
                  <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Deductions</th>
                  <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Net</th>
                  <th className="w-10 px-2" aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {filteredPayslips.map((slip) => (
                  <tr
                    key={slip.id}
                    onClick={() => setSelectedSlip(slip)}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-4 pl-5 pr-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0",
                            avatarColor(slip.employeeId)
                          )}
                        >
                          {initialsOf(slip.employeeName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 leading-tight">{slip.employeeName}</p>
                          <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">{slip.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-5 text-right font-semibold text-slate-900 tabular-nums">{formatNaira(slip.grossPay)}</td>
                    <td className="py-4 pr-5 text-right text-slate-600 tabular-nums">-{formatNaira(slip.tax)}</td>
                    <td className="py-4 pr-5 text-right text-slate-600 tabular-nums">-{formatNaira(slip.totalDeductions)}</td>
                    <td className="py-4 pr-5 text-right font-bold text-slate-900 tabular-nums">{formatNaira(slip.netPay)}</td>
                    <td className="px-2 py-4 text-right text-slate-400">
                      <ChevronRight className="w-4 h-4 inline" />
                    </td>
                  </tr>
                ))}
                {filteredPayslips.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                      No employees match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function LedgerRow({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-slate-600">{label}</dt>
      <dd className={cn("font-semibold tabular-nums", negative ? "text-rose-700" : "text-slate-900")}>{value}</dd>
    </div>
  );
}

function PayslipDetailView({
  slip,
  run,
  onBack,
}: {
  slip: EmployeePayslip;
  run: PayrollRun;
  onBack: () => void;
}) {
  const totalAllowances = slip.housingAllowance + slip.transportAllowance + slip.otherAllowances;
  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="space-y-3">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/payroll" className="hover:text-slate-900 transition-colors">Payroll</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={onBack} className="hover:text-slate-900 transition-colors">{run.period}</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">{slip.employeeName}</span>
        </nav>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0",
                avatarColor(slip.employeeId)
              )}
            >
              {initialsOf(slip.employeeName)}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">{slip.employeeName}</h1>
              <p className="text-sm text-slate-500 leading-tight mt-0.5">
                {slip.department} <span className="text-slate-400">·</span> {run.period}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onBack}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to run
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/70">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Payslip · {run.period}</h3>
          <span className="text-xs text-slate-500 font-mono tabular-nums">{slip.id.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/70">
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Earnings</h4>
            </div>
            <dl className="space-y-2.5 text-sm">
              <LedgerRow label="Basic salary" value={formatNaira(slip.basicSalary)} />
              <LedgerRow label="Housing allowance" value={formatNaira(slip.housingAllowance)} />
              <LedgerRow label="Transport allowance" value={formatNaira(slip.transportAllowance)} />
              <LedgerRow label="Other allowances" value={formatNaira(slip.otherAllowances)} />
            </dl>
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Total allowances</span>
                <span className="text-sm font-semibold text-slate-700 tabular-nums">{formatNaira(totalAllowances)}</span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-900">Gross pay</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">{formatNaira(slip.grossPay)}</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Deductions</h4>
            </div>
            <dl className="space-y-2.5 text-sm">
              <LedgerRow label="PAYE tax" value={`-${formatNaira(slip.tax)}`} negative />
              <LedgerRow label="Pension" value={`-${formatNaira(slip.pension)}`} negative />
              <LedgerRow label="Other deductions" value={`-${formatNaira(slip.otherDeductions)}`} negative />
            </dl>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-900">Total deductions</span>
              <span className="text-base font-bold text-rose-700 tabular-nums">-{formatNaira(slip.totalDeductions)}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Net pay</p>
            <p className="text-xs text-blue-700/80 mt-0.5">Gross minus total deductions</p>
          </div>
          <p className="text-2xl font-bold text-blue-900 tabular-nums leading-none">{formatNaira(slip.netPay)}</p>
        </div>

        <div className="px-6 py-4 border-t border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bank</p>
            <p className="font-semibold text-slate-900 mt-1">{slip.bankName}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Account</p>
            <p className="font-mono font-semibold text-slate-900 mt-1 tabular-nums">{slip.accountNumber}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Employee ID</p>
            <p className="font-mono font-semibold text-slate-900 mt-1 tabular-nums">{slip.employeeId}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Department</p>
            <p className="font-semibold text-slate-900 mt-1">{slip.department}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
