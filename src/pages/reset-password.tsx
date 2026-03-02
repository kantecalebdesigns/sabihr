import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPasswordStrength } from "@/lib/validators";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [success, setSuccess] = useState(false);

  const strength = password ? getPasswordStrength(password) : null;

  function validate(): boolean {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      newErrors.password = "Must include uppercase, lowercase, number, and special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSuccess(true);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <Logo size="lg" />
            <div className="pt-4 space-y-1">
              {!success ? (
                <>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Set new password
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Your new password must be different from previously used passwords.
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center text-center space-y-3 pt-4">
                  <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-success" />
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Password reset successful
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Your password has been updated. You can now sign in with your new password.
                  </p>
                </div>
              )}
            </div>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    autoComplete="new-password"
                    className="pr-10"
                    autoFocus
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

                {/* Password strength indicator */}
                {password && strength && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i < strength.score ? strength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: <span className="font-medium">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password requirements */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Password must contain:</p>
                <ul className="space-y-0.5 pl-4 list-disc">
                  <li>At least 8 characters</li>
                  <li>Upper and lowercase letters</li>
                  <li>At least one number</li>
                  <li>At least one special character (!@#$%^&*)</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Resetting password...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Reset password
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              <Button className="w-full" onClick={() => navigate("/login")}>
                <span className="flex items-center gap-2">
                  Back to login
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </div>
          )}

          {!success && (
            <div className="flex justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right — Brand panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-primary/[0.03] border-l border-border">
        <div className="max-w-[420px] space-y-6 px-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              Manage your entire HR lifecycle in one place
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              From onboarding to payroll, attendance to performance reviews — SabiHR
              gives Nigerian businesses a complete HRIS built for local compliance.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              "PAYE & Pension compliant",
              "Multi-branch support",
              "Employee self-service",
              "Payroll automation",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
