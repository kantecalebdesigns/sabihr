import { useState, useMemo } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_PAYROLL_RUNS,
  MOCK_PAYSLIPS,
  PAYROLL_STATUS_STYLES,
  PAYSLIP_STATUS_STYLES,
  formatNaira,
} from "@/lib/payroll-mock-data";
import type { PayrollStatus, PayslipStatus } from "@/lib/payroll-mock-data";

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

export default function PayrollPage() {
  const [view, setView] = useState<ViewMode>("runs");
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const currentRun = MOCK_PAYROLL_RUNS[0]; // March 2026 (draft)
  const lastCompletedRun = MOCK_PAYROLL_RUNS[1]; // February 2026

  const filteredPayslips = useMemo(() => {
    const runId = selectedRunId ?? lastCompletedRun.id;
    const q = search.toLowerCase();
    return MOCK_PAYSLIPS.filter((p) => {
      const matchesRun = p.payrollRunId === runId;
      const matchesSearch =
        !q ||
        p.employeeName.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q);
      return matchesRun && matchesSearch;
    });
  }, [selectedRunId, search, lastCompletedRun.id]);

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

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Payroll Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Process payroll and manage employee compensation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("Payroll data exported successfully.")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {currentRun.status === "draft" && (
            <Button onClick={() => alert("Processing payroll for " + currentRun.period + "...")}>
              <Play className="w-4 h-4 mr-2" />
              Process {currentRun.period}
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Banknote className="w-4 h-4" />
            <span className="text-xs font-medium">Last Gross Pay</span>
          </div>
          <p className="text-xl font-semibold">
            {formatNaira(lastCompletedRun.totalGross)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {lastCompletedRun.period}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium">Last Net Pay</span>
          </div>
          <p className="text-xl font-semibold">
            {formatNaira(lastCompletedRun.totalNet)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {lastCompletedRun.period}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Total Deductions</span>
          </div>
          <p className="text-xl font-semibold">
            {formatNaira(lastCompletedRun.totalDeductions)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {lastCompletedRun.period}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Employees Paid</span>
          </div>
          <p className="text-xl font-semibold">
            {lastCompletedRun.employeeCount}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {lastCompletedRun.period}
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {VIEW_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                view === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Payroll Runs View */}
      {view === "runs" && (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Period
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="p-3 text-right font-medium text-muted-foreground">
                  Gross Pay
                </th>
                <th className="p-3 text-right font-medium text-muted-foreground">
                  Deductions
                </th>
                <th className="p-3 text-right font-medium text-muted-foreground">
                  Net Pay
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Employees
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Processed
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Approved By
                </th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PAYROLL_RUNS.map((run) => {
                const statusStyle =
                  PAYROLL_STATUS_STYLES[run.status as PayrollStatus];
                return (
                  <tr
                    key={run.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 font-medium">{run.period}</td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                          statusStyle?.bg,
                          statusStyle?.color
                        )}
                      >
                        {statusStyle?.label}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatNaira(run.totalGross)}
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      {formatNaira(run.totalDeductions)}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatNaira(run.totalNet)}
                    </td>
                    <td className="p-3">{run.employeeCount}</td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {run.processedDate
                        ? new Date(run.processedDate).toLocaleDateString(
                            "en-NG",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "--"}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {run.approvedBy ?? "--"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedRunId(run.id);
                          setView("payslips");
                        }}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                        title="View payslips"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Payslips View */}
      {view === "payslips" && (
        <>
          {/* Payslip Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Showing payslips for{" "}
              <span className="font-medium text-foreground">
                {MOCK_PAYROLL_RUNS.find(
                  (r) => r.id === (selectedRunId ?? lastCompletedRun.id)
                )?.period}
              </span>
            </div>
          </div>

          {/* Payslip Totals */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Gross</p>
              <p className="text-lg font-semibold">
                {formatNaira(payslipTotals.gross)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Deductions</p>
              <p className="text-lg font-semibold">
                {formatNaira(payslipTotals.deductions)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Net</p>
              <p className="text-lg font-semibold">
                {formatNaira(payslipTotals.net)}
              </p>
            </div>
          </div>

          {/* Payslips Table */}
          <div className="rounded-xl border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Employee
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Department
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Basic
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Allowances
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Gross
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Tax
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Pension
                  </th>
                  <th className="p-3 text-right font-medium text-muted-foreground">
                    Net Pay
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Bank
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayslips.map((slip) => {
                  const statusStyle =
                    PAYSLIP_STATUS_STYLES[slip.status as PayslipStatus];
                  const totalAllowances =
                    slip.housingAllowance +
                    slip.transportAllowance +
                    slip.otherAllowances;
                  return (
                    <tr
                      key={slip.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                            {slip.employeeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="font-medium">
                            {slip.employeeName}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {slip.department}
                      </td>
                      <td className="p-3 text-right">
                        {formatNaira(slip.basicSalary)}
                      </td>
                      <td className="p-3 text-right text-muted-foreground">
                        {formatNaira(totalAllowances)}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {formatNaira(slip.grossPay)}
                      </td>
                      <td className="p-3 text-right text-red-600">
                        -{formatNaira(slip.tax)}
                      </td>
                      <td className="p-3 text-right text-red-600">
                        -{formatNaira(slip.pension)}
                      </td>
                      <td className="p-3 text-right font-semibold">
                        {formatNaira(slip.netPay)}
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                            statusStyle?.bg,
                            statusStyle?.color
                          )}
                        >
                          {statusStyle?.label}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        <div>{slip.bankName}</div>
                        <div className="font-mono">{slip.accountNumber}</div>
                      </td>
                    </tr>
                  );
                })}
                {filteredPayslips.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="p-12 text-center text-muted-foreground"
                    >
                      <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No payslips found</p>
                      <p className="text-xs mt-1">
                        Try adjusting your search
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Input Review Tab */}
      {view === "input-review" && (
        <InputReviewSection />
      )}

      {/* Computation Results Tab */}
      {view === "computation" && (
        <ComputationSection />
      )}

      {/* Approval Workflow Tab */}
      {view === "approval" && (
        <ApprovalSection />
      )}

      {/* Off-Cycle Payroll Tab */}
      {view === "off-cycle" && (
        <OffCycleSection />
      )}

      {/* Adjustments Tab */}
      {view === "adjustments" && (
        <AdjustmentsSection />
      )}

      {/* Auto-Payroll Tab */}
      {view === "auto-payroll" && (
        <AutoPayrollSection />
      )}
    </div>
  );
}

/* ── 5.3-D2 Input Review ── */
function InputReviewSection() {
  const [search, setSearch] = useState("");
  const [inputs, setInputs] = useState([
    { id: "ir-1", employee: "Adebayo Ogunlesi", department: "Engineering", type: "Overtime", hours: 12, rate: 5000, amount: 60000, status: "pending" as const },
    { id: "ir-2", employee: "Chioma Eze", department: "Product", type: "Bonus", hours: 0, rate: 0, amount: 150000, status: "approved" as const },
    { id: "ir-3", employee: "Emeka Nwosu", department: "Finance", type: "Deduction", hours: 0, rate: 0, amount: -50000, status: "pending" as const },
    { id: "ir-4", employee: "Fatima Bello", department: "HR", type: "Overtime", hours: 8, rate: 3000, amount: 24000, status: "approved" as const },
    { id: "ir-5", employee: "Gbenga Adeyemi", department: "Marketing", type: "Commission", hours: 0, rate: 0, amount: 200000, status: "pending" as const },
    { id: "ir-6", employee: "Halima Yusuf", department: "Engineering", type: "Reimbursement", hours: 0, rate: 0, amount: 35000, status: "rejected" as const },
  ]);

  const updateInputStatus = (id: string, status: "approved" | "rejected") => {
    setInputs((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
  };

  const statusStyles: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
    approved: { label: "Approved", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
    rejected: { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  };

  const filtered = inputs.filter((i) => {
    const q = search.toLowerCase();
    return !q || i.employee.toLowerCase().includes(q) || i.type.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><ClipboardCheck className="w-4 h-4" /><span className="text-xs font-medium">Total Inputs</span></div>
          <p className="text-xl font-semibold">{inputs.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">Pending Review</span></div>
          <p className="text-xl font-semibold">{inputs.filter((i) => i.status === "pending").length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><CheckSquare className="w-4 h-4" /><span className="text-xs font-medium">Approved</span></div>
          <p className="text-xl font-semibold">{inputs.filter((i) => i.status === "approved").length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Banknote className="w-4 h-4" /><span className="text-xs font-medium">Total Amount</span></div>
          <p className="text-xl font-semibold">{formatNaira(inputs.reduce((s, i) => s + i.amount, 0))}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search inputs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Employee</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Department</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Hours</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Rate</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Amount</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((input) => {
              const style = statusStyles[input.status];
              return (
                <tr key={input.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{input.employee}</td>
                  <td className="p-3 text-muted-foreground">{input.department}</td>
                  <td className="p-3">{input.type}</td>
                  <td className="p-3 text-right">{input.hours || "—"}</td>
                  <td className="p-3 text-right">{input.rate ? formatNaira(input.rate) : "—"}</td>
                  <td className={cn("p-3 text-right font-medium", input.amount < 0 ? "text-red-600" : "")}>{formatNaira(Math.abs(input.amount))}{input.amount < 0 ? " (Ded)" : ""}</td>
                  <td className="p-3"><span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>{style.label}</span></td>
                  <td className="p-3">
                    {input.status === "pending" && (
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => updateInputStatus(input.id, "approved")}>Approve</Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs text-red-600" onClick={() => updateInputStatus(input.id, "rejected")}>Reject</Button>
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

/* ── 5.3-D3 Computation Results ── */
function ComputationSection() {
  const computations = [
    { id: "c-1", employee: "Adebayo Ogunlesi", basic: 1000000, allowances: 450000, gross: 1450000, paye: 195000, pension: 116000, nhf: 25000, totalDed: 336000, net: 1114000 },
    { id: "c-2", employee: "Chioma Eze", basic: 650000, allowances: 292500, gross: 942500, paye: 98000, pension: 75400, nhf: 16250, totalDed: 189650, net: 752850 },
    { id: "c-3", employee: "Emeka Nwosu", basic: 2150000, allowances: 967500, gross: 3117500, paye: 548000, pension: 249400, nhf: 53750, totalDed: 851150, net: 2266350 },
    { id: "c-4", employee: "Fatima Bello", basic: 225000, allowances: 101250, gross: 326250, paye: 18500, pension: 26100, nhf: 5625, totalDed: 50225, net: 276025 },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Calculator className="w-4 h-4" /><span className="text-xs font-medium">Total Gross</span></div>
          <p className="text-xl font-semibold">{formatNaira(computations.reduce((s, c) => s + c.gross, 0))}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><TrendingUp className="w-4 h-4" /><span className="text-xs font-medium">Total Deductions</span></div>
          <p className="text-xl font-semibold">{formatNaira(computations.reduce((s, c) => s + c.totalDed, 0))}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><DollarSign className="w-4 h-4" /><span className="text-xs font-medium">Total Net</span></div>
          <p className="text-xl font-semibold">{formatNaira(computations.reduce((s, c) => s + c.net, 0))}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Users className="w-4 h-4" /><span className="text-xs font-medium">Employees</span></div>
          <p className="text-xl font-semibold">{computations.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Employee</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Basic</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Allowances</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Gross</th>
              <th className="p-3 text-right font-medium text-muted-foreground">PAYE</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Pension</th>
              <th className="p-3 text-right font-medium text-muted-foreground">NHF</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Total Ded.</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {computations.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium">{c.employee}</td>
                <td className="p-3 text-right">{formatNaira(c.basic)}</td>
                <td className="p-3 text-right text-muted-foreground">{formatNaira(c.allowances)}</td>
                <td className="p-3 text-right font-medium">{formatNaira(c.gross)}</td>
                <td className="p-3 text-right text-red-600">-{formatNaira(c.paye)}</td>
                <td className="p-3 text-right text-red-600">-{formatNaira(c.pension)}</td>
                <td className="p-3 text-right text-red-600">-{formatNaira(c.nhf)}</td>
                <td className="p-3 text-right text-red-600 font-medium">-{formatNaira(c.totalDed)}</td>
                <td className="p-3 text-right font-semibold">{formatNaira(c.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── 5.3-D4 Approval Workflow ── */
function ApprovalSection() {
  const [approvals, setApprovals] = useState<Array<{ id: string; period: string; step: string; assignee: string; status: "pending" | "waiting" | "approved" | "rejected"; submittedAt: string; grossAmount: number }>>([
    { id: "a-1", period: "March 2026", step: "HR Review", assignee: "Halima Yusuf", status: "pending", submittedAt: "2026-03-22T10:00:00", grossAmount: 48200000 },
    { id: "a-2", period: "March 2026", step: "Finance Review", assignee: "Emeka Nwosu", status: "waiting", submittedAt: "", grossAmount: 48200000 },
    { id: "a-3", period: "March 2026", step: "MD Approval", assignee: "CEO", status: "waiting", submittedAt: "", grossAmount: 48200000 },
    { id: "a-4", period: "February 2026", step: "HR Review", assignee: "Halima Yusuf", status: "approved", submittedAt: "2026-02-22T10:00:00", grossAmount: 47800000 },
    { id: "a-5", period: "February 2026", step: "Finance Review", assignee: "Emeka Nwosu", status: "approved", submittedAt: "2026-02-23T09:00:00", grossAmount: 47800000 },
    { id: "a-6", period: "February 2026", step: "MD Approval", assignee: "CEO", status: "approved", submittedAt: "2026-02-24T11:00:00", grossAmount: 47800000 },
  ]);

  const updateApprovalStatus = (id: string, status: "approved" | "rejected") => {
    setApprovals((prev) => {
      const updated = prev.map((item) => item.id === id ? { ...item, status } : item);
      if (status === "approved") {
        const approvedItem = prev.find((item) => item.id === id);
        if (approvedItem) {
          const nextWaiting = updated.find(
            (item) => item.period === approvedItem.period && item.status === "waiting"
          );
          if (nextWaiting) {
            return updated.map((item) => item.id === nextWaiting.id ? { ...item, status: "pending" as const } : item);
          }
        }
      }
      return updated;
    });
  };

  const approvalStyles: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
    waiting: { label: "Waiting", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
    approved: { label: "Approved", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
    rejected: { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><CheckSquare className="w-4 h-4" /><span className="text-xs font-medium">Pending Approvals</span></div>
          <p className="text-xl font-semibold">{approvals.filter((a) => a.status === "pending").length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">Waiting</span></div>
          <p className="text-xl font-semibold">{approvals.filter((a) => a.status === "waiting").length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><CheckSquare className="w-4 h-4" /><span className="text-xs font-medium">Completed</span></div>
          <p className="text-xl font-semibold">{approvals.filter((a) => a.status === "approved").length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Period</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Step</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Assignee</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Gross Amount</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Submitted</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((a) => {
              const style = approvalStyles[a.status];
              return (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{a.period}</td>
                  <td className="p-3">{a.step}</td>
                  <td className="p-3 text-muted-foreground">{a.assignee}</td>
                  <td className="p-3 text-right font-medium">{formatNaira(a.grossAmount)}</td>
                  <td className="p-3 text-muted-foreground text-xs">{a.submittedAt ? new Date(a.submittedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                  <td className="p-3"><span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>{style.label}</span></td>
                  <td className="p-3">
                    {a.status === "pending" && (
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => updateApprovalStatus(a.id, "approved")}>Approve</Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs text-red-600" onClick={() => updateApprovalStatus(a.id, "rejected")}>Reject</Button>
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

/* ── 5.3-D5 Off-Cycle Payroll ── */
function OffCycleSection() {
  const offCycles = [
    { id: "oc-1", name: "Bonus Payout - Q1 2026", type: "Bonus", employeeCount: 45, totalAmount: 15000000, createdDate: "2026-03-20", status: "draft" as const },
    { id: "oc-2", name: "Final Settlement - Feb Exits", type: "Settlement", employeeCount: 3, totalAmount: 2800000, createdDate: "2026-02-28", status: "completed" as const },
    { id: "oc-3", name: "Commission Payout - Feb", type: "Commission", employeeCount: 16, totalAmount: 4200000, createdDate: "2026-02-25", status: "completed" as const },
  ];

  const statusStyles: Record<string, { label: string; bg: string; color: string }> = {
    draft: { label: "Draft", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
    processing: { label: "Processing", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
    completed: { label: "Completed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Create and manage off-cycle payroll runs for bonuses, settlements, and special payments</p>
        <Button size="sm" onClick={() => alert("New off-cycle payroll run form would open here.")}><Plus className="w-4 h-4 mr-2" />New Off-Cycle Run</Button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Employees</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Total Amount</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Created</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {offCycles.map((oc) => {
              const style = statusStyles[oc.status];
              return (
                <tr key={oc.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{oc.name}</td>
                  <td className="p-3 text-muted-foreground">{oc.type}</td>
                  <td className="p-3">{oc.employeeCount}</td>
                  <td className="p-3 text-right font-medium">{formatNaira(oc.totalAmount)}</td>
                  <td className="p-3 text-muted-foreground">{oc.createdDate}</td>
                  <td className="p-3"><span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>{style.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── 5.3-D6 Adjustments ── */
function AdjustmentsSection() {
  const [search, setSearch] = useState("");
  const adjustments = [
    { id: "adj-1", employee: "Adebayo Ogunlesi", type: "Salary Correction", description: "Transport allowance under-calculated in Feb", amount: 15000, period: "February 2026", adjustedBy: "Halima Yusuf", date: "2026-03-05", status: "applied" as const },
    { id: "adj-2", employee: "Fatima Bello", type: "Retroactive Pay", description: "Pay grade change effective Jan, applied in Mar", amount: 75000, period: "January 2026", adjustedBy: "Emeka Nwosu", date: "2026-03-10", status: "applied" as const },
    { id: "adj-3", employee: "Gbenga Adeyemi", type: "Deduction Reversal", description: "Incorrect loan deduction reversed", amount: 50000, period: "February 2026", adjustedBy: "Emeka Nwosu", date: "2026-03-12", status: "pending" as const },
    { id: "adj-4", employee: "Ibrahim Musa", type: "Tax Correction", description: "PAYE recalculation after relief update", amount: -8500, period: "March 2026", adjustedBy: "System", date: "2026-03-22", status: "pending" as const },
  ];

  const statusStyles: Record<string, { label: string; bg: string; color: string }> = {
    applied: { label: "Applied", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
    pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
    reversed: { label: "Reversed", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  };

  const filtered = adjustments.filter((a) => {
    const q = search.toLowerCase();
    return !q || a.employee.toLowerCase().includes(q) || a.type.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage payroll corrections, retroactive adjustments, and reversals</p>
        <Button size="sm" onClick={() => alert("New payroll adjustment form would open here.")}><PenTool className="w-4 h-4 mr-2" />New Adjustment</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search adjustments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Employee</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Description</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Amount</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Period</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Adjusted By</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((adj) => {
              const style = statusStyles[adj.status];
              return (
                <tr key={adj.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{adj.employee}</td>
                  <td className="p-3">{adj.type}</td>
                  <td className="p-3 text-muted-foreground text-xs">{adj.description}</td>
                  <td className={cn("p-3 text-right font-medium", adj.amount < 0 ? "text-red-600" : "text-emerald-600")}>{adj.amount < 0 ? "-" : "+"}{formatNaira(Math.abs(adj.amount))}</td>
                  <td className="p-3 text-muted-foreground">{adj.period}</td>
                  <td className="p-3 text-muted-foreground">{adj.adjustedBy}</td>
                  <td className="p-3"><span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>{style.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── 5.3-D7 Auto-Payroll ── */
function AutoPayrollSection() {
  const config = {
    enabled: true,
    schedule: "22nd of every month",
    nextRun: "2026-04-22",
    autoApprove: false,
    notifyAdmin: true,
    notifyEmployees: true,
  };

  const logs = [
    { id: "log-1", date: "2026-03-22T09:00:00", action: "Auto-payroll triggered", status: "success" as const, details: "March 2026 payroll run created (Draft)" },
    { id: "log-2", date: "2026-02-22T09:00:00", action: "Auto-payroll triggered", status: "success" as const, details: "February 2026 payroll run created and processed" },
    { id: "log-3", date: "2026-01-22T09:00:00", action: "Auto-payroll triggered", status: "success" as const, details: "January 2026 payroll run created and processed" },
    { id: "log-4", date: "2025-12-22T09:00:00", action: "Auto-payroll triggered", status: "success" as const, details: "December 2025 payroll run created and processed" },
    { id: "log-5", date: "2025-11-22T09:00:00", action: "Auto-payroll failed", status: "failed" as const, details: "Missing salary data for 3 new employees - required manual intervention" },
  ];

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Auto-Payroll Configuration</h3>
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", config.enabled ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-700")}>
            {config.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div><span className="text-muted-foreground">Schedule:</span><br /><span className="font-medium">{config.schedule}</span></div>
          <div><span className="text-muted-foreground">Next Run:</span><br /><span className="font-medium">{config.nextRun}</span></div>
          <div><span className="text-muted-foreground">Auto-Approve:</span><br /><span className="font-medium">{config.autoApprove ? "Yes" : "No (Manual approval required)"}</span></div>
          <div><span className="text-muted-foreground">Notify Admin:</span><br /><span className="font-medium">{config.notifyAdmin ? "Yes" : "No"}</span></div>
          <div><span className="text-muted-foreground">Notify Employees:</span><br /><span className="font-medium">{config.notifyEmployees ? "Yes" : "No"}</span></div>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => alert("Auto-payroll configuration editor would open here.")}><Settings className="w-4 h-4 mr-2" />Edit Configuration</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <div className="p-3 border-b border-border bg-muted/30">
          <h3 className="font-medium text-sm">Execution Log</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Action</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Details</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 text-muted-foreground text-xs">{new Date(log.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                <td className="p-3 font-medium">{log.action}</td>
                <td className="p-3 text-muted-foreground">{log.details}</td>
                <td className="p-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", log.status === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700")}>
                    {log.status === "success" ? "Success" : "Failed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

