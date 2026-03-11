import type {
  EmployeeProfile,
  ColleagueProfile,
  OrgChartNode,
  EmploymentHistoryEntry,
  RedeploymentRequestRecord,
  EmployeeNotification,
  DocumentType,
  Gender,
  MaritalStatus,
  Relationship,
} from "@/types/employee";

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const MARITAL_STATUS_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

export const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "other", label: "Other" },
];

export const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: "school-cert", label: "School Certificate" },
  { value: "birth-certificate", label: "Birth Certificate" },
  { value: "passport", label: "International Passport" },
  { value: "national-id", label: "National ID Card" },
  { value: "drivers-license", label: "Driver's License" },
  { value: "marriage-cert", label: "Marriage Certificate" },
  { value: "offer-letter", label: "Offer Letter" },
  { value: "other", label: "Other Document" },
];

export const MOCK_EMPLOYEE_PROFILE: EmployeeProfile = {
  id: "emp-001",
  profilePhoto: "",
  profileCompletion: 85,
  basicDetails: {
    firstName: "Adebayo",
    lastName: "Ogunlesi",
    middleName: "Chukwuemeka",
    dateOfBirth: "1992-06-15",
    gender: "male",
    maritalStatus: "married",
    nationality: "Nigerian",
    stateOfOrigin: "Lagos",
    nin: "12345678901",
    taxId: "TIN-1234567890",
    pensionId: "PEN-NG-00123456",
    bvn: "22345678901",
  },
  contactInfo: {
    personalEmail: "adebayo.ogunlesi@gmail.com",
    workEmail: "adebayo.ogunlesi@sabihr.com",
    phone: "+2348012345678",
    alternatePhone: "+2349087654321",
    address: "15 Admiralty Way, Lekki Phase 1",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
  },
  emergencyContacts: [
    {
      id: "ec-1",
      name: "Ngozi Ogunlesi",
      relationship: "Spouse",
      phone: "+2348098765432",
      email: "ngozi.ogunlesi@gmail.com",
      address: "15 Admiralty Way, Lekki Phase 1, Lagos",
    },
    {
      id: "ec-2",
      name: "Chief Olumide Ogunlesi",
      relationship: "Father",
      phone: "+2348023456789",
      email: "olumide.ogunlesi@yahoo.com",
      address: "22 Ikoyi Crescent, Ikoyi, Lagos",
    },
  ],
  familyDependents: [
    {
      id: "fd-1",
      name: "Ngozi Ogunlesi",
      relationship: "spouse",
      dateOfBirth: "1994-03-22",
      gender: "female",
    },
    {
      id: "fd-2",
      name: "Tunde Ogunlesi",
      relationship: "child",
      dateOfBirth: "2020-11-08",
      gender: "male",
    },
  ],
  documents: [
    {
      id: "doc-1",
      type: "passport",
      name: "International Passport",
      fileName: "passport_adebayo.pdf",
      uploadDate: "2025-08-15",
      expiryDate: "2026-04-20",
      status: "verified",
    },
    {
      id: "doc-2",
      type: "school-cert",
      name: "B.Sc. Certificate",
      fileName: "bsc_certificate.pdf",
      uploadDate: "2025-08-15",
      expiryDate: "",
      status: "verified",
    },
    {
      id: "doc-3",
      type: "national-id",
      name: "NIN Slip",
      fileName: "nin_slip.pdf",
      uploadDate: "2025-09-01",
      expiryDate: "2026-09-01",
      status: "uploaded",
    },
  ],
  employment: {
    employeeId: "SHR-2025-001",
    jobTitle: "Senior Software Engineer",
    role: "Technical Lead",
    department: "Engineering",
    division: "Product Development",
    supervisor: "Chiamaka Eze",
    supervisorTitle: "VP of Engineering",
    employmentType: "full-time",
    employmentStatus: "active",
    startDate: "2025-03-01",
    tenure: "11 months",
    workLocation: "Lagos Office",
    branch: "Head Office - Victoria Island",
    payGrade: "Grade 7",
    contractEndDate: null,
    contractType: "permanent",
    contractDocument: null,
    probationEndDate: "2025-09-01",
    isProbation: false,
  },
};

export const MOCK_COLLEAGUES: ColleagueProfile[] = [
  {
    id: "emp-002",
    name: "Chiamaka Eze",
    jobTitle: "VP of Engineering",
    department: "Engineering",
    email: "chiamaka.eze@sabihr.com",
    phone: "+2348034567890",
    photo: "",
    location: "Lagos Office",
  },
  {
    id: "emp-003",
    name: "Oluwaseun Afolabi",
    jobTitle: "Product Designer",
    department: "Engineering",
    email: "seun.afolabi@sabihr.com",
    phone: "+2348045678901",
    photo: "",
    location: "Lagos Office",
  },
  {
    id: "emp-004",
    name: "Fatima Abdullahi",
    jobTitle: "HR Manager",
    department: "Human Resources",
    email: "fatima.abdullahi@sabihr.com",
    phone: "+2348056789012",
    photo: "",
    location: "Abuja Office",
  },
  {
    id: "emp-005",
    name: "Emeka Okafor",
    jobTitle: "Sales Executive",
    department: "Sales",
    email: "emeka.okafor@sabihr.com",
    phone: "+2348067890123",
    photo: "",
    location: "Lagos Office",
  },
  {
    id: "emp-006",
    name: "Aisha Mohammed",
    jobTitle: "Finance Analyst",
    department: "Finance",
    email: "aisha.mohammed@sabihr.com",
    phone: "+2348078901234",
    photo: "",
    location: "Abuja Office",
  },
  {
    id: "emp-007",
    name: "Tochukwu Nwankwo",
    jobTitle: "Backend Developer",
    department: "Engineering",
    email: "tochukwu.nwankwo@sabihr.com",
    phone: "+2348089012345",
    photo: "",
    location: "Lagos Office",
  },
  {
    id: "emp-008",
    name: "Bukola Adeyemi",
    jobTitle: "Marketing Manager",
    department: "Marketing",
    email: "bukola.adeyemi@sabihr.com",
    phone: "+2348090123456",
    photo: "",
    location: "Lagos Office",
  },
  {
    id: "emp-009",
    name: "Ibrahim Musa",
    jobTitle: "Operations Lead",
    department: "Operations",
    email: "ibrahim.musa@sabihr.com",
    phone: "+2348001234567",
    photo: "",
    location: "Kano Office",
  },
  {
    id: "emp-010",
    name: "Yetunde Bakare",
    jobTitle: "Legal Counsel",
    department: "Legal",
    email: "yetunde.bakare@sabihr.com",
    phone: "+2348012345670",
    photo: "",
    location: "Lagos Office",
  },
];

export const MOCK_ORG_CHART: OrgChartNode = {
  id: "org-1",
  name: "Olufunke Adeyemi",
  title: "CEO",
  department: "Executive",
  photo: "",
  children: [
    {
      id: "org-2",
      name: "Chiamaka Eze",
      title: "VP of Engineering",
      department: "Engineering",
      photo: "",
      children: [
        {
          id: "org-3",
          name: "Adebayo Ogunlesi",
          title: "Senior Software Engineer",
          department: "Engineering",
          photo: "",
          children: [],
        },
        {
          id: "org-4",
          name: "Tochukwu Nwankwo",
          title: "Backend Developer",
          department: "Engineering",
          photo: "",
          children: [],
        },
        {
          id: "org-5",
          name: "Oluwaseun Afolabi",
          title: "Product Designer",
          department: "Engineering",
          photo: "",
          children: [],
        },
      ],
    },
    {
      id: "org-6",
      name: "Fatima Abdullahi",
      title: "HR Manager",
      department: "Human Resources",
      photo: "",
      children: [],
    },
    {
      id: "org-7",
      name: "Bukola Adeyemi",
      title: "Marketing Manager",
      department: "Marketing",
      photo: "",
      children: [],
    },
  ],
};

export const MOCK_EMPLOYMENT_HISTORY: EmploymentHistoryEntry[] = [
  {
    id: "hist-1",
    title: "Software Engineer",
    department: "Engineering",
    startDate: "2025-03-01",
    endDate: "2025-09-01",
    type: "hire",
  },
  {
    id: "hist-2",
    title: "Senior Software Engineer",
    department: "Engineering",
    startDate: "2025-09-01",
    endDate: null,
    type: "promotion",
  },
];

export const UPCOMING_EVENTS = [
  {
    id: "evt-1",
    title: "Public Holiday — Workers' Day",
    description: "Office closed",
    date: "2026-05-01",
    type: "info" as const,
  },
  {
    id: "evt-2",
    title: "Performance Review",
    description: "Mid-year review with your manager",
    date: "2026-03-15",
    type: "warning" as const,
  },
  {
    id: "evt-3",
    title: "Team Offsite",
    description: "Engineering team quarterly offsite",
    date: "2026-04-10",
    type: "info" as const,
  },
];

// ── Dashboard Data ──────────────────────────────────────────────────

export const LEAVE_BALANCE = {
  annual: { total: 20, used: 5, pending: 2 },
  sick: { total: 10, used: 3, pending: 0 },
  casual: { total: 5, used: 1, pending: 0 },
  compassionate: { total: 5, used: 0, pending: 0 },
};

export const RECENT_LEAVE_REQUESTS = [
  {
    id: "lr-1",
    type: "Annual Leave",
    startDate: "2026-03-20",
    endDate: "2026-03-22",
    days: 2,
    status: "pending" as const,
    appliedOn: "2026-03-01",
  },
  {
    id: "lr-2",
    type: "Sick Leave",
    startDate: "2026-02-10",
    endDate: "2026-02-12",
    days: 3,
    status: "approved" as const,
    appliedOn: "2026-02-10",
  },
  {
    id: "lr-3",
    type: "Annual Leave",
    startDate: "2026-01-06",
    endDate: "2026-01-10",
    days: 5,
    status: "approved" as const,
    appliedOn: "2025-12-20",
  },
];

export const ATTENDANCE_SUMMARY = {
  month: "March 2026",
  workingDays: 22,
  daysPresent: 18,
  daysAbsent: 0,
  daysRemaining: 4,
  lateArrivals: 1,
  earlyDepartures: 0,
  recentLogs: [
    { date: "2026-03-04", clockIn: "08:52", clockOut: "17:05", status: "present" as const },
    { date: "2026-03-03", clockIn: "09:15", clockOut: "17:30", status: "late" as const },
    { date: "2026-03-02", clockIn: "08:45", clockOut: "17:00", status: "present" as const },
    { date: "2026-02-28", clockIn: "08:30", clockOut: "17:10", status: "present" as const },
    { date: "2026-02-27", clockIn: "08:48", clockOut: "17:00", status: "present" as const },
  ],
};

export const PAYSLIP_SUMMARY = {
  nextPayday: "2026-03-28",
  lastPaid: "2026-02-28",
  netPay: 850000,
  grossPay: 1200000,
  currency: "NGN",
  recentPayslips: [
    { id: "ps-1", month: "February 2026", grossPay: 1200000, netPay: 850000, status: "paid" as const },
    { id: "ps-2", month: "January 2026", grossPay: 1200000, netPay: 850000, status: "paid" as const },
    { id: "ps-3", month: "December 2025", grossPay: 1200000, netPay: 920000, status: "paid" as const },
  ],
};

export const PENDING_REQUESTS = {
  leave: 1,
  documents: 1,
  profileEdits: 0,
  total: 2,
};

// ── Redeployment Tracker ────────────────────────────────────────────

export const MOCK_REDEPLOYMENT_REQUESTS: RedeploymentRequestRecord[] = [
  {
    id: "rdp-1",
    targetDepartment: "Marketing",
    reason: "Interested in transitioning to a growth-focused role leveraging my technical background.",
    preferredDate: "2026-04-01",
    additionalNotes: "Happy to do a phased transition.",
    submittedDate: "2026-02-15",
    status: "under-review",
    statusHistory: [
      { status: "pending", date: "2026-02-15", note: "Request submitted" },
      { status: "under-review", date: "2026-02-20", note: "HR reviewing with department heads" },
    ],
  },
  {
    id: "rdp-2",
    targetDepartment: "Sales",
    reason: "Previous experience in client-facing roles; better alignment with career goals.",
    preferredDate: "2025-11-01",
    additionalNotes: "",
    submittedDate: "2025-10-05",
    status: "rejected",
    statusHistory: [
      { status: "pending", date: "2025-10-05", note: "Request submitted" },
      { status: "under-review", date: "2025-10-10", note: "Under departmental review" },
      { status: "rejected", date: "2025-10-20", note: "No openings in target department at this time" },
    ],
  },
];

// ── Notifications ───────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: EmployeeNotification[] = [
  {
    id: "notif-1",
    type: "leave-approved",
    title: "Leave Request Approved",
    message: "Your annual leave request for Mar 20-22 has been approved by Chiamaka Eze.",
    timestamp: "2026-03-05T09:30:00",
    read: false,
    priority: "medium",
    actionUrl: "/employee/dashboard",
  },
  {
    id: "notif-2",
    type: "document-expiry",
    title: "Passport Expiring Soon",
    message: "Your International Passport expires on Apr 20, 2026. Please upload a renewed copy.",
    timestamp: "2026-03-04T14:00:00",
    read: false,
    priority: "high",
    actionUrl: "/employee/profile",
  },
  {
    id: "notif-3",
    type: "payslip-available",
    title: "February Payslip Available",
    message: "Your payslip for February 2026 is now available for download.",
    timestamp: "2026-03-01T08:00:00",
    read: false,
    priority: "low",
    actionUrl: "/employee/dashboard",
  },
  {
    id: "notif-4",
    type: "event-reminder",
    title: "Performance Review in 10 Days",
    message: "Your mid-year performance review with Chiamaka Eze is scheduled for Mar 15.",
    timestamp: "2026-03-05T07:00:00",
    read: false,
    priority: "high",
    actionUrl: "/employee/dashboard",
  },
  {
    id: "notif-5",
    type: "redeployment-update",
    title: "Redeployment Under Review",
    message: "Your redeployment request to Marketing is now being reviewed by HR.",
    timestamp: "2026-02-20T11:15:00",
    read: true,
    priority: "medium",
    actionUrl: "/employee/redeployment",
  },
  {
    id: "notif-6",
    type: "announcement",
    title: "Office Closure — Workers' Day",
    message: "The office will be closed on May 1, 2026 for Workers' Day.",
    timestamp: "2026-02-18T09:00:00",
    read: true,
    priority: "low",
  },
  {
    id: "notif-7",
    type: "profile-update",
    title: "Profile Update Approved",
    message: "Your request to update Contact Information has been approved by HR.",
    timestamp: "2026-02-10T16:45:00",
    read: true,
    priority: "low",
    actionUrl: "/employee/profile",
  },
];
