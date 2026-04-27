import { Link } from "react-router-dom";
import { RegisterWizard } from "@/components/auth/register-wizard";
import { Logo } from "@/components/shared/logo";

export default function RegisterPage() {
  return (
    <div className="relative flex h-screen items-stretch">
      {/* Background image */}
      <img
        src="/onboarding-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Left side — branding over the background */}
      <div className="relative z-10 flex h-full flex-1 flex-col">
        {/* Top row: logo */}
        <div className="flex items-center w-full p-10">
          <Logo size="lg" />
        </div>

        <div className="flex-1" />

        {/* Bottom: full-width blurred band with heading */}
        <div className="relative w-full px-10 py-8">
          {/* Blur backdrop with softened top edge */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,transparent_0%,black_50%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_50%)]" />

          <div className="relative space-y-1">
            <h1 className="text-4xl font-semibold text-white leading-[56px]">
              Create your company account
            </h1>
            <p className="text-sm text-white">
              A few quick steps and your workspace is ready
            </p>
          </div>
        </div>
      </div>

      {/* Right side — white form panel */}
      <div className="relative z-10 flex flex-1 bg-white overflow-y-auto scrollbar-hide">
        <div className="m-auto w-full px-8 py-10">
          <div className="mx-auto w-full max-w-[640px] flex flex-col gap-8">
            <RegisterWizard />

            <p className="text-center text-xs text-slate-500 leading-4">
              By creating an account, you agree to our{" "}
              <Link to="#" className="underline hover:text-slate-700 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="underline hover:text-slate-700 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
