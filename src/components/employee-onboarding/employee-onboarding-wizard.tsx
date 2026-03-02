import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StepIndicator } from "@/components/auth/step-indicator";
import { BasicDetailsStep } from "./basic-details-step";
import { ContactInfoStep } from "./contact-info-step";
import { EmergencyContactsStep } from "./emergency-contacts-step";
import { FamilyDependentsStep } from "./family-dependents-step";
import { DocumentsStep } from "./documents-step";
import {
  validateBasicDetails,
  validateContactInfo,
  validateEmergencyContacts,
  validateFamilyDependents,
  validateDocuments,
} from "@/lib/employee-validators";
import { hasErrors } from "@/lib/validators";
import type { ValidationErrors } from "@/lib/validators";
import type { EmployeeOnboardingStep } from "@/types/employee-onboarding";
import type {
  BasicDetailsData,
  ContactInfoData,
  EmergencyContactsData,
  FamilyDependentsData,
  DocumentsData,
} from "@/types/employee-onboarding";

const STEPS = [
  { label: "Personal" },
  { label: "Contact" },
  { label: "Emergency" },
  { label: "Family" },
  { label: "Documents" },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

const INITIAL_BASIC: BasicDetailsData = {
  firstName: "",
  lastName: "",
  middleName: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  nationality: "Nigerian",
  stateOfOrigin: "",
  nin: "",
  taxId: "",
  pensionId: "",
  bvn: "",
};

const INITIAL_CONTACT: ContactInfoData = {
  personalEmail: "",
  workEmail: "",
  phone: "",
  alternatePhone: "",
  address: "",
  city: "",
  state: "",
  country: "Nigeria",
};

const INITIAL_EMERGENCY: EmergencyContactsData = {
  contacts: [{ id: generateId(), name: "", relationship: "", phone: "", email: "", address: "" }],
};

const INITIAL_FAMILY: FamilyDependentsData = {
  dependents: [],
};

const INITIAL_DOCUMENTS: DocumentsData = {
  documents: [],
};

export function EmployeeOnboardingWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<EmployeeOnboardingStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Step data
  const [basicDetails, setBasicDetails] = useState<BasicDetailsData>(INITIAL_BASIC);
  const [contactInfo, setContactInfo] = useState<ContactInfoData>(INITIAL_CONTACT);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactsData>(INITIAL_EMERGENCY);
  const [familyDependents, setFamilyDependents] = useState<FamilyDependentsData>(INITIAL_FAMILY);
  const [documents, setDocuments] = useState<DocumentsData>(INITIAL_DOCUMENTS);

  // Step errors
  const [basicErrors, setBasicErrors] = useState<ValidationErrors<BasicDetailsData>>({});
  const [contactErrors, setContactErrors] = useState<ValidationErrors<ContactInfoData>>({});
  const [emergencyErrors, setEmergencyErrors] = useState<ValidationErrors<EmergencyContactsData>>({});
  const [familyErrors, setFamilyErrors] = useState<ValidationErrors<FamilyDependentsData>>({});
  const [documentErrors, setDocumentErrors] = useState<ValidationErrors<DocumentsData>>({});

  function validateCurrentStep(): boolean {
    switch (currentStep) {
      case 1: {
        const errs = validateBasicDetails(basicDetails);
        setBasicErrors(errs);
        return !hasErrors(errs);
      }
      case 2: {
        const errs = validateContactInfo(contactInfo);
        setContactErrors(errs);
        return !hasErrors(errs);
      }
      case 3: {
        const errs = validateEmergencyContacts(emergencyContacts);
        setEmergencyErrors(errs);
        return !hasErrors(errs);
      }
      case 4: {
        const errs = validateFamilyDependents(familyDependents);
        setFamilyErrors(errs);
        return !hasErrors(errs);
      }
      case 5: {
        const errs = validateDocuments(documents);
        setDocumentErrors(errs);
        return !hasErrors(errs);
      }
      default:
        return true;
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as EmployeeOnboardingStep);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as EmployeeOnboardingStep);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    localStorage.setItem("employeeOnboardingComplete", "true");
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Profile Setup Complete!</h2>
          <p className="text-muted-foreground max-w-md">
            Your personal information has been saved. You can update your profile anytime from your dashboard.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 pt-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {emergencyContacts.contacts.length}
            </p>
            <p className="text-xs text-muted-foreground">Emergency Contacts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {familyDependents.dependents.length}
            </p>
            <p className="text-xs text-muted-foreground">Dependents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {documents.documents.length}
            </p>
            <p className="text-xs text-muted-foreground">Documents</p>
          </div>
        </div>
        <Button onClick={() => navigate("/employee/dashboard")} className="mt-4">
          <span className="flex items-center gap-2">
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepIndicator steps={STEPS} currentStep={currentStep} />
      <Separator />

      <div className="min-h-[420px]">
        {currentStep === 1 && (
          <BasicDetailsStep
            data={basicDetails}
            errors={basicErrors}
            onChange={(updates) => {
              setBasicDetails((prev) => ({ ...prev, ...updates }));
              setBasicErrors({});
            }}
          />
        )}
        {currentStep === 2 && (
          <ContactInfoStep
            data={contactInfo}
            errors={contactErrors}
            onChange={(updates) => {
              setContactInfo((prev) => ({ ...prev, ...updates }));
              setContactErrors({});
            }}
          />
        )}
        {currentStep === 3 && (
          <EmergencyContactsStep
            data={emergencyContacts}
            errors={emergencyErrors}
            onChange={(updates) => {
              setEmergencyContacts(updates);
              setEmergencyErrors({});
            }}
          />
        )}
        {currentStep === 4 && (
          <FamilyDependentsStep
            data={familyDependents}
            errors={familyErrors}
            onChange={(updates) => {
              setFamilyDependents(updates);
              setFamilyErrors({});
            }}
          />
        )}
        {currentStep === 5 && (
          <DocumentsStep
            data={documents}
            errors={documentErrors}
            onChange={(updates) => {
              setDocuments(updates);
              setDocumentErrors({});
            }}
          />
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={currentStep === 1 ? "invisible" : ""}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Step {currentStep} of 5
          </span>
        </div>

        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          ) : currentStep === 5 ? (
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Complete Setup
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
