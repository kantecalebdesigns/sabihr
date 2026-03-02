import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NIGERIAN_STATES } from "@/lib/mock-data";
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from "@/lib/employee-mock-data";
import type { BasicDetailsData } from "@/types/employee-onboarding";
import type { ValidationErrors } from "@/lib/validators";

interface Props {
  data: BasicDetailsData;
  errors: ValidationErrors<BasicDetailsData>;
  onChange: (updates: Partial<BasicDetailsData>) => void;
}

export function BasicDetailsStep({ data, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Basic Details</h3>
        <p className="text-sm text-muted-foreground">
          Tell us about yourself. This information is used for your employee record.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="Adebayo"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            placeholder="Chukwuemeka"
            value={data.middleName}
            onChange={(e) => onChange({ middleName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="Ogunlesi"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth">
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
          />
          {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>
            Gender <span className="text-destructive">*</span>
          </Label>
          <Select value={data.gender} onValueChange={(v) => onChange({ gender: v as BasicDetailsData["gender"] })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Marital Status</Label>
          <Select value={data.maritalStatus} onValueChange={(v) => onChange({ maritalStatus: v as BasicDetailsData["maritalStatus"] })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {MARITAL_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nationality">
            Nationality <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nationality"
            placeholder="Nigerian"
            value={data.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
          />
          {errors.nationality && <p className="text-xs text-destructive">{errors.nationality}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>
            State of Origin <span className="text-destructive">*</span>
          </Label>
          <Select value={data.stateOfOrigin} onValueChange={(v) => onChange({ stateOfOrigin: v })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {NIGERIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.stateOfOrigin && <p className="text-xs text-destructive">{errors.stateOfOrigin}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nin">NIN (National Identification Number)</Label>
          <Input
            id="nin"
            placeholder="12345678901"
            maxLength={11}
            value={data.nin}
            onChange={(e) => onChange({ nin: e.target.value.replace(/\D/g, "") })}
          />
        </div>
      </div>

      {/* Statutory Identification Numbers */}
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
        <div>
          <p className="text-sm font-medium">Statutory Identification Numbers</p>
          <p className="text-xs text-muted-foreground">
            These are optional during onboarding but required for payroll processing.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="taxId">Tax ID (TIN)</Label>
            <Input
              id="taxId"
              placeholder="TIN-1234567890"
              value={data.taxId}
              onChange={(e) => onChange({ taxId: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pensionId">Pension ID (PenCom)</Label>
            <Input
              id="pensionId"
              placeholder="PEN-NG-00123456"
              value={data.pensionId}
              onChange={(e) => onChange({ pensionId: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bvn">BVN</Label>
            <Input
              id="bvn"
              placeholder="22345678901"
              maxLength={11}
              value={data.bvn}
              onChange={(e) => onChange({ bvn: e.target.value.replace(/\D/g, "") })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
