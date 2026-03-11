import { WelcomeBanner } from "@/components/employee-dashboard/welcome-banner";
import { StatCards } from "@/components/employee-dashboard/stat-cards";
import { LeaveSummary } from "@/components/employee-dashboard/leave-summary";
import { AttendanceOverview } from "@/components/employee-dashboard/attendance-overview";
import { RecentPayslips } from "@/components/employee-dashboard/recent-payslips";
import { QuickActions } from "@/components/employee-dashboard/quick-actions";
import { ProfileCompletion } from "@/components/employee-dashboard/profile-completion";
import { UpcomingEvents } from "@/components/employee-dashboard/upcoming-events";

export default function EmployeeDashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Welcome */}
      <WelcomeBanner />

      {/* Key metrics */}
      <StatCards />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <AttendanceOverview />
          <LeaveSummary />
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          <QuickActions />
          <RecentPayslips />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingEvents />
        <ProfileCompletion />
      </div>
    </div>
  );
}
