import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StepIndicator } from "./step-indicator";
import { CompanyInfoStep } from "./company-info-step";
import { AdminUserStep } from "./admin-user-step";
import { PlanSelectionStep } from "./plan-selection-step";
import type {
  RegistrationStep,
  CompanyInfoData,
  AdminUserData,
  PlanSelectionData,
} from "@/types/auth";
import {
  validateCompanyInfo,
  validateAdminUser,
  validatePlanSelection,
  hasErrors,
} from "@/lib/validators";
import type { ValidationErrors } from "@/lib/validators";

const STEPS = [
  { label: "Company" },
  { label: "Admin" },
  { label: "Plan" },
];

const INITIAL_COMPANY: CompanyInfoData = {
  companyName: "",
  rcNumber: "",
  tinNumber: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  industry: "",
  employeeCount: "",
  logo: null,
  logoPreview: "",
};

const INITIAL_ADMIN: AdminUserData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const INITIAL_PLAN: PlanSelectionData = {
  planId: "",
  billingCycle: "quarterly",
};

export function RegisterWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [companyData, setCompanyData] = useState<CompanyInfoData>(INITIAL_COMPANY);
  const [adminData, setAdminData] = useState<AdminUserData>(INITIAL_ADMIN);
  const [planData, setPlanData] = useState<PlanSelectionData>(INITIAL_PLAN);

  const [companyErrors, setCompanyErrors] = useState<ValidationErrors<CompanyInfoData>>({});
  const [adminErrors, setAdminErrors] = useState<ValidationErrors<AdminUserData>>({});
  const [planErrors, setPlanErrors] = useState<ValidationErrors<PlanSelectionData>>({});

  function updateCompanyField(field: keyof CompanyInfoData, value: string) {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
    setCompanyErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleLogoChange(file: File | null) {
    if (companyData.logoPreview) {
      URL.revokeObjectURL(companyData.logoPreview);
    }
    if (file) {
      const preview = URL.createObjectURL(file);
      setCompanyData((prev) => ({ ...prev, logo: file, logoPreview: preview }));
    } else {
      setCompanyData((prev) => ({ ...prev, logo: null, logoPreview: "" }));
    }
  }

  function updateAdminField(field: keyof AdminUserData, value: string) {
    setAdminData((prev) => ({ ...prev, [field]: value }));
    setAdminErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function updatePlanField(field: keyof PlanSelectionData, value: string) {
    setPlanData((prev) => ({ ...prev, [field]: value }));
    setPlanErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateCurrentStep(): boolean {
    switch (currentStep) {
      case 1: {
        const errors = validateCompanyInfo(companyData);
        setCompanyErrors(errors);
        return !hasErrors(errors);
      }
      case 2: {
        const errors = validateAdminUser(adminData);
        setAdminErrors(errors);
        return !hasErrors(errors);
      }
      case 3: {
        const errors = validatePlanSelection(planData);
        setPlanErrors(errors);
        return !hasErrors(errors);
      }
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) return;

    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as RegistrationStep);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);

    // TODO: send registration data to API
    // { company: companyData, admin: adminData, plan: planData }

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Registration complete!</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your company <strong>{companyData.companyName}</strong> has been registered
            successfully. Next, let&apos;s configure your HR workspace.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs items-center">
          <Button onClick={() => navigate("/onboarding")} className="w-full">
            <Building2 className="w-4 h-4 mr-2" />
            Set Up Your Workspace
          </Button>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("onboardingComplete", "true");
              navigate("/dashboard");
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Skip setup, go to dashboard
          </button>
          <p className="text-xs text-muted-foreground">
            A confirmation email has been sent to{" "}
            <strong>{adminData.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <Separator />

      <div className="min-h-[420px]">
        {currentStep === 1 && (
          <CompanyInfoStep
            data={companyData}
            errors={companyErrors}
            onChange={updateCompanyField}
            onLogoChange={handleLogoChange}
          />
        )}
        {currentStep === 2 && (
          <AdminUserStep
            data={adminData}
            errors={adminErrors}
            onChange={updateAdminField}
          />
        )}
        {currentStep === 3 && (
          <PlanSelectionStep
            data={planData}
            errors={planErrors}
            onChange={updatePlanField}
          />
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        {currentStep > 1 ? (
          <Button variant="ghost" onClick={handleBack} disabled={isSubmitting}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sign in instead
            </Button>
          </Link>
        )}

        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </span>
          ) : currentStep === 3 ? (
            "Complete Registration"
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
