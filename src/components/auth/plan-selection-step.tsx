import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_PLANS, BILLING_CYCLES } from "@/lib/mock-data";
import type { PlanSelectionData, BillingCycle } from "@/types/auth";
import type { ValidationErrors } from "@/lib/validators";

interface PlanSelectionStepProps {
  data: PlanSelectionData;
  errors: ValidationErrors<PlanSelectionData>;
  onChange: (field: keyof PlanSelectionData, value: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getCyclePrice(monthlyPrice: number, cycle: BillingCycle) {
  const config = BILLING_CYCLES.find((c) => c.value === cycle)!;
  const subtotal = monthlyPrice * config.months;
  const discounted = subtotal * (1 - config.discount / 100);
  return { total: Math.round(discounted), perMonth: Math.round(discounted / config.months) };
}

export function PlanSelectionStep({ data, errors, onChange }: PlanSelectionStepProps) {
  const activeCycle = BILLING_CYCLES.find((c) => c.value === data.billingCycle)!;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Choose a Plan</h2>
        <p className="text-sm text-muted-foreground">
          Select your billing cycle and plan. You can upgrade anytime.
        </p>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center rounded-lg bg-muted p-1 gap-0.5">
          {BILLING_CYCLES.map((cycle) => (
            <button
              key={cycle.value}
              type="button"
              onClick={() => onChange("billingCycle", cycle.value)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-150",
                data.billingCycle === cycle.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cycle.label}
              {cycle.discount > 0 && (
                <span
                  className={cn(
                    "ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    data.billingCycle === cycle.value
                      ? "bg-primary/10 text-primary"
                      : "bg-muted-foreground/10 text-muted-foreground"
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
        <p className="text-xs text-destructive text-center">{errors.planId}</p>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-3">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isSelected = data.planId === plan.id;
          const pricing = getCyclePrice(plan.monthlyPrice, data.billingCycle);

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onChange("planId", plan.id)}
              className={cn(
                "relative overflow-visible w-full text-left rounded-lg border-2 p-5 pl-10 transition-all duration-150",
                "hover:border-primary/50 hover:shadow-sm",
                isSelected
                  ? "border-primary bg-primary/[0.02] shadow-sm"
                  : "border-border bg-card"
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-2.5 right-4 bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
                  Most Popular
                </Badge>
              )}

              {/* Radio indicator */}
              <div
                className={cn(
                  "absolute top-5 left-4 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-border bg-background"
                )}
              >
                {isSelected && (
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-semibold">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold">{formatCurrency(pricing.total)}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {activeCycle.discount > 0 ? (
                        <>
                          {formatCurrency(pricing.perMonth)}/emp/mo
                        </>
                      ) : (
                        <>{formatCurrency(plan.monthlyPrice)}/emp/mo</>
                      )}
                      {" "}&middot; {activeCycle.label.toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
