import { AlertTriangle } from "lucide-react";
import { MOCK_EMPLOYEE_PROFILE } from "@/lib/employee-mock-data";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getExpiringDocCount(): number {
  const now = new Date();
  return MOCK_EMPLOYEE_PROFILE.documents.filter((doc) => {
    if (!doc.expiryDate) return false;
    const expiry = new Date(doc.expiryDate);
    const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 90;
  }).length;
}

export function WelcomeBanner() {
  const employee = MOCK_EMPLOYEE_PROFILE;
  const initials = `${employee.basicDetails.firstName[0]}${employee.basicDetails.lastName[0]}`;
  const expiringDocs = getExpiringDocCount();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-5">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">
            {getGreeting()}, {employee.basicDetails.firstName}!
          </h1>
          <p className="text-sm text-muted-foreground">
            {employee.employment.jobTitle} &middot; {employee.employment.department} &middot; {employee.employment.employeeId}
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {employee.employment.workLocation}
          </p>
        </div>
      </div>

      {/* Document expiry alert */}
      {expiringDocs > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <span className="font-medium">{expiringDocs} document{expiringDocs > 1 ? "s" : ""}</span>{" "}
            expiring within 90 days. Update them from your profile.
          </p>
        </div>
      )}
    </div>
  );
}
