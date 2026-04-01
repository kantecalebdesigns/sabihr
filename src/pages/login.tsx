import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";

export type LoginMode = "admin" | "employee";

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<LoginMode>("employee");

  return (
    <div className="relative flex h-screen items-center justify-between p-3">
      {/* Background image */}
      <img
        src="/login-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Left side — branding over the background */}
      <div className="relative z-10 flex h-full flex-1 flex-col justify-between p-10">
        {/* Top row: logo + toggle link */}
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[30px] font-semibold tracking-[-0.75px]">
            <span className="text-white">Sabi</span>
            <span className="text-blue-600">HR</span>
          </h2>
          <button
            type="button"
            onClick={() =>
              setLoginMode(loginMode === "employee" ? "admin" : "employee")
            }
            className="text-sm text-white hover:text-white/80 transition-colors"
          >
            {loginMode === "employee"
              ? "Sign in as admin"
              : "Sign in as employee"}
          </button>
        </div>

        {/* Bottom: heading + subtitle */}
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold text-white leading-[56px]">
            {loginMode === "employee" ? "Employee Portal" : "Admin Portal"}
          </h1>
          <p className="text-sm text-white">
            {loginMode === "employee"
              ? "Sign in to access your employee dashboard"
              : "Sign in to manage your organization"}
          </p>
        </div>
      </div>

      {/* Right side — white form panel */}
      <div className="relative z-10 flex h-full w-[736px] shrink-0 flex-col items-center justify-center rounded-[20px] bg-white px-4 py-12">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold text-neutral-600 leading-[56px]">
              Welcome
            </h1>
            <p className="text-base text-slate-500 leading-6">
              Sign in to access your employee dashboard
            </p>
          </div>

          <LoginForm mode={loginMode} />

          {loginMode === "admin" && (
            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
