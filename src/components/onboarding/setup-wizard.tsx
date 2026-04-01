import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/auth/step-indicator";
import { DepartmentsStep } from "./departments-step";
import { InviteEmployeesStep } from "./invite-employees-step";
import {
  validateDepartments,
  validateInviteEmployees,
  hasErrors,
} from "@/lib/validators";
import type { ValidationErrors } from "@/lib/validators";
import type {
  DepartmentsData,
  InviteEmployeesData,
  Department,
  EmployeeInvite,
} from "@/types/onboarding";

const STEPS = [
  { label: "Departments" },
  { label: "Employees" },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

const INITIAL_DEPARTMENTS: DepartmentsData = {
  departments: [],
};

const INITIAL_INVITES: InviteEmployeesData = {
  invites: [],
};

export function SetupWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [deptData, setDeptData] = useState<DepartmentsData>(INITIAL_DEPARTMENTS);
  const [inviteData, setInviteData] = useState<InviteEmployeesData>(INITIAL_INVITES);

  const [deptErrors, setDeptErrors] = useState<ValidationErrors<DepartmentsData>>({});
  const [inviteErrors, setInviteErrors] = useState<ValidationErrors<InviteEmployeesData>>({});

  // --- Department handlers ---
  function addDepartment(name: string) {
    const dept: Department = { id: generateId(), name, head: "", description: "" };
    setDeptData((prev) => ({ departments: [...prev.departments, dept] }));
    setDeptErrors({});
  }

  function removeDepartment(id: string) {
    setDeptData((prev) => ({
      departments: prev.departments.filter((d) => d.id !== id),
    }));
  }

  function updateDepartment(id: string, field: keyof Department, value: string) {
    setDeptData((prev) => ({
      departments: prev.departments.map((d) =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    }));
    setDeptErrors({});
  }

  // --- Invite handlers ---
  function addInvite() {
    const invite: EmployeeInvite = { id: generateId(), email: "", department: "", role: "" };
    setInviteData((prev) => ({ invites: [...prev.invites, invite] }));
    setInviteErrors({});
  }

  function removeInvite(id: string) {
    setInviteData((prev) => ({
      invites: prev.invites.filter((inv) => inv.id !== id),
    }));
  }

  function updateInvite(id: string, field: keyof EmployeeInvite, value: string) {
    setInviteData((prev) => ({
      invites: prev.invites.map((inv) =>
        inv.id === id ? { ...inv, [field]: value } : inv
      ),
    }));
    setInviteErrors({});
  }

  function bulkAddInvites(text: string) {
    const emails = text
      .split(/[,\n]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    const newInvites: EmployeeInvite[] = emails.map((email) => ({
      id: generateId(),
      email,
      department: "",
      role: "",
    }));
    setInviteData((prev) => ({ invites: [...prev.invites, ...newInvites] }));
    setInviteErrors({});
  }

  // --- Navigation ---
  function validateCurrentStep(): boolean {
    switch (currentStep) {
      case 1: {
        const errors = validateDepartments(deptData);
        setDeptErrors(errors);
        return !hasErrors(errors);
      }
      case 2: {
        const errors = validateInviteEmployees(inviteData);
        setInviteErrors(errors);
        return !hasErrors(errors);
      }
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) return;

    if (currentStep < 2) {
      setCurrentStep(2);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(1);
    }
  }

  function handleComplete() {
    localStorage.setItem("onboardingComplete", "true");
    navigate("/dashboard");
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    // TODO: Send onboarding data to API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full h-px bg-slate-200" />

        <div className="flex flex-col items-center gap-10 py-[22px] w-[384px]">
          <div className="flex flex-col items-center gap-[18px]">
            <div className="w-10 h-10 rounded-full bg-[#f4fcf1] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl font-semibold text-slate-900 text-center">
                Your workspace is ready!
              </h2>
              <p className="text-sm text-slate-500 text-center leading-5 max-w-[362px]">
                You&apos;ve successfully configured your HR workspace.
                You can always adjust these settings later from the admin panel.
              </p>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            className="w-[362px] bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 text-sm font-medium"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <div className="w-full h-px bg-slate-200" />

      <div className="px-[76px] flex flex-col gap-6 items-end">
        <div className="w-full">
          {currentStep === 1 && (
            <DepartmentsStep
              data={deptData}
              errors={deptErrors}
              onAdd={addDepartment}
              onRemove={removeDepartment}
              onUpdate={updateDepartment}
            />
          )}
          {currentStep === 2 && (
            <InviteEmployeesStep
              data={inviteData}
              departments={deptData.departments}
              errors={inviteErrors}
              onAdd={addInvite}
              onRemove={removeInvite}
              onUpdate={updateInvite}
              onBulkAdd={bulkAddInvites}
            />
          )}
        </div>

        <div className="flex items-center w-full">
          {currentStep > 1 && (
            <Button variant="ghost" onClick={handleBack} disabled={isSubmitting} className="mr-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-9 text-sm font-medium ml-auto"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : currentStep === 2 ? (
              "Complete Setup"
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
