import { useState } from "react";
import { AlertTriangle, MapPin, X, Sparkles } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#1d4ed8] text-white">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6 px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[11px] font-medium">
              <Sparkles className="w-3 h-3" />
              {employee.employment.employeeId} · {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {getGreeting()}, {employee.basicDetails.firstName}
            </h1>
            <p className="text-sm text-white/85 max-w-xl leading-relaxed">
              {employee.employment.jobTitle} · {employee.employment.department}
              <span className="hidden sm:inline">
                {" · "}
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {employee.employment.workLocation}
                </span>
              </span>
            </p>
          </div>

          <div className="hidden sm:flex shrink-0 w-48 h-36 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute top-0 right-4 w-24 h-24 rounded-2xl bg-white/15 backdrop-blur rotate-6" />
              <div className="absolute bottom-0 right-14 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur -rotate-12" />
              <div className="absolute top-4 right-16 w-16 h-16 rounded-xl bg-white/25 backdrop-blur rotate-12 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
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
