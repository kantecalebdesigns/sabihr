export interface CompanyInfoData {
  companyName: string;
  rcNumber: string;
  tinNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  industry: string;
  employeeCount: string;
  logo: File | null;
  logoPreview: string;
}

export interface AdminUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type BillingCycle = "quarterly" | "bi-annually" | "annually";

export interface PlanSelectionData {
  planId: string;
  billingCycle: BillingCycle;
}

export interface RegistrationData {
  company: CompanyInfoData;
  admin: AdminUserData;
  plan: PlanSelectionData;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export type RegistrationStep = 1 | 2 | 3 | 4;
