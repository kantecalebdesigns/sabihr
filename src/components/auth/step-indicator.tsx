import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground border border-border"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-medium leading-none",
                    (isActive || isCompleted) ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-3 mt-[-18px]",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
