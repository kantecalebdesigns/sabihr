import { useState } from "react";
import { AlertTriangle, MapPin, X } from "lucide-react";
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
  const expiringDocs = getExpiringDocCount();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {employee.basicDetails.firstName}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-muted-foreground">
              {employee.employment.jobTitle} · {employee.employment.department}
            </p>
            <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground/70">
              <MapPin className="w-3 h-3" />
              {employee.employment.workLocation}
            </span>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {employee.employment.employeeId}
          </p>
        </div>
      </div>

      {expiringDocs > 0 && !bannerDismissed && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700 flex-1">
            <span className="font-medium">{expiringDocs} document{expiringDocs > 1 ? "s" : ""}</span>{" "}
            expiring within 90 days. Update them from your profile.
          </p>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="p-1 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-100 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
