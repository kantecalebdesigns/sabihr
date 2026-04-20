export interface HeadcountMonth {
  month: string;
  hires: number;
  leavers: number;
}

export interface DepartmentSlice {
  name: string;
  count: number;
  color: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  color: string;
  count: number;
  candidates: PipelineCandidate[];
}

export interface PipelineCandidate {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
}

export interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  accent: string;
}

export interface OverviewKpi {
  key: string;
  label: string;
  value: string;
  iconName: "users" | "briefcase" | "calendar" | "trophy";
  trend: number;
  trendDirection: "up" | "down";
}

export const OVERVIEW_KPIS: OverviewKpi[] = [
  { key: "headcount", label: "Headcount", value: "148", iconName: "users", trend: 4, trendDirection: "up" },
  { key: "open_roles", label: "Open roles", value: "12", iconName: "briefcase", trend: 2, trendDirection: "up" },
  { key: "on_leave", label: "On leave", value: "7", iconName: "calendar", trend: 1, trendDirection: "down" },
  { key: "retention", label: "Retention", value: "94%", iconName: "trophy", trend: 1.2, trendDirection: "up" },
];

export const HEADCOUNT_12M: HeadcountMonth[] = [
  { month: "May", hires: 7, leavers: 3 },
  { month: "Jun", hires: 6, leavers: 2 },
  { month: "Jul", hires: 10, leavers: 4 },
  { month: "Aug", hires: 12, leavers: 2 },
  { month: "Sep", hires: 9, leavers: 4 },
  { month: "Oct", hires: 14, leavers: 6 },
  { month: "Nov", hires: 11, leavers: 3 },
  { month: "Dec", hires: 13, leavers: 2 },
  { month: "Jan", hires: 15, leavers: 4 },
  { month: "Feb", hires: 12, leavers: 2 },
  { month: "Mar", hires: 16, leavers: 3 },
  { month: "Apr", hires: 18, leavers: 2 },
];

export const DEPARTMENTS_DONUT: DepartmentSlice[] = [
  { name: "Engineering", count: 48, color: "#2563eb" },
  { name: "Design", count: 26, color: "#8b5cf6" },
  { name: "Sales", count: 22, color: "#10b981" },
  { name: "Marketing", count: 18, color: "#f59e0b" },
  { name: "People Ops", count: 14, color: "#ef4444" },
  { name: "Finance", count: 20, color: "#6366f1" },
];

export const HIRING_PIPELINE: PipelineStage[] = [
  {
    id: "applied",
    label: "Applied",
    color: "bg-slate-400",
    count: 18,
    candidates: [
      { id: "a1", name: "Sara", initials: "SA", avatarColor: "bg-blue-100 text-blue-700", role: "Head of People" },
      { id: "a2", name: "Marcus Lee", initials: "ML", avatarColor: "bg-emerald-100 text-emerald-700", role: "Senior iOS Engineer" },
      { id: "a3", name: "Priya Menon", initials: "PM", avatarColor: "bg-violet-100 text-violet-700", role: "Content Designer" },
    ],
  },
  {
    id: "screening",
    label: "Screening",
    color: "bg-amber-500",
    count: 9,
    candidates: [
      { id: "s1", name: "Daniel Ade", initials: "DA", avatarColor: "bg-amber-100 text-amber-700", role: "Senior iOS Engineer" },
      { id: "s2", name: "Iris Chen", initials: "IC", avatarColor: "bg-rose-100 text-rose-700", role: "Content Designer" },
    ],
  },
  {
    id: "interviewing",
    label: "Interviewing",
    color: "bg-blue-500",
    count: 5,
    candidates: [
      { id: "i1", name: "Zara Thomas", initials: "ZT", avatarColor: "bg-blue-100 text-blue-700", role: "Product Designer" },
      { id: "i2", name: "Kemi Ola", initials: "KO", avatarColor: "bg-violet-100 text-violet-700", role: "Product Designer" },
    ],
  },
  {
    id: "offer",
    label: "Offer",
    color: "bg-emerald-500",
    count: 2,
    candidates: [
      { id: "o1", name: "John Samuel", initials: "JS", avatarColor: "bg-emerald-100 text-emerald-700", role: "Product Designer" },
    ],
  },
];

export const TODAY_EVENTS: CalendarEvent[] = [
  {
    id: "e1",
    time: "09:00",
    title: "Standup · People Ops",
    subtitle: "Zoom · 30 min",
    accent: "bg-blue-500",
  },
  {
    id: "e2",
    time: "10:30",
    title: "Interview · Priya Menon",
    subtitle: "Senior Recruiter role",
    accent: "bg-violet-500",
  },
  {
    id: "e3",
    time: "13:00",
    title: "Payroll review",
    subtitle: "Finance + People Ops",
    accent: "bg-emerald-500",
  },
  {
    id: "e4",
    time: "15:30",
    title: "1:1 · Marcus Lee",
    subtitle: "Onboarding check-in",
    accent: "bg-amber-500",
  },
];
