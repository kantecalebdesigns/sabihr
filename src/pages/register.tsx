import { RegisterWizard } from "@/components/auth/register-wizard";

export default function RegisterPage() {
  return (
    <div className="relative flex h-screen items-center justify-center p-3">
      {/* Background image */}
      <img
        src="/login-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* White card */}
      <div className="relative z-10 flex w-[640px] max-h-[calc(100vh-24px)] flex-col gap-[34px] items-start rounded-[20px] bg-white py-10 overflow-y-auto scrollbar-hide">
        {/* Logo + subtitle */}
        <div className="flex flex-col items-center gap-2 w-full">
          <h2 className="text-[30px] font-semibold tracking-[-0.75px] leading-9">
            <span className="text-slate-900">Sabi</span>
            <span className="text-blue-600">HR</span>
          </h2>
          <p className="text-sm text-slate-500 leading-5">
            Create your company account
          </p>
        </div>

        {/* Card content */}
        <div className="w-full border border-[#efefef] rounded-xl px-[33px] py-[14px]">
          <RegisterWizard />
        </div>

        {/* Terms */}
        <p className="w-full text-center text-xs text-slate-500 leading-4">
          By creating an account, you agree to our{" "}
          <a href="#" className="underline hover:text-slate-700 transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-slate-700 transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
