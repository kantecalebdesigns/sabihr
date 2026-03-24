export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  headTitle: string;
  employeeCount: number;
  activeCount: number;
  onLeaveCount: number;
  location: string;
  budget: number;
  description: string;
  createdDate: string;
  status: "active" | "inactive";
  color: string;
}

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: "dept-001",
    name: "Engineering",
    code: "ENG",
    headOfDepartment: "Chiamaka Eze",
    headTitle: "VP of Engineering",
    employeeCount: 42,
    activeCount: 40,
    onLeaveCount: 2,
    location: "Lagos Office",
    budget: 18500000,
    description:
      "Responsible for product development, software engineering, and technical infrastructure.",
    createdDate: "2024-01-01",
    status: "active",
    color: "#2563eb",
  },
  {
    id: "dept-002",
    name: "Sales",
    code: "SAL",
    headOfDepartment: "Ngozi Ibe",
    headTitle: "Sales Director",
    employeeCount: 28,
    activeCount: 27,
    onLeaveCount: 1,
    location: "Lagos Office",
    budget: 12000000,
    description:
      "Drives revenue growth through client acquisition, relationship management, and sales strategy.",
    createdDate: "2024-01-01",
    status: "active",
    color: "#10b981",
  },
  {
    id: "dept-003",
    name: "Marketing",
    code: "MKT",
    headOfDepartment: "Bukola Adeyemi",
    headTitle: "Marketing Manager",
    employeeCount: 22,
    activeCount: 22,
    onLeaveCount: 0,
    location: "Lagos Office",
    budget: 8500000,
    description:
      "Manages brand strategy, digital marketing, content, and communications.",
    createdDate: "2024-01-01",
    status: "active",
    color: "#f59e0b",
  },
  {
    id: "dept-004",
    name: "Finance",
    code: "FIN",
    headOfDepartment: "Chibueze Okoro",
    headTitle: "Finance Director",
    employeeCount: 18,
    activeCount: 18,
    onLeaveCount: 0,
    location: "Lagos Office",
    budget: 6200000,
    description:
      "Handles financial planning, accounting, payroll, budgeting, and compliance.",
    createdDate: "2024-01-01",
    status: "active",
    color: "#8b5cf6",
  },
  {
    id: "dept-005",
    name: "Human Resources",
    code: "HR",
    headOfDepartment: "Fatima Abdullahi",
    headTitle: "HR Manager",
    employeeCount: 15,
    activeCount: 14,
    onLeaveCount: 1,
    location: "Abuja Office",
    budget: 5800000,
    description:
      "Manages talent acquisition, employee relations, benefits, and organizational development.",
    createdDate: "2024-01-01",
    status: "active",
    color: "#ec4899",
  },
  {
    id: "dept-006",
    name: "Operations",
    code: "OPS",
    headOfDepartment: "Ibrahim Musa",
    headTitle: "Operations Lead",
    employeeCount: 14,
    activeCount: 14,
    onLeaveCount: 0,
    location: "Kano Office",
    budget: 4500000,
    description:
      "Oversees day-to-day operations, logistics, and process optimization.",
    createdDate: "2024-01-01",
    status: "active",
    color: "#06b6d4",
  },
  {
    id: "dept-007",
    name: "Legal",
    code: "LEG",
    headOfDepartment: "Yetunde Bakare",
    headTitle: "Legal Counsel",
    employeeCount: 9,
    activeCount: 9,
    onLeaveCount: 0,
    location: "Lagos Office",
    budget: 3800000,
    description:
      "Provides legal advisory, handles contracts, regulatory compliance, and corporate governance.",
    createdDate: "2024-01-01",
    status: "active",
    color: "#64748b",
  },
  {
    id: "dept-008",
    name: "IT",
    code: "IT",
    headOfDepartment: "Usman Bello",
    headTitle: "IT Support Lead",
    employeeCount: 8,
    activeCount: 8,
    onLeaveCount: 0,
    location: "Abuja Office",
    budget: 4200000,
    description:
      "Manages IT infrastructure, network security, helpdesk, and system administration.",
    createdDate: "2024-01-01",
    status: "active",
    color: "#f97316",
  },
];

export function formatBudget(amount: number): string {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  return `₦${amount.toLocaleString()}`;
}
