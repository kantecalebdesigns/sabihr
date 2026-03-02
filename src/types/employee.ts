export type Gender = "male" | "female" | "other" | "prefer-not-to-say";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type EmploymentType = "full-time" | "part-time" | "contract" | "intern";
export type EmploymentStatus = "active" | "inactive" | "on-leave" | "suspended" | "terminated";
export type Relationship = "spouse" | "child" | "parent" | "sibling" | "other";

export type DocumentType =
  | "school-cert"
  | "birth-certificate"
  | "passport"
  | "national-id"
  | "drivers-license"
  | "marriage-cert"
  | "offer-letter"
  | "other";

export interface BasicDetails {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: Gender | "";
  maritalStatus: MaritalStatus | "";
  nationality: string;
  stateOfOrigin: string;
  nin: string;
  taxId: string;
  pensionId: string;
  bvn: string;
}

export interface ContactInfo {
  personalEmail: string;
  workEmail: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
}

export interface FamilyDependent {
  id: string;
  name: string;
  relationship: Relationship | "";
  dateOfBirth: string;
  gender: Gender | "";
}

export interface EmployeeDocument {
  id: string;
  type: DocumentType | "";
  name: string;
  fileName: string;
  uploadDate: string;
  expiryDate: string;
  status: "uploaded" | "verified" | "rejected";
}

export interface EmploymentInfo {
  employeeId: string;
  jobTitle: string;
  role: string;
  department: string;
  division: string;
  supervisor: string;
  supervisorTitle: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  startDate: string;
  tenure: string;
  workLocation: string;
  branch: string;
  payGrade: string;
  contractEndDate: string | null;
  contractType: "permanent" | "fixed-term" | "temporary";
  contractDocument: string | null;
  probationEndDate: string | null;
  isProbation: boolean;
}

export interface EmployeeProfile {
  id: string;
  basicDetails: BasicDetails;
  contactInfo: ContactInfo;
  emergencyContacts: EmergencyContact[];
  familyDependents: FamilyDependent[];
  documents: EmployeeDocument[];
  employment: EmploymentInfo;
  profilePhoto: string;
  profileCompletion: number;
}

export interface ColleagueProfile {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  photo: string;
  location: string;
}

export interface OrgChartNode {
  id: string;
  name: string;
  title: string;
  department: string;
  photo: string;
  children: OrgChartNode[];
}

export interface RedeploymentRequest {
  targetDepartment: string;
  reason: string;
  preferredDate: string;
  additionalNotes: string;
}

export interface EmploymentHistoryEntry {
  id: string;
  title: string;
  department: string;
  startDate: string;
  endDate: string | null;
  type: "promotion" | "transfer" | "hire" | "role-change";
}
