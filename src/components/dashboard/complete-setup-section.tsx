import { useState } from "react";
import {
  User,
  KeyRound,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPasswordStrength } from "@/lib/validators";
import { cn } from "@/lib/utils";

// ── Shared collapsible card ─────────────────────────────────────────

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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 w-full px-4 py-3 sm:px-5 sm:py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            {required && (
              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Required
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div className="shrink-0 text-muted-foreground">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-4 border-t border-border pt-4">
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

// ── Admin Profile Card ──────────────────────────────────────────────

function AdminProfileCard() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(): Promise<boolean> {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return false;

    // Mock API
    await new Promise((r) => setTimeout(r, 800));
    return true;
  }

  return (
    <SetupCard
      icon={<User className="w-4.5 h-4.5 text-primary" />}
      title="Admin Profile"
      description="Your name and phone number"
      onSubmit={handleSubmit}
      required
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="setupFirstName">
              First name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="setupFirstName"
              placeholder="John"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setErrors((prev) => ({ ...prev, firstName: "" }));
              }}
              autoFocus
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="setupLastName">
              Last name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="setupLastName"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setErrors((prev) => ({ ...prev, lastName: "" }));
              }}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="setupPhone">
            Phone number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="setupPhone"
            placeholder="e.g. 08012345678"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors((prev) => ({ ...prev, phone: "" }));
            }}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>
      </div>
    </SetupCard>
  );
}

// ── Set Password Card ───────────────────────────────────────────────

function SetPasswordCard() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = password ? getPasswordStrength(password) : null;

  async function handleSubmit(): Promise<boolean> {
    const errs: Record<string, string> = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return false;

    // Mock API
    await new Promise((r) => setTimeout(r, 800));
    return true;
  }

  return (
    <SetupCard
      icon={<KeyRound className="w-4.5 h-4.5 text-primary" />}
      title="Set Password"
      description="Create a secure password for your admin account"
      onSubmit={handleSubmit}
      required
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="setupPassword">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="setupPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
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
          <Label htmlFor="setupConfirmPassword">
            Confirm password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="setupConfirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
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
      </div>
    </SetupCard>
  );
}

// ── Main Section ────────────────────────────────────────────────────

export function CompleteSetupSection() {
  const [dismissed, setDismissed] = useState(false);

  // TODO: check from API/local storage whether setup is already complete
  if (dismissed) return null;

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">Complete your account setup</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set up your admin profile and password to secure your account
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0 -mt-0.5"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <AdminProfileCard />
        <SetPasswordCard />
      </div>
    </div>
  );
}
