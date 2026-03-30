// 5.10-5.15 Employee Self-Service Payroll — Mock Data & Types

export interface EmployeePayslipDetail {
  id: string;
  period: string;
  month: string;
  year: number;
  payDate: string;
  earnings: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  totalEarnings: number;
  totalDeductions: number;
  grossPay: number;
  netPay: number;
  ytdGross: number;
  ytdNet: number;
  ytdTax: number;
  status: "paid" | "pending" | "processing";
}

export interface SalaryBreakdown {
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  mealAllowance: number;
  otherAllowances: number;
  grossPay: number;
  paye: number;
  pension: number;
  nhf: number;
  healthInsurance: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  payGrade: string;
  salaryStructure: string;
  effectiveDate: string;
}

export interface SalaryRevision {
  id: string;
  effectiveDate: string;
  previousGross: number;
  newGross: number;
  previousNet: number;
  newNet: number;
  changePercent: number;
  reason: string;
  approvedBy: string;
}

export interface TaxSummary {
  year: number;
  totalTaxableIncome: number;
  totalTaxPaid: number;
  consolidatedRelief: number;
  pensionRelief: number;
  nhfRelief: number;
  otherRelief: number;
  effectiveTaxRate: number;
  monthlyBreakdown: { month: string; taxableIncome: number; taxPaid: number }[];
  certificateAvailable: boolean;
}

export interface PensionSummary {
  pfa: string;
  rsaNumber: string;
  employeeContribution: number;
  employerContribution: number;
  voluntaryContribution: number;
  totalBalance: number;
  ytdEmployee: number;
  ytdEmployer: number;
  monthlyBreakdown: { month: string; employee: number; employer: number }[];
}

export interface StatutoryDeduction {
  name: string;
  code: string;
  ytdAmount: number;
  monthlyAmount: number;
  rate: string;
}

export interface PaymentRecord {
  id: string;
  period: string;
  payDate: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  reference: string;
  status: "completed" | "pending" | "failed";
}

export interface BankDetail {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountType: "savings" | "current";
  isPrimary: boolean;
  verified: boolean;
  addedDate: string;
}

export interface LoanRecord {
  id: string;
  type: "salary-advance" | "personal-loan" | "emergency-loan";
  typeName: string;
  amount: number;
  outstandingBalance: number;
  monthlyDeduction: number;
  interestRate: number;
  tenure: number;
  startDate: string;
  endDate: string;
  installmentsPaid: number;
  totalInstallments: number;
  status: "active" | "pending" | "completed" | "rejected";
  approvedBy: string | null;
  requestDate: string;
}

export interface WalletInfo {
  totalBalanceNGN: number;
  wallets: { currency: string; symbol: string; balance: number; ngnEquivalent: number }[];
  recentTransactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit" | "conversion";
  description: string;
  currency: string;
  amount: number;
  ngnEquivalent: number;
  date: string;
  status: "completed" | "pending";
}

export const PAYSLIP_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  paid: { label: "Paid", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  processing: { label: "Processing", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
};

export const LOAN_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  completed: { label: "Completed", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
  rejected: { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export const PAYMENT_RECORD_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  completed: { label: "Completed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  failed: { label: "Failed", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export const MOCK_EMPLOYEE_PAYSLIPS: EmployeePayslipDetail[] = [
  {
    id: "eps-1", period: "March 2026", month: "March", year: 2026, payDate: "2026-03-25", status: "pending",
    earnings: [{ name: "Basic Salary", amount: 500000 }, { name: "Housing Allowance", amount: 100000 }, { name: "Transport Allowance", amount: 75000 }, { name: "Meal Allowance", amount: 25000 }, { name: "Utility Allowance", amount: 50000 }],
    deductions: [{ name: "PAYE Tax", amount: 68500 }, { name: "Pension (8%)", amount: 54000 }, { name: "NHF (2.5%)", amount: 12500 }, { name: "Health Insurance", amount: 15000 }],
    totalEarnings: 750000, totalDeductions: 150000, grossPay: 750000, netPay: 600000, ytdGross: 2250000, ytdNet: 1800000, ytdTax: 205500,
  },
  {
    id: "eps-2", period: "February 2026", month: "February", year: 2026, payDate: "2026-02-25", status: "paid",
    earnings: [{ name: "Basic Salary", amount: 500000 }, { name: "Housing Allowance", amount: 100000 }, { name: "Transport Allowance", amount: 75000 }, { name: "Meal Allowance", amount: 25000 }, { name: "Utility Allowance", amount: 50000 }],
    deductions: [{ name: "PAYE Tax", amount: 68500 }, { name: "Pension (8%)", amount: 54000 }, { name: "NHF (2.5%)", amount: 12500 }, { name: "Health Insurance", amount: 15000 }],
    totalEarnings: 750000, totalDeductions: 150000, grossPay: 750000, netPay: 600000, ytdGross: 1500000, ytdNet: 1200000, ytdTax: 137000,
  },
  {
    id: "eps-3", period: "January 2026", month: "January", year: 2026, payDate: "2026-01-25", status: "paid",
    earnings: [{ name: "Basic Salary", amount: 500000 }, { name: "Housing Allowance", amount: 100000 }, { name: "Transport Allowance", amount: 75000 }, { name: "Meal Allowance", amount: 25000 }, { name: "Utility Allowance", amount: 50000 }],
    deductions: [{ name: "PAYE Tax", amount: 68500 }, { name: "Pension (8%)", amount: 54000 }, { name: "NHF (2.5%)", amount: 12500 }, { name: "Health Insurance", amount: 15000 }],
    totalEarnings: 750000, totalDeductions: 150000, grossPay: 750000, netPay: 600000, ytdGross: 750000, ytdNet: 600000, ytdTax: 68500,
  },
  {
    id: "eps-4", period: "December 2025", month: "December", year: 2025, payDate: "2025-12-25", status: "paid",
    earnings: [{ name: "Basic Salary", amount: 450000 }, { name: "Housing Allowance", amount: 90000 }, { name: "Transport Allowance", amount: 67500 }, { name: "Meal Allowance", amount: 25000 }, { name: "13th Month Bonus", amount: 450000 }],
    deductions: [{ name: "PAYE Tax", amount: 95000 }, { name: "Pension (8%)", amount: 48600 }, { name: "NHF (2.5%)", amount: 11250 }, { name: "Health Insurance", amount: 15000 }],
    totalEarnings: 1082500, totalDeductions: 169850, grossPay: 1082500, netPay: 912650, ytdGross: 8587500, ytdNet: 6870000, ytdTax: 685000,
  },
];

export const MOCK_SALARY_BREAKDOWN: SalaryBreakdown = {
  basicSalary: 500000,
  housingAllowance: 100000,
  transportAllowance: 75000,
  mealAllowance: 25000,
  otherAllowances: 50000,
  grossPay: 750000,
  paye: 68500,
  pension: 54000,
  nhf: 12500,
  healthInsurance: 15000,
  otherDeductions: 0,
  totalDeductions: 150000,
  netPay: 600000,
  payGrade: "Mid-Level",
  salaryStructure: "Standard Mid-Level",
  effectiveDate: "2026-01-01",
};

export const MOCK_SALARY_REVISIONS: SalaryRevision[] = [
  { id: "sr-1", effectiveDate: "2026-01-01", previousGross: 675000, newGross: 750000, previousNet: 540000, newNet: 600000, changePercent: 11.1, reason: "Annual salary review", approvedBy: "Emeka Nwosu" },
  { id: "sr-2", effectiveDate: "2025-07-01", previousGross: 632500, newGross: 675000, previousNet: 506000, newNet: 540000, changePercent: 6.7, reason: "Mid-year performance bonus adjustment", approvedBy: "Emeka Nwosu" },
  { id: "sr-3", effectiveDate: "2025-01-01", previousGross: 550000, newGross: 632500, previousNet: 440000, newNet: 506000, changePercent: 15.0, reason: "Promotion to Mid-Level", approvedBy: "Halima Yusuf" },
];

export const MOCK_TAX_SUMMARY: TaxSummary = {
  year: 2026,
  totalTaxableIncome: 2250000,
  totalTaxPaid: 205500,
  consolidatedRelief: 200000,
  pensionRelief: 162000,
  nhfRelief: 37500,
  otherRelief: 0,
  effectiveTaxRate: 9.1,
  monthlyBreakdown: [
    { month: "January", taxableIncome: 750000, taxPaid: 68500 },
    { month: "February", taxableIncome: 750000, taxPaid: 68500 },
    { month: "March", taxableIncome: 750000, taxPaid: 68500 },
  ],
  certificateAvailable: false,
};

export const MOCK_PENSION_SUMMARY: PensionSummary = {
  pfa: "Stanbic IBTC Pension",
  rsaNumber: "PEN100398271645",
  employeeContribution: 54000,
  employerContribution: 67500,
  voluntaryContribution: 0,
  totalBalance: 4850000,
  ytdEmployee: 162000,
  ytdEmployer: 202500,
  monthlyBreakdown: [
    { month: "January", employee: 54000, employer: 67500 },
    { month: "February", employee: 54000, employer: 67500 },
    { month: "March", employee: 54000, employer: 67500 },
  ],
};

export const MOCK_STATUTORY_DEDUCTIONS: StatutoryDeduction[] = [
  { name: "PAYE Income Tax", code: "PAYE", ytdAmount: 205500, monthlyAmount: 68500, rate: "Progressive" },
  { name: "Employee Pension", code: "PEN", ytdAmount: 162000, monthlyAmount: 54000, rate: "8%" },
  { name: "National Housing Fund", code: "NHF", ytdAmount: 37500, monthlyAmount: 12500, rate: "2.5%" },
  { name: "Health Insurance (NHIS)", code: "NHIS", ytdAmount: 45000, monthlyAmount: 15000, rate: "Fixed" },
];

export const MOCK_PAYMENT_RECORDS: PaymentRecord[] = [
  { id: "pay-1", period: "February 2026", payDate: "2026-02-25", amount: 600000, bankName: "GTBank", accountNumber: "****4321", reference: "PAY-FEB26-002", status: "completed" },
  { id: "pay-2", period: "January 2026", payDate: "2026-01-25", amount: 600000, bankName: "GTBank", accountNumber: "****4321", reference: "PAY-JAN26-002", status: "completed" },
  { id: "pay-3", period: "December 2025", payDate: "2025-12-25", amount: 912650, bankName: "GTBank", accountNumber: "****4321", reference: "PAY-DEC25-002", status: "completed" },
  { id: "pay-4", period: "November 2025", payDate: "2025-11-25", amount: 540000, bankName: "GTBank", accountNumber: "****4321", reference: "PAY-NOV25-002", status: "completed" },
  { id: "pay-5", period: "March 2026", payDate: "2026-03-25", amount: 600000, bankName: "GTBank", accountNumber: "****4321", reference: "PAY-MAR26-002", status: "pending" },
];

export const MOCK_BANK_DETAILS: BankDetail[] = [
  { id: "bd-1", bankName: "Guaranty Trust Bank", accountNumber: "0123454321", accountName: "Chioma Eze", accountType: "savings", isPrimary: true, verified: true, addedDate: "2024-06-15" },
  { id: "bd-2", bankName: "First Bank of Nigeria", accountNumber: "2034561234", accountName: "Chioma Eze", accountType: "current", isPrimary: false, verified: true, addedDate: "2025-03-10" },
];

export const MOCK_LOANS: LoanRecord[] = [
  { id: "loan-1", type: "personal-loan", typeName: "Personal Loan", amount: 2000000, outstandingBalance: 1200000, monthlyDeduction: 100000, interestRate: 5, tenure: 24, startDate: "2025-09-01", endDate: "2027-08-31", installmentsPaid: 6, totalInstallments: 24, status: "active", approvedBy: "Emeka Nwosu", requestDate: "2025-08-15" },
  { id: "loan-2", type: "salary-advance", typeName: "Salary Advance", amount: 300000, outstandingBalance: 0, monthlyDeduction: 150000, interestRate: 0, tenure: 2, startDate: "2025-11-01", endDate: "2025-12-31", installmentsPaid: 2, totalInstallments: 2, status: "completed", approvedBy: "Emeka Nwosu", requestDate: "2025-10-20" },
  { id: "loan-3", type: "emergency-loan", typeName: "Emergency Loan", amount: 500000, outstandingBalance: 500000, monthlyDeduction: 0, interestRate: 3, tenure: 12, startDate: "", endDate: "", installmentsPaid: 0, totalInstallments: 12, status: "pending", approvedBy: null, requestDate: "2026-03-20" },
];

export const MOCK_WALLET_INFO: WalletInfo = {
  totalBalanceNGN: 485000,
  wallets: [
    { currency: "NGN", symbol: "₦", balance: 350000, ngnEquivalent: 350000 },
    { currency: "USD", symbol: "$", balance: 85.44, ngnEquivalent: 135000 },
  ],
  recentTransactions: [
    { id: "wt-1", type: "credit", description: "Salary top-up", currency: "NGN", amount: 100000, ngnEquivalent: 100000, date: "2026-03-15", status: "completed" },
    { id: "wt-2", type: "debit", description: "USD purchase", currency: "NGN", amount: 158000, ngnEquivalent: 158000, date: "2026-03-10", status: "completed" },
    { id: "wt-3", type: "credit", description: "Currency conversion", currency: "USD", amount: 100, ngnEquivalent: 158000, date: "2026-03-10", status: "completed" },
    { id: "wt-4", type: "debit", description: "Withdrawal to bank", currency: "NGN", amount: 200000, ngnEquivalent: 200000, date: "2026-02-28", status: "completed" },
    { id: "wt-5", type: "credit", description: "Salary top-up", currency: "NGN", amount: 150000, ngnEquivalent: 150000, date: "2026-02-15", status: "completed" },
  ],
};
