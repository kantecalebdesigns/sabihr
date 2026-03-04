// Work Location & Branch

export interface WorkLocation {
  id: string;
  name: string;
  state: string;
  address: string;
}

export interface Branch {
  id: string;
  name: string;
  locationId: string;
}

export interface WorkLocationFormData {
  workLocation: string;
  branch: string;
  effectiveDate: string;
}

// Pay Grade

export interface PayGradeLevel {
  id: string;
  grade: string;
  label: string;
  minSalary: number;
  maxSalary: number;
}

export interface PayGradeFormData {
  payGrade: string;
  effectiveDate: string;
  notes: string;
}

// Probation

export type ProbationStatus = "in-probation" | "completed" | "extended" | "failed";

export interface ProbationFormData {
  isProbation: boolean;
  probationEndDate: string;
  probationStatus: ProbationStatus;
  notes: string;
}

// Contract

export type ContractType = "permanent" | "fixed-term" | "temporary";

export interface ContractFormData {
  contractType: ContractType;
  contractEndDate: string;
  renewalDate: string;
  notes: string;
}
