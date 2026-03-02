import { WelcomeBanner } from "@/components/employee-dashboard/welcome-banner";
import { ProfileCompletion } from "@/components/employee-dashboard/profile-completion";
import { EmploymentInfoCard } from "@/components/employee-dashboard/employment-info-card";
import { QuickActions } from "@/components/employee-dashboard/quick-actions";
import { UpcomingEvents } from "@/components/employee-dashboard/upcoming-events";

export default function EmployeeDashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Welcome */}
      <WelcomeBanner />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Employment info (takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <EmploymentInfoCard />
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <ProfileCompletion />
          <QuickActions />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
