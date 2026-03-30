// 5.6 Statutory Remittance — Mock Data & Types

export interface RemittanceRecord {
  id: string;
  type: "paye" | "pension" | "nhf" | "nhis" | "itf" | "nsitf";
  typeName: string;
  period: string;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  employeeCount: number;
  filingReference: string | null;
  paymentReference: string | null;
  filedDate: string | null;
  paidDate: string | null;
  filedBy: string | null;
  status: "pending" | "filed" | "paid" | "overdue" | "partial";
  taxAuthority: string;
}

export interface RemittanceCalendarItem {
  id: string;
  type: string;
  typeName: string;
  period: string;
  dueDate: string;
  status: "upcoming" | "due-today" | "overdue" | "completed";
  amountDue: number;
  daysUntilDue: number;
}

export const REMITTANCE_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  filed: { label: "Filed", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  paid: { label: "Paid", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  overdue: { label: "Overdue", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  partial: { label: "Partial", bg: "bg-violet-50 border-violet-200", color: "text-violet-700" },
};

export const CALENDAR_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  upcoming: { label: "Upcoming", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  "due-today": { label: "Due Today", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  overdue: { label: "Overdue", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  completed: { label: "Completed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
};

export const MOCK_PAYE_REMITTANCES: RemittanceRecord[] = [
  { id: "rem-p1", type: "paye", typeName: "PAYE Tax", period: "March 2026", dueDate: "2026-04-10", amountDue: 14250000, amountPaid: 0, balance: 14250000, employeeCount: 156, filingReference: null, paymentReference: null, filedDate: null, paidDate: null, filedBy: null, status: "pending", taxAuthority: "FIRS / LIRS" },
  { id: "rem-p2", type: "paye", typeName: "PAYE Tax", period: "February 2026", dueDate: "2026-03-10", amountDue: 13980000, amountPaid: 13980000, balance: 0, employeeCount: 156, filingReference: "PAYE-2026-02-156", paymentReference: "PAY-LIRS-20260308", filedDate: "2026-03-07", paidDate: "2026-03-08", filedBy: "Emeka Nwosu", status: "paid", taxAuthority: "FIRS / LIRS" },
  { id: "rem-p3", type: "paye", typeName: "PAYE Tax", period: "January 2026", dueDate: "2026-02-10", amountDue: 13750000, amountPaid: 13750000, balance: 0, employeeCount: 152, filingReference: "PAYE-2026-01-152", paymentReference: "PAY-LIRS-20260208", filedDate: "2026-02-06", paidDate: "2026-02-08", filedBy: "Emeka Nwosu", status: "paid", taxAuthority: "FIRS / LIRS" },
];

export const MOCK_PENSION_REMITTANCES: RemittanceRecord[] = [
  { id: "rem-pn1", type: "pension", typeName: "Pension", period: "March 2026", dueDate: "2026-04-07", amountDue: 8650000, amountPaid: 0, balance: 8650000, employeeCount: 156, filingReference: null, paymentReference: null, filedDate: null, paidDate: null, filedBy: null, status: "pending", taxAuthority: "PenCom" },
  { id: "rem-pn2", type: "pension", typeName: "Pension", period: "February 2026", dueDate: "2026-03-07", amountDue: 8520000, amountPaid: 8520000, balance: 0, employeeCount: 156, filingReference: "PEN-2026-02-156", paymentReference: "PAY-PENCOM-20260305", filedDate: "2026-03-04", paidDate: "2026-03-05", filedBy: "Emeka Nwosu", status: "paid", taxAuthority: "PenCom" },
  { id: "rem-pn3", type: "pension", typeName: "Pension", period: "January 2026", dueDate: "2026-02-07", amountDue: 8320000, amountPaid: 8320000, balance: 0, employeeCount: 152, filingReference: "PEN-2026-01-152", paymentReference: "PAY-PENCOM-20260205", filedDate: "2026-02-04", paidDate: "2026-02-05", filedBy: "Emeka Nwosu", status: "paid", taxAuthority: "PenCom" },
];

export const MOCK_OTHER_REMITTANCES: RemittanceRecord[] = [
  { id: "rem-n1", type: "nhf", typeName: "NHF", period: "March 2026", dueDate: "2026-03-31", amountDue: 1205000, amountPaid: 0, balance: 1205000, employeeCount: 156, filingReference: null, paymentReference: null, filedDate: null, paidDate: null, filedBy: null, status: "pending", taxAuthority: "FMBN" },
  { id: "rem-n2", type: "nhf", typeName: "NHF", period: "February 2026", dueDate: "2026-02-28", amountDue: 1180000, amountPaid: 1180000, balance: 0, employeeCount: 156, filingReference: "NHF-2026-02", paymentReference: "PAY-FMBN-20260225", filedDate: "2026-02-24", paidDate: "2026-02-25", filedBy: "Emeka Nwosu", status: "paid", taxAuthority: "FMBN" },
  { id: "rem-h1", type: "nhis", typeName: "NHIS", period: "February 2026", dueDate: "2026-03-15", amountDue: 2400000, amountPaid: 0, balance: 2400000, employeeCount: 156, filingReference: null, paymentReference: null, filedDate: null, paidDate: null, filedBy: null, status: "overdue", taxAuthority: "NHIA" },
  { id: "rem-h2", type: "nhis", typeName: "NHIS", period: "January 2026", dueDate: "2026-02-15", amountDue: 2350000, amountPaid: 2350000, balance: 0, employeeCount: 152, filingReference: "NHIS-2026-01", paymentReference: "PAY-NHIA-20260214", filedDate: "2026-02-13", paidDate: "2026-02-14", filedBy: "Emeka Nwosu", status: "paid", taxAuthority: "NHIA" },
  { id: "rem-i1", type: "itf", typeName: "ITF", period: "Q1 2026", dueDate: "2026-03-31", amountDue: 4820000, amountPaid: 0, balance: 4820000, employeeCount: 156, filingReference: null, paymentReference: null, filedDate: null, paidDate: null, filedBy: null, status: "pending", taxAuthority: "ITF" },
  { id: "rem-i2", type: "itf", typeName: "ITF", period: "Q4 2025", dueDate: "2025-12-31", amountDue: 4650000, amountPaid: 4650000, balance: 0, employeeCount: 148, filingReference: "ITF-2025-Q4", paymentReference: "PAY-ITF-20251228", filedDate: "2025-12-27", paidDate: "2025-12-28", filedBy: "Emeka Nwosu", status: "paid", taxAuthority: "ITF" },
  { id: "rem-s1", type: "nsitf", typeName: "NSITF", period: "February 2026", dueDate: "2026-03-15", amountDue: 482000, amountPaid: 482000, balance: 0, employeeCount: 156, filingReference: "NSITF-2026-02", paymentReference: "PAY-NSITF-20260312", filedDate: "2026-03-11", paidDate: "2026-03-12", filedBy: "Emeka Nwosu", status: "paid", taxAuthority: "NSITF" },
  { id: "rem-s2", type: "nsitf", typeName: "NSITF", period: "March 2026", dueDate: "2026-04-15", amountDue: 490000, amountPaid: 0, balance: 490000, employeeCount: 156, filingReference: null, paymentReference: null, filedDate: null, paidDate: null, filedBy: null, status: "pending", taxAuthority: "NSITF" },
];

export const MOCK_REMITTANCE_CALENDAR: RemittanceCalendarItem[] = [
  { id: "cal-1", type: "paye", typeName: "PAYE Tax", period: "March 2026", dueDate: "2026-04-10", status: "upcoming", amountDue: 14250000, daysUntilDue: 16 },
  { id: "cal-2", type: "pension", typeName: "Pension", period: "March 2026", dueDate: "2026-04-07", status: "upcoming", amountDue: 8650000, daysUntilDue: 13 },
  { id: "cal-3", type: "nhf", typeName: "NHF", period: "March 2026", dueDate: "2026-03-31", status: "upcoming", amountDue: 1205000, daysUntilDue: 6 },
  { id: "cal-4", type: "itf", typeName: "ITF", period: "Q1 2026", dueDate: "2026-03-31", status: "upcoming", amountDue: 4820000, daysUntilDue: 6 },
  { id: "cal-5", type: "nhis", typeName: "NHIS", period: "February 2026", dueDate: "2026-03-15", status: "overdue", amountDue: 2400000, daysUntilDue: -10 },
  { id: "cal-6", type: "nsitf", typeName: "NSITF", period: "March 2026", dueDate: "2026-04-15", status: "upcoming", amountDue: 490000, daysUntilDue: 21 },
];
