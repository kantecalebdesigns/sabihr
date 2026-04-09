import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Check,
  User,
  Phone,
  Briefcase,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Section = "personal" | "contact" | "employment" | "review";

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "personal", label: "Personal Info", icon: <User className="w-4 h-4" /> },
  { key: "contact", label: "Contact Details", icon: <Phone className="w-4 h-4" /> },
  { key: "employment", label: "Employment", icon: <Briefcase className="w-4 h-4" /> },
  { key: "review", label: "Review", icon: <FileText className="w-4 h-4" /> },
];

const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
  "Operations",
  "Legal",
  "IT",
];

const LOCATIONS = ["Lagos Office", "Abuja Office", "Kano Office"];

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Section>("personal");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    nationality: "",
    stateOfOrigin: "",
    personalEmail: "",
    workEmail: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    jobTitle: "",
    department: "",
    employmentType: "",
    startDate: "",
    workLocation: "",
    supervisor: "",
    payGrade: "",
    contractType: "",
  });

  const stepIndex = SECTIONS.findIndex((s) => s.key === step);

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const goNext = () => {
    if (stepIndex < SECTIONS.length - 1) setStep(SECTIONS[stepIndex + 1].key);
  };
  const goPrev = () => {
    if (stepIndex > 0) setStep(SECTIONS[stepIndex - 1].key);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("employee-draft", JSON.stringify({ form, step }));
      setSaving(false);
      showToast("Draft saved successfully");
    }, 800);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      localStorage.removeItem("employee-draft");
      showToast("Employee added successfully");
      setTimeout(() => navigate("/employees"), 1000);
    }, 1200);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </button>
        <h1 className="text-xl font-semibold tracking-tight">Add New Employee</h1>
        <p className="text-sm text-slate-500">
          Fill in the details below to add a new employee to the organisation
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {SECTIONS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(s.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              step === s.key
                ? "bg-primary text-primary-foreground"
                : i < stepIndex
                  ? "bg-[#f8fafc] text-blue-600"
                  : "bg-[#f8fafc] text-slate-500 hover:text-slate-900"
            )}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current">
              {i + 1}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Section: Personal Info */}
      {step === "personal" && (
        <div className="rounded-xl border border-[#efefef] bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <User className="w-4 h-4" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="e.g. Adebayo"
                value={form.firstName}
                onChange={(e) => updateForm("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="e.g. Ogunlesi"
                value={form.lastName}
                onChange={(e) => updateForm("lastName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                placeholder="e.g. Chukwuemeka"
                value={form.middleName}
                onChange={(e) => updateForm("middleName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateForm("dateOfBirth", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Gender *</Label>
              <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Marital Status</Label>
              <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                placeholder="e.g. Nigerian"
                value={form.nationality}
                onChange={(e) => updateForm("nationality", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stateOfOrigin">State of Origin</Label>
              <Input
                id="stateOfOrigin"
                placeholder="e.g. Lagos"
                value={form.stateOfOrigin}
                onChange={(e) => updateForm("stateOfOrigin", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Section: Contact Details */}
      {step === "contact" && (
        <div className="rounded-xl border border-[#efefef] bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Phone className="w-4 h-4" /> Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="personalEmail">Personal Email *</Label>
              <Input
                id="personalEmail"
                type="email"
                placeholder="personal@email.com"
                value={form.personalEmail}
                onChange={(e) => updateForm("personalEmail", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="workEmail">Work Email *</Label>
              <Input
                id="workEmail"
                type="email"
                placeholder="name@sabihr.com"
                value={form.workEmail}
                onChange={(e) => updateForm("workEmail", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+234..."
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                placeholder="+234..."
                value={form.alternatePhone}
                onChange={(e) => updateForm("alternatePhone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Residential Address *</Label>
              <Input
                id="address"
                placeholder="Street address"
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g. Lagos"
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="e.g. Lagos"
                value={form.state}
                onChange={(e) => updateForm("state", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="e.g. Nigeria"
                value={form.country}
                onChange={(e) => updateForm("country", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Section: Employment */}
      {step === "employment" && (
        <div className="rounded-xl border border-[#efefef] bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Employment Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Software Engineer"
                value={form.jobTitle}
                onChange={(e) => updateForm("jobTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Department *</Label>
              <Select value={form.department} onValueChange={(v) => updateForm("department", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Employment Type *</Label>
              <Select value={form.employmentType} onValueChange={(v) => updateForm("employmentType", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Contract Type</Label>
              <Select value={form.contractType} onValueChange={(v) => updateForm("contractType", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="fixed-term">Fixed-term</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => updateForm("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Work Location *</Label>
              <Select value={form.workLocation} onValueChange={(v) => updateForm("workLocation", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                placeholder="e.g. Chiamaka Eze"
                value={form.supervisor}
                onChange={(e) => updateForm("supervisor", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payGrade">Pay Grade</Label>
              <Input
                id="payGrade"
                placeholder="e.g. Grade 5"
                value={form.payGrade}
                onChange={(e) => updateForm("payGrade", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Section: Review */}
      {step === "review" && (
        <div className="rounded-xl border border-[#efefef] bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" /> Review & Submit
          </h2>

          <div className="space-y-4">
            {/* Personal */}
            <div className="rounded-lg bg-[#f8fafc] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Personal Information
                </h3>
                <button
                  onClick={() => setStep("personal")}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Full Name</p>
                  <p className="font-medium">
                    {[form.firstName, form.middleName, form.lastName].filter(Boolean).join(" ") || "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date of Birth</p>
                  <p className="font-medium">{form.dateOfBirth || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Gender</p>
                  <p className="font-medium capitalize">{form.gender || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Nationality</p>
                  <p className="font-medium">{form.nationality || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">State of Origin</p>
                  <p className="font-medium">{form.stateOfOrigin || "--"}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-lg bg-[#f8fafc] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact Details
                </h3>
                <button
                  onClick={() => setStep("contact")}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Work Email</p>
                  <p className="font-medium">{form.workEmail || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Personal Email</p>
                  <p className="font-medium">{form.personalEmail || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-medium">{form.phone || "--"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="font-medium">
                    {[form.address, form.city, form.state, form.country].filter(Boolean).join(", ") || "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* Employment */}
            <div className="rounded-lg bg-[#f8fafc] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Employment Details
                </h3>
                <button
                  onClick={() => setStep("employment")}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Job Title</p>
                  <p className="font-medium">{form.jobTitle || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="font-medium">{form.department || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Employment Type</p>
                  <p className="font-medium capitalize">{form.employmentType.replace("-", " ") || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Start Date</p>
                  <p className="font-medium">{form.startDate || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Work Location</p>
                  <p className="font-medium">{form.workLocation || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Supervisor</p>
                  <p className="font-medium">{form.supervisor || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Pay Grade</p>
                  <p className="font-medium">{form.payGrade || "--"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Contract Type</p>
                  <p className="font-medium capitalize">{form.contractType.replace("-", " ") || "--"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={stepIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
            {saving ? (
              <span className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          {step === "review" ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <span className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {submitting ? "Submitting..." : "Add Employee"}
            </Button>
          ) : (
            <Button onClick={goNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#efefef] bg-white px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {toast}
        </div>
      )}
    </div>
  );
}
