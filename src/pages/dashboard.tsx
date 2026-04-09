import { CompleteSetupSection } from "@/components/dashboard/complete-setup-section";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { AttendanceOverview } from "@/components/dashboard/attendance-overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Greeting header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {getGreeting()}, Admin
          </h1>
          <p className="text-sm text-slate-500">
            Here&apos;s what&apos;s happening across your organization today.
          </p>
        </div>
        <p className="text-sm text-slate-500">{formatDate()}</p>
      </div>

      {/* Complete account setup prompt */}
      <CompleteSetupSection />

      {/* KPI Cards */}
      <KpiCards />

      {/* Today's Attendance — full width */}
      <AttendanceOverview />

      {/* Activity + Alerts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivity />
        <AlertsPanel />
      </div>
    </div>
  );
}
