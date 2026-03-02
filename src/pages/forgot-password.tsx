import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OTP_LENGTH = 6;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Focus first OTP input when step changes
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep("otp");
    setCooldown(30);
  }

  function handleOtpChange(index: number, value: string) {
    if (error) setError("");

    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    // Focus the input after last pasted digit
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete verification code");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    // Mock: any 6-digit code works
    navigate("/reset-password");
  }

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    // Mock resend
    await new Promise((resolve) => setTimeout(resolve, 500));
  }, [cooldown]);

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <Logo size="lg" />
            <div className="pt-4 space-y-1">
              {step === "email" ? (
                <>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Reset your password
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter the email address associated with your account and
                    we'll send you a verification code.
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center text-center space-y-3 pt-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Enter verification code
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    We sent a 6-digit code to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {error && (
                <div className="px-3 py-2.5 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending code...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send verification code
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              {error && (
                <div className="px-3 py-2.5 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-semibold rounded-md border border-input bg-background shadow-xs transition-colors focus:border-ring focus:ring-ring/50 focus:ring-[3px] focus:outline-none placeholder:text-muted-foreground"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Verify & continue
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                {cooldown > 0 ? (
                  <span className="text-muted-foreground/60">
                    Resend in {cooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Click to resend
                  </button>
                )}
              </p>
            </form>
          )}

          <div className="flex justify-center">
            {step === "otp" ? (
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp(Array(OTP_LENGTH).fill(""));
                  setError("");
                }}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Use a different email
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            )}
          </div>
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
