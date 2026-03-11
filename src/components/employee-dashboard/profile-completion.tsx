import { Link } from "react-router-dom";
import { ArrowRight, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_EMPLOYEE_PROFILE } from "@/lib/employee-mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";

const CHECKLIST = [
  { label: "Basic details", complete: true },
  { label: "Contact information", complete: true },
  { label: "Emergency contacts", complete: true },
  { label: "Family dependents", complete: true },
  { label: "Upload documents", complete: false },
  { label: "Statutory IDs", complete: false },
];

export function ProfileCompletion() {
  const completion = MOCK_EMPLOYEE_PROFILE.profileCompletion;
  const completedCount = CHECKLIST.filter((item) => item.complete).length;

  if (completion >= 100) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
        <CardAction>
          <span className="text-lg font-bold text-primary">{completion}%</span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {CHECKLIST.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              {item.complete ? (
                <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-primary" />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-border shrink-0" />
              )}
              <span
                className={cn(
                  "text-xs",
                  item.complete
                    ? "text-muted-foreground line-through"
                    : "text-foreground font-medium"
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-muted-foreground">
            {completedCount} of {CHECKLIST.length} completed
          </p>
          <Link
            to="/employee/profile"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Complete
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
