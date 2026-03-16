import {
  PackagePlus,
  RotateCcw,
  ShieldAlert,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AssetNotification, AssetNotificationType } from "@/types/asset";

interface AssetNotificationCardsProps {
  notifications: AssetNotification[];
}

const NOTIFICATION_STYLES: Record<
  AssetNotificationType,
  {
    icon: React.ElementType;
    accent: string;
    iconBg: string;
    borderColor: string;
  }
> = {
  assignment: {
    icon: PackagePlus,
    accent: "text-blue-600",
    iconBg: "bg-blue-100",
    borderColor: "border-l-blue-500",
  },
  "return-reminder": {
    icon: RotateCcw,
    accent: "text-amber-600",
    iconBg: "bg-amber-100",
    borderColor: "border-l-amber-500",
  },
  "damage-update": {
    icon: ShieldAlert,
    accent: "text-green-600",
    iconBg: "bg-green-100",
    borderColor: "border-l-green-500",
  },
  "request-status": {
    icon: Bell,
    accent: "text-violet-600",
    iconBg: "bg-violet-100",
    borderColor: "border-l-violet-500",
  },
  "maintenance-due": {
    icon: Bell,
    accent: "text-orange-600",
    iconBg: "bg-orange-100",
    borderColor: "border-l-orange-500",
  },
  "warranty-expiry": {
    icon: Bell,
    accent: "text-red-600",
    iconBg: "bg-red-100",
    borderColor: "border-l-red-500",
  },
};

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "Just now";
}

export function AssetNotificationCards({
  notifications,
}: AssetNotificationCardsProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Bell className="size-10 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => {
        const style = NOTIFICATION_STYLES[n.type];
        const IconComp = style.icon;

        return (
          <div
            key={n.id}
            className={cn(
              "rounded-xl border border-border bg-card border-l-4 p-4",
              style.borderColor,
              !n.read && "bg-muted/30"
            )}
          >
            <div className="flex gap-3">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  style.iconBg
                )}
              >
                <IconComp className={cn("size-4", style.accent)} />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">
                    {n.title}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    {formatTimestamp(n.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {n.message}
                </p>
                <Button variant="ghost" size="sm" className="text-xs -ml-2 mt-1">
                  View Details
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
