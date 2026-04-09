// ── Types ──

export type PlanStatus = "active" | "inactive";
export type EnrollmentStatus = "active" | "pending" | "cancelled" | "expired";
export type PlanCategory = "health" | "life" | "meal" | "transport" | "wellness";

export interface BenefitPlan {
  id: string;
  name: string;
  category: PlanCategory;
  provider: string;
  description: string;
  coverageSummary: string;
  employerContribution: number;
  employeeContribution: number;
  currency: string;
  frequency: "monthly" | "annually";
  maxDependents: number;
  status: PlanStatus;
}

export interface Enrollment {
  id: string;
  planId: string;
  planName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string | null;
  dependentsCovered: number;
  status: EnrollmentStatus;
  enrolledAt: string;
}

// ── Status Styles ──

export const ENROLLMENT_STATUS_STYLES: Record<EnrollmentStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "text-emerald-700" },
  pending: { label: "Pending", color: "text-amber-700" },
  cancelled: { label: "Cancelled", color: "text-red-700" },
  expired: { label: "Expired", color: "text-gray-500" },
};

export const PLAN_CATEGORY_LABELS: Record<PlanCategory, string> = {
  health: "Health",
  life: "Life Insurance",
  meal: "Meal",
  transport: "Transport",
  wellness: "Wellness",
};

// ── Mock Plans ──

export const MOCK_BENEFIT_PLANS: BenefitPlan[] = [
  {
    id: "plan-1",
    name: "Health Insurance (HMO)",
    category: "health",
    provider: "Leadway Health",
    description: "Comprehensive health insurance covering outpatient, inpatient, dental, and optical care for employees and dependents.",
    coverageSummary: "Outpatient, inpatient, dental, optical",
    employerContribution: 45000,
    employeeContribution: 15000,
    currency: "₦",
    frequency: "monthly",
    maxDependents: 4,
    status: "active",
  },
  {
    id: "plan-2",
    name: "Group Life Insurance",
    category: "life",
    provider: "AXA Mansard",
    description: "Group life insurance providing 3x annual salary coverage for death-in-service, permanent disability, and critical illness.",
    coverageSummary: "3x annual salary, death-in-service, disability",
    employerContribution: 25000,
    employeeContribution: 0,
    currency: "₦",
    frequency: "monthly",
    maxDependents: 0,
    status: "active",
  },
  {
    id: "plan-3",
    name: "Meal Subsidy",
    category: "meal",
    provider: "Eden Life",
    description: "Daily meal allowance credited to employee meal wallet. Valid at partner restaurants and for meal delivery orders.",
    coverageSummary: "₦2,500/day meal credit at partner vendors",
    employerContribution: 50000,
    employeeContribution: 0,
    currency: "₦",
    frequency: "monthly",
    maxDependents: 0,
    status: "active",
  },
  {
    id: "plan-4",
    name: "Transport Allowance",
    category: "transport",
    provider: "Internal",
    description: "Monthly transport subsidy for commuting to work. Covers fuel, public transport, or ride-hailing services.",
    coverageSummary: "Monthly commute allowance",
    employerContribution: 30000,
    employeeContribution: 0,
    currency: "₦",
    frequency: "monthly",
    maxDependents: 0,
    status: "active",
  },
  {
    id: "plan-5",
    name: "Wellness Program",
    category: "wellness",
    provider: "FitLife Nigeria",
    description: "Gym membership, mental health counseling sessions, and annual health screening package.",
    coverageSummary: "Gym, counseling, annual health check",
    employerContribution: 20000,
    employeeContribution: 10000,
    currency: "₦",
    frequency: "monthly",
    maxDependents: 0,
    status: "active",
  },
];

// ── Mock Enrollments ──

export const MOCK_ENROLLMENTS: Enrollment[] = [
  { id: "enr-1", planId: "plan-1", planName: "Health Insurance (HMO)", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", startDate: "2025-03-01", endDate: null, dependentsCovered: 2, status: "active", enrolledAt: "2025-02-20" },
  { id: "enr-2", planId: "plan-2", planName: "Group Life Insurance", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", startDate: "2025-03-01", endDate: null, dependentsCovered: 0, status: "active", enrolledAt: "2025-02-20" },
  { id: "enr-3", planId: "plan-5", planName: "Wellness Program", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", startDate: "2025-06-01", endDate: null, dependentsCovered: 0, status: "active", enrolledAt: "2025-05-25" },
  { id: "enr-4", planId: "plan-1", planName: "Health Insurance (HMO)", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", startDate: "2024-09-01", endDate: null, dependentsCovered: 3, status: "active", enrolledAt: "2024-08-28" },
  { id: "enr-5", planId: "plan-3", planName: "Meal Subsidy", employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", startDate: "2025-04-01", endDate: null, dependentsCovered: 0, status: "active", enrolledAt: "2025-03-28" },
  { id: "enr-6", planId: "plan-1", planName: "Health Insurance (HMO)", employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", startDate: "2025-05-01", endDate: null, dependentsCovered: 1, status: "pending", enrolledAt: "2026-03-30" },
  { id: "enr-7", planId: "plan-4", planName: "Transport Allowance", employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", startDate: "2025-01-01", endDate: "2025-12-31", dependentsCovered: 0, status: "expired", enrolledAt: "2024-12-20" },
  { id: "enr-8", planId: "plan-2", planName: "Group Life Insurance", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", startDate: "2024-09-01", endDate: null, dependentsCovered: 0, status: "active", enrolledAt: "2024-08-28" },
];

// Helper
export function formatBenefitCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
