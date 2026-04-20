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

export default function PayrollProcessPage() {
  const navigate = useNavigate();

  // Use the first draft run, fall back to the latest run
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
          gross: acc.gross + p.grossPay,
          tax: acc.tax + p.tax,
          pension: acc.pension + p.pension,
          otherDeductions: acc.otherDeductions + p.otherDeductions,
          totalDeductions: acc.totalDeductions + p.totalDeductions,
          net: acc.net + p.netPay,
        }),
        { gross: 0, tax: 0, pension: 0, otherDeductions: 0, totalDeductions: 0, net: 0 }
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
      // Mutate mock data in place so the payroll list reflects the update on return
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

  // ── Employee detail sub-view ──
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
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Breadcrumb + Header */}
      <div className="space-y-3">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/payroll" className="hover:text-slate-900 transition-colors">Payroll</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-medium">Process Payroll</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Process Payroll — {run.period}</h1>
            <p className="text-sm text-slate-500">
              Review each employee's breakdown, send payslips, then finalize disbursement.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/payroll">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Payroll
            </Link>
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="rounded-xl border border-[#efefef] bg-white">
        <div className="flex items-center p-5">
          {steps.map((s, i) => (
            <div key={s.key} className={cn("flex items-center gap-2", i < steps.length - 1 && "flex-1")}>
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                i < stepIndex ? "bg-emerald-500 text-white" :
                i === stepIndex ? "bg-blue-600 text-white" :
                "bg-slate-200 text-slate-500"
              )}>
                {i < stepIndex ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
              </div>
              <span className={cn("text-sm font-medium whitespace-nowrap", i === stepIndex ? "text-slate-900" : "text-slate-500")}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className={cn("flex-1 h-px mx-3", i < stepIndex ? "bg-emerald-400" : "bg-slate-200")} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Step: Review ── */}
      {step === "review" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Review the pay breakdown for <span className="font-medium text-slate-900">{run.employeeCount} employees</span>. Click an employee to see full details.
          </p>

          {/* Totals */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <SummaryTile label="Gross" value={formatNaira(totals.gross)} />
            <SummaryTile label="Tax (PAYE)" value={`-${formatNaira(totals.tax)}`} valueClass="text-slate-700" />
            <SummaryTile label="Pension" value={`-${formatNaira(totals.pension)}`} valueClass="text-slate-700" />
            <SummaryTile label="Other Ded." value={`-${formatNaira(totals.otherDeductions)}`} valueClass="text-slate-700" />
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-[11px] text-blue-700 font-medium">Net Pay</p>
              <p className="text-sm font-semibold text-blue-900 mt-0.5">{formatNaira(totals.net)}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search employee or department..."
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Employees table */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <SortableHeader label="Employee" sortKey="name" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="left" />
                  <SortableHeader label="Department" sortKey="department" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="left" />
                  <SortableHeader label="Gross" sortKey="gross" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                  <SortableHeader label="Tax" sortKey="tax" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                  <SortableHeader label="Deductions" sortKey="deductions" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                  <SortableHeader label="Net Pay" sortKey="net" currentKey={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSorted.map((slip) => (
                  <Fragment key={slip.id}>
                    <tr
                      onClick={() => setSelectedEmployeeId(slip.id)}
                      className="border-b border-[#efefef] cursor-pointer hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="p-3 font-medium">{slip.employeeName}</td>
                      <td className="p-3 text-slate-500">{slip.department}</td>
                      <td className="p-3 text-right font-medium">{formatNaira(slip.grossPay)}</td>
                      <td className="p-3 text-right text-slate-700">-{formatNaira(slip.tax)}</td>
                      <td className="p-3 text-right text-slate-700">-{formatNaira(slip.totalDeductions)}</td>
                      <td className="p-3 text-right font-semibold">{formatNaira(slip.netPay)}</td>
                      <td className="p-3 text-slate-500">
                        <ChevronRight className="w-4 h-4" />
                      </td>
                    </tr>
                  </Fragment>
                ))}
                {filteredSorted.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                      No employees match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Step: Send Payslips ── */}
      {step === "payslips" && (
        <div className="rounded-xl border border-[#efefef] bg-white p-8 max-w-2xl mx-auto w-full">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-slate-900">Send Payslips to Employees</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Payslips for {run.employeeCount} employees will be generated and delivered.
            </p>
          </div>
          <div className="space-y-2.5 rounded-lg border border-[#efefef] p-4 mt-5">
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" checked={emailChecked} onChange={(e) => setEmailChecked(e.target.checked)} className="rounded border-slate-300" />
              Email payslips to all {run.employeeCount} employees
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" checked={publishChecked} onChange={(e) => setPublishChecked(e.target.checked)} className="rounded border-slate-300" />
              Publish to employee self-service portal
            </label>
          </div>
        </div>
      )}

      {/* ── Step: Process ── */}
      {step === "process" && (
        <div className="rounded-xl border border-[#efefef] bg-white p-12 text-center max-w-2xl mx-auto w-full">
          {busy ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-spin" />
              <h3 className="font-medium text-slate-900">Processing payroll...</h3>
              <p className="text-sm text-slate-500 mt-1">Finalizing disbursement. This may take a moment.</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <Play className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-slate-900">Ready to Process</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {payslipsSent ? "Payslips sent. " : ""}Click process to finalize {run.period} payroll. This action cannot be undone.
              </p>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <Button variant="outline" size="sm" asChild disabled={busy}>
          <Link to="/payroll">Cancel</Link>
        </Button>
        <div className="flex items-center gap-2">
          {step === "review" && (
            <Button size="sm" onClick={() => setStep("payslips")}>
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {step === "payslips" && (
            <>
              <Button variant="outline" size="sm" onClick={() => setStep("review")} disabled={busy}>Back</Button>
              <Button size="sm" onClick={handleSendPayslips} disabled={busy || (!emailChecked && !publishChecked)}>
                {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                {busy ? "Sending..." : "Send Payslips"}
              </Button>
            </>
          )}
          {step === "process" && (
            <>
              <Button variant="outline" size="sm" onClick={() => setStep("payslips")} disabled={busy}>Back</Button>
              <Button size="sm" onClick={handleProcess} disabled={busy}>
                {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                {busy ? "Processing..." : "Process Payroll"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Employee Detail View (drill-in) ── */
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
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="space-y-3">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/payroll" className="hover:text-slate-900 transition-colors">Payroll</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={onBack} className="hover:text-slate-900 transition-colors">Process Payroll</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-medium">{slip.employeeName}</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              {slip.employeeName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{slip.employeeName}</h1>
              <p className="text-sm text-slate-500">{slip.department} · {run}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Review
          </Button>
        </div>
      </div>

      {/* Top summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryTile label="Gross Pay" value={formatNaira(slip.grossPay)} />
        <SummaryTile label="PAYE Tax" value={`-${formatNaira(slip.tax)}`} valueClass="text-slate-700" />
        <SummaryTile label="Total Deductions" value={`-${formatNaira(slip.totalDeductions)}`} valueClass="text-slate-700" />
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-[11px] text-blue-700 font-medium">Net Pay</p>
          <p className="text-lg font-semibold text-blue-900 mt-0.5">{formatNaira(slip.netPay)}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Earnings</h3>
          <div className="space-y-2 text-sm">
            <DetailRow label="Basic Salary" value={formatNaira(slip.basicSalary)} />
            <DetailRow label="Housing Allowance" value={formatNaira(slip.housingAllowance)} />
            <DetailRow label="Transport Allowance" value={formatNaira(slip.transportAllowance)} />
            <DetailRow label="Other Allowances" value={formatNaira(slip.otherAllowances)} />
            <div className="pt-2 mt-2 border-t border-[#efefef] flex items-center justify-between">
              <span className="text-xs text-slate-500">Total Allowances</span>
              <span className="font-medium">{formatNaira(totalAllowances)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#efefef]">
              <span className="text-sm font-semibold">Gross Pay</span>
              <span className="font-semibold">{formatNaira(slip.grossPay)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Deductions</h3>
          <div className="space-y-2 text-sm">
            <DetailRow label="PAYE Tax" value={`-${formatNaira(slip.tax)}`} valueClass="text-slate-700" />
            <DetailRow label="Pension" value={`-${formatNaira(slip.pension)}`} valueClass="text-slate-700" />
            <DetailRow label="Other Deductions" value={`-${formatNaira(slip.otherDeductions)}`} valueClass="text-slate-700" />
            <div className="pt-2 mt-2 border-t border-[#efefef] flex items-center justify-between">
              <span className="text-xs text-slate-500">Total Deductions</span>
              <span className="font-medium text-slate-700">-{formatNaira(slip.totalDeductions)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#efefef]">
              <span className="text-sm font-semibold">Net Pay</span>
              <span className="font-semibold text-blue-900">{formatNaira(slip.netPay)}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-[#efefef] bg-white p-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Disbursement</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-500">Bank</p>
              <p className="font-medium mt-0.5">{slip.bankName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Account Number</p>
              <p className="font-mono font-medium mt-0.5">{slip.accountNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Employee ID</p>
              <p className="font-mono font-medium mt-0.5">{slip.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Department</p>
              <p className="font-medium mt-0.5">{slip.department}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared bits ── */
function SummaryTile({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-lg border border-[#efefef] bg-white p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={cn("text-sm font-semibold mt-0.5", valueClass)}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={cn("font-medium", valueClass)}>{value}</span>
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
  return (
    <th className={cn("p-3 text-xs font-medium text-slate-500", align === "right" ? "text-right" : "text-left")}>
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
