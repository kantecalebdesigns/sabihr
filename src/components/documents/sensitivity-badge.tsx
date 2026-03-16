import { cn } from "@/lib/utils"
import { Lock, ShieldAlert } from "lucide-react"

interface SensitivityBadgeProps {
  level: "public" | "internal" | "confidential" | "restricted"
  className?: string
}

const badgeConfig = {
  public: {
    label: "Public",
    classes: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: null,
  },
  internal: {
    label: "Internal",
    classes: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: null,
  },
  confidential: {
    label: "Confidential",
    classes:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Lock,
  },
  restricted: {
    label: "Restricted",
    classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: ShieldAlert,
  },
} as const

export function SensitivityBadge({ level, className }: SensitivityBadgeProps) {
  const config = badgeConfig[level]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      {Icon && <Icon className="size-3" />}
      {config.label}
    </span>
  )
}

interface LockOverlayProps {
  reason?: string
  className?: string
}

export function LockOverlay({ reason, className }: LockOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/60 backdrop-blur-[2px]",
        className
      )}
    >
      <Lock className="size-6 text-white/80" />
      <span className="text-xs font-medium text-white/90">
        Access Restricted
      </span>
      {reason && (
        <span className="text-xs text-white/60 text-center max-w-[80%]">
          {reason}
        </span>
      )}
    </div>
  )
}
