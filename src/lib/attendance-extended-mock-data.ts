// Extended attendance, shift, overtime, biometric, geofence mock data

// ── Biometric Devices ──
export interface BiometricDevice {
  id: string;
  name: string;
  type: "fingerprint" | "facial" | "iris" | "card";
  location: string;
  ipAddress: string;
  status: "online" | "offline" | "maintenance";
  lastSync: string;
  employeesEnrolled: number;
  firmware: string;
}

export const MOCK_BIOMETRIC_DEVICES: BiometricDevice[] = [
  { id: "bd-1", name: "Main Entrance FP-100", type: "fingerprint", location: "Lagos Office - Main Gate", ipAddress: "192.168.1.101", status: "online", lastSync: "2026-04-09T08:45:00", employeesEnrolled: 142, firmware: "v3.2.1" },
  { id: "bd-2", name: "Lobby Face-ID", type: "facial", location: "Lagos Office - Lobby", ipAddress: "192.168.1.102", status: "online", lastSync: "2026-04-09T08:42:00", employeesEnrolled: 142, firmware: "v2.1.0" },
  { id: "bd-3", name: "Abuja FP-200", type: "fingerprint", location: "Abuja Office - Entrance", ipAddress: "10.0.1.50", status: "online", lastSync: "2026-04-09T08:30:00", employeesEnrolled: 38, firmware: "v3.2.1" },
  { id: "bd-4", name: "Server Room Iris", type: "iris", location: "Lagos Office - Server Room", ipAddress: "192.168.1.103", status: "maintenance", lastSync: "2026-04-08T17:00:00", employeesEnrolled: 12, firmware: "v1.5.0" },
  { id: "bd-5", name: "Parking Gate Card", type: "card", location: "Lagos Office - Parking", ipAddress: "192.168.1.104", status: "offline", lastSync: "2026-04-07T23:00:00", employeesEnrolled: 85, firmware: "v2.0.3" },
];

export const DEVICE_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  online: { label: "Online", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  offline: { label: "Offline", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  maintenance: { label: "Maintenance", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
};

// ── Geofence Zones ──
export interface GeofenceZone {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isActive: boolean;
  employeesAssigned: number;
}

export const MOCK_GEOFENCE_ZONES: GeofenceZone[] = [
  { id: "gf-1", name: "Lagos Head Office", address: "12 Victoria Island Blvd, Lagos", latitude: 6.4281, longitude: 3.4219, radiusMeters: 200, isActive: true, employeesAssigned: 120 },
  { id: "gf-2", name: "Abuja Branch", address: "5 Wuse Zone 4, Abuja", latitude: 9.0765, longitude: 7.4986, radiusMeters: 150, isActive: true, employeesAssigned: 38 },
  { id: "gf-3", name: "Kano Office", address: "22 Bompai Road, Kano", latitude: 12.0022, longitude: 8.5920, radiusMeters: 100, isActive: false, employeesAssigned: 14 },
  { id: "gf-4", name: "Client Site — GTBank HQ", address: "GTBank Plaza, Victoria Island", latitude: 6.4312, longitude: 3.4156, radiusMeters: 300, isActive: true, employeesAssigned: 8 },
];

// ── Attendance Corrections ──
export interface AttendanceCorrectionRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  originalClockIn: string | null;
  originalClockOut: string | null;
  requestedClockIn: string;
  requestedClockOut: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export const MOCK_CORRECTION_REQUESTS: AttendanceCorrectionRequest[] = [
  { id: "cr-1", employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", date: "2026-04-07", originalClockIn: "09:22", originalClockOut: null, requestedClockIn: "08:55", requestedClockOut: "17:30", reason: "Device malfunction — badge didn't register on entry", status: "pending", submittedAt: "2026-04-08T09:00:00", reviewedBy: null, reviewedAt: null },
  { id: "cr-2", employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", date: "2026-04-07", originalClockIn: "08:55", originalClockOut: null, requestedClockIn: "08:55", requestedClockOut: "17:00", reason: "Forgot to clock out at end of day", status: "pending", submittedAt: "2026-04-08T08:30:00", reviewedBy: null, reviewedAt: null },
  { id: "cr-3", employeeId: "emp-016", employeeName: "Amara Obi", department: "Marketing", date: "2026-04-04", originalClockIn: "09:05", originalClockOut: "17:10", requestedClockIn: "08:45", requestedClockOut: "17:10", reason: "Was in the building but used side entrance without device", status: "approved", submittedAt: "2026-04-05T10:00:00", reviewedBy: "Fatima Abdullahi", reviewedAt: "2026-04-05T14:00:00" },
  { id: "cr-4", employeeId: "emp-007", employeeName: "Tochukwu Nwankwo", department: "Engineering", date: "2026-04-03", originalClockIn: null, originalClockOut: null, requestedClockIn: "08:30", requestedClockOut: "17:00", reason: "Worked from client site, no device access", status: "rejected", submittedAt: "2026-04-04T09:00:00", reviewedBy: "Fatima Abdullahi", reviewedAt: "2026-04-04T16:00:00" },
  { id: "cr-5", employeeId: "emp-014", employeeName: "Damilola Osei", department: "Engineering", date: "2026-04-08", originalClockIn: "08:42", originalClockOut: "13:00", requestedClockIn: "08:42", requestedClockOut: "17:05", reason: "System logged early clock-out due to power outage", status: "pending", submittedAt: "2026-04-09T08:00:00", reviewedBy: null, reviewedAt: null },
];

export const CORRECTION_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  approved: { label: "Approved", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  rejected: { label: "Rejected", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

// ── Shifts ──
export interface ShiftDefinition {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  color: string;
  allowance: number;
  isNight: boolean;
  status: "active" | "draft";
}

export const MOCK_SHIFTS: ShiftDefinition[] = [
  { id: "sh-1", name: "Morning Shift", code: "MS", startTime: "06:00", endTime: "14:00", breakMinutes: 30, color: "#f59e0b", allowance: 0, isNight: false, status: "active" },
  { id: "sh-2", name: "Afternoon Shift", code: "AS", startTime: "14:00", endTime: "22:00", breakMinutes: 30, color: "#3b82f6", allowance: 5000, isNight: false, status: "active" },
  { id: "sh-3", name: "Night Shift", code: "NS", startTime: "22:00", endTime: "06:00", breakMinutes: 60, color: "#6366f1", allowance: 15000, isNight: true, status: "active" },
  { id: "sh-4", name: "Standard Office", code: "SO", startTime: "09:00", endTime: "17:00", breakMinutes: 60, color: "#10b981", allowance: 0, isNight: false, status: "active" },
  { id: "sh-5", name: "Split Shift", code: "SP", startTime: "07:00", endTime: "19:00", breakMinutes: 120, color: "#ec4899", allowance: 8000, isNight: false, status: "draft" },
];

// ── Shift Roster ──
export interface ShiftAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  shiftId: string;
  shiftName: string;
  shiftCode: string;
  date: string;
  color: string;
}

const EMPLOYEES = [
  { id: "emp-001", name: "Adebayo Ogunlesi", dept: "Engineering" },
  { id: "emp-004", name: "Emeka Nwosu", dept: "Operations" },
  { id: "emp-019", name: "Segun Adeniyi", dept: "Operations" },
  { id: "emp-005", name: "Emeka Okafor", dept: "Sales" },
  { id: "emp-002", name: "Chiamaka Eze", dept: "Engineering" },
  { id: "emp-015", name: "Usman Bello", dept: "IT" },
];

function generateRoster(): ShiftAssignment[] {
  const assignments: ShiftAssignment[] = [];
  const shifts = MOCK_SHIFTS.filter(s => s.status === "active");
  let id = 1;
  for (let d = 7; d <= 20; d++) {
    const date = `2026-04-${String(d).padStart(2, "0")}`;
    EMPLOYEES.forEach((emp, i) => {
      const shift = shifts[(i + d) % shifts.length];
      assignments.push({ id: `sa-${id++}`, employeeId: emp.id, employeeName: emp.name, department: emp.dept, shiftId: shift.id, shiftName: shift.name, shiftCode: shift.code, date, color: shift.color });
    });
  }
  return assignments;
}
export const MOCK_SHIFT_ASSIGNMENTS: ShiftAssignment[] = generateRoster();

// ── Shift Swap Requests ──
export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetId: string;
  targetName: string;
  requesterShift: string;
  targetShift: string;
  date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export const MOCK_SHIFT_SWAP_REQUESTS: ShiftSwapRequest[] = [
  { id: "ss-1", requesterId: "emp-004", requesterName: "Emeka Nwosu", targetId: "emp-019", targetName: "Segun Adeniyi", requesterShift: "Morning Shift", targetShift: "Afternoon Shift", date: "2026-04-14", reason: "Doctor appointment in the morning", status: "pending", submittedAt: "2026-04-09T10:00:00" },
  { id: "ss-2", requesterId: "emp-019", requesterName: "Segun Adeniyi", targetId: "emp-004", targetName: "Emeka Nwosu", requesterShift: "Night Shift", targetShift: "Morning Shift", date: "2026-04-16", reason: "Family event in the evening", status: "pending", submittedAt: "2026-04-09T11:00:00" },
  { id: "ss-3", requesterId: "emp-002", requesterName: "Chiamaka Eze", targetId: "emp-001", targetName: "Adebayo Ogunlesi", requesterShift: "Afternoon Shift", targetShift: "Standard Office", date: "2026-04-12", reason: "Childcare scheduling conflict", status: "approved", submittedAt: "2026-04-08T09:00:00" },
];

// ── Overtime Records ──
export interface OvertimeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  scheduledEnd: string;
  actualEnd: string;
  overtimeHours: number;
  rate: number; // multiplier
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy: string | null;
}

export const MOCK_OVERTIME_RECORDS: OvertimeRecord[] = [
  { id: "ot-1", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", date: "2026-04-07", scheduledEnd: "17:00", actualEnd: "20:30", overtimeHours: 3.5, rate: 1.5, amount: 26250, reason: "Sprint deadline — API migration", status: "approved", approvedBy: "Emeka Nwosu" },
  { id: "ot-2", employeeId: "emp-002", employeeName: "Chiamaka Eze", department: "Engineering", date: "2026-04-07", scheduledEnd: "17:00", actualEnd: "19:00", overtimeHours: 2, rate: 1.5, amount: 15000, reason: "Code review backlog", status: "approved", approvedBy: "Emeka Nwosu" },
  { id: "ot-3", employeeId: "emp-014", employeeName: "Damilola Osei", department: "Engineering", date: "2026-04-08", scheduledEnd: "17:00", actualEnd: "21:00", overtimeHours: 4, rate: 2.0, amount: 40000, reason: "Production incident resolution", status: "pending", approvedBy: null },
  { id: "ot-4", employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", date: "2026-04-08", scheduledEnd: "17:00", actualEnd: "19:30", overtimeHours: 2.5, rate: 1.5, amount: 18750, reason: "Month-end closing", status: "pending", approvedBy: null },
  { id: "ot-5", employeeId: "emp-004", employeeName: "Emeka Nwosu", department: "Operations", date: "2026-04-05", scheduledEnd: "14:00", actualEnd: "17:00", overtimeHours: 3, rate: 1.5, amount: 22500, reason: "Equipment maintenance overrun", status: "rejected", approvedBy: "Fatima Abdullahi" },
  { id: "ot-6", employeeId: "emp-019", employeeName: "Segun Adeniyi", department: "Operations", date: "2026-04-09", scheduledEnd: "17:00", actualEnd: "20:00", overtimeHours: 3, rate: 1.5, amount: 22500, reason: "Inventory audit", status: "pending", approvedBy: null },
];

// ── Break Policies ──
export interface BreakPolicy {
  id: string;
  name: string;
  breakDurationMinutes: number;
  maxBreaksPerDay: number;
  paidBreak: boolean;
  autoDeduct: boolean;
  appliesTo: string;
}

export const MOCK_BREAK_POLICIES: BreakPolicy[] = [
  { id: "bp-1", name: "Standard Lunch Break", breakDurationMinutes: 60, maxBreaksPerDay: 1, paidBreak: false, autoDeduct: true, appliesTo: "All employees" },
  { id: "bp-2", name: "Short Break", breakDurationMinutes: 15, maxBreaksPerDay: 2, paidBreak: true, autoDeduct: false, appliesTo: "All employees" },
  { id: "bp-3", name: "Operations Break", breakDurationMinutes: 30, maxBreaksPerDay: 2, paidBreak: true, autoDeduct: false, appliesTo: "Operations" },
];

// ── Department Attendance Summary ──
export interface DepartmentAttendanceSummary {
  department: string;
  totalEmployees: number;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  halfDay: number;
  avgHoursWorked: number;
  attendanceRate: number;
}

export const MOCK_DEPT_ATTENDANCE: DepartmentAttendanceSummary[] = [
  { department: "Engineering", totalEmployees: 42, present: 35, late: 3, absent: 2, onLeave: 1, halfDay: 1, avgHoursWorked: 8.2, attendanceRate: 95.2 },
  { department: "Sales", totalEmployees: 28, present: 22, late: 2, absent: 3, onLeave: 1, halfDay: 0, attendanceRate: 89.3, avgHoursWorked: 7.8 },
  { department: "Marketing", totalEmployees: 22, present: 18, late: 1, absent: 1, onLeave: 2, halfDay: 0, attendanceRate: 90.9, avgHoursWorked: 8.0 },
  { department: "Finance", totalEmployees: 18, present: 16, late: 1, absent: 0, onLeave: 1, halfDay: 0, attendanceRate: 94.4, avgHoursWorked: 8.4 },
  { department: "Human Resources", totalEmployees: 15, present: 12, late: 0, absent: 1, onLeave: 2, halfDay: 0, attendanceRate: 93.3, avgHoursWorked: 8.1 },
  { department: "Operations", totalEmployees: 14, present: 12, late: 1, absent: 0, onLeave: 1, halfDay: 0, attendanceRate: 92.9, avgHoursWorked: 7.9 },
  { department: "Legal", totalEmployees: 9, present: 8, late: 0, absent: 0, onLeave: 1, halfDay: 0, attendanceRate: 100, avgHoursWorked: 8.3 },
  { department: "IT", totalEmployees: 8, present: 7, late: 1, absent: 0, onLeave: 0, halfDay: 0, attendanceRate: 100, avgHoursWorked: 8.5 },
];

// ── Monthly Summary ──
export interface MonthlyAttendanceSummary {
  employeeId: string;
  employeeName: string;
  department: string;
  totalWorkingDays: number;
  daysPresent: number;
  daysLate: number;
  daysAbsent: number;
  daysOnLeave: number;
  daysHalfDay: number;
  totalHoursWorked: number;
  overtimeHours: number;
  attendanceRate: number;
}

export const MOCK_MONTHLY_SUMMARY: MonthlyAttendanceSummary[] = [
  { employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", totalWorkingDays: 22, daysPresent: 20, daysLate: 1, daysAbsent: 0, daysOnLeave: 2, daysHalfDay: 0, totalHoursWorked: 176, overtimeHours: 12, attendanceRate: 95.5 },
  { employeeId: "emp-002", employeeName: "Chiamaka Eze", department: "Engineering", totalWorkingDays: 22, daysPresent: 21, daysLate: 0, daysAbsent: 0, daysOnLeave: 1, daysHalfDay: 0, totalHoursWorked: 182, overtimeHours: 8, attendanceRate: 100 },
  { employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", totalWorkingDays: 22, daysPresent: 18, daysLate: 4, daysAbsent: 2, daysOnLeave: 0, daysHalfDay: 2, totalHoursWorked: 158, overtimeHours: 0, attendanceRate: 81.8 },
  { employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", totalWorkingDays: 22, daysPresent: 22, daysLate: 0, daysAbsent: 0, daysOnLeave: 0, daysHalfDay: 0, totalHoursWorked: 184, overtimeHours: 4, attendanceRate: 100 },
  { employeeId: "emp-005", employeeName: "Emeka Okafor", department: "Sales", totalWorkingDays: 22, daysPresent: 17, daysLate: 2, daysAbsent: 3, daysOnLeave: 0, daysHalfDay: 0, totalHoursWorked: 144, overtimeHours: 0, attendanceRate: 77.3 },
  { employeeId: "emp-006", employeeName: "Aisha Mohammed", department: "Finance", totalWorkingDays: 22, daysPresent: 21, daysLate: 1, daysAbsent: 0, daysOnLeave: 1, daysHalfDay: 0, totalHoursWorked: 178, overtimeHours: 6, attendanceRate: 95.5 },
  { employeeId: "emp-007", employeeName: "Tochukwu Nwankwo", department: "Engineering", totalWorkingDays: 22, daysPresent: 19, daysLate: 3, daysAbsent: 1, daysOnLeave: 0, daysHalfDay: 1, totalHoursWorked: 162, overtimeHours: 2, attendanceRate: 86.4 },
  { employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", totalWorkingDays: 22, daysPresent: 20, daysLate: 0, daysAbsent: 1, daysOnLeave: 1, daysHalfDay: 0, totalHoursWorked: 170, overtimeHours: 0, attendanceRate: 90.9 },
];

// ── Anomalies ──
export interface AttendanceAnomaly {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  type: "missing-clock-out" | "impossible-hours" | "duplicate-entry" | "early-departure" | "weekend-clock-in" | "location-mismatch";
  description: string;
  severity: "low" | "medium" | "high";
  resolved: boolean;
}

export const MOCK_ANOMALIES: AttendanceAnomaly[] = [
  { id: "an-1", employeeId: "emp-008", employeeName: "Bukola Adeyemi", department: "Marketing", date: "2026-04-07", type: "missing-clock-out", description: "Clocked in at 08:55 but no clock-out recorded", severity: "medium", resolved: false },
  { id: "an-2", employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", date: "2026-04-06", type: "impossible-hours", description: "Recorded 16.5 hours — exceeds maximum shift length", severity: "high", resolved: false },
  { id: "an-3", employeeId: "emp-012", employeeName: "Ngozi Ibe", department: "Sales", date: "2026-04-05", type: "duplicate-entry", description: "Two clock-in entries within 3 minutes", severity: "low", resolved: true },
  { id: "an-4", employeeId: "emp-016", employeeName: "Amara Obi", department: "Marketing", date: "2026-04-07", type: "location-mismatch", description: "Clock-in GPS location 2.3km from assigned office", severity: "high", resolved: false },
  { id: "an-5", employeeId: "emp-015", employeeName: "Usman Bello", department: "IT", date: "2026-04-05", type: "weekend-clock-in", description: "Clock-in recorded on Saturday without overtime approval", severity: "medium", resolved: false },
  { id: "an-6", employeeId: "emp-014", employeeName: "Damilola Osei", department: "Engineering", date: "2026-04-08", type: "early-departure", description: "Clocked out at 13:00, 4 hours before shift end", severity: "medium", resolved: false },
];

export const ANOMALY_TYPE_LABELS: Record<string, string> = {
  "missing-clock-out": "Missing Clock-Out",
  "impossible-hours": "Impossible Hours",
  "duplicate-entry": "Duplicate Entry",
  "early-departure": "Early Departure",
  "weekend-clock-in": "Weekend Clock-In",
  "location-mismatch": "Location Mismatch",
};

export const ANOMALY_SEVERITY_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  low: { label: "Low", bg: "bg-slate-50 border-slate-200", color: "text-slate-600" },
  medium: { label: "Medium", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  high: { label: "High", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

// ── Payroll Sync ──
export interface PayrollSyncRecord {
  id: string;
  period: string;
  syncDate: string;
  totalEmployees: number;
  regularHours: number;
  overtimeHours: number;
  absenceDeductions: number;
  lateDeductions: number;
  shiftAllowances: number;
  overtimePayments: number;
  status: "synced" | "pending" | "error" | "partial";
}

export const MOCK_PAYROLL_SYNC: PayrollSyncRecord[] = [
  { id: "ps-1", period: "April 2026 (W1)", syncDate: "2026-04-07", totalEmployees: 156, regularHours: 5460, overtimeHours: 48, absenceDeductions: 125000, lateDeductions: 45000, shiftAllowances: 280000, overtimePayments: 360000, status: "synced" },
  { id: "ps-2", period: "April 2026 (W2)", syncDate: "", totalEmployees: 156, regularHours: 0, overtimeHours: 0, absenceDeductions: 0, lateDeductions: 0, shiftAllowances: 0, overtimePayments: 0, status: "pending" },
  { id: "ps-3", period: "March 2026", syncDate: "2026-03-31", totalEmployees: 156, regularHours: 24960, overtimeHours: 186, absenceDeductions: 450000, lateDeductions: 180000, shiftAllowances: 1120000, overtimePayments: 1395000, status: "synced" },
  { id: "ps-4", period: "February 2026", syncDate: "2026-02-28", totalEmployees: 152, regularHours: 22720, overtimeHours: 164, absenceDeductions: 380000, lateDeductions: 152000, shiftAllowances: 1040000, overtimePayments: 1230000, status: "synced" },
];

export const SYNC_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  synced: { label: "Synced", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  error: { label: "Error", bg: "bg-red-50 border-red-200", color: "text-red-700" },
  partial: { label: "Partial", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
};

// ── Employee Break Records ──
export interface BreakRecord {
  id: string;
  date: string;
  breakType: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number | null;
  status: "on-break" | "completed" | "exceeded";
}

export const MOCK_MY_BREAKS: BreakRecord[] = [
  { id: "br-1", date: "2026-04-09", breakType: "Lunch Break", startTime: "12:05", endTime: "12:58", durationMinutes: 53, status: "completed" },
  { id: "br-2", date: "2026-04-09", breakType: "Short Break", startTime: "10:30", endTime: "10:42", durationMinutes: 12, status: "completed" },
  { id: "br-3", date: "2026-04-08", breakType: "Lunch Break", startTime: "12:00", endTime: "13:10", durationMinutes: 70, status: "exceeded" },
  { id: "br-4", date: "2026-04-08", breakType: "Short Break", startTime: "15:00", endTime: "15:12", durationMinutes: 12, status: "completed" },
  { id: "br-5", date: "2026-04-07", breakType: "Lunch Break", startTime: "12:10", endTime: "13:00", durationMinutes: 50, status: "completed" },
];

// ── Attendance Notifications ──
export interface AttendanceNotification {
  id: string;
  type: "late-warning" | "missed-clock-out" | "correction-approved" | "correction-rejected" | "overtime-approved" | "shift-change" | "reminder";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export const MOCK_ATTENDANCE_NOTIFICATIONS: AttendanceNotification[] = [
  { id: "an-1", type: "late-warning", title: "Late Arrival Warning", message: "You clocked in 22 minutes late on April 7th. Please ensure timely arrival.", date: "2026-04-07T09:22:00", read: false },
  { id: "an-2", type: "missed-clock-out", title: "Missed Clock-Out", message: "No clock-out was recorded for April 8th. Please submit a correction request.", date: "2026-04-09T08:00:00", read: false },
  { id: "an-3", type: "correction-approved", title: "Correction Approved", message: "Your attendance correction for April 4th has been approved by HR.", date: "2026-04-05T14:00:00", read: true },
  { id: "an-4", type: "overtime-approved", title: "Overtime Approved", message: "Your overtime of 3.5 hours on April 7th has been approved.", date: "2026-04-08T10:00:00", read: true },
  { id: "an-5", type: "shift-change", title: "Shift Updated", message: "Your shift for April 14th has been changed to Afternoon Shift (14:00-22:00).", date: "2026-04-09T09:00:00", read: false },
  { id: "an-6", type: "reminder", title: "Clock-In Reminder", message: "Don't forget to clock in when you arrive at the office today.", date: "2026-04-09T07:30:00", read: true },
];

// ── Helper: format naira ──
export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}
