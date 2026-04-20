import { CompleteSetupSection } from "@/components/dashboard/complete-setup-section";
import { HeroGreeting } from "@/components/dashboard/hero-greeting";
import { QuickActionsStrip } from "@/components/dashboard/quick-actions-strip";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { RightRail } from "@/components/dashboard/right-rail";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 max-w-[1500px]">
      <div className="space-y-6 min-w-0">
        <CompleteSetupSection />
        <HeroGreeting />
        <QuickActionsStrip />
        <ActivityTable />
      </div>

      <RightRail />
    </div>
  );
}
