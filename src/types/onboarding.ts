export type OnboardingStep = 1 | 2 | 3 | 4;

// --- Step 1: Departments ---
export interface Department {
  id: string;
  name: string;
  head: string;
  description: string;
}

export interface DepartmentsData {
  departments: Department[];
}

// --- Step 2: Work Schedule & Leave ---
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface LeaveType {
  id: string;
  name: string;
  annualAllowance: number;
}

export interface WorkScheduleData {
  workDays: DayOfWeek[];
  startTime: string;
  endTime: string;
  leaveTypes: LeaveType[];
}

// --- Step 3: Invite Employees ---
export interface EmployeeInvite {
  id: string;
  email: string;
  department: string;
  role: string;
}

export interface InviteEmployeesData {
  invites: EmployeeInvite[];
}

// --- Step 4: Payroll Setup ---
export type PaySchedule = "monthly" | "bi-weekly" | "weekly";
export type PaymentMethod = "bank-transfer" | "cash";

export interface PayrollSetupData {
  paySchedule: PaySchedule;
  paymentMethod: PaymentMethod;
  pensionEnabled: boolean;
  employerPensionPercent: number;
  employeePensionPercent: number;
  payeEnabled: boolean;
}
