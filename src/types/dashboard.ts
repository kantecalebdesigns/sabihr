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
}

export type AlertSeverity = "warning" | "info" | "urgent";

export interface DashboardAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
