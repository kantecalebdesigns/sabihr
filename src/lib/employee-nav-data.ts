import {
  LayoutDashboard,
  Users,
  ArrowRightLeft,
  Package,
  DollarSign,
  Banknote,
  Wallet,
  Home,
  Clock,
  Timer,
  CalendarDays,
  Palmtree,
  Megaphone,
  ClipboardList,
  Receipt,
  ShieldAlert,
  Target,
  Heart,
  Briefcase,
  Settings,
  CalendarClock,
} from "lucide-react";
import type { NavSection } from "@/types/dashboard";

export const EMPLOYEE_NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    icon: Home,
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/employee/dashboard" },
    ],
  },
  {
    title: "Time",
    icon: CalendarDays,
    items: [
      { label: "Attendance", icon: CalendarDays, path: "/employee/attendance" },
      { label: "Shifts", icon: Timer, path: "/employee/shifts" },
      { label: "Work Hours & Overtime", icon: Clock, path: "/employee/work-hours" },
      { label: "Leave", icon: Palmtree, path: "/employee/leave" },
      { label: "Work Schedule", icon: CalendarClock, path: "/employee/schedule" },
    ],
  },
  {
    title: "Pay & Finance",
    icon: Wallet,
    items: [
      {
        label: "Pay & Salary",
        icon: DollarSign,
        path: "/employee/payslips",
        children: [
          { label: "My Payslips", path: "/employee/payslips" },
          { label: "Tax & Statutory", path: "/employee/tax" },
          { label: "Payments & Banking", path: "/employee/payments" },
        ],
      },
      { label: "Loans & Advances", icon: Banknote, path: "/employee/loans" },
      { label: "My Wallet", icon: Wallet, path: "/employee/wallet" },
    ],
  },
  {
    title: "Performance",
    icon: Target,
    items: [
      { label: "My Performance", icon: Target, path: "/employee/performance" },
    ],
  },
  {
    title: "Benefits",
    icon: Heart,
    items: [
      { label: "My Benefits", icon: Heart, path: "/employee/benefits" },
    ],
  },
  {
    title: "Self Service",
    icon: Briefcase,
    items: [
      { label: "My Assets", icon: Package, path: "/employee/assets" },
      { label: "Requisitions", icon: Receipt, path: "/employee/requisitions" },
      { label: "Redeployment", icon: ArrowRightLeft, path: "/employee/redeployment" },
    ],
  },
  {
    title: "Company",
    icon: Users,
    items: [
      { label: "Colleagues", icon: Users, path: "/employee/directory" },
      { label: "Announcements", icon: Megaphone, path: "/employee/announcements" },
      { label: "Surveys", icon: ClipboardList, path: "/employee/surveys" },
    ],
  },
  {
    title: "Compliance",
    icon: ShieldAlert,
    items: [
      { label: "Disciplinary", icon: ShieldAlert, path: "/employee/disciplinary" },
    ],
  },
  {
    title: "Account",
    icon: Settings,
    items: [
      { label: "Settings", icon: Settings, path: "/employee/settings" },
    ],
  },
];
