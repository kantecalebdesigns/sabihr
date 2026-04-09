import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/lib/dashboard-data";
import type { NavItem } from "@/types/dashboard";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    const expanded: Record<string, boolean> = {};
    for (const section of NAV_SECTIONS) {
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
              "group w-full flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] transition-all duration-150",
              collapsed && "justify-center p-0",
              isChildActive
                ? "text-slate-900 font-medium"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            )}
            title={collapsed ? item.label : undefined}
          >
            {collapsed ? (
              <div className={cn(
                "w-10 h-10 rounded-[10px] flex items-center justify-center transition-colors",
                isChildActive ? "bg-blue-50 text-blue-600" : "bg-[#f0f4f8] text-slate-400 hover:bg-slate-100"
              )}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
            ) : (
              <>
                <Icon className={cn(
                  "w-[18px] h-[18px] shrink-0 transition-colors",
                  isChildActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"
                )} />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown className={cn(
                  "w-3.5 h-3.5 text-slate-300 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )} />
              </>
            )}
          </button>
          {!collapsed && isExpanded && (
            <div className="ml-[21px] pl-3 border-l border-slate-100 space-y-0.5 mt-0.5">
              {item.children!.map((child) => {
                const childActive = location.pathname === child.path;
                const ChildIcon = child.icon;
                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={onMobileClose}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] transition-all duration-150",
                      childActive
                        ? "text-blue-600 font-medium bg-blue-50/70"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    )}
                  >
                    <ChildIcon className={cn(
                      "w-[16px] h-[16px] shrink-0",
                      childActive ? "text-blue-600" : "text-slate-400"
                    )} />
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
          "group flex items-center gap-2.5 rounded-lg text-[13px] transition-all duration-150",
          collapsed ? "justify-center p-0" : "px-3 py-[7px]",
          !collapsed && isActive && "text-blue-600 font-medium bg-blue-50/70",
          !collapsed && !isActive && "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        )}
        title={collapsed ? item.label : undefined}
      >
        {collapsed ? (
          <div className={cn(
            "w-10 h-10 rounded-[10px] flex items-center justify-center transition-colors",
            isActive ? "bg-blue-50 text-blue-600" : "bg-[#f0f4f8] text-slate-400 hover:bg-slate-100"
          )}>
            <Icon className="w-[18px] h-[18px]" />
          </div>
        ) : (
          <>
            <Icon className={cn(
              "w-[18px] h-[18px] shrink-0 transition-colors",
              isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"
            )} />
            <span>{item.label}</span>
          </>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className={cn(
        "flex items-center h-[60px] px-5 shrink-0",
        collapsed ? "justify-center px-0" : "gap-2"
      )}>
        {collapsed ? (
          <div className="w-10 h-10 rounded-[10px] bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* Divider */}
      <div className={cn("h-px bg-gradient-to-r from-slate-200/80 via-slate-100 to-transparent", collapsed ? "mx-2" : "mx-4")} />

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto py-3 scrollbar-thin",
        collapsed ? "px-[7px] space-y-1" : "px-3 space-y-5"
      )}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed ? (
              <div className="px-3 mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  {section.title}
                </span>
              </div>
            ) : (
              <div className="h-px bg-slate-100 mx-1 my-2" />
            )}
            <div className={cn("space-y-0.5", collapsed && "flex flex-col items-center")}>
              {section.items.map(renderNavItem)}
            </div>
          </div>
        ))}
      </nav>

      {/* User card + collapse */}
      <div className="shrink-0 border-t border-slate-100">
        {!collapsed ? (
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-[11px] font-semibold text-white">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-slate-900 truncate">Admin User</p>
                <p className="text-[11px] text-slate-400 truncate">HR Administrator</p>
              </div>
              <LogOut className="w-4 h-4 text-slate-300 hover:text-slate-500 transition-colors shrink-0" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-3 gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-[10px] font-semibold text-white">AD</span>
            </div>
          </div>
        )}
        <div className={cn("hidden lg:flex items-center px-3 py-2.5", collapsed ? "justify-center" : "justify-end")}>
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-all duration-150"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] bg-white shadow-xl shadow-black/5 transform transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 bg-white border-r border-slate-100/80 transition-all duration-200",
          collapsed ? "lg:w-16" : "lg:w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
