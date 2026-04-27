import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-7",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <img
      src="/sabi-logo.png"
      alt="SabiHR"
      className={cn(sizes[size], "w-auto", className)}
    />
  );
}
