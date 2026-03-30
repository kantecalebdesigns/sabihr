// 5.2 Statutory Compliance Engine — Mock Data & Types

export interface PAYETaxBand {
  id: string;
  min: number;
  max: number | null;
  rate: number;
  description: string;
}

export interface PAYEConfig {
  id: string;
  name: string;
  effectiveFrom: string;
  consolidatedRelief: number;
  grossIncomeRelief: number;
  taxBands: PAYETaxBand[];
  minimumTax: number;
  minimumTaxRate: number;
  status: "active" | "draft" | "expired";
}

export interface PensionConfig {
  id: string;
  pfa: string;
  pfaCode: string;
  employeeRate: number;
  employerRate: number;
  voluntaryRate: number;
  computationBase: string[];
  rsaNumber: string;
  effectiveFrom: string;
  status: "active" | "inactive";
}

export interface StatutoryBody {
  id: string;
  name: string;
  code: string;
  rate: number;
  computationBase: string;
  employerPortion: number;
  employeePortion: number;
  maxContribution: number | null;
  effectiveFrom: string;
  remittanceFrequency: "monthly" | "quarterly" | "annually";
  status: "active" | "inactive";
  lastRemittanceDate: string | null;
  nextDueDate: string;
  complianceStatus: "compliant" | "due-soon" | "overdue" | "not-applicable";
}

export interface ComplianceOverviewItem {
  id: string;
  body: string;
  period: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "partial";
  filedDate: string | null;
}

export const COMPLIANCE_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  compliant: { label: "Compliant", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  "due-soon": { label: "Due Soon", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  overdue: { label: "Overdue", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  "not-applicable": { label: "N/A", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const PAYMENT_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  paid: { label: "Paid", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  overdue: { label: "Overdue", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  partial: { label: "Partial", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
};

export const PAYE_CONFIG_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  draft: { label: "Draft", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  expired: { label: "Expired", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const MOCK_PAYE_CONFIG: PAYEConfig = {
  id: "paye-1",
  name: "Nigeria PAYE 2026",
  effectiveFrom: "2026-01-01",
  consolidatedRelief: 200000,
  grossIncomeRelief: 20,
  minimumTax: 0,
  minimumTaxRate: 1,
  status: "active",
  taxBands: [
    { id: "tb-1", min: 0, max: 300000, rate: 7, description: "First ₦300,000" },
    { id: "tb-2", min: 300001, max: 600000, rate: 11, description: "Next ₦300,000" },
    { id: "tb-3", min: 600001, max: 1100000, rate: 15, description: "Next ₦500,000" },
    { id: "tb-4", min: 1100001, max: 1600000, rate: 19, description: "Next ₦500,000" },
    { id: "tb-5", min: 1600001, max: 3200000, rate: 21, description: "Next ₦1,600,000" },
    { id: "tb-6", min: 3200001, max: null, rate: 24, description: "Above ₦3,200,000" },
  ],
};

export const MOCK_PENSION_CONFIGS: PensionConfig[] = [
  { id: "pen-1", pfa: "ARM Pension Managers", pfaCode: "ARM001", employeeRate: 8, employerRate: 10, voluntaryRate: 0, computationBase: ["Basic", "Housing", "Transport"], rsaNumber: "PEN100264732891", effectiveFrom: "2025-01-01", status: "active" },
  { id: "pen-2", pfa: "Stanbic IBTC Pension", pfaCode: "STB002", employeeRate: 8, employerRate: 10, voluntaryRate: 2, computationBase: ["Basic", "Housing", "Transport"], rsaNumber: "PEN100398271645", effectiveFrom: "2025-01-01", status: "active" },
  { id: "pen-3", pfa: "Leadway Pensure PFA", pfaCode: "LDW003", employeeRate: 8, employerRate: 10, voluntaryRate: 0, computationBase: ["Basic", "Housing", "Transport"], rsaNumber: "PEN100512389076", effectiveFrom: "2025-06-01", status: "active" },
];

export const MOCK_STATUTORY_BODIES: StatutoryBody[] = [
  { id: "sb-1", name: "National Housing Fund", code: "NHF", rate: 2.5, computationBase: "Basic Salary", employerPortion: 0, employeePortion: 2.5, maxContribution: null, effectiveFrom: "2025-01-01", remittanceFrequency: "monthly", status: "active", lastRemittanceDate: "2026-02-28", nextDueDate: "2026-03-31", complianceStatus: "due-soon" },
  { id: "sb-2", name: "Industrial Training Fund", code: "ITF", rate: 1, computationBase: "Total Payroll", employerPortion: 1, employeePortion: 0, maxContribution: null, effectiveFrom: "2025-01-01", remittanceFrequency: "quarterly", status: "active", lastRemittanceDate: "2025-12-31", nextDueDate: "2026-03-31", complianceStatus: "due-soon" },
  { id: "sb-3", name: "Nigeria Social Insurance Trust Fund", code: "NSITF", rate: 1, computationBase: "Total Payroll", employerPortion: 1, employeePortion: 0, maxContribution: null, effectiveFrom: "2025-01-01", remittanceFrequency: "monthly", status: "active", lastRemittanceDate: "2026-02-28", nextDueDate: "2026-03-31", complianceStatus: "compliant" },
  { id: "sb-4", name: "National Health Insurance Scheme", code: "NHIS", rate: 15, computationBase: "Basic Salary", employerPortion: 10, employeePortion: 5, maxContribution: null, effectiveFrom: "2025-01-01", remittanceFrequency: "monthly", status: "active", lastRemittanceDate: "2026-01-31", nextDueDate: "2026-03-31", complianceStatus: "overdue" },
];

export const MOCK_COMPLIANCE_OVERVIEW: ComplianceOverviewItem[] = [
  { id: "co-1", body: "PAYE", period: "March 2026", amountDue: 14250000, amountPaid: 0, balance: 14250000, dueDate: "2026-04-10", status: "pending", filedDate: null },
  { id: "co-2", body: "Pension", period: "March 2026", amountDue: 8650000, amountPaid: 0, balance: 8650000, dueDate: "2026-04-07", status: "pending", filedDate: null },
  { id: "co-3", body: "NHF", period: "March 2026", amountDue: 1205000, amountPaid: 0, balance: 1205000, dueDate: "2026-03-31", status: "pending", filedDate: null },
  { id: "co-4", body: "NHIS", period: "February 2026", amountDue: 2400000, amountPaid: 0, balance: 2400000, dueDate: "2026-03-15", status: "overdue", filedDate: null },
  { id: "co-5", body: "PAYE", period: "February 2026", amountDue: 13980000, amountPaid: 13980000, balance: 0, dueDate: "2026-03-10", status: "paid", filedDate: "2026-03-08" },
  { id: "co-6", body: "Pension", period: "February 2026", amountDue: 8520000, amountPaid: 8520000, balance: 0, dueDate: "2026-03-07", status: "paid", filedDate: "2026-03-05" },
  { id: "co-7", body: "ITF", period: "Q1 2026", amountDue: 4820000, amountPaid: 0, balance: 4820000, dueDate: "2026-03-31", status: "pending", filedDate: null },
  { id: "co-8", body: "NSITF", period: "February 2026", amountDue: 482000, amountPaid: 482000, balance: 0, dueDate: "2026-03-15", status: "paid", filedDate: "2026-03-12" },
  { id: "co-9", body: "NHF", period: "February 2026", amountDue: 1180000, amountPaid: 1180000, balance: 0, dueDate: "2026-02-28", status: "paid", filedDate: "2026-02-25" },
  { id: "co-10", body: "NHIS", period: "January 2026", amountDue: 2350000, amountPaid: 2350000, balance: 0, dueDate: "2026-02-15", status: "paid", filedDate: "2026-02-14" },
];
