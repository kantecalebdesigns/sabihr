export type RequisitionType = "expense" | "service" | "procurement";
export type RequisitionStatus = "pending" | "approved" | "rejected" | "recalled";

export interface Requisition {
  id: string;
  type: RequisitionType;
  category: string;
  description: string;
  amount: number;
  employeeId: string;
  employeeName: string;
  department: string;
  requestDate: string;
  status: RequisitionStatus;
  approver: string;
  approvedDate: string | null;
  notes: string;
}

export const REQ_TYPE_STYLES: Record<RequisitionType, { label: string; color: string }> = {
  expense: { label: "Expense", color: "text-blue-700" },
  service: { label: "Service", color: "text-violet-700" },
  procurement: { label: "Procurement", color: "text-emerald-700" },
};

export const REQ_STATUS_STYLES: Record<RequisitionStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-amber-700" },
  approved: { label: "Approved", color: "text-emerald-700" },
  rejected: { label: "Rejected", color: "text-red-700" },
  recalled: { label: "Recalled", color: "text-gray-500" },
};

export function formatReqCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export const MOCK_REQUISITIONS: Requisition[] = [
  { id: "req-1", type: "expense", category: "Travel", description: "Flight to Abuja for client meeting", amount: 85000, employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", requestDate: "2026-04-02", status: "pending", approver: "Ngozi Ibe", approvedDate: null, notes: "" },
  { id: "req-2", type: "expense", category: "Meals", description: "Team dinner for project milestone", amount: 45000, employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", requestDate: "2026-04-01", status: "approved", approver: "CEO", approvedDate: "2026-04-02", notes: "" },
  { id: "req-3", type: "procurement", category: "Equipment", description: "2x external monitors for new hires", amount: 180000, employeeId: "emp-015", employeeName: "Usman Bello", department: "IT", requestDate: "2026-03-28", status: "approved", approver: "Ibrahim Musa", approvedDate: "2026-03-30", notes: "" },
  { id: "req-4", type: "service", category: "Consulting", description: "Legal review of vendor contracts", amount: 350000, employeeId: "emp-010", employeeName: "Yetunde Bakare", department: "Legal", requestDate: "2026-03-25", status: "approved", approver: "CEO", approvedDate: "2026-03-27", notes: "" },
  { id: "req-5", type: "expense", category: "Training", description: "AWS certification exam fee", amount: 75000, employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", requestDate: "2026-03-22", status: "approved", approver: "Chiamaka Eze", approvedDate: "2026-03-23", notes: "" },
  { id: "req-6", type: "expense", category: "Office Supplies", description: "Stationery and printer cartridges", amount: 25000, employeeId: "emp-009", employeeName: "Ibrahim Musa", department: "Operations", requestDate: "2026-03-20", status: "approved", approver: "CEO", approvedDate: "2026-03-21", notes: "" },
  { id: "req-7", type: "procurement", category: "Software", description: "Annual Figma team license renewal", amount: 420000, employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", requestDate: "2026-03-18", status: "pending", approver: "Chiamaka Eze", approvedDate: null, notes: "" },
  { id: "req-8", type: "expense", category: "Travel", description: "Accommodation for Kano branch visit", amount: 120000, employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", requestDate: "2026-03-15", status: "rejected", approver: "CEO", approvedDate: null, notes: "Budget exceeded for Q1 travel" },
  { id: "req-9", type: "service", category: "Maintenance", description: "Office AC repair and servicing", amount: 95000, employeeId: "emp-009", employeeName: "Ibrahim Musa", department: "Operations", requestDate: "2026-03-12", status: "approved", approver: "CEO", approvedDate: "2026-03-13", notes: "" },
  { id: "req-10", type: "expense", category: "Meals", description: "Client lunch meeting at Eko Hotels", amount: 35000, employeeId: "emp-012", employeeName: "Ngozi Ibe", department: "Sales", requestDate: "2026-03-10", status: "approved", approver: "CEO", approvedDate: "2026-03-11", notes: "" },
  { id: "req-11", type: "procurement", category: "Furniture", description: "Ergonomic chairs for engineering team", amount: 500000, employeeId: "emp-002", employeeName: "Chiamaka Eze", department: "Engineering", requestDate: "2026-03-08", status: "pending", approver: "CEO", approvedDate: null, notes: "" },
  { id: "req-12", type: "service", category: "Recruitment", description: "Job board posting for 3 positions", amount: 150000, employeeId: "emp-013", employeeName: "Kemi Adekunle", department: "Human Resources", requestDate: "2026-03-05", status: "rejected", approver: "Fatima Abdullahi", approvedDate: null, notes: "Use internal referrals first" },
  { id: "req-13", type: "expense", category: "Transport", description: "Fuel reimbursement for site visits", amount: 15000, employeeId: "emp-019", employeeName: "Segun Adeniyi", department: "Operations", requestDate: "2026-03-03", status: "recalled", approver: "Ibrahim Musa", approvedDate: null, notes: "Duplicate request" },
  { id: "req-14", type: "service", category: "Marketing", description: "Social media ad campaign management", amount: 280000, employeeId: "emp-016", employeeName: "Amara Obi", department: "Marketing", requestDate: "2026-03-01", status: "rejected", approver: "Bukola Adeyemi", approvedDate: null, notes: "Agency contract already covers this" },
  { id: "req-15", type: "expense", category: "Training", description: "Conference registration for DevFest", amount: 5000, employeeId: "emp-007", employeeName: "Tochukwu Nwankwo", department: "Engineering", requestDate: "2026-02-28", status: "approved", approver: "Chiamaka Eze", approvedDate: "2026-03-01", notes: "" },
];
