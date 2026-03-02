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
import type { ContactInfoData } from "@/types/employee-onboarding";
import type { ValidationErrors } from "@/lib/validators";

interface Props {
  data: ContactInfoData;
  errors: ValidationErrors<ContactInfoData>;
  onChange: (updates: Partial<ContactInfoData>) => void;
}

export function ContactInfoStep({ data, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <p className="text-sm text-muted-foreground">
          How can we reach you? Provide your contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="personalEmail">
            Personal Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="personalEmail"
            type="email"
            placeholder="you@gmail.com"
            value={data.personalEmail}
            onChange={(e) => onChange({ personalEmail: e.target.value })}
          />
          {errors.personalEmail && <p className="text-xs text-destructive">{errors.personalEmail}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="workEmail">Work Email</Label>
          <Input
            id="workEmail"
            type="email"
            placeholder="you@company.com"
            value={data.workEmail}
            onChange={(e) => onChange({ workEmail: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            placeholder="+2348012345678"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="alternatePhone">Alternate Phone</Label>
          <Input
            id="alternatePhone"
            placeholder="+2349087654321"
            value={data.alternatePhone}
            onChange={(e) => onChange({ alternatePhone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">
          Residential Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address"
          placeholder="15 Admiralty Way, Lekki Phase 1"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Lagos"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>
            State <span className="text-destructive">*</span>
          </Label>
          <Select value={data.state} onValueChange={(v) => onChange({ state: v })}>
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
          {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="Nigeria"
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
