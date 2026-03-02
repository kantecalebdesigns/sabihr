import type { ValidationErrors } from "@/lib/validators";
import type {
  BasicDetailsData,
  ContactInfoData,
  EmergencyContactsData,
  FamilyDependentsData,
  DocumentsData,
} from "@/types/employee-onboarding";
import type { RedeploymentRequest } from "@/types/employee";

export function validateBasicDetails(data: BasicDetailsData): ValidationErrors<BasicDetailsData> {
  const errors: ValidationErrors<BasicDetailsData> = {};

  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";
  if (!data.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
  if (!data.gender) errors.gender = "Gender is required";
  if (!data.nationality.trim()) errors.nationality = "Nationality is required";
  if (!data.stateOfOrigin) errors.stateOfOrigin = "State of origin is required";

  return errors;
}

export function validateContactInfo(data: ContactInfoData): ValidationErrors<ContactInfoData> {
  const errors: ValidationErrors<ContactInfoData> = {};

  if (!data.personalEmail.trim()) {
    errors.personalEmail = "Personal email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalEmail)) {
    errors.personalEmail = "Enter a valid email address";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^(\+234|0)[789]\d{9}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a valid Nigerian phone number";
  }

  if (!data.address.trim()) errors.address = "Address is required";
  if (!data.city.trim()) errors.city = "City is required";
  if (!data.state) errors.state = "State is required";

  return errors;
}

export function validateEmergencyContacts(
  data: EmergencyContactsData
): ValidationErrors<EmergencyContactsData> {
  const errors: ValidationErrors<EmergencyContactsData> = {};

  if (data.contacts.length === 0) {
    errors.contacts = "Add at least one emergency contact";
    return errors;
  }

  const hasEmptyName = data.contacts.some((c) => !c.name.trim());
  if (hasEmptyName) {
    errors.contacts = "All contacts must have a name";
    return errors;
  }

  const hasEmptyPhone = data.contacts.some((c) => !c.phone.trim());
  if (hasEmptyPhone) {
    errors.contacts = "All contacts must have a phone number";
    return errors;
  }

  const hasEmptyRelationship = data.contacts.some((c) => !c.relationship.trim());
  if (hasEmptyRelationship) {
    errors.contacts = "All contacts must have a relationship specified";
  }

  return errors;
}

export function validateFamilyDependents(
  _data: FamilyDependentsData
): ValidationErrors<FamilyDependentsData> {
  // Family dependents are optional — no required validation
  return {};
}

export function validateDocuments(data: DocumentsData): ValidationErrors<DocumentsData> {
  const errors: ValidationErrors<DocumentsData> = {};

  if (data.documents.length === 0) {
    errors.documents = "Upload at least one document";
    return errors;
  }

  const hasEmptyType = data.documents.some((d) => !d.type);
  if (hasEmptyType) {
    errors.documents = "All documents must have a type selected";
    return errors;
  }

  const hasEmptyName = data.documents.some((d) => !d.fileName.trim());
  if (hasEmptyName) {
    errors.documents = "All documents must have a file uploaded";
  }

  return errors;
}

export function validateRedeploymentRequest(
  data: RedeploymentRequest
): ValidationErrors<RedeploymentRequest> {
  const errors: ValidationErrors<RedeploymentRequest> = {};

  if (!data.targetDepartment) errors.targetDepartment = "Select a target department";
  if (!data.reason.trim()) errors.reason = "Please provide a reason for the request";
  if (!data.preferredDate) errors.preferredDate = "Preferred date is required";

  return errors;
}
