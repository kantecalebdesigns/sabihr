import { AlertCircle, AlertTriangle, Clock, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ---------- ExpiryAlertCard ---------- */

interface ExpiryAlertCardProps {
  employeeName: string;
  documentType: string;
  expiryDate: string;
  daysLeft: number;
  onSendReminder: () => void;
}

function getAlertTier(daysLeft: number) {
  if (daysLeft < 7) {
    return {
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-500",
      Icon: AlertCircle,
      accentText: "text-red-600",
    };
  }
  if (daysLeft < 30) {
    return {
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconColor: "text-amber-500",
      Icon: AlertTriangle,
      accentText: "text-amber-600",
    };
  }
  return {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    iconColor: "text-yellow-500",
    Icon: Clock,
    accentText: "text-yellow-600",
  };
}

export function ExpiryAlertCard({
  employeeName,
  documentType,
  expiryDate,
  daysLeft,
  onSendReminder,
}: ExpiryAlertCardProps) {
  const tier = getAlertTier(daysLeft);
  const Icon = tier.Icon;
  const isExpired = daysLeft < 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex items-start gap-3 transition-colors",
        tier.bg,
        tier.border
      )}
    >
      <div
        className={cn(
          "size-9 rounded-lg flex items-center justify-center bg-white/60 shrink-0 mt-0.5",
          tier.iconColor
        )}
      >
        <Icon className="size-4" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium">{employeeName}</p>
        <p className="text-xs text-muted-foreground">{documentType}</p>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Expiry: {expiryDate}</span>
          <span className={cn("font-semibold", tier.accentText)}>
            {isExpired
              ? `Expired ${Math.abs(daysLeft)} days ago`
              : `${daysLeft} days left`}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="xs"
        onClick={onSendReminder}
        className="shrink-0"
      >
        Send Reminder
      </Button>
    </div>
  );
}

/* ---------- ExpiryNotificationBanner ---------- */

interface ExpiryNotificationBannerProps {
  expiredCount: number;
  expiringCount: number;
  onViewAll: () => void;
  onDismiss: () => void;
}

export function ExpiryNotificationBanner({
  expiredCount,
  expiringCount,
  onViewAll,
  onDismiss,
}: ExpiryNotificationBannerProps) {
  const hasExpired = expiredCount > 0;

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-xl border px-4 py-3",
        hasExpired
          ? "bg-red-50 border-red-200"
          : "bg-amber-50 border-amber-200"
      )}
    >
      {hasExpired ? (
        <AlertCircle className="size-5 text-red-500 shrink-0" />
      ) : (
        <AlertTriangle className="size-5 text-amber-500 shrink-0" />
      )}

      <p className="flex-1 text-sm">
        {expiredCount > 0 && (
          <span className="font-semibold text-red-600">
            {expiredCount} document{expiredCount !== 1 ? "s" : ""} expired
          </span>
        )}
        {expiredCount > 0 && expiringCount > 0 && <span>, </span>}
        {expiringCount > 0 && (
          <span
            className={cn(
              "font-semibold",
              hasExpired ? "text-red-600" : "text-amber-600"
            )}
          >
            {expiringCount} expiring soon
          </span>
        )}
        <span className="text-muted-foreground"> — </span>
        <button
          onClick={onViewAll}
          className={cn(
            "inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline",
            hasExpired ? "text-red-700" : "text-amber-700"
          )}
        >
          View All
          <ArrowRight className="size-3" />
        </button>
      </p>

      <button
        onClick={onDismiss}
        className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
