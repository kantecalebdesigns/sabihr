import { useState, useMemo, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Loader2,
  Mail,
  Play,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_PAYROLL_RUNS,
  MOCK_PAYSLIPS,
  formatNaira,
} from "@/lib/payroll-mock-data";
import type { EmployeePayslip } from "@/lib/payroll-mock-data";

type Step = "review" | "payslips" | "process";
type SortKey = "name" | "department" | "gross" | "tax" | "deductions" | "net";
type SortDir = "asc" | "desc";

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

export default function PayrollProcessPage() {
  const navigate = useNavigate();

  const run = useMemo(() => {
    return MOCK_PAYROLL_RUNS.find((r) => r.status === "draft") ?? MOCK_PAYROLL_RUNS[0];
  }, []);

  const [step, setStep] = useState<Step>("review");
  const [busy, setBusy] = useState(false);
  const [payslipsSent, setPayslipsSent] = useState(false);
  const [emailChecked, setEmailChecked] = useState(true);
  const [publishChecked, setPublishChecked] = useState(true);

  const [reviewSearch, setReviewSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const previewSlips = MOCK_PAYSLIPS;
  const selectedSlip = useMemo(
    () => previewSlips.find((p) => p.id === selectedEmployeeId) ?? null,
    [previewSlips, selectedEmployeeId]
  );

  const totals = useMemo(
    () =>
      previewSlips.reduce(
        (acc, p) => ({
          basic: acc.basic + p.basicSalary,
          housing: acc.housing + p.housingAllowance,
          transport: acc.transport + p.transportAllowance,
          otherAllowances: acc.otherAllowances + p.otherAllowances,
          gross: acc.gross + p.grossPay,
          tax: acc.tax + p.tax,
          pension: acc.pension + p.pension,
          otherDeductions: acc.otherDeductions + p.otherDeductions,
          totalDeductions: acc.totalDeductions + p.totalDeductions,
          net: acc.net + p.netPay,
        }),
        { basic: 0, housing: 0, transport: 0, otherAllowances: 0, gross: 0, tax: 0, pension: 0, otherDeductions: 0, totalDeductions: 0, net: 0 }
      ),
    [previewSlips]
  );

  const filteredSorted = useMemo(() => {
    const q = reviewSearch.toLowerCase();
    const filtered = previewSlips.filter(
      (p) => !q || p.employeeName.toLowerCase().includes(q) || p.department.toLowerCase().includes(q)
    );
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.employeeName.localeCompare(b.employeeName) * dir;
        case "department":
          return a.department.localeCompare(b.department) * dir;
        case "gross":
          return (a.grossPay - b.grossPay) * dir;
        case "tax":
          return (a.tax - b.tax) * dir;
        case "deductions":
          return (a.totalDeductions - b.totalDeductions) * dir;
        case "net":
          return (a.netPay - b.netPay) * dir;
      }
    });
  }, [previewSlips, reviewSearch, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "department" ? "asc" : "desc");
    }
  };

  const steps: { key: Step; label: string }[] = [
    { key: "review", label: "Review" },
    { key: "payslips", label: "Send Payslips" },
    { key: "process", label: "Process" },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  const handleSendPayslips = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setPayslipsSent(true);
      setStep("process");
    }, 1200);
  };

  const handleProcess = () => {
    setBusy(true);
    setTimeout(() => {
      const idx = MOCK_PAYROLL_RUNS.findIndex((r) => r.id === run.id);
      if (idx >= 0) {
        MOCK_PAYROLL_RUNS[idx] = {
          ...MOCK_PAYROLL_RUNS[idx],
          status: "completed",
          totalGross: totals.gross,
          totalNet: totals.net,
          totalDeductions: totals.totalDeductions,
          processedDate: new Date().toISOString().split("T")[0],
          approvedBy: "Admin User",
        };
      }
      navigate("/payroll", { state: { processed: run.id } });
    }, 1500);
  };

  if (selectedSlip) {
    return (
      <EmployeeDetailView
        slip={selectedSlip}
        run={run.period}
        onBack={() => setSelectedEmployeeId(null)}
      />
    );
  }

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Breadcrumb + Header */}
      <div className="space-y-3">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/payroll" className="hover:text-slate-900 transition-colors">Payroll</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Process payroll</span>
        </nav>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Process payroll · {run.period}</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Review each employee's breakdown, send payslips, then finalize disbursement.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white shrink-0"
          >
            <Link to="/payroll">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Payroll
            </Link>
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s.key} className={cn("flex items-center gap-2", i < steps.length - 1 && "flex-1")}>
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                  i < stepIndex
                    ? "bg-emerald-500 text-white"
                    : i === stepIndex
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
                )}
              >
                {i < stepIndex ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-semibold whitespace-nowrap",
                  i === stepIndex ? "text-slate-900" : "text-slate-500"
                )}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={cn("flex-1 h-px mx-3", i < stepIndex ? "bg-emerald-400" : "bg-slate-200")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step: Review */}
      {step === "review" && (
        <div className="space-y-5">
          {/* Payslip-style run totals */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/70">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Run summary · {run.period}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Combined earnings and deductions across {run.employeeCount} employees</p>
              </div>
              <span className="text-xs text-slate-500 font-mono tabular-nums">{run.id.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/70">
              {/* Earnings side */}
              <div className="px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Earnings</h4>
                </div>
                <dl className="space-y-2.5 text-sm">
                  <LedgerRow label="Basic salary" value={formatNaira(totals.basic)} />
                  <LedgerRow label="Housing allowance" value={formatNaira(totals.housing)} />
                  <LedgerRow label="Transport allowance" value={formatNaira(totals.transport)} />
                  <LedgerRow label="Other allowances" value={formatNaira(totals.otherAllowances)} />
                </dl>
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Total allowances</span>
                    <span className="text-sm font-semibold text-slate-700 tabular-nums">
                      {formatNaira(totals.housing + totals.transport + totals.otherAllowances)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-900">Gross pay</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">{formatNaira(totals.gross)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions side */}
              <div className="px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Deductions</h4>
                </div>
                <dl className="space-y-2.5 text-sm">
                  <LedgerRow label="PAYE tax" value={`-${formatNaira(totals.tax)}`} negative />
                  <LedgerRow label="Pension" value={`-${formatNaira(totals.pension)}`} negative />
                  <LedgerRow label="Other deductions" value={`-${formatNaira(totals.otherDeductions)}`} negative />
                  <LedgerRow label="—" value="" blank />
                </dl>
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Total deductions</span>
                    <span className="text-sm font-semibold text-rose-700 tabular-nums">-{formatNaira(totals.totalDeductions)}</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-900">After deductions</span>
                    <span className="text-base font-bold text-slate-700 tabular-nums">-{formatNaira(totals.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net pay footer */}
            <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Total net pay</p>
                <p className="text-xs text-blue-700/80 mt-0.5">Disbursement across {run.employeeCount} employees</p>
              </div>
              <p className="text-2xl font-bold text-blue-900 tabular-nums leading-none">{formatNaira(totals.net)}</p>
            </div>
          </div>

          {/* Table card */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search employee or department..."
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    className="pl-9 bg-white border-slate-200 h-10 rounded-lg"
                  />
                </div>
                <p className="text-sm text-slate-500 whitespace-nowrap">{filteredSorted.length} employees</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200/70">
                    <SortableHeader label="Employee" sortKey="name" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="left" />
                    <SortableHeader label="Gross" sortKey="gross" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                    <SortableHeader label="Tax" sortKey="tax" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                    <SortableHeader label="Deductions" sortKey="deductions" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                    <SortableHeader label="Net pay" sortKey="net" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                    <th className="w-10 px-2" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.map((slip) => (
                    <Fragment key={slip.id}>
                      <tr
                        onClick={() => setSelectedEmployeeId(slip.id)}
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
                    </Fragment>
                  ))}
                  {filteredSorted.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                        No employees match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Step: Send Payslips */}
      {step === "payslips" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-8 max-w-2xl mx-auto w-full shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Send payslips to employees</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Payslips for {run.employeeCount} employees will be generated and delivered.
            </p>
          </div>
          <div className="space-y-2.5 rounded-xl border border-slate-200/70 p-4 mt-5 bg-slate-50/40">
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={emailChecked}
                onChange={(e) => setEmailChecked(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              Email payslips to all {run.employeeCount} employees
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={publishChecked}
                onChange={(e) => setPublishChecked(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              Publish to employee self-service portal
            </label>
          </div>
        </div>
      )}

      {/* Step: Process */}
      {step === "process" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center max-w-2xl mx-auto w-full shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
          {busy ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-spin" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Processing payroll...</h3>
              <p className="text-sm text-slate-500 mt-1">Finalizing disbursement. This may take a moment.</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <Play className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Ready to process</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {payslipsSent ? "Payslips sent. " : ""}Click process to finalize {run.period} payroll. This action cannot be undone.
              </p>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <Button
          variant="outline"
          asChild
          disabled={busy}
          className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
        >
          <Link to="/payroll">Cancel</Link>
        </Button>
        <div className="flex items-center gap-2">
          {step === "review" && (
            <Button
              onClick={() => setStep("payslips")}
              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          {step === "payslips" && (
            <>
              <Button
                variant="outline"
                onClick={() => setStep("review")}
                disabled={busy}
                className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
              >
                Back
              </Button>
              <Button
                onClick={handleSendPayslips}
                disabled={busy || (!emailChecked && !publishChecked)}
                className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
              >
                {busy ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Mail className="w-4 h-4 mr-1" />}
                {busy ? "Sending..." : "Send payslips"}
              </Button>
            </>
          )}
          {step === "process" && (
            <>
              <Button
                variant="outline"
                onClick={() => setStep("payslips")}
                disabled={busy}
                className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
              >
                Back
              </Button>
              <Button
                onClick={handleProcess}
                disabled={busy}
                className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
              >
                {busy ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
                {busy ? "Processing..." : "Process payroll"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployeeDetailView({
  slip,
  run,
  onBack,
}: {
  slip: EmployeePayslip;
  run: string;
  onBack: () => void;
}) {
  const totalAllowances = slip.housingAllowance + slip.transportAllowance + slip.otherAllowances;

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      {/* Breadcrumb + header */}
      <div className="space-y-3">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/payroll" className="hover:text-slate-900 transition-colors">Payroll</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={onBack} className="hover:text-slate-900 transition-colors">Process payroll</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">{slip.employeeName}</span>
        </nav>
        <div className="flex items-center justify-between gap-4">
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
                {slip.department} <span className="text-slate-400">·</span> {run}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onBack}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to review
          </Button>
        </div>
      </div>

      {/* Top summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryTile label="Gross pay" value={formatNaira(slip.grossPay)} />
        <SummaryTile label="PAYE tax" value={`-${formatNaira(slip.tax)}`} />
        <SummaryTile label="Total deductions" value={`-${formatNaira(slip.totalDeductions)}`} />
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
          <p className="text-xs text-blue-700 font-semibold">Net pay</p>
          <p className="text-xl font-bold text-blue-900 mt-1 tabular-nums leading-none">{formatNaira(slip.netPay)}</p>
        </div>
      </div>

      {/* Payslip-style breakdown */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/70">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Payslip · {run}</h3>
          <span className="text-xs text-slate-500 font-mono tabular-nums">{slip.id.toUpperCase()}</span>
        </div>

        {/* Two-column ledger */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/70">
          {/* Earnings side */}
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

          {/* Deductions side */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Deductions</h4>
            </div>
            <dl className="space-y-2.5 text-sm">
              <LedgerRow label="PAYE tax" value={`-${formatNaira(slip.tax)}`} negative />
              <LedgerRow label="Pension" value={`-${formatNaira(slip.pension)}`} negative />
              <LedgerRow label="Other deductions" value={`-${formatNaira(slip.otherDeductions)}`} negative />
              <LedgerRow label="—" value="" blank />
            </dl>
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Total deductions</span>
                <span className="text-sm font-semibold text-rose-700 tabular-nums">-{formatNaira(slip.totalDeductions)}</span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-900">After deductions</span>
                <span className="text-base font-bold text-slate-700 tabular-nums">-{formatNaira(slip.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net pay footer */}
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Net pay</p>
            <p className="text-xs text-blue-700/80 mt-0.5">Gross minus total deductions</p>
          </div>
          <p className="text-2xl font-bold text-blue-900 tabular-nums leading-none">{formatNaira(slip.netPay)}</p>
        </div>

        {/* Disbursement footer */}
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

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums leading-none">{value}</p>
    </div>
  );
}

function LedgerRow({
  label,
  value,
  negative,
  blank,
}: {
  label: string;
  value: string;
  negative?: boolean;
  blank?: boolean;
}) {
  if (blank) {
    return <div className="flex items-baseline justify-between invisible">&nbsp;</div>;
  }
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-slate-600">{label}</dt>
      <dd className={cn("font-semibold tabular-nums", negative ? "text-rose-700" : "text-slate-900")}>{value}</dd>
    </div>
  );
}

function SortableHeader({
  label,
  sortKey,
  currentKey,
  dir,
  onSort,
  align,
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  align: "left" | "right";
}) {
  const active = currentKey === sortKey;
  const isFirst = sortKey === "name";
  return (
    <th
      className={cn(
        "font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5",
        align === "right" ? "text-right" : "text-left",
        isFirst && "pl-5"
      )}
    >
      <button
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 hover:text-slate-900 transition-colors",
          active && "text-slate-900",
          align === "right" && "flex-row-reverse"
        )}
      >
        {label}
        <span className={cn("text-[10px]", !active && "opacity-30")}>
          {active ? (dir === "asc" ? "▲" : "▼") : "▲"}
        </span>
      </button>
    </th>
  );
}
