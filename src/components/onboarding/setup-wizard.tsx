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
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <div className="flex flex-col items-center gap-2 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
            Your workspace is ready
          </h2>
          <p className="text-sm text-slate-500 text-center leading-relaxed">
            You've successfully configured your HR workspace. You can always adjust these
            settings later from the admin panel.
          </p>
        </div>
        <Button
          onClick={handleComplete}
          className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <div className="w-full h-px bg-slate-200/70" />

      <div className="flex flex-col gap-6">
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

        <div className="flex items-center w-full pt-2 border-t border-slate-200/70 -mx-6 sm:-mx-10 px-6 sm:px-10 pt-5">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 ml-auto"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : currentStep === 2 ? (
              "Complete setup"
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
