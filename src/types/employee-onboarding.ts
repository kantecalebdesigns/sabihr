import type {
  BasicDetails,
  ContactInfo,
  EmergencyContact,
  FamilyDependent,
  EmployeeDocument,
} from "./employee";

export type EmployeeOnboardingStep = 1 | 2 | 3 | 4 | 5;

export interface BasicDetailsData extends BasicDetails {}

export interface ContactInfoData extends ContactInfo {}

export interface EmergencyContactsData {
  contacts: EmergencyContact[];
}

export interface FamilyDependentsData {
  dependents: FamilyDependent[];
}

export interface DocumentsData {
  documents: EmployeeDocument[];
}
