import { ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department } from "@/types/onboarding";

export interface HrAdminData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
}

interface HrAdminStepProps {
  data: HrAdminData;
  departments: Department[];
  errors: Partial<Record<keyof HrAdminData, string>>;
  onChange: (field: keyof HrAdminData, value: string) => void;
}

export function HrAdminStep({ data, departments, errors, onChange }: HrAdminStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Create HR Admin</h2>
          <p className="text-sm text-muted-foreground">
            Designate an HR administrator who will manage employees, payroll, and company settings.
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3">
        <p className="text-xs text-amber-800">
          The HR Admin will have full access to manage employees, run payroll, approve leave requests, and configure company policies.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="hrFirstName">
              First name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hrFirstName"
              placeholder="e.g. Adaeze"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              autoFocus
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hrLastName">
              Last name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hrLastName"
              placeholder="e.g. Okonkwo"
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="hrEmail">
              Email address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hrEmail"
              type="email"
              placeholder="e.g. adaeze@company.com"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hrPhone">
              Phone number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hrPhone"
              placeholder="e.g. 08012345678"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hrDepartment">Department</Label>
          <Select value={data.department} onValueChange={(v) => onChange("department", v)}>
            <SelectTrigger id="hrDepartment" className="w-full">
              <SelectValue placeholder="Assign to a department (optional)" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
              {departments.length === 0 && (
                <SelectItem value="_none" disabled>
                  No departments added yet
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Role badge */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">Role: HR Admin</p>
            <p className="text-xs text-muted-foreground">This person will be automatically assigned the HR Admin role</p>
          </div>
        </div>
      </div>
    </div>
  );
}
