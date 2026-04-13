// --- Types ---

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const DAYS_OF_WEEK: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_LABELS: Record<DayOfWeek, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export interface WorkSchedule {
  id: string;
  name: string;
  description: string;
  workDays: DayOfWeek[];
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  totalHoursPerDay: number;
  isDefault: boolean;
  assignedEmployees: number;
  department: string | null; // null = company-wide
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeScheduleAssignment {
  employeeId: string;
  employeeName: string;
  department: string;
  scheduleId: string;
  scheduleName: string;
  effectiveDate: string;
  avatar?: string;
}

export const SCHEDULE_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  draft: { label: "Draft", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  archived: { label: "Archived", bg: "bg-gray-50 border-gray-200", color: "text-gray-500" },
};

// --- Mock Data ---

export const MOCK_SCHEDULES: WorkSchedule[] = [
  {
    id: "ws-1",
    name: "Standard Office Hours",
    description: "Default 9-to-5 schedule for office staff",
    workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "09:00",
    endTime: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    totalHoursPerDay: 7,
    isDefault: true,
    assignedEmployees: 98,
    department: null,
    status: "active",
    createdAt: "2025-01-15",
    updatedAt: "2026-02-01",
  },
  {
    id: "ws-2",
    name: "Engineering Flex",
    description: "Flexible hours for the engineering team",
    workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "08:00",
    endTime: "16:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    totalHoursPerDay: 7,
    isDefault: false,
    assignedEmployees: 42,
    department: "Engineering",
    status: "active",
    createdAt: "2025-03-10",
    updatedAt: "2026-01-15",
  },
  {
    id: "ws-3",
    name: "Shift A — Morning",
    description: "Morning shift for operations team",
    workDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    startTime: "06:00",
    endTime: "14:00",
    breakStart: "10:00",
    breakEnd: "10:30",
    totalHoursPerDay: 7.5,
    isDefault: false,
    assignedEmployees: 14,
    department: "Operations",
    status: "active",
    createdAt: "2025-06-01",
    updatedAt: "2025-12-10",
  },
  {
    id: "ws-4",
    name: "Shift B — Afternoon",
    description: "Afternoon shift for operations team",
    workDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    startTime: "14:00",
    endTime: "22:00",
    breakStart: "18:00",
    breakEnd: "18:30",
    totalHoursPerDay: 7.5,
    isDefault: false,
    assignedEmployees: 0,
    department: "Operations",
    status: "draft",
    createdAt: "2026-03-20",
    updatedAt: "2026-03-20",
  },
  {
    id: "ws-5",
    name: "Part-Time",
    description: "Half-day schedule for part-time employees",
    workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "09:00",
    endTime: "13:00",
    breakStart: "",
    breakEnd: "",
    totalHoursPerDay: 4,
    isDefault: false,
    assignedEmployees: 2,
    department: null,
    status: "active",
    createdAt: "2025-09-01",
    updatedAt: "2025-11-20",
  },
];

export const MOCK_SCHEDULE_ASSIGNMENTS: EmployeeScheduleAssignment[] = [
  { employeeId: "emp-001", employeeName: "Chioma Eze", department: "Engineering", scheduleId: "ws-2", scheduleName: "Engineering Flex", effectiveDate: "2025-03-10" },
  { employeeId: "emp-002", employeeName: "Adebayo Ogunlesi", department: "Engineering", scheduleId: "ws-2", scheduleName: "Engineering Flex", effectiveDate: "2025-03-10" },
  { employeeId: "emp-003", employeeName: "Fatima Ibrahim", department: "HR", scheduleId: "ws-1", scheduleName: "Standard Office Hours", effectiveDate: "2025-01-15" },
  { employeeId: "emp-004", employeeName: "Emeka Nwosu", department: "Operations", scheduleId: "ws-3", scheduleName: "Shift A — Morning", effectiveDate: "2025-06-01" },
  { employeeId: "emp-005", employeeName: "Oluwaseun Adeyemi", department: "Sales", scheduleId: "ws-1", scheduleName: "Standard Office Hours", effectiveDate: "2025-01-15" },
  { employeeId: "emp-006", employeeName: "Halima Yusuf", department: "Finance", scheduleId: "ws-1", scheduleName: "Standard Office Hours", effectiveDate: "2025-01-15" },
  { employeeId: "emp-007", employeeName: "Chibueze Okoro", department: "Engineering", scheduleId: "ws-2", scheduleName: "Engineering Flex", effectiveDate: "2025-04-01" },
  { employeeId: "emp-008", employeeName: "Amara Obi", department: "Marketing", scheduleId: "ws-1", scheduleName: "Standard Office Hours", effectiveDate: "2025-01-15" },
];

// The current logged-in employee's schedule (for employee view)
export const MY_SCHEDULE: WorkSchedule = MOCK_SCHEDULES[1]; // Engineering Flex
