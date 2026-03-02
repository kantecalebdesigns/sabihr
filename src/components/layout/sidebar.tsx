import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/lib/dashboard-data";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center h-[60px] border-b border-sidebar-border px-4 shrink-0",
        collapsed ? "justify-center" : "gap-2"
      )}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:flex items-center justify-end border-t border-sidebar-border p-3">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 bg-sidebar border-r border-sidebar-border transition-all duration-200",
          collapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
