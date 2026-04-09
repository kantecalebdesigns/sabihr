import { useState } from "react";
import { Outlet } from "react-router-dom";
import { EmployeeSidebar } from "./employee-sidebar";
import { EmployeeTopbar } from "./employee-topbar";
import { cn } from "@/lib/utils";

export function EmployeeLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <EmployeeSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-200",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-[260px]"
        )}
      >
        <EmployeeTopbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
