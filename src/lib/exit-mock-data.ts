export type ExitType = "resignation" | "termination" | "retirement" | "redundancy" | "end-of-contract";
export type ExitStage = "pending-approval" | "notice-period" | "clearance" | "final-settlement" | "completed";
export type ClearanceStatus = "pending" | "completed" | "not-applicable";

export interface ClearanceItem {
  id: string;
  activity: string;
  assignee: string;
  status: ClearanceStatus;
  completedDate: string | null;
}

export interface ExitRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  jobTitle: string;
  exitType: ExitType;
  reason: string;
  requestedLastDay: string;
  stage: ExitStage;
  initiatedDate: string;
  initiatedBy: string;
  clearanceItems: ClearanceItem[];
  unpaidSalary: number;
  leaveEncashment: number;
  gratuity: number;
  deductions: number;
  netSettlement: number;
  surveyCompleted: boolean;
}

export const EXIT_TYPE_STYLES: Record<ExitType, { label: string; color: string }> = {
  resignation: { label: "Resignation", color: "text-blue-700" },
  termination: { label: "Termination", color: "text-red-700" },
  retirement: { label: "Retirement", color: "text-violet-700" },
  redundancy: { label: "Redundancy", color: "text-amber-700" },
  "end-of-contract": { label: "End of Contract", color: "text-gray-600" },
};

export const EXIT_STAGE_STYLES: Record<ExitStage, { label: string; color: string }> = {
  "pending-approval": { label: "Pending Approval", color: "text-amber-700" },
  "notice-period": { label: "Notice Period", color: "text-blue-700" },
  "clearance": { label: "Clearance", color: "text-violet-700" },
  "final-settlement": { label: "Final Settlement", color: "text-orange-700" },
  "completed": { label: "Completed", color: "text-emerald-700" },
};

export const EXIT_STAGES_ORDER: ExitStage[] = ["pending-approval", "notice-period", "clearance", "final-settlement", "completed"];

export function formatExitCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export const MOCK_EXITS: ExitRecord[] = [
  {
    id: "exit-1", employeeId: "emp-017", employeeName: "Olumide Fashola", department: "Sales", jobTitle: "Account Executive", exitType: "termination", reason: "Repeated policy violations and insubordination", requestedLastDay: "2026-04-15", stage: "clearance", initiatedDate: "2026-03-20", initiatedBy: "Ngozi Ibe",
    clearanceItems: [
      { id: "cl-1", activity: "Exit Survey", assignee: "HR", status: "completed", completedDate: "2026-03-25" },
      { id: "cl-2", activity: "Department Clearance", assignee: "Ngozi Ibe", status: "completed", completedDate: "2026-03-28" },
      { id: "cl-3", activity: "IT Clearance", assignee: "Usman Bello", status: "pending", completedDate: null },
      { id: "cl-4", activity: "Asset Return", assignee: "Operations", status: "pending", completedDate: null },
      { id: "cl-5", activity: "Knowledge Handover", assignee: "Sales Team", status: "completed", completedDate: "2026-04-01" },
      { id: "cl-6", activity: "Final Settlement", assignee: "Finance", status: "pending", completedDate: null },
    ],
    unpaidSalary: 450000, leaveEncashment: 120000, gratuity: 0, deductions: 175000, netSettlement: 395000, surveyCompleted: true,
  },
  {
    id: "exit-2", employeeId: "emp-019", employeeName: "Segun Adeniyi", department: "Operations", jobTitle: "Operations Analyst", exitType: "resignation", reason: "Pursuing further education abroad", requestedLastDay: "2026-05-01", stage: "notice-period", initiatedDate: "2026-03-28", initiatedBy: "Segun Adeniyi",
    clearanceItems: [
      { id: "cl-7", activity: "Exit Survey", assignee: "HR", status: "pending", completedDate: null },
      { id: "cl-8", activity: "Department Clearance", assignee: "Ibrahim Musa", status: "pending", completedDate: null },
      { id: "cl-9", activity: "IT Clearance", assignee: "Usman Bello", status: "pending", completedDate: null },
      { id: "cl-10", activity: "Asset Return", assignee: "Operations", status: "pending", completedDate: null },
      { id: "cl-11", activity: "Knowledge Handover", assignee: "Operations Team", status: "pending", completedDate: null },
      { id: "cl-12", activity: "Final Settlement", assignee: "Finance", status: "pending", completedDate: null },
    ],
    unpaidSalary: 200000, leaveEncashment: 85000, gratuity: 150000, deductions: 100000, netSettlement: 335000, surveyCompleted: false,
  },
  {
    id: "exit-3", employeeId: "emp-020", employeeName: "Folake Williams", department: "Finance", jobTitle: "Payroll Specialist", exitType: "resignation", reason: "Relocating to another city", requestedLastDay: "2026-04-30", stage: "pending-approval", initiatedDate: "2026-04-03", initiatedBy: "Folake Williams",
    clearanceItems: [],
    unpaidSalary: 550000, leaveEncashment: 200000, gratuity: 180000, deductions: 50000, netSettlement: 880000, surveyCompleted: false,
  },
  {
    id: "exit-4", employeeId: "emp-018", employeeName: "Halima Yusuf", department: "Legal", jobTitle: "Compliance Officer", exitType: "end-of-contract", reason: "Contract period ended", requestedLastDay: "2026-03-31", stage: "completed", initiatedDate: "2026-03-01", initiatedBy: "Yetunde Bakare",
    clearanceItems: [
      { id: "cl-13", activity: "Exit Survey", assignee: "HR", status: "completed", completedDate: "2026-03-20" },
      { id: "cl-14", activity: "Department Clearance", assignee: "Yetunde Bakare", status: "completed", completedDate: "2026-03-22" },
      { id: "cl-15", activity: "IT Clearance", assignee: "Usman Bello", status: "completed", completedDate: "2026-03-24" },
      { id: "cl-16", activity: "Asset Return", assignee: "Operations", status: "completed", completedDate: "2026-03-25" },
      { id: "cl-17", activity: "Knowledge Handover", assignee: "Legal Team", status: "completed", completedDate: "2026-03-26" },
      { id: "cl-18", activity: "Final Settlement", assignee: "Finance", status: "completed", completedDate: "2026-03-28" },
    ],
    unpaidSalary: 550000, leaveEncashment: 150000, gratuity: 0, deductions: 62000, netSettlement: 638000, surveyCompleted: true,
  },
  {
    id: "exit-5", employeeId: "emp-013", employeeName: "Kemi Adekunle", department: "Human Resources", jobTitle: "Recruitment Specialist", exitType: "resignation", reason: "Career change to consulting", requestedLastDay: "2026-05-15", stage: "clearance", initiatedDate: "2026-03-15", initiatedBy: "Kemi Adekunle",
    clearanceItems: [
      { id: "cl-19", activity: "Exit Survey", assignee: "HR", status: "completed", completedDate: "2026-04-01" },
      { id: "cl-20", activity: "Department Clearance", assignee: "Fatima Abdullahi", status: "completed", completedDate: "2026-04-03" },
      { id: "cl-21", activity: "IT Clearance", assignee: "Usman Bello", status: "completed", completedDate: "2026-04-04" },
      { id: "cl-22", activity: "Asset Return", assignee: "Operations", status: "pending", completedDate: null },
      { id: "cl-23", activity: "Knowledge Handover", assignee: "HR Team", status: "pending", completedDate: null },
      { id: "cl-24", activity: "Final Settlement", assignee: "Finance", status: "pending", completedDate: null },
    ],
    unpaidSalary: 260000, leaveEncashment: 95000, gratuity: 120000, deductions: 45000, netSettlement: 430000, surveyCompleted: true,
  },
  {
    id: "exit-6", employeeId: "emp-011", employeeName: "Chibueze Okoro", department: "Finance", jobTitle: "Finance Director", exitType: "retirement", reason: "Retirement after 15 years of service", requestedLastDay: "2026-06-30", stage: "completed", initiatedDate: "2026-01-15", initiatedBy: "Chibueze Okoro",
    clearanceItems: [
      { id: "cl-25", activity: "Exit Survey", assignee: "HR", status: "completed", completedDate: "2026-06-10" },
      { id: "cl-26", activity: "Department Clearance", assignee: "CEO", status: "completed", completedDate: "2026-06-15" },
      { id: "cl-27", activity: "IT Clearance", assignee: "Usman Bello", status: "completed", completedDate: "2026-06-18" },
      { id: "cl-28", activity: "Asset Return", assignee: "Operations", status: "completed", completedDate: "2026-06-20" },
      { id: "cl-29", activity: "Knowledge Handover", assignee: "Finance Team", status: "completed", completedDate: "2026-06-22" },
      { id: "cl-30", activity: "Final Settlement", assignee: "Finance", status: "completed", completedDate: "2026-06-25" },
    ],
    unpaidSalary: 1100000, leaveEncashment: 450000, gratuity: 550000, deductions: 0, netSettlement: 2100000, surveyCompleted: true,
  },
];
