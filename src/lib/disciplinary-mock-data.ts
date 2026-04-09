export type CaseStatus = "reported" | "investigating" | "hearing" | "sanctioned" | "closed" | "appealed";
export type Severity = "minor" | "major" | "gross";

export interface DisciplinaryCase {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  offence: string;
  severity: Severity;
  status: CaseStatus;
  reportedBy: string;
  reportedDate: string;
  description: string;
  sanction: string | null;
  sanctionDate: string | null;
}

export interface OffenceType {
  id: string;
  name: string;
  severity: Severity;
  description: string;
}

export interface SanctionType {
  id: string;
  name: string;
  level: number;
  description: string;
}

export const CASE_STATUS_STYLES: Record<CaseStatus, { label: string; color: string }> = {
  reported: { label: "Reported", color: "text-amber-700" },
  investigating: { label: "Investigating", color: "text-blue-700" },
  hearing: { label: "Hearing", color: "text-violet-700" },
  sanctioned: { label: "Sanctioned", color: "text-red-700" },
  closed: { label: "Closed", color: "text-gray-500" },
  appealed: { label: "Appealed", color: "text-orange-700" },
};

export const SEVERITY_STYLES: Record<Severity, { label: string; color: string }> = {
  minor: { label: "Minor", color: "text-amber-700" },
  major: { label: "Major", color: "text-orange-700" },
  gross: { label: "Gross", color: "text-red-700" },
};

export const MOCK_OFFENCE_TYPES: OffenceType[] = [
  { id: "off-1", name: "Tardiness", severity: "minor", description: "Repeated late arrival to work" },
  { id: "off-2", name: "Unauthorized Absence", severity: "minor", description: "Absence without prior approval" },
  { id: "off-3", name: "Insubordination", severity: "major", description: "Refusal to follow reasonable instructions" },
  { id: "off-4", name: "Harassment", severity: "gross", description: "Any form of workplace harassment" },
  { id: "off-5", name: "Data Breach", severity: "gross", description: "Unauthorized access or sharing of confidential data" },
  { id: "off-6", name: "Policy Violation", severity: "minor", description: "Breach of company policies" },
  { id: "off-7", name: "Negligence", severity: "major", description: "Failure to exercise reasonable care" },
  { id: "off-8", name: "Fraud", severity: "gross", description: "Intentional deception for personal gain" },
  { id: "off-9", name: "Substance Abuse", severity: "major", description: "Being under influence during work" },
  { id: "off-10", name: "Property Damage", severity: "major", description: "Deliberate damage to company property" },
];

export const MOCK_SANCTION_TYPES: SanctionType[] = [
  { id: "san-1", name: "Verbal Warning", level: 1, description: "Documented verbal warning" },
  { id: "san-2", name: "Written Warning", level: 2, description: "Formal written warning letter" },
  { id: "san-3", name: "Final Warning", level: 3, description: "Final warning before further action" },
  { id: "san-4", name: "Suspension", level: 4, description: "Temporary suspension from duties" },
  { id: "san-5", name: "Demotion", level: 5, description: "Reduction in rank or grade" },
  { id: "san-6", name: "Termination", level: 6, description: "Dismissal from employment" },
];

export const MOCK_CASES: DisciplinaryCase[] = [
  { id: "case-1", employeeId: "emp-017", employeeName: "Olumide Fashola", department: "Sales", offence: "Unauthorized Absence", severity: "minor", status: "investigating", reportedBy: "Ngozi Ibe", reportedDate: "2026-03-28", description: "Employee was absent for 3 consecutive days without approval or communication.", sanction: null, sanctionDate: null },
  { id: "case-2", employeeId: "emp-019", employeeName: "Segun Adeniyi", department: "Operations", offence: "Negligence", severity: "major", status: "hearing", reportedBy: "Ibrahim Musa", reportedDate: "2026-03-15", description: "Failed to follow safety protocols during warehouse inspection, resulting in a near-miss incident.", sanction: null, sanctionDate: null },
  { id: "case-3", employeeId: "emp-014", employeeName: "Damilola Osei", department: "Engineering", offence: "Policy Violation", severity: "minor", status: "sanctioned", reportedBy: "Chiamaka Eze", reportedDate: "2026-02-20", description: "Shared internal code repository access credentials with an external party without authorization.", sanction: "Written Warning", sanctionDate: "2026-03-05" },
  { id: "case-4", employeeId: "emp-007", employeeName: "Tochukwu Nwankwo", department: "Engineering", offence: "Tardiness", severity: "minor", status: "closed", reportedBy: "Adebayo Ogunlesi", reportedDate: "2026-01-10", description: "Consistently late to work for 2 weeks. Resolved after verbal counseling.", sanction: "Verbal Warning", sanctionDate: "2026-01-15" },
  { id: "case-5", employeeId: "emp-017", employeeName: "Olumide Fashola", department: "Sales", offence: "Insubordination", severity: "major", status: "appealed", reportedBy: "Ngozi Ibe", reportedDate: "2026-02-01", description: "Refused to attend mandatory sales training and argued with manager in front of team.", sanction: "Suspension", sanctionDate: "2026-02-15" },
];
