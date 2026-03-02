import type { CompanyInfoData, AdminUserData, PlanSelectionData } from "@/types/auth";
import type { DepartmentsData, WorkScheduleData, InviteEmployeesData, PayrollSetupData } from "@/types/onboarding";

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateCompanyInfo(data: CompanyInfoData): ValidationErrors<CompanyInfoData> {
  const errors: ValidationErrors<CompanyInfoData> = {};

  if (!data.companyName.trim()) errors.companyName = "Company name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^(\+234|0)[789]\d{9}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a valid Nigerian phone number";
  }
  if (!data.state) errors.state = "State is required";
  if (!data.industry) errors.industry = "Industry is required";

  return errors;
}

export function validateAdminUser(data: AdminUserData): ValidationErrors<AdminUserData> {
  const errors: ValidationErrors<AdminUserData> = {};

  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^(\+234|0)[789]\d{9}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a valid Nigerian phone number";
  }
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(data.password)) {
    errors.password = "Must include uppercase, lowercase, number, and special character";
  }
  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validatePlanSelection(data: PlanSelectionData): ValidationErrors<PlanSelectionData> {
  const errors: ValidationErrors<PlanSelectionData> = {};
  if (!data.planId) errors.planId = "Please select a plan";
  return errors;
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

export function validateDepartments(data: DepartmentsData): ValidationErrors<DepartmentsData> {
  const errors: ValidationErrors<DepartmentsData> = {};
  if (data.departments.length === 0) {
    errors.departments = "Add at least one department";
    return errors;
  }
  const hasEmptyName = data.departments.some((d) => !d.name.trim());
  if (hasEmptyName) {
    errors.departments = "All departments must have a name";
    return errors;
  }
  const names = data.departments.map((d) => d.name.trim().toLowerCase());
  if (new Set(names).size !== names.length) {
    errors.departments = "Department names must be unique";
  }
  return errors;
}

export function validateWorkSchedule(data: WorkScheduleData): ValidationErrors<WorkScheduleData> {
  const errors: ValidationErrors<WorkScheduleData> = {};
  if (data.workDays.length === 0) {
    errors.workDays = "Select at least one work day";
  }
  if (!data.startTime) {
    errors.startTime = "Start time is required";
  }
  if (!data.endTime) {
    errors.endTime = "End time is required";
  }
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    errors.endTime = "End time must be after start time";
  }
  if (data.leaveTypes.length === 0) {
    errors.leaveTypes = "Add at least one leave type";
  }
  return errors;
}

export function validateInviteEmployees(data: InviteEmployeesData): ValidationErrors<InviteEmployeesData> {
  const errors: ValidationErrors<InviteEmployeesData> = {};
  if (data.invites.length === 0) return errors;
  const emptyEmails = data.invites.filter((inv) => !inv.email.trim());
  if (emptyEmails.length > 0) {
    errors.invites = "All invite rows must have an email address";
    return errors;
  }
  const invalidEmails = data.invites.filter(
    (inv) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inv.email)
  );
  if (invalidEmails.length > 0) {
    errors.invites = "One or more email addresses are invalid";
  }
  return errors;
}

export function validatePayrollSetup(data: PayrollSetupData): ValidationErrors<PayrollSetupData> {
  const errors: ValidationErrors<PayrollSetupData> = {};
  if (!data.paySchedule) {
    errors.paySchedule = "Select a pay schedule";
  }
  if (!data.paymentMethod) {
    errors.paymentMethod = "Select a payment method";
  }
  if (data.pensionEnabled) {
    if (data.employerPensionPercent <= 0 || data.employerPensionPercent > 100) {
      errors.employerPensionPercent = "Enter a valid percentage (1-100)";
    }
    if (data.employeePensionPercent <= 0 || data.employeePensionPercent > 100) {
      errors.employeePensionPercent = "Enter a valid percentage (1-100)";
    }
  }
  return errors;
}
