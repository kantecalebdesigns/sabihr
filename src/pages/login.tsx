import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
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
        {/* Top row: logo */}
        <div className="flex items-center w-full">
          <h2 className="text-[30px] font-semibold tracking-[-0.75px]">
            <span className="text-white">Sabi</span>
            <span className="text-blue-600">HR</span>
          </h2>
        </div>

        {/* Bottom: heading + subtitle */}
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold text-white leading-[56px]">
            Welcome Back
          </h1>
          <p className="text-sm text-white">
            Sign in to access your dashboard
          </p>
        </div>
      </div>

      {/* Right side — white form panel */}
      <div className="relative z-10 flex h-full w-[736px] shrink-0 flex-col items-center justify-center rounded-[20px] bg-white px-4 py-12">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold text-neutral-600 leading-[56px]">
              Sign In
            </h1>
            <p className="text-base text-slate-500 leading-6">
              Enter your credentials to access your account
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
