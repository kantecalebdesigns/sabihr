// 5.1 Payroll Configuration — Mock Data & Types

export interface PayGrade {
  id: string;
  name: string;
  level: number;
  minSalary: number;
  maxSalary: number;
  midSalary: number;
  employeeCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface SalaryComponent {
  id: string;
  name: string;
  type: "earning" | "deduction";
  category: "basic" | "allowance" | "bonus" | "statutory" | "voluntary";
  calculationType: "fixed" | "percentage";
  value: number;
  percentageOf?: string;
  taxable: boolean;
  status: "active" | "inactive";
}

export interface SalaryStructure {
  id: string;
  name: string;
  description: string;
  payGradeId: string;
  payGradeName: string;
  components: SalaryComponent[];
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  employeeCount: number;
  status: "active" | "draft" | "archived";
  effectiveFrom: string;
  createdAt: string;
}

export interface AllowanceDeductionTemplate {
  id: string;
  name: string;
  type: "allowance" | "deduction";
  category: string;
  calculationType: "fixed" | "percentage";
  defaultValue: number;
  percentageOf?: string;
  taxable: boolean;
  statutory: boolean;
  description: string;
  applicableTo: "all" | "specific-grades";
  status: "active" | "inactive";
}

export interface PayrollCalendar {
  id: string;
  name: string;
  frequency: "monthly" | "bi-weekly" | "weekly";
  payDay: number;
  cutoffDay: number;
  processingDay: number;
  year: number;
  periods: PayrollPeriod[];
  status: "active" | "inactive";
}

export interface PayrollPeriod {
  id: string;
  periodName: string;
  startDate: string;
  endDate: string;
  cutoffDate: string;
  processingDate: string;
  payDate: string;
  status: "upcoming" | "open" | "closed" | "processed";
}

export interface SalaryAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  structureId: string;
  structureName: string;
  payGradeName: string;
  basicSalary: number;
  grossPay: number;
  effectiveFrom: string;
  status: "active" | "pending" | "expired";
}

export const PAY_GRADE_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  inactive: { label: "Inactive", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const STRUCTURE_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  draft: { label: "Draft", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  archived: { label: "Archived", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const ASSIGNMENT_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  expired: { label: "Expired", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const PERIOD_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  upcoming: { label: "Upcoming", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  open: { label: "Open", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  closed: { label: "Closed", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
  processed: { label: "Processed", bg: "bg-violet-50 border-violet-200", color: "text-violet-700" },
};

export const MOCK_PAY_GRADES: PayGrade[] = [
  { id: "pg-1", name: "Entry Level", level: 1, minSalary: 150000, maxSalary: 300000, midSalary: 225000, employeeCount: 42, status: "active", createdAt: "2025-01-15" },
  { id: "pg-2", name: "Junior", level: 2, minSalary: 300000, maxSalary: 500000, midSalary: 400000, employeeCount: 35, status: "active", createdAt: "2025-01-15" },
  { id: "pg-3", name: "Mid-Level", level: 3, minSalary: 500000, maxSalary: 800000, midSalary: 650000, employeeCount: 28, status: "active", createdAt: "2025-01-15" },
  { id: "pg-4", name: "Senior", level: 4, minSalary: 800000, maxSalary: 1200000, midSalary: 1000000, employeeCount: 22, status: "active", createdAt: "2025-01-15" },
  { id: "pg-5", name: "Lead", level: 5, minSalary: 1200000, maxSalary: 1800000, midSalary: 1500000, employeeCount: 14, status: "active", createdAt: "2025-01-15" },
  { id: "pg-6", name: "Manager", level: 6, minSalary: 1800000, maxSalary: 2500000, midSalary: 2150000, employeeCount: 8, status: "active", createdAt: "2025-01-15" },
  { id: "pg-7", name: "Director", level: 7, minSalary: 2500000, maxSalary: 4000000, midSalary: 3250000, employeeCount: 5, status: "active", createdAt: "2025-01-15" },
  { id: "pg-8", name: "Executive", level: 8, minSalary: 4000000, maxSalary: 7000000, midSalary: 5500000, employeeCount: 2, status: "active", createdAt: "2025-01-15" },
  { id: "pg-9", name: "Intern", level: 0, minSalary: 75000, maxSalary: 150000, midSalary: 112500, employeeCount: 0, status: "inactive", createdAt: "2025-06-01" },
];

export const MOCK_SALARY_COMPONENTS: SalaryComponent[] = [
  { id: "sc-1", name: "Basic Salary", type: "earning", category: "basic", calculationType: "percentage", value: 50, percentageOf: "gross", taxable: true, status: "active" },
  { id: "sc-2", name: "Housing Allowance", type: "earning", category: "allowance", calculationType: "percentage", value: 20, percentageOf: "basic", taxable: true, status: "active" },
  { id: "sc-3", name: "Transport Allowance", type: "earning", category: "allowance", calculationType: "percentage", value: 15, percentageOf: "basic", taxable: true, status: "active" },
  { id: "sc-4", name: "Meal Allowance", type: "earning", category: "allowance", calculationType: "fixed", value: 25000, taxable: false, status: "active" },
  { id: "sc-5", name: "Utility Allowance", type: "earning", category: "allowance", calculationType: "percentage", value: 10, percentageOf: "basic", taxable: true, status: "active" },
  { id: "sc-6", name: "PAYE Tax", type: "deduction", category: "statutory", calculationType: "percentage", value: 0, taxable: false, status: "active" },
  { id: "sc-7", name: "Pension (Employee)", type: "deduction", category: "statutory", calculationType: "percentage", value: 8, percentageOf: "basic", taxable: false, status: "active" },
  { id: "sc-8", name: "NHF", type: "deduction", category: "statutory", calculationType: "percentage", value: 2.5, percentageOf: "basic", taxable: false, status: "active" },
  { id: "sc-9", name: "Health Insurance", type: "deduction", category: "voluntary", calculationType: "fixed", value: 15000, taxable: false, status: "active" },
];

export const MOCK_SALARY_STRUCTURES: SalaryStructure[] = [
  {
    id: "ss-1", name: "Standard Entry Level", description: "Default salary structure for entry-level employees", payGradeId: "pg-1", payGradeName: "Entry Level",
    components: MOCK_SALARY_COMPONENTS.slice(0, 5),
    totalEarnings: 225000, totalDeductions: 33750, netPay: 191250, employeeCount: 42, status: "active", effectiveFrom: "2025-01-01", createdAt: "2025-01-15",
  },
  {
    id: "ss-2", name: "Standard Mid-Level", description: "Salary structure for mid-level professionals", payGradeId: "pg-3", payGradeName: "Mid-Level",
    components: MOCK_SALARY_COMPONENTS,
    totalEarnings: 650000, totalDeductions: 97500, netPay: 552500, employeeCount: 28, status: "active", effectiveFrom: "2025-01-01", createdAt: "2025-01-15",
  },
  {
    id: "ss-3", name: "Senior Professional", description: "Comprehensive package for senior employees", payGradeId: "pg-4", payGradeName: "Senior",
    components: MOCK_SALARY_COMPONENTS,
    totalEarnings: 1000000, totalDeductions: 150000, netPay: 850000, employeeCount: 22, status: "active", effectiveFrom: "2025-01-01", createdAt: "2025-01-15",
  },
  {
    id: "ss-4", name: "Management Package", description: "Executive compensation structure for managers", payGradeId: "pg-6", payGradeName: "Manager",
    components: MOCK_SALARY_COMPONENTS,
    totalEarnings: 2150000, totalDeductions: 322500, netPay: 1827500, employeeCount: 8, status: "active", effectiveFrom: "2025-01-01", createdAt: "2025-01-15",
  },
  {
    id: "ss-5", name: "Director Package (Draft)", description: "New structure pending approval", payGradeId: "pg-7", payGradeName: "Director",
    components: MOCK_SALARY_COMPONENTS,
    totalEarnings: 3250000, totalDeductions: 487500, netPay: 2762500, employeeCount: 0, status: "draft", effectiveFrom: "2026-04-01", createdAt: "2026-03-10",
  },
];

export const MOCK_TEMPLATES: AllowanceDeductionTemplate[] = [
  { id: "t-1", name: "Housing Allowance", type: "allowance", category: "Housing", calculationType: "percentage", defaultValue: 20, percentageOf: "basic", taxable: true, statutory: false, description: "Standard housing allowance", applicableTo: "all", status: "active" },
  { id: "t-2", name: "Transport Allowance", type: "allowance", category: "Transport", calculationType: "percentage", defaultValue: 15, percentageOf: "basic", taxable: true, statutory: false, description: "Monthly transport allowance", applicableTo: "all", status: "active" },
  { id: "t-3", name: "Meal Allowance", type: "allowance", category: "Meals", calculationType: "fixed", defaultValue: 25000, taxable: false, statutory: false, description: "Daily meal subsidy", applicableTo: "all", status: "active" },
  { id: "t-4", name: "Leave Allowance", type: "allowance", category: "Leave", calculationType: "percentage", defaultValue: 10, percentageOf: "basic", taxable: true, statutory: false, description: "Annual leave allowance", applicableTo: "all", status: "active" },
  { id: "t-5", name: "13th Month", type: "allowance", category: "Bonus", calculationType: "percentage", defaultValue: 100, percentageOf: "basic", taxable: true, statutory: false, description: "Year-end 13th month salary", applicableTo: "all", status: "active" },
  { id: "t-6", name: "PAYE Tax", type: "deduction", category: "Tax", calculationType: "percentage", defaultValue: 0, taxable: false, statutory: true, description: "Pay-As-You-Earn income tax", applicableTo: "all", status: "active" },
  { id: "t-7", name: "Pension (Employee 8%)", type: "deduction", category: "Pension", calculationType: "percentage", defaultValue: 8, percentageOf: "basic+housing+transport", taxable: false, statutory: true, description: "Employee pension contribution", applicableTo: "all", status: "active" },
  { id: "t-8", name: "Pension (Employer 10%)", type: "deduction", category: "Pension", calculationType: "percentage", defaultValue: 10, percentageOf: "basic+housing+transport", taxable: false, statutory: true, description: "Employer pension contribution", applicableTo: "all", status: "active" },
  { id: "t-9", name: "NHF", type: "deduction", category: "NHF", calculationType: "percentage", defaultValue: 2.5, percentageOf: "basic", taxable: false, statutory: true, description: "National Housing Fund", applicableTo: "all", status: "active" },
  { id: "t-10", name: "Health Insurance (HMO)", type: "deduction", category: "Insurance", calculationType: "fixed", defaultValue: 15000, taxable: false, statutory: false, description: "Health maintenance organization", applicableTo: "all", status: "active" },
  { id: "t-11", name: "Cooperative Deduction", type: "deduction", category: "Voluntary", calculationType: "fixed", defaultValue: 0, taxable: false, statutory: false, description: "Staff cooperative society", applicableTo: "specific-grades", status: "active" },
];

export const MOCK_PAYROLL_CALENDAR: PayrollCalendar = {
  id: "cal-1",
  name: "Monthly Payroll 2026",
  frequency: "monthly",
  payDay: 25,
  cutoffDay: 20,
  processingDay: 22,
  year: 2026,
  status: "active",
  periods: [
    { id: "p-01", periodName: "January 2026", startDate: "2026-01-01", endDate: "2026-01-31", cutoffDate: "2026-01-20", processingDate: "2026-01-22", payDate: "2026-01-25", status: "processed" },
    { id: "p-02", periodName: "February 2026", startDate: "2026-02-01", endDate: "2026-02-28", cutoffDate: "2026-02-20", processingDate: "2026-02-22", payDate: "2026-02-25", status: "processed" },
    { id: "p-03", periodName: "March 2026", startDate: "2026-03-01", endDate: "2026-03-31", cutoffDate: "2026-03-20", processingDate: "2026-03-22", payDate: "2026-03-25", status: "open" },
    { id: "p-04", periodName: "April 2026", startDate: "2026-04-01", endDate: "2026-04-30", cutoffDate: "2026-04-20", processingDate: "2026-04-22", payDate: "2026-04-25", status: "upcoming" },
    { id: "p-05", periodName: "May 2026", startDate: "2026-05-01", endDate: "2026-05-31", cutoffDate: "2026-05-20", processingDate: "2026-05-22", payDate: "2026-05-25", status: "upcoming" },
    { id: "p-06", periodName: "June 2026", startDate: "2026-06-01", endDate: "2026-06-30", cutoffDate: "2026-06-20", processingDate: "2026-06-22", payDate: "2026-06-25", status: "upcoming" },
    { id: "p-07", periodName: "July 2026", startDate: "2026-07-01", endDate: "2026-07-31", cutoffDate: "2026-07-20", processingDate: "2026-07-22", payDate: "2026-07-25", status: "upcoming" },
    { id: "p-08", periodName: "August 2026", startDate: "2026-08-01", endDate: "2026-08-31", cutoffDate: "2026-08-20", processingDate: "2026-08-22", payDate: "2026-08-25", status: "upcoming" },
    { id: "p-09", periodName: "September 2026", startDate: "2026-09-01", endDate: "2026-09-30", cutoffDate: "2026-09-20", processingDate: "2026-09-22", payDate: "2026-09-25", status: "upcoming" },
    { id: "p-10", periodName: "October 2026", startDate: "2026-10-01", endDate: "2026-10-31", cutoffDate: "2026-10-20", processingDate: "2026-10-22", payDate: "2026-10-25", status: "upcoming" },
    { id: "p-11", periodName: "November 2026", startDate: "2026-11-01", endDate: "2026-11-30", cutoffDate: "2026-11-20", processingDate: "2026-11-22", payDate: "2026-11-25", status: "upcoming" },
    { id: "p-12", periodName: "December 2026", startDate: "2026-12-01", endDate: "2026-12-31", cutoffDate: "2026-12-20", processingDate: "2026-12-22", payDate: "2026-12-25", status: "upcoming" },
  ],
};

export const MOCK_SALARY_ASSIGNMENTS: SalaryAssignment[] = [
  { id: "sa-1", employeeId: "EMP-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", structureId: "ss-3", structureName: "Senior Professional", payGradeName: "Senior", basicSalary: 1000000, grossPay: 1450000, effectiveFrom: "2025-03-01", status: "active" },
  { id: "sa-2", employeeId: "EMP-002", employeeName: "Chioma Eze", department: "Product", structureId: "ss-2", structureName: "Standard Mid-Level", payGradeName: "Mid-Level", basicSalary: 650000, grossPay: 942500, effectiveFrom: "2025-01-01", status: "active" },
  { id: "sa-3", employeeId: "EMP-003", employeeName: "Emeka Nwosu", department: "Finance", structureId: "ss-4", structureName: "Management Package", payGradeName: "Manager", basicSalary: 2150000, grossPay: 3117500, effectiveFrom: "2025-06-01", status: "active" },
  { id: "sa-4", employeeId: "EMP-004", employeeName: "Fatima Bello", department: "HR", structureId: "ss-1", structureName: "Standard Entry Level", payGradeName: "Entry Level", basicSalary: 225000, grossPay: 326250, effectiveFrom: "2025-09-01", status: "active" },
  { id: "sa-5", employeeId: "EMP-005", employeeName: "Gbenga Adeyemi", department: "Marketing", structureId: "ss-2", structureName: "Standard Mid-Level", payGradeName: "Mid-Level", basicSalary: 700000, grossPay: 1015000, effectiveFrom: "2025-04-01", status: "active" },
  { id: "sa-6", employeeId: "EMP-006", employeeName: "Halima Yusuf", department: "Engineering", structureId: "ss-3", structureName: "Senior Professional", payGradeName: "Senior", basicSalary: 1100000, grossPay: 1595000, effectiveFrom: "2025-01-01", status: "active" },
  { id: "sa-7", employeeId: "EMP-007", employeeName: "Ibrahim Musa", department: "Operations", structureId: "ss-1", structureName: "Standard Entry Level", payGradeName: "Entry Level", basicSalary: 200000, grossPay: 290000, effectiveFrom: "2026-01-15", status: "pending" },
  { id: "sa-8", employeeId: "EMP-008", employeeName: "Joy Okafor", department: "Legal", structureId: "ss-2", structureName: "Standard Mid-Level", payGradeName: "Mid-Level", basicSalary: 600000, grossPay: 870000, effectiveFrom: "2024-06-01", status: "expired" },
];
