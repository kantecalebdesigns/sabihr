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
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Simple, transparent pricing
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          No contracts. No surprise fees.
        </p>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center rounded-full bg-slate-100 p-1 gap-0.5">
          {BILLING_CYCLES.map((cycle) => (
            <button
              key={cycle.value}
              type="button"
              onClick={() => onChange("billingCycle", cycle.value)}
              className={cn(
                "relative h-8 px-3.5 text-xs font-semibold rounded-full transition-colors inline-flex items-center gap-1",
                data.billingCycle === cycle.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {cycle.label}
              {cycle.discount > 0 && (
                <span
                  className={cn(
                    "text-[9px] font-bold px-1 py-px rounded",
                    data.billingCycle === cycle.value
                      ? "bg-white/20 text-white"
                      : "bg-emerald-50 text-emerald-700"
                  )}
                >
                  -{cycle.discount}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {errors.planId && (
        <p className="text-xs text-rose-600 text-center">{errors.planId}</p>
      )}

      {/* Plan cards — 3 columns, middle card elevated */}
      <div className="grid grid-cols-3 gap-5 pt-6 items-stretch">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isSelected = data.planId === plan.id;
          const pricing = getCyclePrice(plan.monthlyPrice, data.billingCycle);
          const isPopular = !!plan.popular;
          const visibleFeatures = plan.features.slice(0, 6);

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onChange("planId", plan.id)}
              className={cn(
                "group relative w-full text-left rounded-2xl px-6 py-7 flex flex-col transition-all",
                isPopular
                  ? cn(
                      "-mt-6 bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] text-white",
                      "shadow-[0_16px_40px_-12px_rgba(37,99,235,0.55),0_6px_16px_-6px_rgba(37,99,235,0.35)]",
                      isSelected
                        ? "ring-4 ring-blue-300/50"
                        : "hover:shadow-[0_20px_48px_-12px_rgba(37,99,235,0.65),0_6px_16px_-6px_rgba(37,99,235,0.4)]"
                    )
                  : cn(
                      "bg-white border",
                      "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]",
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200/70 hover:border-slate-300"
                    )
              )}
            >
              {/* Most popular ribbon */}
              {isPopular && (
                <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span
                  className={cn(
                    "text-[32px] font-bold tracking-tight tabular-nums leading-none",
                    isPopular ? "text-white" : "text-slate-900"
                  )}
                >
                  {formatPerMonth(pricing.perMonth)}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isPopular ? "text-white/80" : "text-slate-500"
                  )}
                >
                  /month
                </span>
              </div>

              {/* Plan name */}
              <h3
                className={cn(
                  "mt-6 text-2xl font-bold tracking-tight",
                  isPopular ? "text-white" : "text-slate-900"
                )}
              >
                {plan.name}
              </h3>

              {/* Description */}
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed",
                  isPopular ? "text-white/80" : "text-slate-500"
                )}
              >
                {plan.description}
              </p>

              {/* Features */}
              <ul className="mt-6 space-y-2.5 flex-1">
                {visibleFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        isPopular ? "bg-white/25" : "bg-blue-50"
                      )}
                    >
                      <Check
                        className={cn(
                          "w-3 h-3",
                          isPopular ? "text-white" : "text-blue-600"
                        )}
                        strokeWidth={3}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm leading-snug",
                        isPopular ? "text-white/90" : "text-slate-700"
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA / Select button */}
              <div
                className={cn(
                  "mt-7 w-full h-11 rounded-full inline-flex items-center justify-center text-sm font-semibold transition-colors",
                  isPopular
                    ? "bg-white text-blue-700 group-hover:bg-white/95"
                    : isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                )}
              >
                {isSelected ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-4 h-4" strokeWidth={3} />
                    Selected
                  </span>
                ) : isPopular ? (
                  "Choose Professional"
                ) : (
                  "Select"
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 text-center pt-1">
        All plans include a free 14-day trial. Cancel anytime.
      </p>
    </div>
  );
}
