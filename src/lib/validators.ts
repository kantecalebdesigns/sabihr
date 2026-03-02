import type { CompanyInfoData, AdminUserData, PlanSelectionData } from "@/types/auth";
import type { DepartmentsData, WorkScheduleData, InviteEmployeesData, PayrollSetupData } from "@/types/onboarding";

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateCompanyInfo(_data: CompanyInfoData): ValidationErrors<CompanyInfoData> {
  return {};
}

export function validateAdminUser(_data: AdminUserData): ValidationErrors<AdminUserData> {
  return {};
}

export function validatePlanSelection(_data: PlanSelectionData): ValidationErrors<PlanSelectionData> {
  return {};
}

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-destructive" };
  if (score <= 2) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 3) return { score, label: "Good", color: "bg-chart-2" };
  return { score, label: "Strong", color: "bg-success" };
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}

// --- Onboarding validators ---

export function validateDepartments(_data: DepartmentsData): ValidationErrors<DepartmentsData> {
  return {};
}

export function validateWorkSchedule(_data: WorkScheduleData): ValidationErrors<WorkScheduleData> {
  return {};
}

export function validateInviteEmployees(_data: InviteEmployeesData): ValidationErrors<InviteEmployeesData> {
  return {};
}

export function validatePayrollSetup(_data: PayrollSetupData): ValidationErrors<PayrollSetupData> {
  return {};
}
