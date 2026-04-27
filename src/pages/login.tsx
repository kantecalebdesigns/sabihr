import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/shared/logo";

export default function LoginPage() {
  return (
    <div className="relative flex h-screen items-stretch">
      {/* Background video */}
      <video
        src="/login-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="/login-bg.jpg"
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
              Welcome Back
            </h1>
            <p className="text-sm text-white">
              Sign in to access your dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Right side — white form panel */}
      <div className="relative z-10 flex flex-1 bg-white overflow-y-auto scrollbar-hide">
        <div className="m-auto w-full px-8 py-12">
          <div className="mx-auto w-full max-w-[400px] space-y-8">
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
    </div>
  );
}
