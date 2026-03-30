import { useState } from "react";
import {
  Banknote,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_LOANS, LOAN_STATUS_STYLES } from "@/lib/employee-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type Tab = "loans" | "advance";

const TABS: { key: Tab; label: string; icon: typeof Banknote }[] = [
  { key: "loans", label: "Loan Request & Tracking", icon: Banknote },
  { key: "advance", label: "Salary Advance", icon: TrendingUp },
];

export default function EmployeeLoansPage() {
  const [activeTab, setActiveTab] = useState<Tab>("loans");

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Loans & Advances</h1>
        <p className="text-sm text-muted-foreground">Track loan requests and salary advances</p>
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap", activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "loans" && <LoansTab />}
      {activeTab === "advance" && <AdvanceTab />}
    </div>
  );
}

function LoansTab() {
  const activeLoans = MOCK_LOANS.filter((l) => l.status === "active");
  const totalOutstanding = activeLoans.reduce((s, l) => s + l.outstandingBalance, 0);
  const totalMonthlyDeduction = activeLoans.reduce((s, l) => s + l.monthlyDeduction, 0);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Banknote className="w-4 h-4" /><span className="text-xs font-medium">Total Loans</span></div>
          <p className="text-xl font-semibold">{MOCK_LOANS.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">Outstanding</span></div>
          <p className="text-xl font-semibold text-red-600">{formatNaira(totalOutstanding)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><TrendingUp className="w-4 h-4" /><span className="text-xs font-medium">Monthly Deduction</span></div>
          <p className="text-xl font-semibold">{formatNaira(totalMonthlyDeduction)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Clock className="w-4 h-4" /><span className="text-xs font-medium">Pending</span></div>
          <p className="text-xl font-semibold">{MOCK_LOANS.filter((l) => l.status === "pending").length}</p>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => alert("Loan request form would open here.")}><Plus className="w-4 h-4 mr-2" />Request Loan</Button>
      </div>

      <div className="space-y-4">
        {MOCK_LOANS.map((loan) => {
          const style = LOAN_STATUS_STYLES[loan.status];
          const progress = loan.totalInstallments > 0 ? (loan.installmentsPaid / loan.totalInstallments) * 100 : 0;

          return (
            <div key={loan.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{loan.typeName}</h4>
                  <p className="text-xs text-muted-foreground">Requested: {loan.requestDate}</p>
                </div>
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                <div><span className="text-muted-foreground">Loan Amount</span><br /><span className="font-medium">{formatNaira(loan.amount)}</span></div>
                <div><span className="text-muted-foreground">Outstanding</span><br /><span className="font-medium text-red-600">{formatNaira(loan.outstandingBalance)}</span></div>
                <div><span className="text-muted-foreground">Monthly Deduction</span><br /><span className="font-medium">{formatNaira(loan.monthlyDeduction)}</span></div>
                <div><span className="text-muted-foreground">Interest Rate</span><br /><span className="font-medium">{loan.interestRate}%</span></div>
              </div>

              {loan.status === "active" && (
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Repayment Progress</span>
                    <span>{loan.installmentsPaid} / {loan.totalInstallments} installments</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {loan.status === "active" && (
                <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                  <span>Tenure: {loan.tenure} months</span>
                  <span>Start: {loan.startDate}</span>
                  <span>End: {loan.endDate}</span>
                </div>
              )}

              {loan.approvedBy && <p className="text-xs text-muted-foreground mt-2">Approved by: {loan.approvedBy}</p>}
            </div>
          );
        })}
      </div>
    </>
  );
}

function AdvanceTab() {
  const advances = MOCK_LOANS.filter((l) => l.type === "salary-advance");

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Request a salary advance against your next paycheck</p>
        <Button size="sm" onClick={() => alert("Salary advance request form would open here.")}><Plus className="w-4 h-4 mr-2" />Request Advance</Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-medium mb-3">Salary Advance Guidelines</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Maximum advance: 50% of monthly net salary</li>
          <li>Repayment: Deducted from next 1-2 salary payments</li>
          <li>No interest charged on salary advances</li>
          <li>One active advance at a time</li>
          <li>Must have completed probation period</li>
        </ul>
      </div>

      {advances.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Previous Advances</h3>
          {advances.map((adv) => {
            const style = LOAN_STATUS_STYLES[adv.status];
            return (
              <div key={adv.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{formatNaira(adv.amount)}</h4>
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Requested: {adv.requestDate} | Tenure: {adv.tenure} months</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">{adv.installmentsPaid}/{adv.totalInstallments} paid</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No salary advances</p>
          <p className="text-xs mt-1">You haven't requested any salary advances yet</p>
        </div>
      )}
    </>
  );
}

