import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StepIndicator } from "@/components/auth/step-indicator";
import { DepartmentsStep } from "./departments-step";
import { WorkScheduleStep } from "./work-schedule-step";
import { InviteEmployeesStep } from "./invite-employees-step";
import { PayrollSetupStep } from "./payroll-setup-step";
import { DEFAULT_LEAVE_TYPES } from "@/lib/mock-data";
import {
  validateDepartments,
  validateWorkSchedule,
  validateInviteEmployees,
  validatePayrollSetup,
  hasErrors,
} from "@/lib/validators";
import type { ValidationErrors } from "@/lib/validators";
import type {
  OnboardingStep,
  DepartmentsData,
  WorkScheduleData,
  InviteEmployeesData,
  PayrollSetupData,
  Department,
  LeaveType,
  EmployeeInvite,
} from "@/types/onboarding";

const STEPS = [
  { label: "Departments" },
  { label: "Schedule" },
  { label: "Invite" },
  { label: "Payroll" },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

const INITIAL_DEPARTMENTS: DepartmentsData = {
  departments: [],
};

const INITIAL_SCHEDULE: WorkScheduleData = {
  workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  startTime: "09:00",
  endTime: "17:00",
  leaveTypes: DEFAULT_LEAVE_TYPES.map((lt) => ({
    id: generateId(),
    ...lt,
  })),
};

const INITIAL_INVITES: InviteEmployeesData = {
  invites: [],
};

const INITIAL_PAYROLL: PayrollSetupData = {
  paySchedule: "monthly",
  paymentMethod: "bank-transfer",
  pensionEnabled: true,
  employerPensionPercent: 10,
  employeePensionPercent: 8,
  payeEnabled: true,
};

export function SetupWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [deptData, setDeptData] = useState<DepartmentsData>(INITIAL_DEPARTMENTS);
  const [scheduleData, setScheduleData] = useState<WorkScheduleData>(INITIAL_SCHEDULE);
  const [inviteData, setInviteData] = useState<InviteEmployeesData>(INITIAL_INVITES);
  const [payrollData, setPayrollData] = useState<PayrollSetupData>(INITIAL_PAYROLL);

  const [deptErrors, setDeptErrors] = useState<ValidationErrors<DepartmentsData>>({});
  const [scheduleErrors, setScheduleErrors] = useState<ValidationErrors<WorkScheduleData>>({});
  const [inviteErrors, setInviteErrors] = useState<ValidationErrors<InviteEmployeesData>>({});
  const [payrollErrors, setPayrollErrors] = useState<ValidationErrors<PayrollSetupData>>({});

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

  // --- Schedule handlers ---
  function toggleWorkDay(day: WorkScheduleData["workDays"][number]) {
    setScheduleData((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day],
    }));
    setScheduleErrors((prev) => ({ ...prev, workDays: undefined }));
  }

  function updateScheduleField(field: "startTime" | "endTime", value: string) {
    setScheduleData((prev) => ({ ...prev, [field]: value }));
    setScheduleErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function addLeaveType() {
    const lt: LeaveType = { id: generateId(), name: "", annualAllowance: 0 };
    setScheduleData((prev) => ({
      ...prev,
      leaveTypes: [...prev.leaveTypes, lt],
    }));
  }

  function removeLeaveType(id: string) {
    setScheduleData((prev) => ({
      ...prev,
      leaveTypes: prev.leaveTypes.filter((lt) => lt.id !== id),
    }));
  }

  function updateLeaveType(id: string, field: keyof LeaveType, value: string | number) {
    setScheduleData((prev) => ({
      ...prev,
      leaveTypes: prev.leaveTypes.map((lt) =>
        lt.id === id ? { ...lt, [field]: value } : lt
      ),
    }));
    setScheduleErrors((prev) => ({ ...prev, leaveTypes: undefined }));
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

  // --- Payroll handlers ---
  function updatePayrollField(field: keyof PayrollSetupData, value: string | boolean | number) {
    setPayrollData((prev) => ({ ...prev, [field]: value }));
    setPayrollErrors((prev) => ({ ...prev, [field]: undefined }));
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
        const errors = validateWorkSchedule(scheduleData);
        setScheduleErrors(errors);
        return !hasErrors(errors);
      }
      case 3: {
        const errors = validateInviteEmployees(inviteData);
        setInviteErrors(errors);
        return !hasErrors(errors);
      }
      case 4: {
        const errors = validatePayrollSetup(payrollData);
        setPayrollErrors(errors);
        return !hasErrors(errors);
      }
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) return;

    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
    }
  }

  function handleSkipStep() {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    } else {
      handleComplete();
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
      <div className="flex flex-col items-center text-center space-y-6 py-10">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Your workspace is ready!</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            You&apos;ve successfully configured your HR workspace.
            You can always adjust these settings later from the admin panel.
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 py-2">
          {deptData.departments.length > 0 && (
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="text-lg font-bold text-foreground">{deptData.departments.length}</span>
              <span className="text-[11px] text-muted-foreground">Departments</span>
            </div>
          )}
          {inviteData.invites.length > 0 && (
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="text-lg font-bold text-foreground">{inviteData.invites.length}</span>
              <span className="text-[11px] text-muted-foreground">Invites</span>
            </div>
          )}
          {scheduleData.leaveTypes.length > 0 && (
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="text-lg font-bold text-foreground">{scheduleData.leaveTypes.length}</span>
              <span className="text-[11px] text-muted-foreground">Leave Types</span>
            </div>
          )}
        </div>

        <Button onClick={handleComplete} className="w-full max-w-xs">
          <Building2 className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <div className="text-center">
        <button
          type="button"
          onClick={handleComplete}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
        >
          I&apos;ll do this later
        </button>
      </div>

      <Separator />

      <div className="min-h-[420px]">
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
          <WorkScheduleStep
            data={scheduleData}
            errors={scheduleErrors}
            onToggleDay={toggleWorkDay}
            onChangeField={updateScheduleField}
            onAddLeaveType={addLeaveType}
            onRemoveLeaveType={removeLeaveType}
            onUpdateLeaveType={updateLeaveType}
          />
        )}
        {currentStep === 3 && (
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
        {currentStep === 4 && (
          <PayrollSetupStep
            data={payrollData}
            errors={payrollErrors}
            onChange={updatePayrollField}
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
          <div />
        )}

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleSkipStep} disabled={isSubmitting}>
            Skip for now
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : currentStep === 4 ? (
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
