// 5.5 Payment Disbursement — Mock Data & Types

export interface BankConfig {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  accountType: "current" | "savings";
  currency: string;
  isDefault: boolean;
  apiIntegrated: boolean;
  lastSyncDate: string | null;
  status: "active" | "inactive" | "pending-verification";
}

export interface PaymentFile {
  id: string;
  payrollRunId: string;
  period: string;
  bankName: string;
  format: "NEFT" | "NIP" | "RTGS" | "CSV" | "NIBSS";
  totalAmount: number;
  transactionCount: number;
  fileName: string;
  fileSize: string;
  generatedAt: string;
  generatedBy: string;
  status: "generated" | "downloaded" | "submitted" | "processed";
}

export interface PaymentTransaction {
  id: string;
  payrollRunId: string;
  period: string;
  employeeId: string;
  employeeName: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  reference: string;
  initiatedAt: string;
  completedAt: string | null;
  status: "pending" | "processing" | "completed" | "failed" | "reversed";
  failureReason: string | null;
}

export interface ReconciliationRecord {
  id: string;
  payrollRunId: string;
  period: string;
  totalExpected: number;
  totalDisbursed: number;
  totalFailed: number;
  variance: number;
  matchedCount: number;
  unmatchedCount: number;
  failedCount: number;
  reconciledAt: string | null;
  reconciledBy: string | null;
  status: "pending" | "in-progress" | "reconciled" | "discrepancy";
}

export const BANK_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  inactive: { label: "Inactive", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
  "pending-verification": { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
};

export const PAYMENT_FILE_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  generated: { label: "Generated", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  downloaded: { label: "Downloaded", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  submitted: { label: "Submitted", bg: "bg-violet-50 border-violet-200", color: "text-violet-700" },
  processed: { label: "Processed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
};

export const TRANSACTION_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
  processing: { label: "Processing", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  completed: { label: "Completed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  failed: { label: "Failed", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  reversed: { label: "Reversed", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
};

export const RECON_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
  "in-progress": { label: "In Progress", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  reconciled: { label: "Reconciled", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  discrepancy: { label: "Discrepancy", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export const MOCK_BANK_CONFIGS: BankConfig[] = [
  { id: "bank-1", bankName: "First Bank of Nigeria", bankCode: "011", accountNumber: "2034567890", accountName: "Sabi Technologies Ltd", accountType: "current", currency: "NGN", isDefault: true, apiIntegrated: true, lastSyncDate: "2026-03-24T16:00:00", status: "active" },
  { id: "bank-2", bankName: "Guaranty Trust Bank", bankCode: "058", accountNumber: "0123456789", accountName: "Sabi Technologies Ltd", accountType: "current", currency: "NGN", isDefault: false, apiIntegrated: true, lastSyncDate: "2026-03-24T16:00:00", status: "active" },
  { id: "bank-3", bankName: "Access Bank", bankCode: "044", accountNumber: "1098765432", accountName: "Sabi Technologies Ltd", accountType: "current", currency: "NGN", isDefault: false, apiIntegrated: false, lastSyncDate: null, status: "inactive" },
  { id: "bank-4", bankName: "Zenith Bank", bankCode: "057", accountNumber: "5678901234", accountName: "Sabi Technologies Ltd - USD", accountType: "current", currency: "USD", isDefault: false, apiIntegrated: true, lastSyncDate: "2026-03-20T12:00:00", status: "active" },
];

export const MOCK_PAYMENT_FILES: PaymentFile[] = [
  { id: "pf-1", payrollRunId: "pr-002", period: "February 2026", bankName: "First Bank of Nigeria", format: "NIBSS", totalAmount: 28450000, transactionCount: 98, fileName: "payroll_feb2026_firstbank.nibss", fileSize: "245 KB", generatedAt: "2026-02-24T11:00:00", generatedBy: "Emeka Nwosu", status: "processed" },
  { id: "pf-2", payrollRunId: "pr-002", period: "February 2026", bankName: "Guaranty Trust Bank", format: "NIP", totalAmount: 5650000, transactionCount: 58, fileName: "payroll_feb2026_gtbank.nip", fileSize: "128 KB", generatedAt: "2026-02-24T11:05:00", generatedBy: "Emeka Nwosu", status: "processed" },
  { id: "pf-3", payrollRunId: "pr-001", period: "March 2026", bankName: "First Bank of Nigeria", format: "NIBSS", totalAmount: 29100000, transactionCount: 100, fileName: "payroll_mar2026_firstbank.nibss", fileSize: "252 KB", generatedAt: "2026-03-24T10:00:00", generatedBy: "System", status: "generated" },
  { id: "pf-4", payrollRunId: "pr-003", period: "January 2026", bankName: "First Bank of Nigeria", format: "NIBSS", totalAmount: 27800000, transactionCount: 96, fileName: "payroll_jan2026_firstbank.nibss", fileSize: "238 KB", generatedAt: "2026-01-24T11:00:00", generatedBy: "Emeka Nwosu", status: "processed" },
];

export const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  { id: "txn-1", payrollRunId: "pr-002", period: "February 2026", employeeId: "EMP-001", employeeName: "Adebayo Ogunlesi", bankName: "First Bank", accountNumber: "****7890", amount: 850000, reference: "PAY-FEB26-001", initiatedAt: "2026-02-25T09:00:00", completedAt: "2026-02-25T09:05:00", status: "completed", failureReason: null },
  { id: "txn-2", payrollRunId: "pr-002", period: "February 2026", employeeId: "EMP-002", employeeName: "Chioma Eze", bankName: "GTBank", accountNumber: "****4321", amount: 552500, reference: "PAY-FEB26-002", initiatedAt: "2026-02-25T09:00:00", completedAt: "2026-02-25T09:03:00", status: "completed", failureReason: null },
  { id: "txn-3", payrollRunId: "pr-002", period: "February 2026", employeeId: "EMP-003", employeeName: "Emeka Nwosu", bankName: "First Bank", accountNumber: "****1234", amount: 1827500, reference: "PAY-FEB26-003", initiatedAt: "2026-02-25T09:00:00", completedAt: "2026-02-25T09:04:00", status: "completed", failureReason: null },
  { id: "txn-4", payrollRunId: "pr-002", period: "February 2026", employeeId: "EMP-004", employeeName: "Fatima Bello", bankName: "Access Bank", accountNumber: "****5678", amount: 191250, reference: "PAY-FEB26-004", initiatedAt: "2026-02-25T09:00:00", completedAt: null, status: "failed", failureReason: "Invalid account number" },
  { id: "txn-5", payrollRunId: "pr-002", period: "February 2026", employeeId: "EMP-005", employeeName: "Gbenga Adeyemi", bankName: "Zenith Bank", accountNumber: "****9012", amount: 670000, reference: "PAY-FEB26-005", initiatedAt: "2026-02-25T09:00:00", completedAt: "2026-02-25T09:06:00", status: "completed", failureReason: null },
  { id: "txn-6", payrollRunId: "pr-001", period: "March 2026", employeeId: "EMP-001", employeeName: "Adebayo Ogunlesi", bankName: "First Bank", accountNumber: "****7890", amount: 870000, reference: "PAY-MAR26-001", initiatedAt: "2026-03-25T09:00:00", completedAt: null, status: "pending", failureReason: null },
  { id: "txn-7", payrollRunId: "pr-001", period: "March 2026", employeeId: "EMP-002", employeeName: "Chioma Eze", bankName: "GTBank", accountNumber: "****4321", amount: 560000, reference: "PAY-MAR26-002", initiatedAt: "2026-03-25T09:00:00", completedAt: null, status: "pending", failureReason: null },
];

export const MOCK_RECONCILIATIONS: ReconciliationRecord[] = [
  { id: "recon-1", payrollRunId: "pr-002", period: "February 2026", totalExpected: 34100000, totalDisbursed: 33908750, totalFailed: 191250, variance: 191250, matchedCount: 154, unmatchedCount: 0, failedCount: 2, reconciledAt: "2026-02-26T10:00:00", reconciledBy: "Emeka Nwosu", status: "discrepancy" },
  { id: "recon-2", payrollRunId: "pr-003", period: "January 2026", totalExpected: 33200000, totalDisbursed: 33200000, totalFailed: 0, variance: 0, matchedCount: 152, unmatchedCount: 0, failedCount: 0, reconciledAt: "2026-01-26T11:00:00", reconciledBy: "Emeka Nwosu", status: "reconciled" },
  { id: "recon-3", payrollRunId: "pr-001", period: "March 2026", totalExpected: 34100000, totalDisbursed: 0, totalFailed: 0, variance: 34100000, matchedCount: 0, unmatchedCount: 156, failedCount: 0, reconciledAt: null, reconciledBy: null, status: "pending" },
];
