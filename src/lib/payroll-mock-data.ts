export type PayrollStatus = "draft" | "processing" | "completed" | "failed";
export type PayslipStatus = "pending" | "paid" | "on-hold";

export interface PayrollRun {
  id: string;
  period: string;
  month: string;
  year: number;
  status: PayrollStatus;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  processedDate: string | null;
  approvedBy: string | null;
}

export interface EmployeePayslip {
  id: string;
  payrollRunId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  grossPay: number;
  tax: number;
  pension: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  status: PayslipStatus;
  bankName: string;
  accountNumber: string;
}

export const PAYROLL_STATUS_STYLES: Record<
  PayrollStatus,
  { label: string; bg: string; color: string }
> = {
  draft: { label: "Draft", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
  processing: { label: "Processing", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  completed: { label: "Completed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  failed: { label: "Failed", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export const PAYSLIP_STATUS_STYLES: Record<
  PayslipStatus,
  { label: string; bg: string; color: string }
> = {
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  paid: { label: "Paid", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  "on-hold": { label: "On Hold", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export const MOCK_PAYROLL_RUNS: PayrollRun[] = [
  { id: "pr-001", period: "March 2026", month: "March", year: 2026, status: "draft", totalGross: 48200000, totalNet: 34100000, totalDeductions: 14100000, employeeCount: 156, processedDate: null, approvedBy: null },
  { id: "pr-002", period: "February 2026", month: "February", year: 2026, status: "completed", totalGross: 47800000, totalNet: 33800000, totalDeductions: 14000000, employeeCount: 154, processedDate: "2026-02-28", approvedBy: "Chibueze Okoro" },
  { id: "pr-003", period: "January 2026", month: "January", year: 2026, status: "completed", totalGross: 46500000, totalNet: 32900000, totalDeductions: 13600000, employeeCount: 150, processedDate: "2026-01-30", approvedBy: "Chibueze Okoro" },
  { id: "pr-004", period: "December 2025", month: "December", year: 2025, status: "completed", totalGross: 52300000, totalNet: 37200000, totalDeductions: 15100000, employeeCount: 150, processedDate: "2025-12-24", approvedBy: "Chibueze Okoro" },
  { id: "pr-005", period: "November 2025", month: "November", year: 2025, status: "completed", totalGross: 45200000, totalNet: 32000000, totalDeductions: 13200000, employeeCount: 148, processedDate: "2025-11-28", approvedBy: "Chibueze Okoro" },
  { id: "pr-006", period: "October 2025", month: "October", year: 2025, status: "completed", totalGross: 44800000, totalNet: 31700000, totalDeductions: 13100000, employeeCount: 145, processedDate: "2025-10-30", approvedBy: "Chibueze Okoro" },
];

export const MOCK_PAYSLIPS: EmployeePayslip[] = [
  { id: "ps-001", payrollRunId: "pr-002", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", basicSalary: 850000, housingAllowance: 170000, transportAllowance: 85000, otherAllowances: 95000, grossPay: 1200000, tax: 180000, pension: 96000, otherDeductions: 74000, totalDeductions: 350000, netPay: 850000, status: "paid", bankName: "GTBank", accountNumber: "****4521" },
  { id: "ps-002", payrollRunId: "pr-002", employeeId: "emp-002", employeeName: "Chiamaka Eze", department: "Engineering", basicSalary: 1200000, housingAllowance: 240000, transportAllowance: 120000, otherAllowances: 140000, grossPay: 1700000, tax: 280000, pension: 136000, otherDeductions: 84000, totalDeductions: 500000, netPay: 1200000, status: "paid", bankName: "First Bank", accountNumber: "****7832" },
  { id: "ps-003", payrollRunId: "pr-002", employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", basicSalary: 600000, housingAllowance: 120000, transportAllowance: 60000, otherAllowances: 70000, grossPay: 850000, tax: 120000, pension: 68000, otherDeductions: 62000, totalDeductions: 250000, netPay: 600000, status: "paid", bankName: "Access Bank", accountNumber: "****2190" },
  { id: "ps-004", payrollRunId: "pr-002", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", basicSalary: 700000, housingAllowance: 140000, transportAllowance: 70000, otherAllowances: 90000, grossPay: 1000000, tax: 150000, pension: 80000, otherDeductions: 70000, totalDeductions: 300000, netPay: 700000, status: "paid", bankName: "Zenith Bank", accountNumber: "****5643" },
  { id: "ps-005", payrollRunId: "pr-002", employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", basicSalary: 500000, housingAllowance: 100000, transportAllowance: 50000, otherAllowances: 50000, grossPay: 700000, tax: 95000, pension: 56000, otherDeductions: 49000, totalDeductions: 200000, netPay: 500000, status: "paid", bankName: "UBA", accountNumber: "****8901" },
  { id: "ps-006", payrollRunId: "pr-002", employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", basicSalary: 550000, housingAllowance: 110000, transportAllowance: 55000, otherAllowances: 60000, grossPay: 775000, tax: 108000, pension: 62000, otherDeductions: 55000, totalDeductions: 225000, netPay: 550000, status: "paid", bankName: "Fidelity Bank", accountNumber: "****3456" },
  { id: "ps-007", payrollRunId: "pr-002", employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", basicSalary: 750000, housingAllowance: 150000, transportAllowance: 75000, otherAllowances: 75000, grossPay: 1050000, tax: 158000, pension: 84000, otherDeductions: 58000, totalDeductions: 300000, netPay: 750000, status: "paid", bankName: "Stanbic IBTC", accountNumber: "****6789" },
  { id: "ps-008", payrollRunId: "pr-002", employeeId: "emp-011", employeeName: "Chibueze Okoro", department: "Finance", basicSalary: 1100000, housingAllowance: 220000, transportAllowance: 110000, otherAllowances: 120000, grossPay: 1550000, tax: 248000, pension: 124000, otherDeductions: 78000, totalDeductions: 450000, netPay: 1100000, status: "paid", bankName: "GTBank", accountNumber: "****1234" },
  { id: "ps-009", payrollRunId: "pr-002", employeeId: "emp-017", employeeName: "Olumide Fashola", department: "Sales", basicSalary: 450000, housingAllowance: 90000, transportAllowance: 45000, otherAllowances: 40000, grossPay: 625000, tax: 85000, pension: 50000, otherDeductions: 40000, totalDeductions: 175000, netPay: 450000, status: "on-hold", bankName: "Wema Bank", accountNumber: "****5678" },
];
