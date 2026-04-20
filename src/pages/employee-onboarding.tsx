import { Logo } from "@/components/shared/logo";
import { EmployeeOnboardingWizard } from "@/components/employee-onboarding/employee-onboarding-wizard";

export default function EmployeeOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#eff6ff] flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-[900px] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-slate-500">
            Complete your profile to get started
          </p>
        </div>

        <div className="bg-white border border-[#efefef] rounded-xl shadow-sm p-6 sm:p-8">
          <EmployeeOnboardingWizard />
        </div>

        <p className="text-center text-xs text-slate-500">
          Your information is securely stored and only visible to authorized HR personnel.
        </p>
      </div>
    </div>
  );
}
