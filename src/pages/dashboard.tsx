import { KpiCards } from "@/components/dashboard/kpi-cards";
import { HeadcountChart } from "@/components/dashboard/headcount-chart";
import { DepartmentChart } from "@/components/dashboard/department-chart";
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
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening across your organization today.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{formatDate()}</p>
      </div>

      {/* KPI Cards */}
      <KpiCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HeadcountChart />
        <DepartmentChart />
      </div>

      {/* Attendance + Activity + Alerts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AttendanceOverview />
        <RecentActivity />
        <AlertsPanel />
      </div>
    </div>
  );
}
