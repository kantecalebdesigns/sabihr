import {
  Users,
  Banknote,
  Clock,
  TrendingDown,
  LayoutDashboard,
  UserCircle,
  Building2,
  CalendarDays,
  Palmtree,
  DollarSign,
  FileText,
  FolderOpen,
  Package,
  Megaphone,
  Settings,
  Home,
  Briefcase,
  Wallet,
  MoreHorizontal,
  Target,
  UserCheck,
  Heart,
  CreditCard,
  ClipboardList,
  ShieldAlert,
  LogOut,
  MessageSquare,
  Receipt,
  Timer,
  PieChart,
  Network,
  Building,
  ScrollText,
  GitBranch,
  Workflow,
} from "lucide-react";
import type {
  KpiCardData,
  DepartmentBreakdown,
  HeadcountTrend,
  AttendanceSummary,
  RecentActivity,
  DashboardAlert,
  NavSection,
  QuickAction,
  PendingApproval,
  OnLeaveToday,
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
// Photos are Unsplash portraits; they fall back to initials avatars on load error.
export const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: "1",
    type: "new_hire",
    description: "joined as Senior Developer in Engineering",
    employee: "Adebayo Ogunlesi",
    timestamp: "2 hours ago",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
  },
  {
    id: "2",
    type: "leave_approved",
    description: "annual leave approved (Mar 3-7)",
    employee: "Chioma Nwosu",
    timestamp: "3 hours ago",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces",
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
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&crop=faces",
  },
  {
    id: "5",
    type: "document_generated",
    description: "confirmation letter generated",
    employee: "Fatima Ibrahim",
    timestamp: "2 days ago",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces",
  },
  {
    id: "6",
    type: "probation_ending",
    description: "probation period ends in 7 days",
    employee: "Oluwaseun Adeyemi",
    timestamp: "2 days ago",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces",
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

// --- Quick Actions (tile strip) ---
export const QUICK_ACTIONS: QuickAction[] = [
  {
    key: "add_employee",
    label: "Add Employee",
    icon: UserCircle,
    countLabel: "Start onboarding",
    path: "/employees",
    iconBg: "bg-slate-50",
    iconColor: "text-slate-700",
  },
  {
    key: "approve_leave",
    label: "Leave Requests",
    icon: Briefcase,
    count: 4,
    countLabel: "pending",
    path: "/leave",
    iconBg: "bg-slate-50",
    iconColor: "text-slate-700",
  },
  {
    key: "run_payroll",
    label: "Run Payroll",
    icon: DollarSign,
    countLabel: "Due in 5 days",
    path: "/payroll",
    iconBg: "bg-slate-50",
    iconColor: "text-slate-700",
  },
  {
    key: "post_announcement",
    label: "Post Announcement",
    icon: Megaphone,
    countLabel: "Notify team",
    path: "/announcements",
    iconBg: "bg-slate-50",
    iconColor: "text-slate-700",
  },
  {
    key: "new_asset",
    label: "Asset Requests",
    icon: Package,
    count: 2,
    countLabel: "awaiting review",
    path: "/assets",
    iconBg: "bg-slate-50",
    iconColor: "text-slate-700",
  },
];

// --- Pending Approvals (right-rail list) ---
export const PENDING_APPROVALS: PendingApproval[] = [
  {
    id: "a1",
    employeeName: "Chioma Nwosu",
    initials: "CN",
    avatarColor: "bg-rose-500",
    type: "leave",
    summary: "Annual leave · Mar 3–7",
    submittedAt: "20 min ago",
  },
  {
    id: "a2",
    employeeName: "Emeka Eze",
    initials: "EE",
    avatarColor: "bg-blue-500",
    type: "leave",
    summary: "Sick leave · 3 days",
    submittedAt: "1 hr ago",
  },
  {
    id: "a3",
    employeeName: "Fatima Ibrahim",
    initials: "FI",
    avatarColor: "bg-emerald-500",
    type: "expense",
    summary: "Expense claim · ₦42,500",
    submittedAt: "2 hrs ago",
  },
  {
    id: "a4",
    employeeName: "Tunde Bakare",
    initials: "TB",
    avatarColor: "bg-amber-500",
    type: "document",
    summary: "NDA signature request",
    submittedAt: "Yesterday",
  },
  {
    id: "a5",
    employeeName: "Ngozi Okafor",
    initials: "NO",
    avatarColor: "bg-violet-500",
    type: "loan",
    summary: "Salary advance · ₦180,000",
    submittedAt: "Yesterday",
  },
];

// --- On Leave Today (right-rail chips) ---
export const ON_LEAVE_TODAY: OnLeaveToday[] = [
  {
    id: "l1",
    name: "Samuel John",
    initials: "SJ",
    avatarColor: "bg-blue-500",
    returns: "Apr 24",
  },
  {
    id: "l2",
    name: "Amina Yusuf",
    initials: "AY",
    avatarColor: "bg-emerald-500",
    returns: "Apr 22",
  },
  {
    id: "l3",
    name: "Jide Bello",
    initials: "JB",
    avatarColor: "bg-amber-500",
    returns: "Apr 26",
  },
  {
    id: "l4",
    name: "Grace Adeola",
    initials: "GA",
    avatarColor: "bg-rose-500",
    returns: "Apr 21",
  },
];

// --- Sidebar Navigation ---
export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    icon: Home,
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    title: "People",
    icon: Users,
    items: [
      { label: "Employees", icon: UserCircle, path: "/employees" },
      { label: "Departments", icon: Building2, path: "/departments" },
    ],
  },
  {
    title: "Time",
    icon: Clock,
    items: [
      { label: "Attendance", icon: CalendarDays, path: "/attendance" },
      { label: "Shifts", icon: Timer, path: "/shifts" },
      { label: "Leave", icon: Palmtree, path: "/leave" },
    ],
  },
  {
    title: "Payroll",
    icon: Wallet,
    items: [
      { label: "Processing", icon: DollarSign, path: "/payroll" },
      { label: "Pay Grades & Groups", icon: Banknote, path: "/payroll/pay-grades" },
    ],
  },
  {
    title: "Performance",
    icon: Target,
    items: [
      { label: "Performance", icon: Target, path: "/performance" },
    ],
  },
  {
    title: "Benefits",
    icon: Heart,
    items: [
      { label: "Plans", icon: Heart, path: "/benefits" },
      { label: "Enrollments", icon: UserCheck, path: "/benefits/enrollments" },
    ],
  },
  {
    title: "Loans",
    icon: CreditCard,
    items: [
      { label: "Management", icon: CreditCard, path: "/loans" },
    ],
  },
  {
    title: "Operations",
    icon: Briefcase,
    items: [
      { label: "Documents", icon: FileText, path: "/documents" },
      { label: "Employee Documents", icon: FolderOpen, path: "/documents/library" },
      { label: "Assets", icon: Package, path: "/assets" },
    ],
  },
  {
    title: "Branches",
    icon: Network,
    items: [
      { label: "Branches", icon: Building, path: "/branches" },
      { label: "Branch Policies", icon: ScrollText, path: "/branches/policies" },
      { label: "Branch Hierarchy", icon: GitBranch, path: "/branches/hierarchy" },
      { label: "Organogram", icon: Workflow, path: "/branches/organogram" },
    ],
  },
  {
    title: "Engagement",
    icon: MessageSquare,
    items: [
      { label: "Announcements", icon: Megaphone, path: "/announcements" },
      { label: "Surveys", icon: ClipboardList, path: "/surveys" },
      { label: "Requisitions", icon: Receipt, path: "/requisitions" },
    ],
  },
  {
    title: "Compliance",
    icon: ShieldAlert,
    items: [
      { label: "Disciplinary", icon: ShieldAlert, path: "/disciplinary" },
      { label: "Exit Management", icon: LogOut, path: "/exit" },
    ],
  },
  {
    title: "More",
    icon: MoreHorizontal,
    items: [
      { label: "Reports", icon: PieChart, path: "/reports" },
      { label: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];
