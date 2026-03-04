import { useState } from "react";
import { Loader2, Lock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SUBSCRIPTION_PLANS, BILLING_CYCLES } from "@/lib/mock-data";
import type { PlanSelectionData } from "@/types/auth";

interface PaystackPaymentStepProps {
  planData: PlanSelectionData;
  companyEmail: string;
  onComplete: () => void;
  onCancel: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function calculateTotal(planData: PlanSelectionData) {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planData.planId);
  const cycle = BILLING_CYCLES.find((c) => c.value === planData.billingCycle);
  if (!plan || !cycle) return { total: 0, planName: "", cycleName: "" };

  const subtotal = plan.monthlyPrice * cycle.months;
  const total = Math.round(subtotal * (1 - cycle.discount / 100));
  return { total, planName: plan.name, cycleName: cycle.label };
}

export function PaystackPaymentStep({
  planData,
  companyEmail,
  onComplete,
  onCancel,
}: PaystackPaymentStepProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { total, planName, cycleName } = calculateTotal(planData);

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  }

  async function handlePay() {
    setIsPaying(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPaying(false);
    onComplete();
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Paystack-style header */}
      <div className="rounded-t-lg bg-[#0A2540] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#00C3F7] flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-white text-sm font-semibold">Paystack</span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Payment body */}
      <div className="border border-t-0 rounded-b-lg bg-white dark:bg-card">
        {/* Order summary */}
        <div className="px-6 py-4 border-b space-y-1">
          <p className="text-xs text-muted-foreground">{companyEmail}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {planName} Plan &middot; {cycleName}
            </span>
            <span className="text-lg font-bold">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Card form */}
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Card Number
            </label>
            <Input
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Expiry
              </label>
              <Input
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                CVV
              </label>
              <Input
                type="password"
                placeholder="123"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                }
                maxLength={3}
              />
            </div>
          </div>

          {/* Pay button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={isPaying}
            className="w-full rounded-md bg-[#00C3F7] hover:bg-[#00b0e0] text-white font-semibold py-3 text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPaying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              `Pay ${formatCurrency(total)}`
            )}
          </button>

          {/* Cancel link */}
          <button
            type="button"
            onClick={onCancel}
            disabled={isPaying}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            Cancel Payment
          </button>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-1 pt-1">
            <Lock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              Secured by Paystack
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
