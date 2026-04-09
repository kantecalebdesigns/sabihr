import { useState } from "react";
import {
  User,
  Phone,
  ShieldAlert,
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BasicDetailsStep } from "@/components/employee-onboarding/basic-details-step";
import { ContactInfoStep } from "@/components/employee-onboarding/contact-info-step";
import { EmergencyContactsStep } from "@/components/employee-onboarding/emergency-contacts-step";
import { FamilyDependentsStep } from "@/components/employee-onboarding/family-dependents-step";
import {
  validateBasicDetails,
  validateContactInfo,
  validateEmergencyContacts,
  validateFamilyDependents,
} from "@/lib/employee-validators";
import { hasErrors } from "@/lib/validators";
import type { ValidationErrors } from "@/lib/validators";
import type {
  BasicDetailsData,
  ContactInfoData,
  EmergencyContactsData,
  FamilyDependentsData,
} from "@/types/employee-onboarding";

// ── Shared wrapper ─────────────────────────────────────────────────

interface SetupCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: () => Promise<boolean>;
  required?: boolean;
}

function SetupCard({ icon, title, description, children, onSubmit, required }: SetupCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return null;

  async function handleSubmit() {
    setSubmitting(true);
    const valid = await onSubmit();
    setSubmitting(false);
    if (valid) setDone(true);
  }

  return (
    <div className="rounded-xl border border-[#efefef] bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 w-full px-4 py-3 sm:px-5 sm:py-4 text-left hover:bg-[#f8fafc] transition-colors"
      >
        <div className="w-9 h-9 rounded-[10px] bg-[#f0f4f8] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {required && (
              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Required
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        <div className="shrink-0 text-slate-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-4 border-t border-[#efefef] pt-4">
          {children}

          <div className="flex justify-end pt-2">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Save & Continue
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// ── Basic Details Card ──────────────────────────────────────────────

export function BasicDetailsCard() {
  const [data, setData] = useState<BasicDetailsData>({
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
  });
  const [errors, setErrors] = useState<ValidationErrors<BasicDetailsData>>({});

  async function handleSubmit(): Promise<boolean> {
    const errs = validateBasicDetails(data);
    setErrors(errs);
    if (hasErrors(errs)) return false;

    // Mock API
    await new Promise((r) => setTimeout(r, 800));
    return true;
  }

  return (
    <SetupCard
      icon={<User className="w-4.5 h-4.5 text-slate-500" />}
      title="Personal Details"
      description="Name, date of birth, gender, nationality, and statutory IDs"
      onSubmit={handleSubmit}
      required
    >
      <BasicDetailsStep
        data={data}
        errors={errors}
        onChange={(updates) => {
          setData((prev) => ({ ...prev, ...updates }));
          setErrors({});
        }}
      />
    </SetupCard>
  );
}

// ── Contact Info Card ───────────────────────────────────────────────

export function ContactInfoCard() {
  const [data, setData] = useState<ContactInfoData>({
    personalEmail: "",
    workEmail: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
  });
  const [errors, setErrors] = useState<ValidationErrors<ContactInfoData>>({});

  async function handleSubmit(): Promise<boolean> {
    const errs = validateContactInfo(data);
    setErrors(errs);
    if (hasErrors(errs)) return false;

    await new Promise((r) => setTimeout(r, 800));
    return true;
  }

  return (
    <SetupCard
      icon={<Phone className="w-4.5 h-4.5 text-slate-500" />}
      title="Contact Information"
      description="Email, phone number, and residential address"
      onSubmit={handleSubmit}
      required
    >
      <ContactInfoStep
        data={data}
        errors={errors}
        onChange={(updates) => {
          setData((prev) => ({ ...prev, ...updates }));
          setErrors({});
        }}
      />
    </SetupCard>
  );
}

// ── Emergency Contacts Card ─────────────────────────────────────────

export function EmergencyContactsCard() {
  const [data, setData] = useState<EmergencyContactsData>({
    contacts: [{ id: generateId(), name: "", relationship: "", phone: "", email: "", address: "" }],
  });
  const [errors, setErrors] = useState<ValidationErrors<EmergencyContactsData>>({});

  async function handleSubmit(): Promise<boolean> {
    const errs = validateEmergencyContacts(data);
    setErrors(errs);
    if (hasErrors(errs)) return false;

    await new Promise((r) => setTimeout(r, 800));
    return true;
  }

  return (
    <SetupCard
      icon={<ShieldAlert className="w-4.5 h-4.5 text-slate-500" />}
      title="Emergency Contacts"
      description="At least one person we can reach in case of emergency"
      onSubmit={handleSubmit}
      required
    >
      <EmergencyContactsStep
        data={data}
        errors={errors}
        onChange={(updates) => {
          setData(updates);
          setErrors({});
        }}
      />
    </SetupCard>
  );
}

// ── Family Dependents Card ──────────────────────────────────────────

export function FamilyDependentsCard() {
  const [data, setData] = useState<FamilyDependentsData>({
    dependents: [],
  });
  const [errors, setErrors] = useState<ValidationErrors<FamilyDependentsData>>({});

  async function handleSubmit(): Promise<boolean> {
    const errs = validateFamilyDependents(data);
    setErrors(errs);
    if (hasErrors(errs)) return false;

    await new Promise((r) => setTimeout(r, 800));
    return true;
  }

  return (
    <SetupCard
      icon={<Users className="w-4.5 h-4.5 text-slate-500" />}
      title="Family & Dependents"
      description="Add your spouse, children, or other dependents (optional)"
      onSubmit={handleSubmit}
    >
      <FamilyDependentsStep
        data={data}
        errors={errors}
        onChange={(updates) => {
          setData(updates);
          setErrors({});
        }}
      />
    </SetupCard>
  );
}
