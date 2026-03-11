import { Link } from "react-router-dom";
import {
  CalendarPlus,
  FileText,
  UserCircle,
  Users,
  Receipt,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ACTIONS = [
  {
    label: "Request Leave",
    icon: CalendarPlus,
    path: "/employee/leave",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "View Payslips",
    icon: Receipt,
    path: "/employee/payslips",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Edit Profile",
    icon: UserCircle,
    path: "/employee/profile",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    label: "Colleagues",
    icon: Users,
    path: "/employee/directory",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Documents",
    icon: FileText,
    path: "/employee/profile",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    label: "Redeployment",
    icon: Send,
    path: "/employee/redeployment",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {ACTIONS.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-muted/50 transition-colors group"
            >
              <div
                className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
              >
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="text-[11px] font-medium text-center leading-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
