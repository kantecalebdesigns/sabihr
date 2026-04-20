import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  DollarSign,
  Download,
  Play,
  Eye,
  Users,
  TrendingUp,
  Banknote,
  FileText,
  ClipboardCheck,
  Calculator,
  CheckSquare,
  Zap,
  PenTool,
  RotateCcw,
  Settings,
  AlertCircle,
  Plus,
  Check,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_PAYROLL_RUNS as INITIAL_RUNS,
  MOCK_PAYSLIPS,
  PAYROLL_STATUS_STYLES,
  PAYSLIP_STATUS_STYLES,
  formatNaira,
} from "@/lib/payroll-mock-data";
import type { PayrollStatus, PayslipStatus, PayrollRun } from "@/lib/payroll-mock-data";

type ViewMode = "runs" | "payslips" | "input-review" | "computation" | "approval" | "off-cycle" | "adjustments" | "auto-payroll";

const VIEW_TABS: { key: ViewMode; label: string; icon: typeof Play }[] = [
  { key: "runs", label: "Payroll Runs", icon: Play },
  { key: "payslips", label: "Payslips", icon: FileText },
  { key: "input-review", label: "Input Review", icon: ClipboardCheck },
  { key: "computation", label: "Computation", icon: Calculator },
  { key: "approval", label: "Approval", icon: CheckSquare },
  { key: "off-cycle", label: "Off-Cycle", icon: Zap },
  { key: "adjustments", label: "Adjustments", icon: PenTool },
  { key: "auto-payroll", label: "Auto-Payroll", icon: RotateCcw },
];

/* ── Toast-like banner ── */
function Toast({ message, type = "success", onDismiss }: { message: string; type?: "success" | "info"; onDismiss: () => void }) {
  return (
    <div className={cn(
      "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm",
      type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-blue-50 border-blue-200 text-blue-800"
    )}>
      <div className="flex items-center gap-2">
        {type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
        {message}
      </div>
      <button onClick={onDismiss} className="p-0.5 hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

export default function PayrollPage() {
  const [view, setView] = useState<ViewMode>("runs");
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [runs] = useState<PayrollRun[]>(INITIAL_RUNS);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const currentRun = runs[0];
  const completedRuns = runs.filter((r) => r.status === "completed");
  // Prefer the completed run that actually has payslips, fall back to newest
  const lastCompletedRun = completedRuns.find((r) => MOCK_PAYSLIPS.some((p) => p.payrollRunId === r.id)) ?? completedRuns[0];

  const filteredPayslips = useMemo(() => {
    const runId = selectedRunId ?? lastCompletedRun?.id;
    if (!runId) return [];
    const q = search.toLowerCase();
    return MOCK_PAYSLIPS.filter((p) => {
      const matchesRun = p.payrollRunId === runId;
      const matchesSearch =
        !q ||
        p.employeeName.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q);
      return matchesRun && matchesSearch;
    });
  }, [selectedRunId, search, lastCompletedRun?.id]);

  const payslipTotals = useMemo(() => {
    return filteredPayslips.reduce(
      (acc, p) => ({
        gross: acc.gross + p.grossPay,
        net: acc.net + p.netPay,
        deductions: acc.deductions + p.totalDeductions,
      }),
      { gross: 0, net: 0, deductions: 0 }
    );
  }, [filteredPayslips]);

  const handleExport = () => {
    setToast({ message: "Payroll data exported to CSV.", type: "success" });
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Payroll Management
          </h1>
          <p className="text-sm text-slate-500">
            Review, process, and manage payroll for your team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {currentRun.status === "draft" && (
            <Button asChild>
              <Link to="/payroll/process">
                <Play className="w-4 h-4 mr-2" />
                Process {currentRun.period}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {lastCompletedRun ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Banknote className="w-4 h-4" />
              <span className="text-xs font-medium">Last Gross Pay</span>
            </div>
            <p className="text-xl font-semibold">{formatNaira(lastCompletedRun.totalGross)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{lastCompletedRun.period}</p>
          </div>
          <div className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Last Net Pay</span>
            </div>
            <p className="text-xl font-semibold">{formatNaira(lastCompletedRun.totalNet)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{lastCompletedRun.period}</p>
          </div>
          <div className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Total Deductions</span>
            </div>
            <p className="text-xl font-semibold">{formatNaira(lastCompletedRun.totalDeductions)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{lastCompletedRun.period}</p>
          </div>
          <div className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Employees Paid</span>
            </div>
            <p className="text-xl font-semibold">{lastCompletedRun.employeeCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{lastCompletedRun.period}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#efefef] bg-white p-6 text-center">
          <Banknote className="w-8 h-8 mx-auto mb-2 text-slate-500/40" />
          <p className="text-sm font-medium text-slate-900">No payroll processed yet</p>
          <p className="text-xs text-slate-500 mt-1">Process your first payroll run to see summary data here</p>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex items-center gap-1 border-b border-[#efefef] overflow-x-auto">
        {VIEW_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => { setView(tab.key); setSearch(""); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                view === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Payroll Runs ── */}
      {view === "runs" && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="p-3 text-left text-xs font-medium text-slate-500">Period</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
                <th className="p-3 text-right text-xs font-medium text-slate-500">Gross Pay</th>
                <th className="p-3 text-right text-xs font-medium text-slate-500">Deductions</th>
                <th className="p-3 text-right text-xs font-medium text-slate-500">Net Pay</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Employees</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Processed</th>
                <th className="p-3 text-left text-xs font-medium text-slate-500">Approved By</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => {
                const statusStyle = PAYROLL_STATUS_STYLES[run.status as PayrollStatus];
                return (
                  <tr key={run.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-medium">{run.period}</td>
                    <td className={cn("p-3 text-sm font-medium", statusStyle?.color)}>
                      <span className="flex items-center gap-1.5">
                        {run.status === "processing" && <Loader2 className="w-3 h-3 animate-spin" />}
                        {statusStyle?.label}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{run.totalGross > 0 ? formatNaira(run.totalGross) : "—"}</td>
                    <td className="p-3 text-right text-slate-500">{run.totalDeductions > 0 ? formatNaira(run.totalDeductions) : "—"}</td>
                    <td className="p-3 text-right font-medium">{run.totalNet > 0 ? formatNaira(run.totalNet) : "—"}</td>
                    <td className="p-3">{run.employeeCount}</td>
                    <td className="p-3 text-slate-500 text-xs">
                      {run.processedDate
                        ? new Date(run.processedDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="p-3 text-slate-500 text-xs">{run.approvedBy ?? "—"}</td>
                    <td className="p-3">
                      {run.status === "completed" && (
                        <button
                          onClick={() => { setSelectedRunId(run.id); setView("payslips"); }}
                          className="p-1.5 rounded-lg hover:bg-[#f8fafc] text-slate-500 transition-colors"
                          title="View payslips"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Payslips ── */}
      {view === "payslips" && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input placeholder="Search employee..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="text-xs text-slate-500">
              Showing payslips for <span className="font-medium text-slate-900">{runs.find((r) => r.id === (selectedRunId ?? lastCompletedRun?.id))?.period ?? "—"}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#efefef] bg-white p-3 text-center">
              <p className="text-xs text-slate-500">Total Gross</p>
              <p className="text-lg font-semibold">{formatNaira(payslipTotals.gross)}</p>
            </div>
            <div className="rounded-xl border border-[#efefef] bg-white p-3 text-center">
              <p className="text-xs text-slate-500">Total Deductions</p>
              <p className="text-lg font-semibold">{formatNaira(payslipTotals.deductions)}</p>
            </div>
            <div className="rounded-xl border border-[#efefef] bg-white p-3 text-center">
              <p className="text-xs text-slate-500">Total Net</p>
              <p className="text-lg font-semibold">{formatNaira(payslipTotals.net)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Basic</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Allowances</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Gross</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Tax</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Pension</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Net Pay</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Bank</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayslips.map((slip) => {
                  const statusStyle = PAYSLIP_STATUS_STYLES[slip.status as PayslipStatus];
                  const totalAllowances = slip.housingAllowance + slip.transportAllowance + slip.otherAllowances;
                  return (
                    <tr key={slip.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-medium">{slip.employeeName}</td>
                      <td className="p-3 text-slate-500">{slip.department}</td>
                      <td className="p-3 text-right">{formatNaira(slip.basicSalary)}</td>
                      <td className="p-3 text-right text-slate-500">{formatNaira(totalAllowances)}</td>
                      <td className="p-3 text-right font-medium">{formatNaira(slip.grossPay)}</td>
                      <td className="p-3 text-right text-slate-700">-{formatNaira(slip.tax)}</td>
                      <td className="p-3 text-right text-slate-700">-{formatNaira(slip.pension)}</td>
                      <td className="p-3 text-right font-semibold">{formatNaira(slip.netPay)}</td>
                      <td className={cn("p-3 text-sm font-medium", statusStyle?.color)}>{statusStyle?.label}</td>
                      <td className="p-3 text-xs text-slate-500">
                        <div>{slip.bankName}</div>
                        <div className="font-mono">{slip.accountNumber}</div>
                      </td>
                    </tr>
                  );
                })}
                {filteredPayslips.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-500">
                      <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium text-slate-900">No payslips found</p>
                      <p className="text-xs mt-1 mb-3">
                        {completedRuns.length > 0
                          ? "Click the eye icon on a completed payroll run to view its payslips"
                          : "Process a payroll run first, then view payslips here"}
                      </p>
                      {completedRuns.length > 0 && (
                        <button
                          onClick={() => setView("runs")}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Go to Payroll Runs
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Input Review ── */}
      {view === "input-review" && <InputReviewSection />}

      {/* ── Computation ── */}
      {view === "computation" && <ComputationSection />}

      {/* ── Approval ── */}
      {view === "approval" && <ApprovalSection />}

      {/* ── Off-Cycle ── */}
      {view === "off-cycle" && <OffCycleSection />}

      {/* ── Adjustments ── */}
      {view === "adjustments" && <AdjustmentsSection />}

      {/* ── Auto-Payroll ── */}
      {view === "auto-payroll" && <AutoPayrollSection />}
    </div>
  );
}


/* ── Input Review ── */
function InputReviewSection() {
  const [search, setSearch] = useState("");
  const [inputs, setInputs] = useState([
    { id: "ir-1", employee: "Adebayo Ogunlesi", department: "Engineering", type: "Overtime", hours: 12, rate: 5000, amount: 60000, status: "pending" as "pending" | "approved" | "rejected" },
    { id: "ir-2", employee: "Fatima Abdullahi", department: "HR", type: "Bonus", hours: 0, rate: 0, amount: 45000, status: "pending" as "pending" | "approved" | "rejected" },
  ]);

  const updateInputStatus = (id: string, status: "approved" | "rejected") => {
    setInputs((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
  };

  const statusStyles: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "text-amber-700" },
    approved: { label: "Approved", color: "text-emerald-700" },
    rejected: { label: "Rejected", color: "text-red-700" },
  };

  const filtered = inputs.filter((i) => {
    const q = search.toLowerCase();
    return !q || i.employee.toLowerCase().includes(q) || i.type.toLowerCase().includes(q);
  });

  return (
    <>
      <p className="text-sm text-slate-500">Review and approve payroll inputs like overtime, bonuses, and deductions before they are included in the next payroll run.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={ClipboardCheck} label="Total Inputs" value={String(inputs.length)} />
        <SummaryCard icon={AlertCircle} label="Pending Review" value={String(inputs.filter((i) => i.status === "pending").length)} />
        <SummaryCard icon={CheckSquare} label="Approved" value={String(inputs.filter((i) => i.status === "approved").length)} />
        <SummaryCard icon={Banknote} label="Total Amount" value={formatNaira(inputs.reduce((s, i) => s + i.amount, 0))} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input placeholder="Search inputs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Type</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Hours</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Rate</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Amount</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((input) => {
              const style = statusStyles[input.status];
              return (
                <tr key={input.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-medium">{input.employee}</td>
                  <td className="p-3 text-slate-500">{input.department}</td>
                  <td className="p-3">{input.type}</td>
                  <td className="p-3 text-right">{input.hours || "—"}</td>
                  <td className="p-3 text-right">{input.rate ? formatNaira(input.rate) : "—"}</td>
                  <td className={cn("p-3 text-right font-medium", input.amount < 0 ? "text-slate-700" : "")}>{formatNaira(Math.abs(input.amount))}{input.amount < 0 ? " (Ded)" : ""}</td>
                  <td className={cn("p-3 text-sm font-medium", style.color)}>{style.label}</td>
                  <td className="p-3">
                    {input.status === "pending" && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateInputStatus(input.id, "approved")} className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve"><Check className="w-4 h-4" strokeWidth={2.5} /></button>
                        <button onClick={() => updateInputStatus(input.id, "rejected")} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" title="Reject"><X className="w-4 h-4" strokeWidth={2.5} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <EmptyRow colSpan={8} message="No payroll inputs to review" sub="Inputs like overtime, bonuses, and deductions will appear here" />}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Computation ── */
function ComputationSection() {
  const computations = [
    { id: "c-1", employee: "Adebayo Ogunlesi", basic: 850000, allowances: 350000, gross: 1200000, paye: 180000, pension: 96000, nhf: 21250, totalDed: 297250, net: 902750 },
    { id: "c-2", employee: "Fatima Abdullahi", basic: 700000, allowances: 300000, gross: 1000000, paye: 150000, pension: 80000, nhf: 17500, totalDed: 247500, net: 752500 },
    { id: "c-3", employee: "Emeka Okafor", basic: 500000, allowances: 200000, gross: 700000, paye: 95000, pension: 56000, nhf: 12500, totalDed: 163500, net: 536500 },
    { id: "c-4", employee: "Aisha Mohammed", basic: 550000, allowances: 225000, gross: 775000, paye: 108000, pension: 62000, nhf: 13750, totalDed: 183750, net: 591250 },
  ];

  return (
    <>
      <p className="text-sm text-slate-500">Detailed breakdown of salary computations including PAYE tax, pension, and NHF deductions for the current period.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Calculator} label="Total Gross" value={formatNaira(computations.reduce((s, c) => s + c.gross, 0))} />
        <SummaryCard icon={TrendingUp} label="Total Deductions" value={formatNaira(computations.reduce((s, c) => s + c.totalDed, 0))} />
        <SummaryCard icon={DollarSign} label="Total Net" value={formatNaira(computations.reduce((s, c) => s + c.net, 0))} />
        <SummaryCard icon={Users} label="Employees" value={String(computations.length)} />
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Basic</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Allowances</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Gross</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">PAYE</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Pension</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">NHF</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Total Ded.</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {computations.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="p-3 font-medium">{c.employee}</td>
                <td className="p-3 text-right">{formatNaira(c.basic)}</td>
                <td className="p-3 text-right text-slate-500">{formatNaira(c.allowances)}</td>
                <td className="p-3 text-right font-medium">{formatNaira(c.gross)}</td>
                <td className="p-3 text-right text-slate-700">-{formatNaira(c.paye)}</td>
                <td className="p-3 text-right text-slate-700">-{formatNaira(c.pension)}</td>
                <td className="p-3 text-right text-slate-700">-{formatNaira(c.nhf)}</td>
                <td className="p-3 text-right text-slate-700 font-medium">-{formatNaira(c.totalDed)}</td>
                <td className="p-3 text-right font-semibold">{formatNaira(c.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Approval ── */
function ApprovalSection() {
  const [approvals, setApprovals] = useState([
    { id: "a-1", period: "April 2026", step: "HR Review", assignee: "Fatima Abdullahi", status: "pending" as "pending" | "waiting" | "approved" | "rejected", submittedAt: "2026-04-02T10:00:00", grossAmount: 8450000 },
    { id: "a-2", period: "April 2026", step: "Finance Review", assignee: "Chibueze Okoro", status: "waiting" as "pending" | "waiting" | "approved" | "rejected", submittedAt: "", grossAmount: 8450000 },
    { id: "a-3", period: "April 2026", step: "MD Approval", assignee: "CEO", status: "waiting" as "pending" | "waiting" | "approved" | "rejected", submittedAt: "", grossAmount: 8450000 },
  ]);

  const updateApprovalStatus = (id: string, status: "approved" | "rejected") => {
    setApprovals((prev) => {
      const updated = prev.map((item) => item.id === id ? { ...item, status } : item);
      if (status === "approved") {
        const approvedItem = prev.find((item) => item.id === id);
        if (approvedItem) {
          const nextWaiting = updated.find((item) => item.period === approvedItem.period && item.status === "waiting");
          if (nextWaiting) {
            return updated.map((item) => item.id === nextWaiting.id ? { ...item, status: "pending" as const } : item);
          }
        }
      }
      return updated;
    });
  };

  const approvalStyles: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "text-amber-700" },
    waiting: { label: "Waiting", color: "text-gray-500" },
    approved: { label: "Approved", color: "text-emerald-700" },
    rejected: { label: "Rejected", color: "text-red-700" },
  };

  return (
    <>
      <p className="text-sm text-slate-500">Payroll requires approval from HR, Finance, and Management before disbursement. Each step unlocks the next.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <SummaryCard icon={CheckSquare} label="Pending Approvals" value={String(approvals.filter((a) => a.status === "pending").length)} />
        <SummaryCard icon={AlertCircle} label="Waiting" value={String(approvals.filter((a) => a.status === "waiting").length)} />
        <SummaryCard icon={CheckSquare} label="Completed" value={String(approvals.filter((a) => a.status === "approved").length)} />
      </div>

      {/* Step visualizer */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <p className="text-xs font-medium text-slate-500 mb-3">April 2026 Approval Progress</p>
        <div className="flex items-center gap-2">
          {approvals.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                a.status === "approved" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                a.status === "pending" ? "border-amber-200 bg-amber-50 text-amber-700" :
                a.status === "rejected" ? "border-red-200 bg-red-50 text-red-700" :
                "border-[#efefef] bg-[#f8fafc] text-slate-500"
              )}>
                {a.status === "approved" ? <Check className="w-3.5 h-3.5" /> :
                 a.status === "pending" ? <AlertCircle className="w-3.5 h-3.5" /> : null}
                <span className="font-medium">{a.step}</span>
              </div>
              {i < approvals.length - 1 && <ArrowRight className="w-4 h-4 text-slate-500/40 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Period</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Step</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Assignee</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Gross Amount</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Submitted</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((a) => {
              const style = approvalStyles[a.status];
              return (
                <tr key={a.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-medium">{a.period}</td>
                  <td className="p-3">{a.step}</td>
                  <td className="p-3 text-slate-500">{a.assignee}</td>
                  <td className="p-3 text-right font-medium">{formatNaira(a.grossAmount)}</td>
                  <td className="p-3 text-slate-500 text-xs">{a.submittedAt ? new Date(a.submittedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                  <td className={cn("p-3 text-sm font-medium", style.color)}>{style.label}</td>
                  <td className="p-3">
                    {a.status === "pending" && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateApprovalStatus(a.id, "approved")} className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve"><Check className="w-4 h-4" strokeWidth={2.5} /></button>
                        <button onClick={() => updateApprovalStatus(a.id, "rejected")} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" title="Reject"><X className="w-4 h-4" strokeWidth={2.5} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Off-Cycle (empty state) ── */
function OffCycleSection() {
  return (
    <div className="rounded-xl border border-dashed border-[#efefef] bg-white p-12 text-center">
      <Zap className="w-10 h-10 mx-auto mb-3 text-slate-500/30" />
      <p className="font-medium text-slate-900">No off-cycle payroll runs</p>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        Off-cycle runs are used for bonuses, settlements, and special payments outside the regular payroll schedule.
      </p>
      <Button size="sm" className="mt-4" onClick={() => {}}>
        <Plus className="w-4 h-4 mr-2" />
        Create Off-Cycle Run
      </Button>
    </div>
  );
}

/* ── Adjustments (empty state) ── */
function AdjustmentsSection() {
  return (
    <div className="rounded-xl border border-dashed border-[#efefef] bg-white p-12 text-center">
      <PenTool className="w-10 h-10 mx-auto mb-3 text-slate-500/30" />
      <p className="font-medium text-slate-900">No payroll adjustments</p>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        Adjustments let you correct salary errors, apply retroactive pay, or reverse incorrect deductions from previous runs.
      </p>
      <Button size="sm" className="mt-4" onClick={() => {}}>
        <Plus className="w-4 h-4 mr-2" />
        New Adjustment
      </Button>
    </div>
  );
}

/* ── Auto-Payroll ── */
function AutoPayrollSection() {
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-[#efefef] bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Auto-Payroll Configuration</h3>
          <span className={cn("text-sm font-medium", enabled ? "text-emerald-700" : "text-gray-500")}>
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {enabled ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div><span className="text-slate-500">Schedule:</span><br /><span className="font-medium">22nd of every month</span></div>
            <div><span className="text-slate-500">Next Run:</span><br /><span className="font-medium">2026-05-22</span></div>
            <div><span className="text-slate-500">Auto-Approve:</span><br /><span className="font-medium">No (Manual approval required)</span></div>
            <div><span className="text-slate-500">Notify Admin:</span><br /><span className="font-medium">Yes</span></div>
            <div><span className="text-slate-500">Notify Employees:</span><br /><span className="font-medium">Yes</span></div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500 mb-3">Automatically trigger payroll processing on a set schedule so you never miss a pay date.</p>
            <Button size="sm" onClick={() => setEnabled(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Enable Auto-Payroll
            </Button>
          </div>
        )}

        {enabled && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setEnabled(false)}>
              <Settings className="w-4 h-4 mr-2" />
              Disable
            </Button>
          </div>
        )}
      </div>

      {enabled && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
          <div className="p-3 border-b border-slate-200/70">
            <h3 className="font-medium text-sm">Execution Log</h3>
          </div>
          <div className="p-8 text-center text-slate-500">
            <RotateCcw className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No executions yet</p>
            <p className="text-xs mt-1">Logs will appear here after the first auto-payroll run</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Shared ── */
function SummaryCard({ icon: Icon, label, value }: { icon: typeof CheckSquare; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-4">
      <div className="flex items-center gap-2 text-slate-500 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function EmptyRow({ colSpan, message, sub }: { colSpan: number; message: string; sub: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-12 text-center text-slate-500">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium text-slate-900">{message}</p>
        <p className="text-xs mt-1">{sub}</p>
      </td>
    </tr>
  );
}
