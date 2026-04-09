import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MOCK_LOAN_PRODUCTS,
  formatLoanCurrency,
  generateRepaymentSchedule,
} from "@/lib/loans-mock-data";
import { cn } from "@/lib/utils";

export default function LoanApplyPage() {
  const navigate = useNavigate();

  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedProduct = MOCK_LOAN_PRODUCTS.find((p) => p.id === productId);

  const tenureOptions = useMemo(() => {
    if (!selectedProduct) return [];
    const options: number[] = [];
    for (let m = 3; m <= selectedProduct.maxTenureMonths; m += 3) {
      options.push(m);
    }
    return options;
  }, [selectedProduct]);

  const parsedAmount = Number(amount) || 0;
  const parsedTenure = Number(tenure) || 0;

  const repayment = useMemo(() => {
    if (!selectedProduct || parsedAmount <= 0 || parsedTenure <= 0) return null;
    const schedule = generateRepaymentSchedule(
      parsedAmount,
      selectedProduct.interestRate,
      parsedTenure
    );
    const monthlyPayment = schedule[0]?.payment ?? 0;
    const totalInterest = schedule.reduce((sum, r) => sum + r.interest, 0);
    const totalRepayment = schedule.reduce((sum, r) => sum + r.payment, 0);
    return { monthlyPayment, totalInterest, totalRepayment, schedule };
  }, [selectedProduct, parsedAmount, parsedTenure]);

  const canSubmit =
    productId &&
    parsedAmount > 0 &&
    parsedTenure > 0 &&
    purpose.trim().length > 0 &&
    (!selectedProduct || parsedAmount <= selectedProduct.maxAmount);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="rounded-xl border border-[#efefef] bg-white p-8 text-center space-y-4">
          <CheckCircle className="mx-auto size-12 text-emerald-600" />
          <h2 className="text-xl font-semibold">Application Submitted</h2>
          <p className="text-sm text-slate-500">
            Your loan application for {formatLoanCurrency(parsedAmount)} has been
            submitted and is pending review.
          </p>
          <Button variant="outline" onClick={() => navigate("/loans")}>
            Back to Loans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate("/loans")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to Loans
      </button>

      <h1 className="text-2xl font-semibold">Apply for a Loan</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[#efefef] bg-white p-6 space-y-5"
        >
          {/* Loan Product */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Loan Product</label>
            <Select
              value={productId}
              onValueChange={(v) => {
                setProductId(v);
                setTenure("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a loan product" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_LOAN_PRODUCTS.filter((p) => p.status === "active").map(
                  (p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - {p.interestRate}% p.a. (max{" "}
                      {formatLoanCurrency(p.maxAmount)})
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="Enter loan amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
              max={selectedProduct?.maxAmount}
            />
            {selectedProduct && (
              <p className="text-xs text-slate-500">
                Max: {formatLoanCurrency(selectedProduct.maxAmount)}
              </p>
            )}
          </div>

          {/* Tenure */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tenure</label>
            <Select value={tenure} onValueChange={setTenure}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tenure" />
              </SelectTrigger>
              <SelectContent>
                {tenureOptions.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {m} months
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Purpose</label>
            <textarea
              className={cn(
                "border-input placeholder:text-slate-500 focus-visible:border-ring flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              )}
              placeholder="Describe the purpose of this loan"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={!canSubmit}>
            Submit Application
          </Button>
        </form>

        {/* Repayment Preview */}
        <div className="rounded-xl border border-[#efefef] bg-white p-6 space-y-5">
          <h2 className="text-lg font-semibold">Repayment Preview</h2>

          {!repayment ? (
            <p className="text-sm text-slate-500">
              Select a product, enter an amount, and choose a tenure to see the
              repayment preview.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Monthly Repayment
                  </p>
                  <p className="text-2xl font-bold">
                    {formatLoanCurrency(repayment.monthlyPayment)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Total Interest
                    </p>
                    <p className="text-sm font-semibold">
                      {formatLoanCurrency(repayment.totalInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">
                      Total Repayment
                    </p>
                    <p className="text-sm font-semibold">
                      {formatLoanCurrency(repayment.totalRepayment)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amortization Table */}
              <div className="rounded-xl border border-[#efefef] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f8fafc] text-left">
                      <th className="px-3 py-2 text-xs font-medium text-slate-500">Month</th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">
                        Principal
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">
                        Interest
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">
                        Payment
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {repayment.schedule.map((row) => (
                      <tr key={row.month} className="border-t border-[#efefef]">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
