export type PayrollStatus = "draft" | "processing" | "completed" | "failed";
export type PayslipStatus = "pending" | "paid" | "on-hold";

export type PayrollRunType = "regular" | "off-cycle" | "bonus" | "13th-month";

export interface PayrollRun {
  id: string;
  period: string;
  month: string;
  year: number;
  status: PayrollStatus;
  runType: PayrollRunType;
  payDate: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  totalTax: number;
  totalPension: number;
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
  { id: "pr-001", period: "April 2026", month: "April", year: 2026, status: "draft", runType: "regular", payDate: "2026-04-25", totalGross: 0, totalNet: 0, totalDeductions: 0, totalTax: 0, totalPension: 0, employeeCount: 22, processedDate: null, approvedBy: null },
  { id: "pr-002", period: "March 2026", month: "March", year: 2026, status: "completed", runType: "regular", payDate: "2026-03-25", totalGross: 8450000, totalNet: 5980000, totalDeductions: 2470000, totalTax: 1620000, totalPension: 710000, employeeCount: 20, processedDate: "2026-03-25", approvedBy: "Chibueze Okoro" },
  { id: "pr-003", period: "March 2026 · Bonus", month: "March", year: 2026, status: "completed", runType: "bonus", payDate: "2026-03-18", totalGross: 1250000, totalNet: 1062500, totalDeductions: 187500, totalTax: 125000, totalPension: 62500, employeeCount: 12, processedDate: "2026-03-18", approvedBy: "Chibueze Okoro" },
  { id: "pr-004", period: "February 2026", month: "February", year: 2026, status: "completed", runType: "regular", payDate: "2026-02-25", totalGross: 8185000, totalNet: 5789650, totalDeductions: 2395350, totalTax: 1570000, totalPension: 687850, employeeCount: 19, processedDate: "2026-02-25", approvedBy: "Chibueze Okoro" },
  { id: "pr-005", period: "January 2026", month: "January", year: 2026, status: "completed", runType: "regular", payDate: "2026-01-25", totalGross: 8010000, totalNet: 5665100, totalDeductions: 2344900, totalTax: 1540000, totalPension: 672450, employeeCount: 19, processedDate: "2026-01-25", approvedBy: "Fatima Abdullahi" },
  { id: "pr-006", period: "December 2025 · 13th Month", month: "December", year: 2025, status: "completed", runType: "13th-month", payDate: "2025-12-20", totalGross: 7920000, totalNet: 7326000, totalDeductions: 594000, totalTax: 396000, totalPension: 198000, employeeCount: 18, processedDate: "2025-12-20", approvedBy: "Chibueze Okoro" },
  { id: "pr-007", period: "December 2025", month: "December", year: 2025, status: "completed", runType: "regular", payDate: "2025-12-22", totalGross: 7920000, totalNet: 5605350, totalDeductions: 2314650, totalTax: 1520000, totalPension: 664650, employeeCount: 18, processedDate: "2025-12-22", approvedBy: "Fatima Abdullahi" },
  { id: "pr-008", period: "November 2025 · Off-cycle", month: "November", year: 2025, status: "failed", runType: "off-cycle", payDate: "2025-11-10", totalGross: 450000, totalNet: 382500, totalDeductions: 67500, totalTax: 45000, totalPension: 22500, employeeCount: 3, processedDate: "2025-11-10", approvedBy: null },
  { id: "pr-009", period: "November 2025", month: "November", year: 2025, status: "completed", runType: "regular", payDate: "2025-11-25", totalGross: 7755000, totalNet: 5488850, totalDeductions: 2266150, totalTax: 1488000, totalPension: 651150, employeeCount: 18, processedDate: "2025-11-25", approvedBy: "Chibueze Okoro" },
  { id: "pr-010", period: "October 2025", month: "October", year: 2025, status: "completed", runType: "regular", payDate: "2025-10-25", totalGross: 7590000, totalNet: 5372250, totalDeductions: 2217750, totalTax: 1456000, totalPension: 637350, employeeCount: 18, processedDate: "2025-10-25", approvedBy: "Chibueze Okoro" },
];

export const MOCK_PAYSLIPS: EmployeePayslip[] = [
  { id: "ps-001", payrollRunId: "pr-002", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", basicSalary: 850000, housingAllowance: 170000, transportAllowance: 85000, otherAllowances: 95000, grossPay: 1200000, tax: 180000, pension: 96000, otherDeductions: 74000, totalDeductions: 350000, netPay: 850000, status: "paid", bankName: "GTBank", accountNumber: "****4521" },
  { id: "ps-002", payrollRunId: "pr-002", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", basicSalary: 700000, housingAllowance: 140000, transportAllowance: 70000, otherAllowances: 90000, grossPay: 1000000, tax: 150000, pension: 80000, otherDeductions: 70000, totalDeductions: 300000, netPay: 700000, status: "paid", bankName: "Zenith Bank", accountNumber: "****5643" },
  { id: "ps-003", payrollRunId: "pr-002", employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", basicSalary: 500000, housingAllowance: 100000, transportAllowance: 50000, otherAllowances: 50000, grossPay: 700000, tax: 95000, pension: 56000, otherDeductions: 49000, totalDeductions: 200000, netPay: 500000, status: "paid", bankName: "UBA", accountNumber: "****8901" },
  { id: "ps-004", payrollRunId: "pr-002", employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", basicSalary: 550000, housingAllowance: 110000, transportAllowance: 55000, otherAllowances: 60000, grossPay: 775000, tax: 108000, pension: 62000, otherDeductions: 55000, totalDeductions: 225000, netPay: 550000, status: "pending", bankName: "Fidelity Bank", accountNumber: "****3456" },
];
