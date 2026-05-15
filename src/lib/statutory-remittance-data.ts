// Statutory Remittance — configuration data
// Defines which statutory deductions the company remits, with rates,
// computation bases, splits, and schedules.

export type ComputationBase = "basic-salary" | "gross-salary" | "total-payroll";
export type RemittanceFrequency = "monthly" | "quarterly" | "annually";

export interface StatutoryBodyConfig {
  id: string;
  code: string;
  name: string;
  authority: string;
  description: string;
  enabled: boolean;
  isTiered: boolean;
  computationBase: ComputationBase;
  employerPortion: number; // percent
  employeePortion: number; // percent
  hasMaxContribution: boolean;
  maxContribution: number | null; // Naira
  frequency: RemittanceFrequency;
  effectiveFrom: string; // ISO date
  remittanceDayOfMonth: number; // 1–31
  tieredConfigPath?: string;
}

export const COMPUTATION_BASE_LABELS: Record<ComputationBase, string> = {
  "basic-salary": "Basic salary",
  "gross-salary": "Gross salary",
  "total-payroll": "Total payroll",
};

export const FREQUENCY_LABELS: Record<RemittanceFrequency, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annually",
};

export const MOCK_STATUTORY_CONFIGS: StatutoryBodyConfig[] = [
  {
    id: "paye",
    code: "PAYE",
    name: "PAYE Tax",
    authority: "FIRS / LIRS",
    description: "Pay-As-You-Earn personal income tax withheld from employee salaries.",
    enabled: true,
    isTiered: true,
    computationBase: "gross-salary",
    employerPortion: 0,
    employeePortion: 0,
    hasMaxContribution: false,
    maxContribution: null,
    frequency: "monthly",
    effectiveFrom: "2025-01-01",
    remittanceDayOfMonth: 10,
    tieredConfigPath: "/payroll/compliance",
  },
  {
    id: "pension",
    code: "PEN",
    name: "Pension",
    authority: "PenCom",
    description: "Mandatory pension contributions to employee-selected PFAs.",
    enabled: true,
    isTiered: false,
    computationBase: "basic-salary",
    employerPortion: 10,
    employeePortion: 8,
    hasMaxContribution: false,
    maxContribution: null,
    frequency: "monthly",
    effectiveFrom: "2025-01-01",
    remittanceDayOfMonth: 7,
  },
  {
    id: "nhf",
    code: "NHF",
    name: "National Housing Fund",
    authority: "FMBN",
    description: "2.5% employee contribution to the Federal Mortgage Bank of Nigeria.",
    enabled: true,
    isTiered: false,
    computationBase: "basic-salary",
    employerPortion: 0,
    employeePortion: 2.5,
    hasMaxContribution: false,
    maxContribution: null,
    frequency: "monthly",
    effectiveFrom: "2025-01-01",
    remittanceDayOfMonth: 28,
  },
  {
    id: "nhis",
    code: "NHIS",
    name: "National Health Insurance",
    authority: "NHIA",
    description: "Health insurance contributions split between employer and employee.",
    enabled: true,
    isTiered: false,
    computationBase: "basic-salary",
    employerPortion: 10,
    employeePortion: 5,
    hasMaxContribution: false,
    maxContribution: null,
    frequency: "monthly",
    effectiveFrom: "2025-01-01",
    remittanceDayOfMonth: 15,
  },
  {
    id: "itf",
    code: "ITF",
    name: "Industrial Training Fund",
    authority: "ITF",
    description: "Employer-only levy funding industrial skills development. Applies once annual payroll exceeds ₦50M.",
    enabled: true,
    isTiered: false,
    computationBase: "total-payroll",
    employerPortion: 1,
    employeePortion: 0,
    hasMaxContribution: false,
    maxContribution: null,
    frequency: "quarterly",
    effectiveFrom: "2025-01-01",
    remittanceDayOfMonth: 31,
  },
  {
    id: "nsitf",
    code: "NSITF",
    name: "Employee Compensation Scheme",
    authority: "NSITF",
    description: "Employer-only contribution funding workplace injury compensation.",
    enabled: false,
    isTiered: false,
    computationBase: "total-payroll",
    employerPortion: 1,
    employeePortion: 0,
    hasMaxContribution: false,
    maxContribution: null,
    frequency: "monthly",
    effectiveFrom: "2025-01-01",
    remittanceDayOfMonth: 15,
  },
];
