import { Menu, Bell, LogOut, User, Settings, ChevronDown, ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuToggle: () => void;
  pageTitle?: string;
}

export function Topbar({ onMenuToggle, pageTitle = "Dashboard" }: TopbarProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    localStorage.removeItem("onboardingComplete");
    navigate("/login");
  }

  return (
    <header className="h-[60px] border-b-2 border-slate-200 bg-white flex items-center justify-between px-4 lg:px-6 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#f8fafc] hover:text-slate-600 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-slate-900 truncate">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* View switcher — hover dropdown */}
        <div className="relative group">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#f8fafc] hover:text-slate-600 transition-colors">
            <ArrowRightLeft className="w-4.5 h-4.5" />
          </button>
          <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-full mt-1 w-48 rounded-xl border border-[#efefef] bg-white shadow-lg py-1 z-50 transition-all duration-150">
            <p className="px-3 py-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Switch View</p>
            <button
              onClick={() => {
                localStorage.setItem("adminViewSwitch", "true");
                navigate("/employee/dashboard");
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-900 hover:bg-[#f8fafc] transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              Employee View
            </button>
          </div>
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#f8fafc] hover:text-slate-600 transition-colors">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#fb2c36]" />
        </button>

        {/* User menu */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#f8fafc] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center">
              <span className="text-xs font-semibold text-slate-600">AD</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none text-slate-900">Admin User</p>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">HR Admin</p>
            </div>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block",
              dropdownOpen && "rotate-180"
            )} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-[#efefef] bg-white shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-900 hover:bg-[#f8fafc] transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-900 hover:bg-[#f8fafc] transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  localStorage.setItem("adminViewSwitch", "true");
                  navigate("/employee/dashboard");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-900 hover:bg-[#f8fafc] transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                Switch to Employee View
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
