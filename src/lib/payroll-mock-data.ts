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
  { id: "pr-001", period: "April 2026", month: "April", year: 2026, status: "draft", totalGross: 0, totalNet: 0, totalDeductions: 0, employeeCount: 20, processedDate: null, approvedBy: null },
  { id: "pr-002", period: "March 2026", month: "March", year: 2026, status: "completed", totalGross: 8450000, totalNet: 5980000, totalDeductions: 2470000, employeeCount: 20, processedDate: "2026-03-25", approvedBy: "Chibueze Okoro" },
];

export const MOCK_PAYSLIPS: EmployeePayslip[] = [
  { id: "ps-001", payrollRunId: "pr-002", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", basicSalary: 850000, housingAllowance: 170000, transportAllowance: 85000, otherAllowances: 95000, grossPay: 1200000, tax: 180000, pension: 96000, otherDeductions: 74000, totalDeductions: 350000, netPay: 850000, status: "paid", bankName: "GTBank", accountNumber: "****4521" },
  { id: "ps-002", payrollRunId: "pr-002", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", basicSalary: 700000, housingAllowance: 140000, transportAllowance: 70000, otherAllowances: 90000, grossPay: 1000000, tax: 150000, pension: 80000, otherDeductions: 70000, totalDeductions: 300000, netPay: 700000, status: "paid", bankName: "Zenith Bank", accountNumber: "****5643" },
  { id: "ps-003", payrollRunId: "pr-002", employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", basicSalary: 500000, housingAllowance: 100000, transportAllowance: 50000, otherAllowances: 50000, grossPay: 700000, tax: 95000, pension: 56000, otherDeductions: 49000, totalDeductions: 200000, netPay: 500000, status: "paid", bankName: "UBA", accountNumber: "****8901" },
  { id: "ps-004", payrollRunId: "pr-002", employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", basicSalary: 550000, housingAllowance: 110000, transportAllowance: 55000, otherAllowances: 60000, grossPay: 775000, tax: 108000, pension: 62000, otherDeductions: 55000, totalDeductions: 225000, netPay: 550000, status: "pending", bankName: "Fidelity Bank", accountNumber: "****3456" },
];
