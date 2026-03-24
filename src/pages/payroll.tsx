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

type ViewMode = "runs" | "payslips";

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
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {currentRun.status === "draft" && (
            <Button>
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
      <div className="flex items-center gap-1 border-b border-border">
        <button
          onClick={() => setView("runs")}
          className={cn(
            "px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
            view === "runs"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Payroll Runs
        </button>
        <button
          onClick={() => setView("payslips")}
          className={cn(
            "px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
            view === "payslips"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Employee Payslips
        </button>
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
    </div>
  );
}
