// ── Types ──

export type LoanStatus = "active" | "fully-paid" | "defaulted" | "pending";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type AdvanceStatus = "pending" | "approved" | "disbursed" | "repaid";

export interface LoanProduct {
  id: string;
  name: string;
  interestRate: number;
  maxAmount: number;
  maxTenureMonths: number;
  description: string;
  status: "active" | "inactive";
}

export interface Loan {
  id: string;
  productId: string;
  productName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  principalAmount: number;
  outstandingBalance: number;
  interestRate: number;
  tenureMonths: number;
  monthlyDeduction: number;
  monthsPaid: number;
  startDate: string;
  status: LoanStatus;
}

export interface LoanApplication {
  id: string;
  productId: string;
  productName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  appliedDate: string;
  status: ApplicationStatus;
}

export interface SalaryAdvance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: AdvanceStatus;
}

export interface RepaymentScheduleRow {
  month: number;
  principal: number;
  interest: number;
  payment: number;
  balance: number;
}

// ── Status Styles ──

export const LOAN_STATUS_STYLES: Record<LoanStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "text-emerald-700" },
  "fully-paid": { label: "Fully Paid", color: "text-blue-700" },
  defaulted: { label: "Defaulted", color: "text-red-700" },
  pending: { label: "Pending", color: "text-amber-700" },
};

export const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-amber-700" },
  approved: { label: "Approved", color: "text-emerald-700" },
  rejected: { label: "Rejected", color: "text-red-700" },
};

export const ADVANCE_STATUS_STYLES: Record<AdvanceStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-amber-700" },
  approved: { label: "Approved", color: "text-emerald-700" },
  disbursed: { label: "Disbursed", color: "text-blue-700" },
  repaid: { label: "Repaid", color: "text-gray-500" },
};

// ── Helper ──

export function formatLoanCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export function generateRepaymentSchedule(principal: number, annualRate: number, tenureMonths: number): RepaymentScheduleRow[] {
  const monthlyRate = annualRate / 100 / 12;
  const payment = monthlyRate > 0
    ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenureMonths))
    : principal / tenureMonths;
  const schedule: RepaymentScheduleRow[] = [];
  let balance = principal;
  for (let m = 1; m <= tenureMonths; m++) {
    const interest = balance * monthlyRate;
    const princ = payment - interest;
    balance = Math.max(0, balance - princ);
    schedule.push({
      month: m,
      principal: Math.round(princ),
      interest: Math.round(interest),
      payment: Math.round(payment),
      balance: Math.round(balance),
    });
  }
  return schedule;
}

// ── Mock: Loan Products ──

export const MOCK_LOAN_PRODUCTS: LoanProduct[] = [
  { id: "lp-1", name: "Staff Loan", interestRate: 15, maxAmount: 2000000, maxTenureMonths: 24, description: "General purpose staff loan with competitive rates", status: "active" },
  { id: "lp-2", name: "Emergency Loan", interestRate: 10, maxAmount: 500000, maxTenureMonths: 6, description: "Quick emergency loan with fast approval", status: "active" },
  { id: "lp-3", name: "Car Loan", interestRate: 12, maxAmount: 5000000, maxTenureMonths: 48, description: "Vehicle financing for eligible employees", status: "active" },
];

// ── Mock: Active Loans ──

export const MOCK_LOANS: Loan[] = [
  { id: "ln-1", productId: "lp-1", productName: "Staff Loan", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", principalAmount: 1500000, outstandingBalance: 1125000, interestRate: 15, tenureMonths: 18, monthlyDeduction: 96000, monthsPaid: 6, startDate: "2025-10-01", status: "active" },
  { id: "ln-2", productId: "lp-2", productName: "Emergency Loan", employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", principalAmount: 300000, outstandingBalance: 150000, interestRate: 10, tenureMonths: 6, monthlyDeduction: 52500, monthsPaid: 3, startDate: "2026-01-01", status: "active" },
  { id: "ln-3", productId: "lp-3", productName: "Car Loan", employeeId: "emp-002", employeeName: "Chiamaka Eze", department: "Engineering", principalAmount: 4000000, outstandingBalance: 3600000, interestRate: 12, tenureMonths: 36, monthlyDeduction: 132800, monthsPaid: 4, startDate: "2025-12-01", status: "active" },
  { id: "ln-4", productId: "lp-1", productName: "Staff Loan", employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", principalAmount: 800000, outstandingBalance: 400000, interestRate: 15, tenureMonths: 12, monthlyDeduction: 72200, monthsPaid: 6, startDate: "2025-10-01", status: "active" },
  { id: "ln-5", productId: "lp-2", productName: "Emergency Loan", employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", principalAmount: 200000, outstandingBalance: 0, interestRate: 10, tenureMonths: 4, monthlyDeduction: 52000, monthsPaid: 4, startDate: "2025-12-01", status: "fully-paid" },
  { id: "ln-6", productId: "lp-1", productName: "Staff Loan", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", principalAmount: 1000000, outstandingBalance: 833000, interestRate: 15, tenureMonths: 12, monthlyDeduction: 90300, monthsPaid: 2, startDate: "2026-02-01", status: "active" },
  { id: "ln-7", productId: "lp-3", productName: "Car Loan", employeeId: "emp-011", employeeName: "Chibueze Okoro", department: "Finance", principalAmount: 3500000, outstandingBalance: 3200000, interestRate: 12, tenureMonths: 48, monthlyDeduction: 92200, monthsPaid: 3, startDate: "2026-01-01", status: "active" },
  { id: "ln-8", productId: "lp-1", productName: "Staff Loan", employeeId: "emp-012", employeeName: "Ngozi Ibe", department: "Sales", principalAmount: 500000, outstandingBalance: 480000, interestRate: 15, tenureMonths: 12, monthlyDeduction: 45200, monthsPaid: 1, startDate: "2026-03-01", status: "active" },
];

// ── Mock: Loan Applications ──

export const MOCK_LOAN_APPLICATIONS: LoanApplication[] = [
  { id: "la-1", productId: "lp-1", productName: "Staff Loan", employeeId: "emp-009", employeeName: "Ibrahim Musa", department: "Operations", amount: 1200000, tenureMonths: 18, purpose: "Home renovation and furniture purchase", appliedDate: "2026-03-28", status: "pending" },
  { id: "la-2", productId: "lp-2", productName: "Emergency Loan", employeeId: "emp-016", employeeName: "Amara Obi", department: "Marketing", amount: 250000, tenureMonths: 4, purpose: "Medical emergency for family member", appliedDate: "2026-04-01", status: "pending" },
  { id: "la-3", productId: "lp-3", productName: "Car Loan", employeeId: "emp-015", employeeName: "Usman Bello", department: "IT", amount: 3000000, tenureMonths: 36, purpose: "Purchase of a new vehicle for commuting", appliedDate: "2026-04-03", status: "pending" },
];

// ── Mock: Salary Advances ──

export const MOCK_SALARY_ADVANCES: SalaryAdvance[] = [
  { id: "sa-1", employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", amount: 200000, reason: "Rent payment due before salary date", requestDate: "2026-03-20", status: "disbursed" },
  { id: "sa-2", employeeId: "emp-013", employeeName: "Kemi Adekunle", department: "Human Resources", amount: 150000, reason: "School fees for children", requestDate: "2026-03-25", status: "repaid" },
  { id: "sa-3", employeeId: "emp-007", employeeName: "Tochukwu Nwankwo", department: "Engineering", amount: 100000, reason: "Travel expenses for family event", requestDate: "2026-04-01", status: "pending" },
  { id: "sa-4", employeeId: "emp-014", employeeName: "Damilola Osei", department: "Engineering", amount: 180000, reason: "Car repair", requestDate: "2026-04-02", status: "approved" },
  { id: "sa-5", employeeId: "emp-010", employeeName: "Yetunde Bakare", department: "Legal", amount: 250000, reason: "Medical expenses", requestDate: "2026-04-04", status: "pending" },
];
