import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onboardingDone = localStorage.getItem("onboardingComplete");
  if (!onboardingDone) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f7fbff]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen min-w-0 transition-all duration-200",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-[260px]"
        )}
      >
        <Topbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />

        <main className="flex-1 min-w-0 p-4 lg:p-6 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
