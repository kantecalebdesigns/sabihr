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
      <div className="py-4">
        <div className="flex flex-col gap-1 text-center mb-[20px]">
          <h2 className="text-lg font-semibold text-slate-900 leading-7">Get started</h2>
          <p className="text-sm text-slate-500 leading-5">
            Enter your company name and email address. We'll send you a verification code.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5 max-w-[384px] mx-auto">
          {error && (
            <div className="px-3 py-2.5 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
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
              className="h-9"
            />
          </div>

          <div className="flex flex-col gap-1.5">
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
              className="h-9"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md h-9 text-sm font-medium" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
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
    <div className="py-4">
      <div className="flex flex-col items-center text-center gap-3 mb-[20px]">
        <div className="w-14 h-14 rounded-full bg-blue-600/10 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900 leading-7">Enter verification code</h2>
          <p className="text-sm text-slate-500 leading-5">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-slate-900">{email}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5 max-w-[384px] mx-auto">
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
              className="w-12 h-14 text-center text-xl font-semibold rounded-md border border-input bg-background transition-colors focus:border-ring focus:ring-0 focus:outline-none placeholder:text-muted-foreground"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md h-9 text-sm font-medium" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Verify & continue
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Didn't receive the code?{" "}
          {cooldown > 0 ? (
            <span className="text-slate-400">
              Resend in {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
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
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Use a different email
          </button>
        </div>
      </form>
    </div>
  );
}
