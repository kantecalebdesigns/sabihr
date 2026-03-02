import type { BillingCycle, SubscriptionPlan } from "@/types/auth";
import type { DayOfWeek, PaySchedule, PaymentMethod } from "@/types/onboarding";

export const BILLING_CYCLES: { value: BillingCycle; label: string; months: number; discount: number }[] = [
  { value: "quarterly", label: "Quarterly", months: 3, discount: 0 },
  { value: "bi-annually", label: "Bi-Annually", months: 6, discount: 10 },
  { value: "annually", label: "Annually", months: 12, discount: 20 },
];

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

export const INDUSTRIES = [
  "Agriculture",
  "Banking & Finance",
  "Construction",
  "Consulting",
  "Education",
  "Energy & Oil/Gas",
  "Healthcare",
  "Hospitality",
  "Information Technology",
  "Legal Services",
  "Logistics & Transportation",
  "Manufacturing",
  "Media & Entertainment",
  "Non-Profit",
  "Real Estate",
  "Retail & E-Commerce",
  "Telecommunications",
  "Other",
] as const;

export const EMPLOYEE_COUNT_RANGES = [
  "1 - 10",
  "11 - 50",
  "51 - 100",
  "101 - 250",
  "251 - 500",
  "501 - 1000",
  "1000+",
] as const;

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 2500,
    description: "For small teams getting started with HR management",
    features: [
      "Up to 25 employees",
      "Employee records management",
      "Leave management",
      "Basic attendance tracking",
      "Employee self-service portal",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 4500,
    description: "For growing businesses that need full HR capabilities",
    features: [
      "Up to 250 employees",
      "Everything in Starter",
      "Payroll processing with PAYE",
      "Performance management",
      "Document management",
      "Onboarding workflows",
      "Multi-branch support",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 7500,
    description: "For large organizations with complex HR needs",
    features: [
      "Unlimited employees",
      "Everything in Professional",
      "Multi-subsidiary support",
      "Custom approval workflows",
      "Advanced analytics & reports",
      "Biometric integration",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
  },
];

// --- Onboarding constants ---

export const PRESET_DEPARTMENTS = [
  "Engineering",
  "Finance",
  "Human Resources",
  "Marketing",
  "Operations",
  "Sales",
  "Legal",
  "Information Technology",
] as const;

export const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
  { value: "Sat", label: "Saturday" },
  { value: "Sun", label: "Sunday" },
];

export const DEFAULT_LEAVE_TYPES: { name: string; annualAllowance: number }[] = [
  { name: "Annual Leave", annualAllowance: 15 },
  { name: "Sick Leave", annualAllowance: 10 },
  { name: "Casual Leave", annualAllowance: 5 },
  { name: "Maternity Leave", annualAllowance: 90 },
  { name: "Paternity Leave", annualAllowance: 10 },
  { name: "Compassionate Leave", annualAllowance: 5 },
];

export const PAY_SCHEDULES: { value: PaySchedule; label: string; description: string }[] = [
  { value: "monthly", label: "Monthly", description: "Paid once per month" },
  { value: "bi-weekly", label: "Bi-weekly", description: "Paid every two weeks" },
  { value: "weekly", label: "Weekly", description: "Paid every week" },
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
];

export const EMPLOYEE_ROLES = [
  "Employee",
  "Manager",
  "HR Admin",
  "Department Head",
] as const;
