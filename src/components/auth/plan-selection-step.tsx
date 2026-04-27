import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUBSCRIPTION_PLANS, BILLING_CYCLES } from "@/lib/mock-data";
import type { PlanSelectionData, BillingCycle } from "@/types/auth";
import type { ValidationErrors } from "@/lib/validators";

interface PlanSelectionStepProps {
  data: PlanSelectionData;
  errors: ValidationErrors<PlanSelectionData>;
  onChange: (field: keyof PlanSelectionData, value: string) => void;
}

function formatPerMonth(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getCyclePrice(monthlyPrice: number, cycle: BillingCycle) {
  const config = BILLING_CYCLES.find((c) => c.value === cycle)!;
  const subtotal = monthlyPrice * config.months;
  const discounted = subtotal * (1 - config.discount / 100);
  return {
    total: Math.round(discounted),
    perMonth: Math.round(discounted / config.months),
    months: config.months,
  };
}

export function PlanSelectionStep({ data, errors, onChange }: PlanSelectionStepProps) {
  const cycleConfig = BILLING_CYCLES.find((c) => c.value === data.billingCycle);
  const cycleCaption =
    cycleConfig && cycleConfig.months > 1
      ? `paid ${cycleConfig.label.toLowerCase()}`
      : "billed monthly";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Pricing</h2>
        <p className="text-sm text-muted-foreground">
          Pick the plan that fits your team — switch or cancel any time
        </p>
      </div>

      {/* Billing cycle toggle — minimal underline tabs */}
      <div className="flex items-center justify-center gap-8 border-b border-slate-200">
        {BILLING_CYCLES.map((cycle) => {
          const isActive = data.billingCycle === cycle.value;
          return (
            <button
              key={cycle.value}
              type="button"
              onClick={() => onChange("billingCycle", cycle.value)}
              className={cn(
                "relative pb-3 text-sm font-medium transition-colors inline-flex items-center gap-1.5",
                isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {cycle.label}
              {cycle.discount > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    isActive ? "text-blue-600" : "text-slate-400"
                  )}
                >
                  Save {cycle.discount}%
                </span>
              )}
              {isActive && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {errors.planId && (
        <p className="text-xs text-rose-600">{errors.planId}</p>
      )}

      {/* Plan columns */}
      <div className="grid grid-cols-3 divide-x divide-slate-200">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isSelected = data.planId === plan.id;
          const pricing = getCyclePrice(plan.monthlyPrice, data.billingCycle);

          return (
            <div key={plan.id} className="px-4 first:pl-0 last:pr-0 flex flex-col">
              {/* Plan name */}
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600 inline-flex items-center gap-1.5">
                {plan.name}
                {plan.popular && (
                  <span className="w-1 h-1 rounded-full bg-blue-600" />
                )}
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight tabular-nums text-slate-900 leading-none">
                  {formatPerMonth(pricing.perMonth)}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  per month
                  <br />
                  {cycleCaption}
                </span>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => onChange("planId", plan.id)}
                className={cn(
                  "mt-5 h-10 w-full rounded-full text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors",
                  isSelected
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                )}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={3} />
                    Selected
                  </>
                ) : (
                  "Select"
                )}
              </button>

              {/* Features — plain rows separated by hairlines */}
              <ul className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="py-3 text-[13px] text-slate-700 leading-snug"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        All plans include a free 14-day trial. Cancel anytime.
      </p>
    </div>
  );
}
