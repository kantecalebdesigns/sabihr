import { Logo } from "@/components/shared/logo";
import { RegisterWizard } from "@/components/auth/register-wizard";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-[640px] space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <Logo size="lg" />
          <p className="text-sm text-muted-foreground">
            Create your company account
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          <RegisterWizard />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
