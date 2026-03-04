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

      {/* Row 1: Employment Info + Profile Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmploymentInfoCard />
        </div>
        <div>
          <ProfileCompletion />
        </div>
      </div>

      {/* Row 2: Quick Actions + Quick Actions + Upcoming */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActions />
        <QuickActions />
        <UpcomingEvents />
      </div>
    </div>
  );
}
