import { SetupWizard } from "@/components/onboarding/setup-wizard";
import { Logo } from "@/components/shared/logo";

export default function OnboardingPage() {
  return (
    <div className="relative flex h-screen items-stretch">
      {/* Background image */}
      <img
        src="/onboarding-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Left side — branding over the background (desktop only) */}
      <div className="relative z-10 hidden lg:flex h-full flex-1 flex-col">
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
              Set up your workspace
            </h1>
            <p className="text-sm text-white">
              Let's get your workspace ready in two quick steps
            </p>
          </div>
        </div>
      </div>

      {/* Right side — white wizard panel (full-width on mobile) */}
      <div className="relative z-10 flex w-full lg:flex-1 bg-white overflow-y-auto scrollbar-hide">
        <div className="m-auto w-full px-6 sm:px-8 py-8 sm:py-12">
          <div className="mx-auto w-full max-w-[640px] space-y-6">
            <div className="lg:hidden flex justify-center">
              <Logo size="md" />
            </div>
            <SetupWizard />
          </div>
        </div>
      </div>
    </div>
  );
}
