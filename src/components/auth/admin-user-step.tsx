import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminUserData } from "@/types/auth";
import { getPasswordStrength } from "@/lib/validators";
import type { ValidationErrors } from "@/lib/validators";
import { cn } from "@/lib/utils";

interface AdminUserStepProps {
  data: AdminUserData;
  errors: ValidationErrors<AdminUserData>;
  onChange: (field: keyof AdminUserData, value: string) => void;
}

export function AdminUserStep({ data, errors, onChange }: AdminUserStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strength = data.password ? getPasswordStrength(data.password) : null;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Admin Account</h2>
        <p className="text-sm text-muted-foreground">
          Create the first administrator account for your company
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">
              First name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              autoFocus
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">
              Last name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
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
            <Label htmlFor="adminEmail">
              Email address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="john@company.com"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="adminPhone">
              Phone number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="adminPhone"
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
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={data.password}
              onChange={(e) => onChange("password", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}

          {strength && (
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      level <= strength.score ? strength.color : "bg-border"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: <span className="font-medium">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">
            Confirm password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={data.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
}
