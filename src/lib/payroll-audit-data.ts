// 5.9 Payroll History & Audit — Mock Data & Types

export interface PayrollArchive {
  id: string;
  period: string;
  year: number;
  month: number;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  processedDate: string;
  approvedBy: string;
  status: "archived" | "active";
  archivedDate: string | null;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  action: "payroll-created" | "payroll-processed" | "payroll-approved" | "payroll-rejected" | "payslip-generated" | "payment-initiated" | "payment-completed" | "adjustment-made" | "salary-changed" | "structure-modified" | "remittance-filed" | "config-changed";
  actionLabel: string;
  module: string;
  description: string;
  performedBy: string;
  affectedEntity: string;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string;
}

export interface YearEndReport {
  id: string;
  year: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalTaxPaid: number;
  totalPensionPaid: number;
  totalStatutory: number;
  employeeCount: number;
  payrollRunCount: number;
  status: "open" | "closing" | "closed";
  closedBy: string | null;
  closedDate: string | null;
}

export const ARCHIVE_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  archived: { label: "Archived", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
};

export const AUDIT_ACTION_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  "payroll-created": { label: "Created", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  "payroll-processed": { label: "Processed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  "payroll-approved": { label: "Approved", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  "payroll-rejected": { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  "payslip-generated": { label: "Generated", bg: "bg-violet-50 border-violet-200", color: "text-violet-700" },
  "payment-initiated": { label: "Payment", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  "payment-completed": { label: "Completed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  "adjustment-made": { label: "Adjustment", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  "salary-changed": { label: "Salary Change", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  "structure-modified": { label: "Modified", bg: "bg-violet-50 border-violet-200", color: "text-violet-700" },
  "remittance-filed": { label: "Remittance", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  "config-changed": { label: "Config", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const YEAR_END_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  open: { label: "Open", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  closing: { label: "Closing", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  closed: { label: "Closed", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const MOCK_PAYROLL_ARCHIVES: PayrollArchive[] = [
  { id: "arch-1", period: "March 2026", year: 2026, month: 3, totalGross: 48200000, totalNet: 34100000, totalDeductions: 14100000, employeeCount: 156, processedDate: "2026-03-22", approvedBy: "Emeka Nwosu", status: "active", archivedDate: null },
  { id: "arch-2", period: "February 2026", year: 2026, month: 2, totalGross: 47800000, totalNet: 33800000, totalDeductions: 14000000, employeeCount: 156, processedDate: "2026-02-22", approvedBy: "Emeka Nwosu", status: "archived", archivedDate: "2026-03-01" },
  { id: "arch-3", period: "January 2026", year: 2026, month: 1, totalGross: 46500000, totalNet: 32900000, totalDeductions: 13600000, employeeCount: 152, processedDate: "2026-01-22", approvedBy: "Emeka Nwosu", status: "archived", archivedDate: "2026-02-01" },
  { id: "arch-4", period: "December 2025", year: 2025, month: 12, totalGross: 52300000, totalNet: 37100000, totalDeductions: 15200000, employeeCount: 148, processedDate: "2025-12-22", approvedBy: "Emeka Nwosu", status: "archived", archivedDate: "2026-01-01" },
  { id: "arch-5", period: "November 2025", year: 2025, month: 11, totalGross: 44800000, totalNet: 31700000, totalDeductions: 13100000, employeeCount: 148, processedDate: "2025-11-22", approvedBy: "Emeka Nwosu", status: "archived", archivedDate: "2025-12-01" },
  { id: "arch-6", period: "October 2025", year: 2025, month: 10, totalGross: 44200000, totalNet: 31200000, totalDeductions: 13000000, employeeCount: 148, processedDate: "2025-10-22", approvedBy: "Emeka Nwosu", status: "archived", archivedDate: "2025-11-01" },
];

export const MOCK_AUDIT_TRAIL: AuditTrailEntry[] = [
  { id: "at-1", timestamp: "2026-03-25T09:30:00", action: "payroll-created", actionLabel: "Payroll Run Created", module: "Payroll Processing", description: "Created payroll run for March 2026", performedBy: "System (Auto-Payroll)", affectedEntity: "PR-MAR-2026", oldValue: null, newValue: "Draft", ipAddress: "10.0.0.1" },
  { id: "at-2", timestamp: "2026-03-24T16:45:00", action: "salary-changed", actionLabel: "Salary Revised", module: "Payroll Config", description: "Salary revision for Adebayo Ogunlesi - promoted to Lead", performedBy: "Halima Yusuf", affectedEntity: "EMP-001", oldValue: "₦1,000,000", newValue: "₦1,500,000", ipAddress: "192.168.1.45" },
  { id: "at-3", timestamp: "2026-03-22T10:00:00", action: "config-changed", actionLabel: "Config Updated", module: "Payroll Config", description: "Updated transport allowance from 15% to 18% for Mid-Level structure", performedBy: "Emeka Nwosu", affectedEntity: "SS-002", oldValue: "15%", newValue: "18%", ipAddress: "192.168.1.50" },
  { id: "at-4", timestamp: "2026-02-25T09:05:00", action: "payment-completed", actionLabel: "Payment Disbursed", module: "Payment", description: "Salary disbursement completed for February 2026 - 154/156 successful", performedBy: "System", affectedEntity: "PR-FEB-2026", oldValue: null, newValue: "₦33,908,750 disbursed", ipAddress: "10.0.0.1" },
  { id: "at-5", timestamp: "2026-02-25T08:00:00", action: "payment-initiated", actionLabel: "Payment Initiated", module: "Payment", description: "Initiated salary payment for February 2026", performedBy: "Emeka Nwosu", affectedEntity: "PR-FEB-2026", oldValue: null, newValue: "156 transactions", ipAddress: "192.168.1.50" },
  { id: "at-6", timestamp: "2026-02-24T14:00:00", action: "payroll-approved", actionLabel: "Payroll Approved", module: "Payroll Processing", description: "February 2026 payroll approved for payment", performedBy: "Emeka Nwosu", affectedEntity: "PR-FEB-2026", oldValue: "Processing", newValue: "Completed", ipAddress: "192.168.1.50" },
  { id: "at-7", timestamp: "2026-02-24T10:30:00", action: "payslip-generated", actionLabel: "Payslips Generated", module: "Payslip", description: "Generated 156 payslips for February 2026", performedBy: "Emeka Nwosu", affectedEntity: "BATCH-FEB-2026", oldValue: null, newValue: "156 payslips", ipAddress: "192.168.1.50" },
  { id: "at-8", timestamp: "2026-02-22T09:00:00", action: "payroll-processed", actionLabel: "Payroll Processed", module: "Payroll Processing", description: "Payroll computation completed for February 2026", performedBy: "System", affectedEntity: "PR-FEB-2026", oldValue: "Draft", newValue: "Processing", ipAddress: "10.0.0.1" },
  { id: "at-9", timestamp: "2026-03-08T11:00:00", action: "remittance-filed", actionLabel: "Remittance Filed", module: "Remittance", description: "PAYE tax filed for February 2026 - ₦13,980,000", performedBy: "Emeka Nwosu", affectedEntity: "REM-PAYE-FEB-2026", oldValue: null, newValue: "Filed & Paid", ipAddress: "192.168.1.50" },
  { id: "at-10", timestamp: "2026-02-20T14:30:00", action: "adjustment-made", actionLabel: "Payroll Adjustment", module: "Payroll Processing", description: "Added overtime for 12 employees in Engineering dept", performedBy: "Halima Yusuf", affectedEntity: "PR-FEB-2026", oldValue: null, newValue: "12 adjustments", ipAddress: "192.168.1.45" },
];

export const MOCK_YEAR_END_REPORTS: YearEndReport[] = [
  { id: "ye-1", year: 2026, totalGrossPay: 142500000, totalNetPay: 100800000, totalTaxPaid: 25100000, totalPensionPaid: 11400000, totalStatutory: 5200000, employeeCount: 156, payrollRunCount: 3, status: "open", closedBy: null, closedDate: null },
  { id: "ye-2", year: 2025, totalGrossPay: 540000000, totalNetPay: 382500000, totalTaxPaid: 95400000, totalPensionPaid: 43200000, totalStatutory: 19800000, employeeCount: 148, payrollRunCount: 12, status: "closed", closedBy: "Emeka Nwosu", closedDate: "2026-01-15" },
  { id: "ye-3", year: 2024, totalGrossPay: 480000000, totalNetPay: 340000000, totalTaxPaid: 84800000, totalPensionPaid: 38400000, totalStatutory: 17600000, employeeCount: 132, payrollRunCount: 12, status: "closed", closedBy: "Emeka Nwosu", closedDate: "2025-01-20" },
];
