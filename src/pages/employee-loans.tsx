import { useState } from "react";
import {
  Banknote,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MOCK_LOANS, LOAN_STATUS_STYLES } from "@/lib/employee-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";
import { ApprovalTimeline } from "@/components/shared/approval-workflow";
import type { ApprovalWorkflow } from "@/components/shared/approval-workflow";

const MOCK_LOAN_WORKFLOWS: Record<string, ApprovalWorkflow> = {
  "loan-3": {
    id: "wf-loan-3", module: "loans", requestId: "loan-3", requestType: "Emergency Loan",
    requestedBy: "You", requestedAt: "2026-03-20T09:00:00", currentStep: 1,
    steps: [
      { id: "s1", role: "employee", roleLabel: "Employee Submission", assignee: "You", status: "approved", date: "2026-03-20T09:00:00", comment: null },
      { id: "s2", role: "line_manager", roleLabel: "Line Manager Review", assignee: "Emeka Nwosu", status: "pending", date: null, comment: null },
      { id: "s3", role: "admin", roleLabel: "Admin / HR Approval", assignee: "Fatima Abdullahi", status: "pending", date: null, comment: null },
    ],
    overallStatus: "in_progress",
  },
};

type Tab = "loans" | "advance";

const TABS: { key: Tab; label: string; icon: typeof Banknote }[] = [
  { key: "loans", label: "Loan Request & Tracking", icon: Banknote },
  { key: "advance", label: "Salary Advance", icon: TrendingUp },
];

const LOAN_TYPES = [
  { value: "personal-loan", label: "Personal Loan", maxTenure: 36, interestRate: 5 },
  { value: "emergency-loan", label: "Emergency Loan", maxTenure: 12, interestRate: 3 },
];

export default function EmployeeLoansPage() {
  const [activeTab, setActiveTab] = useState<Tab>("loans");

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Loans & Advances</h1>
        <p className="text-sm text-slate-500">Track loan requests and salary advances</p>
      </div>

      <div className="flex items-center gap-1 border-b border-[#efefef]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap", activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900")}>
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
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeLoans = MOCK_LOANS.filter((l) => l.status === "active");
  const totalOutstanding = activeLoans.reduce((s, l) => s + l.outstandingBalance, 0);
  const totalMonthlyDeduction = activeLoans.reduce((s, l) => s + l.monthlyDeduction, 0);

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-4">
        <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
        <h3 className="text-lg font-semibold">Loan Request Submitted</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">Your loan request has been submitted for review. You'll be notified once it's approved by your manager.</p>
        <Button variant="outline" onClick={() => { setSubmitted(false); setShowForm(false); }}>Back to Loans</Button>
      </div>
    );
  }

  if (showForm) {
    return <LoanRequestForm onBack={() => setShowForm(false)} onSubmit={() => setSubmitted(true)} />;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Banknote className="w-4 h-4" /><span className="text-xs font-medium">Total Loans</span></div>
          <p className="text-xl font-semibold">{MOCK_LOANS.length}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">Outstanding</span></div>
          <p className="text-xl font-semibold text-red-600">{formatNaira(totalOutstanding)}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><TrendingUp className="w-4 h-4" /><span className="text-xs font-medium">Monthly Deduction</span></div>
          <p className="text-xl font-semibold">{formatNaira(totalMonthlyDeduction)}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Clock className="w-4 h-4" /><span className="text-xs font-medium">Pending</span></div>
          <p className="text-xl font-semibold">{MOCK_LOANS.filter((l) => l.status === "pending").length}</p>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" />Request Loan</Button>
      </div>

      <div className="space-y-4">
        {MOCK_LOANS.map((loan) => {
          const style = LOAN_STATUS_STYLES[loan.status];
          const progress = loan.totalInstallments > 0 ? (loan.installmentsPaid / loan.totalInstallments) * 100 : 0;

          return (
            <div key={loan.id} className="rounded-xl border border-[#efefef] bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{loan.typeName}</h4>
                  <p className="text-xs text-slate-500">Requested: {loan.requestDate}</p>
                </div>
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                <div><span className="text-slate-500">Loan Amount</span><br /><span className="font-medium">{formatNaira(loan.amount)}</span></div>
                <div><span className="text-slate-500">Outstanding</span><br /><span className="font-medium text-red-600">{formatNaira(loan.outstandingBalance)}</span></div>
                <div><span className="text-slate-500">Monthly Deduction</span><br /><span className="font-medium">{formatNaira(loan.monthlyDeduction)}</span></div>
                <div><span className="text-slate-500">Interest Rate</span><br /><span className="font-medium">{loan.interestRate}%</span></div>
              </div>

              {loan.status === "active" && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Repayment Progress</span>
                    <span>{loan.installmentsPaid} / {loan.totalInstallments} installments</span>
                  </div>
                  <div className="w-full bg-[#f8fafc] rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {loan.status === "active" && (
                <div className="grid grid-cols-3 gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-[#efefef]">
                  <span>Tenure: {loan.tenure} months</span>
                  <span>Start: {loan.startDate}</span>
                  <span>End: {loan.endDate}</span>
                </div>
              )}

              {loan.approvedBy && <p className="text-xs text-slate-500 mt-2">Approved by: {loan.approvedBy}</p>}

              {loan.status === "pending" && MOCK_LOAN_WORKFLOWS[loan.id] && (
                <div className="mt-4">
                  <ApprovalTimeline workflow={MOCK_LOAN_WORKFLOWS[loan.id]} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function LoanRequestForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [step, setStep] = useState(1);
  const [loanType, setLoanType] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [reason, setReason] = useState("");

  const selectedType = LOAN_TYPES.find((t) => t.value === loanType);
  const parsedAmount = Number(amount) || 0;
  const parsedTenure = Number(tenure) || 0;
  const monthlyRepayment = parsedTenure > 0 ? Math.ceil((parsedAmount * (1 + (selectedType?.interestRate ?? 0) / 100)) / parsedTenure) : 0;
  const totalRepayment = parsedTenure > 0 ? monthlyRepayment * parsedTenure : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-semibold">Request a Loan</h2>
          <p className="text-sm text-slate-500">Step {step} of 3</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors",
              step >= s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
            )}>
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            <span className={cn("text-xs font-medium hidden sm:inline", step >= s ? "text-slate-900" : "text-slate-400")}>
              {s === 1 ? "Loan Type" : s === 2 ? "Details" : "Review"}
            </span>
            {s < 3 && <div className={cn("flex-1 h-0.5 rounded-full", step > s ? "bg-blue-600" : "bg-slate-100")} />}
          </div>
        ))}
      </div>

      {/* Step 1: Choose loan type */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Select the type of loan you'd like to apply for.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LOAN_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setLoanType(type.value)}
                className={cn(
                  "rounded-xl border p-5 text-left transition-all",
                  loanType === type.value
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                    : "border-[#efefef] bg-white hover:border-slate-300"
                )}
              >
                <h4 className="font-medium">{type.label}</h4>
                <p className="text-xs text-slate-500 mt-1">Up to {type.maxTenure} months &middot; {type.interestRate}% interest</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button disabled={!loanType} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Loan details */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-sm text-slate-500">Enter the loan amount and repayment terms.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Loan Amount (NGN)</label>
              <Input
                type="number"
                placeholder="e.g. 500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tenure (months)</label>
              <Input
                type="number"
                placeholder={`Max ${selectedType?.maxTenure ?? 12} months`}
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                max={selectedType?.maxTenure}
                min={1}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Reason for loan</label>
            <textarea
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-none"
              placeholder="Briefly describe why you need this loan..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {parsedAmount > 0 && parsedTenure > 0 && (
            <div className="rounded-xl border border-[#efefef] bg-[#f8fafc] p-4">
              <p className="text-xs font-medium text-slate-500 mb-3">Repayment Estimate</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Monthly Repayment</span>
                  <p className="font-semibold">{formatNaira(monthlyRepayment)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Interest Rate</span>
                  <p className="font-semibold">{selectedType?.interestRate}%</p>
                </div>
                <div>
                  <span className="text-slate-500">Total Repayment</span>
                  <p className="font-semibold">{formatNaira(totalRepayment)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button disabled={!amount || !tenure || !reason} onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-slate-500">Review your loan request before submitting.</p>

          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Loan Type</span>
                <p className="font-medium">{selectedType?.label}</p>
              </div>
              <div>
                <span className="text-slate-500">Amount</span>
                <p className="font-medium">{formatNaira(parsedAmount)}</p>
              </div>
              <div>
                <span className="text-slate-500">Tenure</span>
                <p className="font-medium">{parsedTenure} months</p>
              </div>
              <div>
                <span className="text-slate-500">Interest Rate</span>
                <p className="font-medium">{selectedType?.interestRate}%</p>
              </div>
              <div>
                <span className="text-slate-500">Monthly Repayment</span>
                <p className="font-medium">{formatNaira(monthlyRepayment)}</p>
              </div>
              <div>
                <span className="text-slate-500">Total Repayment</span>
                <p className="font-medium">{formatNaira(totalRepayment)}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#efefef] text-sm">
              <span className="text-slate-500">Reason</span>
              <p className="font-medium mt-1">{reason}</p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            By submitting, your loan request will be sent to your manager and HR for approval. Monthly deductions will begin from your salary once approved.
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={onSubmit}>Submit Request</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdvanceTab() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const advances = MOCK_LOANS.filter((l) => l.type === "salary-advance");

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-4">
        <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
        <h3 className="text-lg font-semibold">Advance Request Submitted</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">Your salary advance request has been submitted. You'll be notified once it's processed.</p>
        <Button variant="outline" onClick={() => { setSubmitted(false); setShowForm(false); }}>Back to Advances</Button>
      </div>
    );
  }

  if (showForm) {
    return <AdvanceRequestForm onBack={() => setShowForm(false)} onSubmit={() => setSubmitted(true)} />;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Request a salary advance against your next paycheck</p>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" />Request Advance</Button>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white p-6">
        <h3 className="font-medium mb-3">Salary Advance Guidelines</h3>
        <ul className="space-y-2 text-sm text-slate-500">
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
              <div key={adv.id} className="rounded-xl border border-[#efefef] bg-white p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{formatNaira(adv.amount)}</h4>
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Requested: {adv.requestDate} | Tenure: {adv.tenure} months</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-slate-500">{adv.installmentsPaid}/{adv.totalInstallments} paid</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No salary advances</p>
          <p className="text-xs mt-1">You haven't requested any salary advances yet</p>
        </div>
      )}
    </>
  );
}

function AdvanceRequestForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("1");

  const parsedAmount = Number(amount) || 0;
  const maxAdvance = 300000; // 50% of net salary

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-semibold">Request Salary Advance</h2>
          <p className="text-sm text-slate-500">Fill in the details below</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-[#f8fafc] p-4 text-sm">
        <p className="text-slate-500">Your maximum eligible advance is <span className="font-semibold text-slate-900">{formatNaira(maxAdvance)}</span> (50% of net salary).</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Amount (NGN)</label>
          <Input
            type="number"
            placeholder={`Max ${formatNaira(maxAdvance)}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={maxAdvance}
          />
          {parsedAmount > maxAdvance && (
            <p className="text-xs text-red-500">Amount exceeds maximum eligible advance.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Repayment Period</label>
          <div className="flex gap-3">
            {["1", "2"].map((m) => (
              <button
                key={m}
                onClick={() => setRepaymentMonths(m)}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                  repaymentMonths === m
                    ? "border-blue-600 bg-blue-50 text-blue-600 ring-1 ring-blue-600"
                    : "border-[#efefef] bg-white text-slate-700 hover:border-slate-300"
                )}
              >
                {m} month{m === "2" ? "s" : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Reason</label>
          <textarea
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-none"
            placeholder="Briefly describe why you need this advance..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {parsedAmount > 0 && parsedAmount <= maxAdvance && (
          <div className="rounded-xl border border-[#efefef] bg-white p-4">
            <p className="text-xs font-medium text-slate-500 mb-3">Deduction Summary</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Amount</span>
                <p className="font-semibold">{formatNaira(parsedAmount)}</p>
              </div>
              <div>
                <span className="text-slate-500">Monthly Deduction</span>
                <p className="font-semibold">{formatNaira(Math.ceil(parsedAmount / Number(repaymentMonths)))}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Cancel</Button>
        <Button
          disabled={!amount || !reason || parsedAmount > maxAdvance || parsedAmount <= 0}
          onClick={onSubmit}
        >
          Submit Request
        </Button>
      </div>
    </div>
  );
}
