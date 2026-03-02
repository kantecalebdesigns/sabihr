import { Logo } from "@/components/shared/logo";
import { SetupWizard } from "@/components/onboarding/setup-wizard";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <p className="text-sm text-muted-foreground hidden sm:block">
            Let&apos;s set up your HR workspace
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <div className="bg-card border border-border rounded-xl p-6 sm:p-10 shadow-sm">
          <SetupWizard />
        </div>
      </div>
    </div>
  );
}
