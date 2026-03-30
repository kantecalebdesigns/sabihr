// 5.8 Payroll Reporting & Analytics — Mock Data & Types

export interface PayrollReport {
  id: string;
  name: string;
  category: "summary" | "statutory" | "department" | "variance" | "custom";
  description: string;
  lastGenerated: string | null;
  frequency: "monthly" | "quarterly" | "annual" | "on-demand";
  format: "pdf" | "excel" | "csv";
  status: "available" | "generating" | "scheduled";
}

export interface CustomReportField {
  id: string;
  name: string;
  category: "employee" | "earnings" | "deductions" | "statutory" | "banking";
  dataType: "text" | "number" | "date" | "currency";
}

export interface PayrollAnalytic {
  period: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  totalTax: number;
  totalPension: number;
  employeeCount: number;
  averageSalary: number;
  highestSalary: number;
  lowestSalary: number;
}

export interface DepartmentPayrollSummary {
  department: string;
  employeeCount: number;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  averageSalary: number;
  percentOfPayroll: number;
}

export interface GLEntry {
  id: string;
  period: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  postingDate: string;
  status: "posted" | "pending" | "reversed";
}

export const GL_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  posted: { label: "Posted", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  reversed: { label: "Reversed", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export const MOCK_STANDARD_REPORTS: PayrollReport[] = [
  { id: "rpt-1", name: "Monthly Payroll Summary", category: "summary", description: "Complete payroll summary including gross, deductions, and net pay", lastGenerated: "2026-02-25", frequency: "monthly", format: "pdf", status: "available" },
  { id: "rpt-2", name: "Department Payroll Breakdown", category: "department", description: "Payroll costs broken down by department", lastGenerated: "2026-02-25", frequency: "monthly", format: "excel", status: "available" },
  { id: "rpt-3", name: "PAYE Tax Report", category: "statutory", description: "Monthly PAYE tax computation and filing report", lastGenerated: "2026-02-28", frequency: "monthly", format: "pdf", status: "available" },
  { id: "rpt-4", name: "Pension Schedule", category: "statutory", description: "Employee and employer pension contribution schedule", lastGenerated: "2026-02-28", frequency: "monthly", format: "excel", status: "available" },
  { id: "rpt-5", name: "Salary Variance Report", category: "variance", description: "Month-over-month salary variance analysis", lastGenerated: "2026-02-26", frequency: "monthly", format: "pdf", status: "available" },
  { id: "rpt-6", name: "Annual Tax Summary", category: "statutory", description: "Year-to-date tax computation for all employees", lastGenerated: "2025-12-31", frequency: "annual", format: "pdf", status: "available" },
  { id: "rpt-7", name: "Quarterly Statutory Report", category: "statutory", description: "Quarterly ITF, NSITF, and other statutory contributions", lastGenerated: "2025-12-31", frequency: "quarterly", format: "excel", status: "available" },
  { id: "rpt-8", name: "Bank Payment Summary", category: "summary", description: "Payment disbursement summary by bank", lastGenerated: "2026-02-25", frequency: "monthly", format: "csv", status: "available" },
  { id: "rpt-9", name: "Payroll Cost Trend", category: "summary", description: "12-month payroll cost trend analysis", lastGenerated: "2026-02-28", frequency: "monthly", format: "pdf", status: "available" },
];

export const MOCK_CUSTOM_REPORT_FIELDS: CustomReportField[] = [
  { id: "f-1", name: "Employee ID", category: "employee", dataType: "text" },
  { id: "f-2", name: "Employee Name", category: "employee", dataType: "text" },
  { id: "f-3", name: "Department", category: "employee", dataType: "text" },
  { id: "f-4", name: "Pay Grade", category: "employee", dataType: "text" },
  { id: "f-5", name: "Date Joined", category: "employee", dataType: "date" },
  { id: "f-6", name: "Basic Salary", category: "earnings", dataType: "currency" },
  { id: "f-7", name: "Housing Allowance", category: "earnings", dataType: "currency" },
  { id: "f-8", name: "Transport Allowance", category: "earnings", dataType: "currency" },
  { id: "f-9", name: "Other Allowances", category: "earnings", dataType: "currency" },
  { id: "f-10", name: "Gross Pay", category: "earnings", dataType: "currency" },
  { id: "f-11", name: "PAYE Tax", category: "deductions", dataType: "currency" },
  { id: "f-12", name: "Pension (Employee)", category: "deductions", dataType: "currency" },
  { id: "f-13", name: "Pension (Employer)", category: "deductions", dataType: "currency" },
  { id: "f-14", name: "NHF", category: "statutory", dataType: "currency" },
  { id: "f-15", name: "NHIS", category: "statutory", dataType: "currency" },
  { id: "f-16", name: "Total Deductions", category: "deductions", dataType: "currency" },
  { id: "f-17", name: "Net Pay", category: "earnings", dataType: "currency" },
  { id: "f-18", name: "Bank Name", category: "banking", dataType: "text" },
  { id: "f-19", name: "Account Number", category: "banking", dataType: "text" },
];

export const MOCK_PAYROLL_ANALYTICS: PayrollAnalytic[] = [
  { period: "Mar 2026", totalGross: 48200000, totalNet: 34100000, totalDeductions: 14100000, totalTax: 8500000, totalPension: 3856000, employeeCount: 156, averageSalary: 308974, highestSalary: 7000000, lowestSalary: 150000 },
  { period: "Feb 2026", totalGross: 47800000, totalNet: 33800000, totalDeductions: 14000000, totalTax: 8400000, totalPension: 3824000, employeeCount: 156, averageSalary: 306410, highestSalary: 7000000, lowestSalary: 150000 },
  { period: "Jan 2026", totalGross: 46500000, totalNet: 32900000, totalDeductions: 13600000, totalTax: 8200000, totalPension: 3720000, employeeCount: 152, averageSalary: 305921, highestSalary: 7000000, lowestSalary: 150000 },
  { period: "Dec 2025", totalGross: 52300000, totalNet: 37100000, totalDeductions: 15200000, totalTax: 9100000, totalPension: 3680000, employeeCount: 148, averageSalary: 353378, highestSalary: 7000000, lowestSalary: 150000 },
  { period: "Nov 2025", totalGross: 44800000, totalNet: 31700000, totalDeductions: 13100000, totalTax: 7900000, totalPension: 3584000, employeeCount: 148, averageSalary: 302703, highestSalary: 6500000, lowestSalary: 150000 },
  { period: "Oct 2025", totalGross: 44200000, totalNet: 31200000, totalDeductions: 13000000, totalTax: 7800000, totalPension: 3536000, employeeCount: 148, averageSalary: 298649, highestSalary: 6500000, lowestSalary: 150000 },
];

export const MOCK_DEPARTMENT_SUMMARIES: DepartmentPayrollSummary[] = [
  { department: "Engineering", employeeCount: 45, totalGross: 18500000, totalNet: 13100000, totalDeductions: 5400000, averageSalary: 411111, percentOfPayroll: 38.4 },
  { department: "Product", employeeCount: 18, totalGross: 7200000, totalNet: 5100000, totalDeductions: 2100000, averageSalary: 400000, percentOfPayroll: 14.9 },
  { department: "Marketing", employeeCount: 22, totalGross: 6600000, totalNet: 4700000, totalDeductions: 1900000, averageSalary: 300000, percentOfPayroll: 13.7 },
  { department: "Finance", employeeCount: 15, totalGross: 5250000, totalNet: 3700000, totalDeductions: 1550000, averageSalary: 350000, percentOfPayroll: 10.9 },
  { department: "HR", employeeCount: 12, totalGross: 3600000, totalNet: 2500000, totalDeductions: 1100000, averageSalary: 300000, percentOfPayroll: 7.5 },
  { department: "Operations", employeeCount: 20, totalGross: 4000000, totalNet: 2800000, totalDeductions: 1200000, averageSalary: 200000, percentOfPayroll: 8.3 },
  { department: "Legal", employeeCount: 8, totalGross: 2400000, totalNet: 1700000, totalDeductions: 700000, averageSalary: 300000, percentOfPayroll: 5.0 },
  { department: "Sales", employeeCount: 16, totalGross: 650000, totalNet: 500000, totalDeductions: 150000, averageSalary: 40625, percentOfPayroll: 1.3 },
];

export const MOCK_GL_ENTRIES: GLEntry[] = [
  { id: "gl-1", period: "February 2026", accountCode: "5100", accountName: "Salaries & Wages", debit: 47800000, credit: 0, description: "Monthly payroll - gross salaries", postingDate: "2026-02-25", status: "posted" },
  { id: "gl-2", period: "February 2026", accountCode: "5110", accountName: "Employer Pension Contribution", debit: 4780000, credit: 0, description: "Employer pension 10%", postingDate: "2026-02-25", status: "posted" },
  { id: "gl-3", period: "February 2026", accountCode: "2100", accountName: "PAYE Tax Payable", debit: 0, credit: 8400000, description: "PAYE tax withheld", postingDate: "2026-02-25", status: "posted" },
  { id: "gl-4", period: "February 2026", accountCode: "2110", accountName: "Pension Payable", debit: 0, credit: 8604000, description: "Employee + Employer pension", postingDate: "2026-02-25", status: "posted" },
  { id: "gl-5", period: "February 2026", accountCode: "2120", accountName: "NHF Payable", debit: 0, credit: 1180000, description: "NHF deductions", postingDate: "2026-02-25", status: "posted" },
  { id: "gl-6", period: "February 2026", accountCode: "1000", accountName: "Bank - First Bank", debit: 0, credit: 33800000, description: "Net salary disbursement", postingDate: "2026-02-25", status: "posted" },
  { id: "gl-7", period: "March 2026", accountCode: "5100", accountName: "Salaries & Wages", debit: 48200000, credit: 0, description: "Monthly payroll - gross salaries", postingDate: "2026-03-25", status: "pending" },
  { id: "gl-8", period: "March 2026", accountCode: "2100", accountName: "PAYE Tax Payable", debit: 0, credit: 8500000, description: "PAYE tax withheld", postingDate: "2026-03-25", status: "pending" },
];
