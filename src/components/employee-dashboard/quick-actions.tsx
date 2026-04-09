import { Link } from "react-router-dom";
import {
  CalendarPlus,
  FileText,
  UserCircle,
  Users,
  Receipt,
  Send,
} from "lucide-react";

const ACTIONS = [
  { label: "Request Leave", icon: CalendarPlus, path: "/employee/leave" },
  { label: "View Payslips", icon: Receipt, path: "/employee/payslips" },
  { label: "Edit Profile", icon: UserCircle, path: "/employee/profile" },
  { label: "Colleagues", icon: Users, path: "/employee/directory" },
  { label: "Documents", icon: FileText, path: "/employee/documents" },
  { label: "Redeployment", icon: Send, path: "/employee/redeployment" },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.label}
            to={action.path}
            className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-[#f8fafc] transition-colors group"
          >
            <div className="w-10 h-10 rounded-[10px] bg-[#f0f4f8] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <action.icon className="w-[18px] h-[18px] text-slate-500 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
