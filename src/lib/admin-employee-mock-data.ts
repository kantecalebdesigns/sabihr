import type { WorkLocation, Branch, PayGradeLevel, ProbationStatus } from "@/types/admin-employee";

// ---- Work Locations ----
export const WORK_LOCATIONS: WorkLocation[] = [
  { id: "loc-1", name: "Lagos Office", state: "Lagos", address: "15 Admiralty Way, Lekki Phase 1, Lagos" },
  { id: "loc-2", name: "Abuja Office", state: "FCT - Abuja", address: "Plot 42, Ahmadu Bello Way, Central Area, Abuja" },
  { id: "loc-3", name: "Kano Office", state: "Kano", address: "12 Ibrahim Taiwo Road, Kano" },
  { id: "loc-4", name: "Port Harcourt Office", state: "Rivers", address: "8 Aba Road, Port Harcourt" },
  { id: "loc-5", name: "Remote", state: "", address: "" },
];

// ---- Branches (linked to locations via locationId) ----
export const BRANCHES: Branch[] = [
  { id: "br-1", name: "Head Office - Victoria Island", locationId: "loc-1" },
  { id: "br-2", name: "Lekki Phase 1 Branch", locationId: "loc-1" },
  { id: "br-3", name: "Ikeja Branch", locationId: "loc-1" },
  { id: "br-4", name: "Central Area Branch", locationId: "loc-2" },
  { id: "br-5", name: "Garki Branch", locationId: "loc-2" },
  { id: "br-6", name: "Nassarawa GRA Branch", locationId: "loc-3" },
  { id: "br-7", name: "Main Office", locationId: "loc-4" },
  { id: "br-8", name: "N/A", locationId: "loc-5" },
];

// ---- Pay Grade Scale ----
export const PAY_GRADES: PayGradeLevel[] = [
  { id: "pg-1", grade: "Grade 1", label: "Entry Level", minSalary: 1_200_000, maxSalary: 2_000_000 },
  { id: "pg-2", grade: "Grade 2", label: "Junior", minSalary: 2_000_000, maxSalary: 3_200_000 },
  { id: "pg-3", grade: "Grade 3", label: "Mid-Level", minSalary: 3_200_000, maxSalary: 4_800_000 },
  { id: "pg-4", grade: "Grade 4", label: "Senior", minSalary: 4_800_000, maxSalary: 6_500_000 },
  { id: "pg-5", grade: "Grade 5", label: "Lead", minSalary: 6_500_000, maxSalary: 8_500_000 },
  { id: "pg-6", grade: "Grade 6", label: "Principal", minSalary: 8_500_000, maxSalary: 12_000_000 },
  { id: "pg-7", grade: "Grade 7", label: "Senior Principal", minSalary: 12_000_000, maxSalary: 18_000_000 },
  { id: "pg-8", grade: "Grade 8", label: "Director", minSalary: 18_000_000, maxSalary: 25_000_000 },
  { id: "pg-9", grade: "Grade 9", label: "VP", minSalary: 25_000_000, maxSalary: 40_000_000 },
  { id: "pg-10", grade: "Grade 10", label: "Executive", minSalary: 40_000_000, maxSalary: 80_000_000 },
];

// ---- Contract Type Options ----
export const CONTRACT_TYPE_OPTIONS = [
  { value: "permanent" as const, label: "Permanent", description: "Ongoing employment with no end date" },
  { value: "fixed-term" as const, label: "Fixed-Term", description: "Contract with a defined end date" },
  { value: "temporary" as const, label: "Temporary", description: "Short-term or casual employment" },
];

// ---- Probation Status Options ----
export const PROBATION_STATUS_OPTIONS: { value: ProbationStatus; label: string; color: string }[] = [
  { value: "in-probation", label: "In Probation", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "completed", label: "Completed", color: "bg-success/10 text-success border-success/20" },
  { value: "extended", label: "Extended", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "failed", label: "Failed", color: "bg-destructive/10 text-destructive border-destructive/20" },
];

// ---- Probation Duration Options ----
export const PROBATION_DURATION_OPTIONS = [
  { value: 3, label: "3 months" },
  { value: 6, label: "6 months" },
  { value: 9, label: "9 months" },
  { value: 12, label: "12 months" },
];
