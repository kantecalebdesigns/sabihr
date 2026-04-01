import { SetupWizard } from "@/components/onboarding/setup-wizard";

export default function OnboardingPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {/* Background image */}
      <img
        src="/login-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Card */}
      <div className="relative z-10 w-[1052px] max-w-full bg-white border-[0.5px] border-[#dcdcdc] rounded-xl px-[41px] pt-[34px] pb-6 flex flex-col gap-3">
        {/* Logo + subtitle */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-[30px] font-semibold tracking-[-0.75px] leading-9">
            <span className="text-slate-900">Sabi</span>
            <span className="text-blue-600">HR</span>
          </h2>
          <p className="text-sm text-slate-500 leading-5">
            Lets setup your workspace
          </p>
        </div>

        <SetupWizard />
      </div>
    </div>
  );
}
