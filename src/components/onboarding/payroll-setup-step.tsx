import { Check, Banknote, ShieldCheck, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { PAY_SCHEDULES, PAYMENT_METHODS } from "@/lib/mock-data";
import type { PayrollSetupData, PaySchedule, PaymentMethod } from "@/types/onboarding";
import type { ValidationErrors } from "@/lib/validators";

interface PayrollSetupStepProps {
  data: PayrollSetupData;
  errors: ValidationErrors<PayrollSetupData>;
  onChange: (field: keyof PayrollSetupData, value: string | boolean | number) => void;
}

export function PayrollSetupStep({ data, errors, onChange }: PayrollSetupStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <Banknote className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Payroll Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Set up how and when your employees get paid, plus statutory deductions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Pay Schedule Section */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold">Pay Schedule</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {PAY_SCHEDULES.map((schedule) => {
            const isSelected = data.paySchedule === schedule.value;
            return (
              <button
                key={schedule.value}
                type="button"
                onClick={() => onChange("paySchedule", schedule.value as PaySchedule)}
                className={cn(
                  "relative w-full text-left rounded-lg border-2 p-4 pl-10 transition-all duration-150",
                  "hover:border-primary/50",
                  isSelected
                    ? "border-primary bg-primary/[0.03] shadow-sm"
                    : "border-border bg-background"
                )}
              >
                <div
                  className={cn(
                    "absolute top-4 left-3.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-border bg-background"
                  )}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <div>
                  <div className="text-sm font-medium">{schedule.label}</div>
                  <div className="text-xs text-muted-foreground">{schedule.description}</div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.paySchedule && (
          <p className="text-xs text-destructive">{errors.paySchedule}</p>
        )}

        {/* Payment method */}
        <div className="space-y-2.5 pt-2">
          <Label className="text-xs text-muted-foreground">Payment method</Label>
          <div className="flex gap-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = data.paymentMethod === method.value;
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => onChange("paymentMethod", method.value as PaymentMethod)}
                  className={cn(
                    "flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary/[0.03] text-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {method.label}
                </button>
              );
            })}
          </div>
          {errors.paymentMethod && (
            <p className="text-xs text-destructive">{errors.paymentMethod}</p>
          )}
        </div>
      </div>

      {/* Statutory Deductions Section */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold">Statutory Deductions</span>
        </div>

        {/* Pension */}
        <div className={cn(
          "rounded-lg border p-4 space-y-3 transition-colors",
          data.pensionEnabled ? "border-emerald-200 bg-emerald-50/30" : "border-border"
        )}>
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={data.pensionEnabled}
              onCheckedChange={(checked) => onChange("pensionEnabled", !!checked)}
              className="mt-0.5"
            />
            <div>
              <div className="text-sm font-medium">Pension deductions</div>
              <div className="text-xs text-muted-foreground">
                Pension Reform Act requires minimum 10% employer and 8% employee contributions.
              </div>
            </div>
          </label>

          {data.pensionEnabled && (
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div className="space-y-1.5">
                <Label htmlFor="employerPension" className="text-xs text-muted-foreground">
                  Employer (%)
                </Label>
                <Input
                  id="employerPension"
                  type="number"
                  min={1}
                  max={100}
                  value={data.employerPensionPercent}
                  onChange={(e) => onChange("employerPensionPercent", parseInt(e.target.value) || 0)}
                />
                {errors.employerPensionPercent && (
                  <p className="text-xs text-destructive">{errors.employerPensionPercent}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="employeePension" className="text-xs text-muted-foreground">
                  Employee (%)
                </Label>
                <Input
                  id="employeePension"
                  type="number"
                  min={1}
                  max={100}
                  value={data.employeePensionPercent}
                  onChange={(e) => onChange("employeePensionPercent", parseInt(e.target.value) || 0)}
                />
                {errors.employeePensionPercent && (
                  <p className="text-xs text-destructive">{errors.employeePensionPercent}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PAYE */}
        <div className={cn(
          "rounded-lg border p-4 transition-colors",
          data.payeEnabled ? "border-blue-200 bg-blue-50/30" : "border-border"
        )}>
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={data.payeEnabled}
              onCheckedChange={(checked) => onChange("payeEnabled", !!checked)}
              className="mt-0.5"
            />
            <div>
              <div className="text-sm font-medium">PAYE tax deductions</div>
              <div className="text-xs text-muted-foreground">
                Pay As You Earn tax will be calculated based on FIRS tax bands.
              </div>
            </div>
          </label>
        </div>
      </div>
      </div>
    </div>
  );
}
