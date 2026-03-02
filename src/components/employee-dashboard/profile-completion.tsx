import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { MOCK_EMPLOYEE_PROFILE } from "@/lib/employee-mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
          <span className="text-lg font-bold text-primary">{completion}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>

          {/* Checklist */}
          <div className="space-y-1.5 pt-1">
            {CHECKLIST.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                {item.complete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                )}
                <span className={`text-xs ${item.complete ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground">
            {completedCount} of {CHECKLIST.length} completed
          </p>

          {completion < 100 && (
            <Button asChild className="w-full" size="sm">
              <Link to="/employee/profile">
                <span className="flex items-center gap-2">
                  Complete Profile
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
