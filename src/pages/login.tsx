import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { LoginForm } from "@/components/auth/login-form";

export type LoginMode = "admin" | "employee";

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<LoginMode>("admin");

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <Logo size="lg" />
            <div className="pt-4 space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {loginMode === "admin" ? "Welcome back" : "Employee Portal"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {loginMode === "admin"
                  ? "Sign in to your admin account to continue"
                  : "Sign in to access your employee dashboard"}
              </p>
            </div>
          </div>

          {/* Login mode toggle */}
          <div className="flex rounded-lg border border-border p-1 bg-muted/50">
            <button
              type="button"
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                loginMode === "admin"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setLoginMode("admin")}
            >
              Company Admin
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                loginMode === "employee"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setLoginMode("employee")}
            >
              Employee
            </button>
          </div>

          <LoginForm mode={loginMode} />

          {loginMode === "admin" && (
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Create an account
              </Link>
            </p>
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
