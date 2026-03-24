export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type LeaveType = "annual" | "sick" | "casual" | "maternity" | "paternity" | "compassionate";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
  appliedOn: string;
  approvedBy: string | null;
}

export const LEAVE_STATUS_STYLES: Record<
  LeaveStatus,
  { label: string; bg: string; color: string }
> = {
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  approved: { label: "Approved", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  rejected: { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  cancelled: { label: "Cancelled", bg: "bg-gray-50 border-gray-200", color: "text-gray-600" },
};

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  casual: "Casual Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
  compassionate: "Compassionate Leave",
};

export const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  annual: "bg-blue-100 text-blue-700",
  sick: "bg-red-100 text-red-700",
  casual: "bg-violet-100 text-violet-700",
  maternity: "bg-pink-100 text-pink-700",
  paternity: "bg-cyan-100 text-cyan-700",
  compassionate: "bg-amber-100 text-amber-700",
};

export const LEAVE_POLICY_SUMMARY = {
  annual: { total: 20, label: "Annual Leave" },
  sick: { total: 10, label: "Sick Leave" },
  casual: { total: 5, label: "Casual Leave" },
  maternity: { total: 90, label: "Maternity Leave" },
  paternity: { total: 10, label: "Paternity Leave" },
  compassionate: { total: 5, label: "Compassionate Leave" },
};

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "lv-001", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", leaveType: "annual", startDate: "2026-03-20", endDate: "2026-03-22", days: 2, status: "pending", reason: "Family vacation", appliedOn: "2026-03-10", approvedBy: null },
  { id: "lv-002", employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", leaveType: "sick", startDate: "2026-03-17", endDate: "2026-03-18", days: 2, status: "pending", reason: "Medical appointment and recovery", appliedOn: "2026-03-15", approvedBy: null },
  { id: "lv-003", employeeId: "emp-009", employeeName: "Ibrahim Musa", department: "Operations", leaveType: "annual", startDate: "2026-03-24", endDate: "2026-03-28", days: 5, status: "approved", reason: "Travelling for a family event", appliedOn: "2026-03-05", approvedBy: "Olufunke Adeyemi" },
  { id: "lv-004", employeeId: "emp-013", employeeName: "Kemi Adekunle", department: "Human Resources", leaveType: "maternity", startDate: "2026-03-15", endDate: "2026-06-12", days: 90, status: "approved", reason: "Maternity leave", appliedOn: "2026-02-28", approvedBy: "Fatima Abdullahi" },
  { id: "lv-005", employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", leaveType: "casual", startDate: "2026-03-24", endDate: "2026-03-24", days: 1, status: "pending", reason: "Personal errand", appliedOn: "2026-03-21", approvedBy: null },
  { id: "lv-006", employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", leaveType: "annual", startDate: "2026-04-01", endDate: "2026-04-05", days: 5, status: "pending", reason: "Holiday trip", appliedOn: "2026-03-18", approvedBy: null },
  { id: "lv-007", employeeId: "emp-012", employeeName: "Ngozi Ibe", department: "Sales", leaveType: "sick", startDate: "2026-03-10", endDate: "2026-03-11", days: 2, status: "approved", reason: "Flu and fever", appliedOn: "2026-03-10", approvedBy: "Olufunke Adeyemi" },
  { id: "lv-008", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", leaveType: "compassionate", startDate: "2026-02-20", endDate: "2026-02-22", days: 3, status: "approved", reason: "Family bereavement", appliedOn: "2026-02-19", approvedBy: "Olufunke Adeyemi" },
  { id: "lv-009", employeeId: "emp-007", employeeName: "Tochukwu Nwankwo", department: "Engineering", leaveType: "annual", startDate: "2026-03-05", endDate: "2026-03-07", days: 3, status: "rejected", reason: "Personal time off", appliedOn: "2026-02-25", approvedBy: null },
  { id: "lv-010", employeeId: "emp-016", employeeName: "Amara Obi", department: "Marketing", leaveType: "casual", startDate: "2026-03-28", endDate: "2026-03-28", days: 1, status: "pending", reason: "Attending a workshop", appliedOn: "2026-03-22", approvedBy: null },
  { id: "lv-011", employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", leaveType: "annual", startDate: "2026-04-10", endDate: "2026-04-14", days: 5, status: "pending", reason: "Annual vacation", appliedOn: "2026-03-20", approvedBy: null },
  { id: "lv-012", employeeId: "emp-018", employeeName: "Halima Yusuf", department: "Legal", leaveType: "sick", startDate: "2026-03-01", endDate: "2026-03-02", days: 2, status: "approved", reason: "Dental procedure", appliedOn: "2026-02-28", approvedBy: "Yetunde Bakare" },
];
