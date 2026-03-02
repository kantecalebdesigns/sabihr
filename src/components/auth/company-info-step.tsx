import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyInfoData } from "@/types/auth";
import type { ValidationErrors } from "@/lib/validators";
import { NIGERIAN_STATES, INDUSTRIES, EMPLOYEE_COUNT_RANGES } from "@/lib/mock-data";

interface CompanyInfoStepProps {
  data: CompanyInfoData;
  errors: ValidationErrors<CompanyInfoData>;
  onChange: (field: keyof CompanyInfoData, value: string) => void;
  onLogoChange: (file: File | null) => void;
}

export function CompanyInfoStep({ data, errors, onChange, onLogoChange }: CompanyInfoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit

    onLogoChange(file);
  }

  function handleRemoveLogo() {
    onLogoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Company Information</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your organization
        </p>
      </div>

      <div className="space-y-4">
        {/* Logo upload */}
        <div className="space-y-1.5">
          <Label>Company Logo <span className="text-muted-foreground font-normal">(optional)</span></Label>
          {data.logoPreview ? (
            <div className="w-full rounded-lg border border-border bg-muted/30 p-4 flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-lg border border-border overflow-hidden bg-background shrink-0">
                <img
                  src={data.logoPreview}
                  alt="Company logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{data.logo?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {data.logo ? `${(data.logo.size / 1024).toFixed(1)} KB` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  Change
                </Button>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border-2 border-dashed border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-colors cursor-pointer py-8 flex flex-col items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop your logo here or{" "}
                <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                PNG, JPG up to 5MB
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="companyName">
            Company name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="companyName"
            placeholder="e.g. Acme Technologies Ltd"
            value={data.companyName}
            onChange={(e) => onChange("companyName", e.target.value)}
          />
          {errors.companyName && (
            <p className="text-xs text-destructive">{errors.companyName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="rcNumber">RC number</Label>
            <Input
              id="rcNumber"
              placeholder="e.g. RC123456"
              value={data.rcNumber}
              onChange={(e) => onChange("rcNumber", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tinNumber">TIN number</Label>
            <Input
              id="tinNumber"
              placeholder="e.g. 12345678-0001"
              value={data.tinNumber}
              onChange={(e) => onChange("tinNumber", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="companyEmail">
              Company email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyEmail"
              type="email"
              placeholder="info@company.com"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyPhone">
              Phone number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyPhone"
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
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Street address"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="e.g. Lagos"
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">
              State <span className="text-destructive">*</span>
            </Label>
            <Select value={data.state} onValueChange={(v) => onChange("state", v)}>
              <SelectTrigger id="state" className="w-full">
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
            {errors.state && (
              <p className="text-xs text-destructive">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="industry">
              Industry <span className="text-destructive">*</span>
            </Label>
            <Select value={data.industry} onValueChange={(v) => onChange("industry", v)}>
              <SelectTrigger id="industry" className="w-full">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-xs text-destructive">{errors.industry}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="employeeCount">Number of employees</Label>
            <Select value={data.employeeCount} onValueChange={(v) => onChange("employeeCount", v)}>
              <SelectTrigger id="employeeCount" className="w-full">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_COUNT_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
