import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OTP_LENGTH = 6;

interface EmailVerificationStepProps {
  onVerified: (email: string, companyName: string) => void;
}

export function EmailVerificationStep({ onVerified }: EmailVerificationStepProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
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

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!companyName.trim()) {
      setError("Please enter your company name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Mock API call to send OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep("otp");
    setCooldown(30);
  }

  function handleOtpChange(index: number, value: string) {
    if (error) setError("");
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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
    // Mock verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    // Mock: any 6-digit code works
    onVerified(email, companyName);
  }

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }, [cooldown]);

  if (step === "email") {
    return (
      <div className="space-y-6 py-4">
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold">Get started</h2>
          <p className="text-sm text-muted-foreground">
            Enter your company name and email address. We'll send you a verification code.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-5 max-w-sm mx-auto">
          {error && (
            <div className="px-3 py-2.5 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              placeholder="e.g. Acme Technologies Ltd"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (error) setError("");
              }}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="verifyEmail">Email address</Label>
            <Input
              id="verifyEmail"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              autoComplete="email"
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

          <div className="flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Enter verification code</h2>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-5 max-w-sm mx-auto">
        {error && (
          <div className="px-3 py-2.5 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-semibold rounded-md border border-input bg-background shadow-xs transition-colors focus:border-ring focus:ring-0 focus:outline-none placeholder:text-muted-foreground"
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

        <div className="flex justify-center">
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
        </div>
      </form>
    </div>
  );
}
