import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ArrowLeft, Check } from "lucide-react";
import {
  MOCK_LOANS,
  LOAN_STATUS_STYLES,
  formatLoanCurrency,
  generateRepaymentSchedule,
} from "@/lib/loans-mock-data";
import { cn } from "@/lib/utils";

export default function LoanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const loan = MOCK_LOANS.find((l) => l.id === id);

  const schedule = useMemo(() => {
    if (!loan) return [];
    return generateRepaymentSchedule(
      loan.principalAmount,
      loan.interestRate,
      loan.tenureMonths
    );
  }, [loan]);

  if (!loan) {
    return (
      <div className="p-6 space-y-4">
        <button
          onClick={() => navigate("/loans")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to Loans
        </button>
        <div className="rounded-xl border border-[#efefef] bg-white p-8 text-center">
          <h2 className="text-lg font-semibold">Loan Not Found</h2>
          <p className="text-sm text-slate-500 mt-1">
            No loan found with ID "{id}".
          </p>
        </div>
      </div>
    );
  }

  const statusStyle = LOAN_STATUS_STYLES[loan.status];
  const progressPercent = Math.round(
    (loan.monthsPaid / loan.tenureMonths) * 100
  );

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate("/loans")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to Loans
      </button>

      <h1 className="text-2xl font-semibold">{loan.productName}</h1>

      {/* Summary Card */}
      <div className="rounded-xl border border-[#efefef] bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryItem label="Product" value={loan.productName} />
          <SummaryItem
            label="Principal Amount"
            value={formatLoanCurrency(loan.principalAmount)}
          />
          <SummaryItem
            label="Outstanding Balance"
            value={formatLoanCurrency(loan.outstandingBalance)}
          />
          <SummaryItem
            label="Interest Rate"
            value={`${loan.interestRate}% p.a.`}
          />
          <SummaryItem
            label="Tenure"
            value={`${loan.tenureMonths} months`}
          />
          <SummaryItem
            label="Monthly Deduction"
            value={formatLoanCurrency(loan.monthlyDeduction)}
          />
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <p className={cn("text-sm font-semibold", statusStyle.color)}>
              {statusStyle.label}
            </p>
          </div>
          <SummaryItem label="Start Date" value={loan.startDate} />
          <SummaryItem
            label="Months Paid"
            value={`${loan.monthsPaid} / ${loan.tenureMonths}`}
          />
        </div>
      </div>

      {/* Repayment Progress */}
      <div className="rounded-xl border border-[#efefef] bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">Repayment Progress</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full bg-[#f8fafc] overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
            {progressPercent}%
          </span>
        </div>
        <p className="text-xs text-slate-500">
          {loan.monthsPaid} of {loan.tenureMonths} months completed
        </p>
      </div>

      {/* Repayment Schedule */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Repayment Schedule</h2>
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 text-left">
                <th className="px-3 py-2 text-xs font-medium text-slate-500">Month</th>
                <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Principal</th>
                <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Interest</th>
                <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Payment</th>
                <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Balance</th>
                <th className="px-3 py-2 text-xs font-medium text-slate-500 text-center w-16">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => {
                const isPaid = row.month <= loan.monthsPaid;
                return (
                  <tr
                    key={row.month}
                    className={cn(
                      "border-t border-[#efefef]",
                      isPaid && "text-emerald-700"
                    )}
                  >
                    <td className="px-3 py-2">{row.month}</td>
                    <td className="px-3 py-2 text-right">
                      {formatLoanCurrency(row.principal)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatLoanCurrency(row.interest)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatLoanCurrency(row.payment)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatLoanCurrency(row.balance)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {isPaid && <Check className="size-4 mx-auto text-emerald-600" />}
                    </td>
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

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
