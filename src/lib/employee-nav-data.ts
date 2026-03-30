import { LayoutDashboard, Bell, UserCircle, Users, ArrowRightLeft, FileText, Package, DollarSign, Landmark, CreditCard, Banknote, Wallet } from "lucide-react";
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
    title: "Pay & Finance",
    items: [
      {
        label: "Pay & Salary",
        icon: DollarSign,
        path: "/employee/payslips",
        children: [
          { label: "My Payslips", icon: DollarSign, path: "/employee/payslips" },
          { label: "Tax & Statutory", icon: Landmark, path: "/employee/tax" },
          { label: "Payments & Banking", icon: CreditCard, path: "/employee/payments" },
        ],
      },
      { label: "Loans & Advances", icon: Banknote, path: "/employee/loans" },
      { label: "My Wallet", icon: Wallet, path: "/employee/wallet" },
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
