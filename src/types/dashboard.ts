import type { LucideIcon } from "lucide-react";

export interface KpiCardData {
  label: string;
  value: string;
  change: number;
  changeType: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface DepartmentBreakdown {
  name: string;
  count: number;
  color: string;
}

export interface HeadcountTrend {
  month: string;
  count: number;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  total: number;
}

export type ActivityType =
  | "new_hire"
  | "leave_approved"
  | "leave_requested"
  | "payroll_processed"
  | "document_generated"
  | "probation_ending"
  | "employee_exit";

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  employee: string;
  timestamp: string;
  photo?: string;
}

export type AlertSeverity = "warning" | "info" | "urgent";

export interface DashboardAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
}

export type QuickActionKey =
  | "add_employee"
  | "approve_leave"
  | "run_payroll"
  | "post_announcement"
  | "new_asset";

export interface QuickAction {
  key: QuickActionKey;
  label: string;
  icon: LucideIcon;
  count?: number;
  countLabel?: string;
  path: string;
  iconBg: string;
  iconColor: string;
}

export type PendingApprovalType = "leave" | "expense" | "document" | "loan";

export interface PendingApproval {
  id: string;
  employeeName: string;
  initials: string;
  avatarColor: string;
  type: PendingApprovalType;
  summary: string;
  submittedAt: string;
}

export interface OnLeaveToday {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  returns: string;
}

export interface NavItem {
  label: string;
  icon?: LucideIcon;
  path: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}
