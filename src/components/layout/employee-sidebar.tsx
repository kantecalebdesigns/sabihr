import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { EMPLOYEE_NAV_SECTIONS } from "@/lib/employee-nav-data";
import type { NavItem } from "@/types/dashboard";

interface EmployeeSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function EmployeeSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: EmployeeSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    const expanded: Record<string, boolean> = {};
    for (const section of EMPLOYEE_NAV_SECTIONS) {
      for (const item of section.items) {
        if (item.children) {
          const isChildActive = item.children.some((child) => location.pathname === child.path);
          if (isChildActive || location.pathname === item.path) {
            expanded[item.label] = true;
          }
        }
      }
    }
    return expanded;
  });

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.label];
    const isActive = location.pathname === item.path;
    const isChildActive = hasChildren && item.children!.some((child) => location.pathname === child.path);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpand(item.label)}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              collapsed && "justify-center px-2",
              isChildActive
                ? "text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-180")} />
              </>
            )}
          </button>
          {!collapsed && isExpanded && (
            <div className="ml-4 pl-3 border-l border-sidebar-border/50 space-y-0.5 mt-0.5">
              {item.children!.map((child) => {
                const childActive = location.pathname === child.path;
                const ChildIcon = child.icon;
                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                      childActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{child.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

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
  };

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
        {EMPLOYEE_NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(renderNavItem)}
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
