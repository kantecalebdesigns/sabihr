import type { ValidationErrors } from "@/lib/validators";
import type {
  BasicDetailsData,
  ContactInfoData,
  EmergencyContactsData,
  FamilyDependentsData,
  DocumentsData,
} from "@/types/employee-onboarding";
import type { RedeploymentRequest } from "@/types/employee";

export function validateBasicDetails(_data: BasicDetailsData): ValidationErrors<BasicDetailsData> {
  return {};
}

export function validateContactInfo(_data: ContactInfoData): ValidationErrors<ContactInfoData> {
  return {};
}

export function validateEmergencyContacts(
  _data: EmergencyContactsData
): ValidationErrors<EmergencyContactsData> {
  return {};
}

export function validateFamilyDependents(
  _data: FamilyDependentsData
): ValidationErrors<FamilyDependentsData> {
  // Family dependents are optional — no required validation
  return {};
}

export function validateDocuments(_data: DocumentsData): ValidationErrors<DocumentsData> {
  return {};
}

export function validateRedeploymentRequest(
  _data: RedeploymentRequest
): ValidationErrors<RedeploymentRequest> {
  return {};
}
