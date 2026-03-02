import {
  Users,
  Banknote,
  Clock,
  TrendingDown,
  LayoutDashboard,
  UserCircle,
  Building2,
  UserPlus,
  CalendarDays,
  Palmtree,
  DollarSign,
  FileText,
  Package,
  BarChart3,
  Megaphone,
  Settings,
  Target,
} from "lucide-react";
import type {
  KpiCardData,
  DepartmentBreakdown,
  HeadcountTrend,
  AttendanceSummary,
  RecentActivity,
  DashboardAlert,
  NavSection,
} from "@/types/dashboard";

// --- KPI Cards ---
export const DASHBOARD_KPI: KpiCardData[] = [
  {
    label: "Total Employees",
    value: "156",
    change: 5.2,
    changeType: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Payroll Cost",
    value: "₦45.2M",
    change: 2.1,
    changeType: "up",
    icon: Banknote,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    label: "Attendance Rate",
    value: "94.2%",
    change: 1.3,
    changeType: "up",
    icon: Clock,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    label: "Turnover Rate",
    value: "3.1%",
    change: 0.8,
    changeType: "down",
    icon: TrendingDown,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

// --- Headcount Trend (last 6 months) ---
export const HEADCOUNT_TREND: HeadcountTrend[] = [
  { month: "Sep", count: 134 },
  { month: "Oct", count: 139 },
  { month: "Nov", count: 142 },
  { month: "Dec", count: 145 },
  { month: "Jan", count: 150 },
  { month: "Feb", count: 156 },
];

// --- Department Breakdown ---
export const DEPARTMENT_BREAKDOWN: DepartmentBreakdown[] = [
  { name: "Engineering", count: 42, color: "#2563eb" },
  { name: "Sales", count: 28, color: "#10b981" },
  { name: "Marketing", count: 22, color: "#f59e0b" },
  { name: "Finance", count: 18, color: "#8b5cf6" },
  { name: "HR", count: 15, color: "#ec4899" },
  { name: "Operations", count: 14, color: "#06b6d4" },
  { name: "Legal", count: 9, color: "#64748b" },
  { name: "IT", count: 8, color: "#f97316" },
];

// --- Attendance Summary (today) ---
export const ATTENDANCE_SUMMARY: AttendanceSummary = {
  present: 128,
  absent: 8,
  late: 12,
  onLeave: 8,
  total: 156,
};

// --- Recent Activity ---
export const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: "1",
    type: "new_hire",
    description: "joined as Senior Developer in Engineering",
    employee: "Adebayo Ogunlesi",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "leave_approved",
    description: "annual leave approved (Mar 3-7)",
    employee: "Chioma Nwosu",
    timestamp: "3 hours ago",
  },
  {
    id: "3",
    type: "payroll_processed",
    description: "February payroll processed for 156 employees",
    employee: "System",
    timestamp: "Yesterday",
  },
  {
    id: "4",
    type: "leave_requested",
    description: "requested 3 days sick leave",
    employee: "Emeka Eze",
    timestamp: "Yesterday",
  },
  {
    id: "5",
    type: "document_generated",
    description: "confirmation letter generated",
    employee: "Fatima Ibrahim",
    timestamp: "2 days ago",
  },
  {
    id: "6",
    type: "probation_ending",
    description: "probation period ends in 7 days",
    employee: "Oluwaseun Adeyemi",
    timestamp: "2 days ago",
  },
];

// --- Alerts ---
export const DASHBOARD_ALERTS: DashboardAlert[] = [
  {
    id: "1",
    severity: "warning",
    title: "3 Probation Reviews Due",
    description:
      "Three employees have probation reviews due within the next 14 days.",
  },
  {
    id: "2",
    severity: "info",
    title: "Payroll Due in 5 Days",
    description:
      "March payroll processing deadline is March 3rd. Ensure all attendance data is up to date.",
  },
  {
    id: "3",
    severity: "warning",
    title: "Low Leave Balances",
    description:
      "2 employees have exhausted their annual leave balance for the year.",
  },
  {
    id: "4",
    severity: "urgent",
    title: "Pension Remittance Overdue",
    description:
      "February pension contributions have not been remitted to PFAs. Due date was Feb 20th.",
  },
];

// --- Sidebar Navigation ---
export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Employees", icon: UserCircle, path: "/employees" },
      { label: "Departments", icon: Building2, path: "/departments" },
      { label: "Onboarding", icon: UserPlus, path: "/onboarding-mgmt" },
    ],
  },
  {
    title: "Time & Pay",
    items: [
      { label: "Attendance", icon: CalendarDays, path: "/attendance" },
      { label: "Leave", icon: Palmtree, path: "/leave" },
      { label: "Payroll", icon: DollarSign, path: "/payroll" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Documents", icon: FileText, path: "/documents" },
      { label: "Assets", icon: Package, path: "/assets" },
      { label: "Performance", icon: Target, path: "/performance" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Announcements", icon: Megaphone, path: "/announcements" },
      { label: "Reports", icon: BarChart3, path: "/reports" },
      { label: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];
