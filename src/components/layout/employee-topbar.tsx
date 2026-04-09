import { Menu, Bell, LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MOCK_EMPLOYEE_PROFILE, MOCK_NOTIFICATIONS } from "@/lib/employee-mock-data";
import { NotificationDropdown } from "./notification-dropdown";
import type { EmployeeNotification } from "@/types/employee";

interface EmployeeTopbarProps {
  onMenuToggle: () => void;
  pageTitle?: string;
}

export function EmployeeTopbar({ onMenuToggle, pageTitle = "Dashboard" }: EmployeeTopbarProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<EmployeeNotification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const employee = MOCK_EMPLOYEE_PROFILE;
  const initials = `${employee.basicDetails.firstName[0]}${employee.basicDetails.lastName[0]}`;
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    localStorage.removeItem("employeeOnboardingComplete");
    localStorage.removeItem("userRole");
    navigate("/login");
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <header className="h-[60px] border-b border-[#efefef] bg-white flex items-center justify-between px-4 lg:px-6 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#f8fafc] hover:text-slate-600 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#f8fafc] hover:text-slate-600 transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#fb2c36]" />
            )}
          </button>
          <NotificationDropdown
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
          />
        </div>

        {/* User menu */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#f8fafc] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center">
              <span className="text-xs font-semibold text-slate-600">{initials}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none text-slate-900">
                {employee.basicDetails.firstName} {employee.basicDetails.lastName}
              </p>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">
                {employee.employment.jobTitle}
              </p>
            </div>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block",
              dropdownOpen && "rotate-180"
            )} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[#efefef] bg-white shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/employee/profile");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-900 hover:bg-[#f8fafc] transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                My Profile
              </button>
              <div className="border-t border-[#efefef] my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#e7000b] hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
