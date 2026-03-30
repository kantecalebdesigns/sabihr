// 5.4 Payslip Generation & Distribution — Mock Data & Types

export interface PayslipTemplate {
  id: string;
  name: string;
  description: string;
  layout: "standard" | "detailed" | "compact";
  showCompanyLogo: boolean;
  showEmployeePhoto: boolean;
  showYtdTotals: boolean;
  showBankDetails: boolean;
  showQrCode: boolean;
  watermark: boolean;
  headerColor: string;
  status: "active" | "draft" | "archived";
  isDefault: boolean;
  lastModified: string;
  createdBy: string;
}

export interface PayslipBatch {
  id: string;
  payrollRunId: string;
  period: string;
  templateId: string;
  templateName: string;
  totalPayslips: number;
  generated: number;
  failed: number;
  status: "pending" | "generating" | "completed" | "failed";
  generatedAt: string | null;
  generatedBy: string;
  fileSize: string | null;
}

export interface PayslipDistribution {
  id: string;
  batchId: string;
  period: string;
  channel: "email" | "portal" | "print" | "all";
  totalRecipients: number;
  delivered: number;
  failed: number;
  pending: number;
  status: "scheduled" | "in-progress" | "completed" | "failed";
  scheduledAt: string;
  completedAt: string | null;
  initiatedBy: string;
}

export interface PayslipSecurityConfig {
  passwordProtection: boolean;
  passwordType: "dob" | "employee-id" | "custom";
  watermarkEnabled: boolean;
  watermarkText: string;
  downloadLimit: number;
  expiryDays: number;
  ipRestriction: boolean;
  auditTrail: boolean;
}

export const TEMPLATE_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  draft: { label: "Draft", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  archived: { label: "Archived", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const BATCH_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
  generating: { label: "Generating", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  completed: { label: "Completed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  failed: { label: "Failed", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export const DISTRIBUTION_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  scheduled: { label: "Scheduled", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  "in-progress": { label: "In Progress", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  completed: { label: "Completed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  failed: { label: "Failed", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export const MOCK_PAYSLIP_TEMPLATES: PayslipTemplate[] = [
  { id: "tpl-1", name: "Standard Payslip", description: "Default payslip template with all essential details", layout: "standard", showCompanyLogo: true, showEmployeePhoto: false, showYtdTotals: true, showBankDetails: true, showQrCode: false, watermark: false, headerColor: "#2563eb", status: "active", isDefault: true, lastModified: "2026-01-15", createdBy: "Admin" },
  { id: "tpl-2", name: "Detailed Payslip", description: "Comprehensive payslip with full breakdown and YTD figures", layout: "detailed", showCompanyLogo: true, showEmployeePhoto: true, showYtdTotals: true, showBankDetails: true, showQrCode: true, watermark: true, headerColor: "#059669", status: "active", isDefault: false, lastModified: "2026-02-10", createdBy: "Admin" },
  { id: "tpl-3", name: "Compact Payslip", description: "Minimal payslip for quick reference", layout: "compact", showCompanyLogo: true, showEmployeePhoto: false, showYtdTotals: false, showBankDetails: false, showQrCode: false, watermark: false, headerColor: "#7c3aed", status: "draft", isDefault: false, lastModified: "2026-03-05", createdBy: "Admin" },
];

export const MOCK_PAYSLIP_BATCHES: PayslipBatch[] = [
  { id: "batch-1", payrollRunId: "pr-002", period: "February 2026", templateId: "tpl-1", templateName: "Standard Payslip", totalPayslips: 156, generated: 156, failed: 0, status: "completed", generatedAt: "2026-02-24T10:30:00", generatedBy: "Emeka Nwosu", fileSize: "12.4 MB" },
  { id: "batch-2", payrollRunId: "pr-001", period: "March 2026", templateId: "tpl-1", templateName: "Standard Payslip", totalPayslips: 156, generated: 0, failed: 0, status: "pending", generatedAt: null, generatedBy: "System", fileSize: null },
  { id: "batch-3", payrollRunId: "pr-003", period: "January 2026", templateId: "tpl-2", templateName: "Detailed Payslip", totalPayslips: 152, generated: 152, failed: 0, status: "completed", generatedAt: "2026-01-24T14:15:00", generatedBy: "Emeka Nwosu", fileSize: "18.7 MB" },
  { id: "batch-4", payrollRunId: "pr-004", period: "December 2025", templateId: "tpl-1", templateName: "Standard Payslip", totalPayslips: 148, generated: 146, failed: 2, status: "completed", generatedAt: "2025-12-24T09:45:00", generatedBy: "Emeka Nwosu", fileSize: "11.8 MB" },
];

export const MOCK_DISTRIBUTIONS: PayslipDistribution[] = [
  { id: "dist-1", batchId: "batch-1", period: "February 2026", channel: "email", totalRecipients: 156, delivered: 154, failed: 2, pending: 0, status: "completed", scheduledAt: "2026-02-25T08:00:00", completedAt: "2026-02-25T08:45:00", initiatedBy: "Emeka Nwosu" },
  { id: "dist-2", batchId: "batch-1", period: "February 2026", channel: "portal", totalRecipients: 156, delivered: 156, failed: 0, pending: 0, status: "completed", scheduledAt: "2026-02-25T08:00:00", completedAt: "2026-02-25T08:02:00", initiatedBy: "System" },
  { id: "dist-3", batchId: "batch-3", period: "January 2026", channel: "all", totalRecipients: 152, delivered: 150, failed: 2, pending: 0, status: "completed", scheduledAt: "2026-01-25T08:00:00", completedAt: "2026-01-25T09:00:00", initiatedBy: "Emeka Nwosu" },
  { id: "dist-4", batchId: "batch-2", period: "March 2026", channel: "email", totalRecipients: 156, delivered: 0, failed: 0, pending: 156, status: "scheduled", scheduledAt: "2026-03-25T08:00:00", completedAt: null, initiatedBy: "System" },
];

export const MOCK_SECURITY_CONFIG: PayslipSecurityConfig = {
  passwordProtection: true,
  passwordType: "dob",
  watermarkEnabled: true,
  watermarkText: "CONFIDENTIAL",
  downloadLimit: 5,
  expiryDays: 90,
  ipRestriction: false,
  auditTrail: true,
};
