import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface HeroGreetingProps {
  name?: string;
  pendingCount?: number;
}

export function HeroGreeting({ name = "Admin", pendingCount = 6 }: HeroGreetingProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#1d4ed8] text-white">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6 px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[11px] font-medium">
            <Sparkles className="w-3 h-3" />
            Today's overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {getGreeting()}, {name}
          </h1>
          <p className="text-sm text-white/85 max-w-md leading-relaxed">
            You have <span className="font-semibold text-white">{pendingCount} pending items</span> and a few
            reviews waiting. Let's get the day started.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              asChild
              size="sm"
              className="bg-white text-[#1d4ed8] hover:bg-white/90 h-9 rounded-lg font-semibold"
            >
              <Link to="/employees">
                Review pending
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white h-9 rounded-lg font-medium border border-white/20"
            >
              <Link to="/reports">View reports</Link>
            </Button>
          </div>
        </div>

        <div className="hidden sm:flex shrink-0 w-48 h-36 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-0 right-4 w-24 h-24 rounded-2xl bg-white/15 backdrop-blur rotate-6" />
            <div className="absolute bottom-0 right-14 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur -rotate-12" />
            <div className="absolute top-4 right-16 w-16 h-16 rounded-xl bg-white/25 backdrop-blur rotate-12 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
    </div>
  );
}
