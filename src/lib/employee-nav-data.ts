import { LayoutDashboard, Bell, UserCircle, Users, ArrowRightLeft, FileText, Package } from "lucide-react";
import type { NavSection } from "@/types/dashboard";

export const EMPLOYEE_NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/employee/dashboard" },
      { label: "Notifications", icon: Bell, path: "/employee/notifications" },
    ],
  },
  {
    title: "My Profile",
    items: [
      { label: "Personal Info", icon: UserCircle, path: "/employee/profile" },
      { label: "My Documents", icon: FileText, path: "/employee/documents" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Colleagues", icon: Users, path: "/employee/directory" },
    ],
  },
  {
    title: "Self Service",
    items: [
      { label: "My Assets", icon: Package, path: "/employee/assets" },
      { label: "Redeployment", icon: ArrowRightLeft, path: "/employee/redeployment" },
    ],
  },
];
