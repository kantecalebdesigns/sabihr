import { SetupWizard } from "@/components/onboarding/setup-wizard";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#eff6ff] flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-[1052px] flex flex-col gap-5">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome to Sabi<span className="text-slate-500">HR</span>
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Let's get your workspace ready in two quick steps — add your departments, then invite
            your first teammates.
          </p>
        </div>

        {/* Wizard card */}
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] px-6 sm:px-10 py-7 flex flex-col gap-6">
          <SetupWizard />
        </div>
      </div>
    </div>
  );
}
