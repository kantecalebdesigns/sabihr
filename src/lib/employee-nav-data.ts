import { LayoutDashboard, UserCircle, Users } from "lucide-react";
import type { NavSection } from "@/types/dashboard";

export const EMPLOYEE_NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/employee/dashboard" },
    ],
  },
  {
    title: "My Profile",
    items: [
      { label: "Personal Info", icon: UserCircle, path: "/employee/profile" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Colleagues", icon: Users, path: "/employee/directory" },
    ],
  },
];
