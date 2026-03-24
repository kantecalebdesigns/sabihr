export type AttendanceStatus = "present" | "late" | "absent" | "on-leave" | "half-day";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: AttendanceStatus;
  hoursWorked: number | null;
  location: string;
}

export const ATTENDANCE_STATUS_STYLES: Record<
  AttendanceStatus,
  { label: string; bg: string; color: string }
> = {
  present: { label: "Present", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  late: { label: "Late", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  absent: { label: "Absent", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  "on-leave": { label: "On Leave", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  "half-day": { label: "Half Day", bg: "bg-violet-50 border-violet-200", color: "text-violet-700" },
};

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { id: "att-001", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", date: "2026-03-24", clockIn: "08:45", clockOut: "17:10", status: "present", hoursWorked: 8.4, location: "Lagos Office" },
  { id: "att-002", employeeId: "emp-002", employeeName: "Chiamaka Eze", department: "Engineering", date: "2026-03-24", clockIn: "08:30", clockOut: "17:30", status: "present", hoursWorked: 9.0, location: "Lagos Office" },
  { id: "att-003", employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", date: "2026-03-24", clockIn: "09:22", clockOut: "17:00", status: "late", hoursWorked: 7.6, location: "Lagos Office" },
  { id: "att-004", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", date: "2026-03-24", clockIn: "08:50", clockOut: "17:05", status: "present", hoursWorked: 8.2, location: "Abuja Office" },
  { id: "att-005", employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", date: "2026-03-24", clockIn: null, clockOut: null, status: "absent", hoursWorked: null, location: "Lagos Office" },
  { id: "att-006", employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", date: "2026-03-24", clockIn: "08:40", clockOut: "17:15", status: "present", hoursWorked: 8.6, location: "Abuja Office" },
  { id: "att-007", employeeId: "emp-007", employeeName: "Tochukwu Nwankwo", department: "Engineering", date: "2026-03-24", clockIn: "09:10", clockOut: "17:30", status: "late", hoursWorked: 8.3, location: "Lagos Office" },
  { id: "att-008", employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", date: "2026-03-24", clockIn: "08:55", clockOut: "17:00", status: "present", hoursWorked: 8.1, location: "Lagos Office" },
  { id: "att-009", employeeId: "emp-009", employeeName: "Ibrahim Musa", department: "Operations", date: "2026-03-24", clockIn: null, clockOut: null, status: "on-leave", hoursWorked: null, location: "Kano Office" },
  { id: "att-010", employeeId: "emp-010", employeeName: "Yetunde Bakare", department: "Legal", date: "2026-03-24", clockIn: "08:35", clockOut: "17:00", status: "present", hoursWorked: 8.4, location: "Lagos Office" },
  { id: "att-011", employeeId: "emp-011", employeeName: "Chibueze Okoro", department: "Finance", date: "2026-03-24", clockIn: "08:28", clockOut: "17:20", status: "present", hoursWorked: 8.9, location: "Lagos Office" },
  { id: "att-012", employeeId: "emp-012", employeeName: "Ngozi Ibe", department: "Sales", date: "2026-03-24", clockIn: "08:50", clockOut: "13:00", status: "half-day", hoursWorked: 4.2, location: "Lagos Office" },
  { id: "att-013", employeeId: "emp-013", employeeName: "Kemi Adekunle", department: "Human Resources", date: "2026-03-24", clockIn: null, clockOut: null, status: "on-leave", hoursWorked: null, location: "Lagos Office" },
  { id: "att-014", employeeId: "emp-014", employeeName: "Damilola Osei", department: "Engineering", date: "2026-03-24", clockIn: "08:42", clockOut: "17:05", status: "present", hoursWorked: 8.4, location: "Lagos Office" },
  { id: "att-015", employeeId: "emp-015", employeeName: "Usman Bello", department: "IT", date: "2026-03-24", clockIn: "08:30", clockOut: "17:00", status: "present", hoursWorked: 8.5, location: "Abuja Office" },
  { id: "att-016", employeeId: "emp-016", employeeName: "Amara Obi", department: "Marketing", date: "2026-03-24", clockIn: "09:05", clockOut: "17:10", status: "late", hoursWorked: 8.1, location: "Lagos Office" },
  { id: "att-017", employeeId: "emp-017", employeeName: "Olumide Fashola", department: "Sales", date: "2026-03-24", clockIn: null, clockOut: null, status: "absent", hoursWorked: null, location: "Lagos Office" },
  { id: "att-018", employeeId: "emp-018", employeeName: "Halima Yusuf", department: "Legal", date: "2026-03-24", clockIn: "08:48", clockOut: "17:00", status: "present", hoursWorked: 8.2, location: "Abuja Office" },
  { id: "att-019", employeeId: "emp-019", employeeName: "Segun Adeniyi", department: "Operations", date: "2026-03-24", clockIn: "08:55", clockOut: "17:15", status: "present", hoursWorked: 8.3, location: "Lagos Office" },
  { id: "att-020", employeeId: "emp-020", employeeName: "Folake Williams", department: "Finance", date: "2026-03-24", clockIn: "08:38", clockOut: "17:00", status: "present", hoursWorked: 8.4, location: "Lagos Office" },
];
