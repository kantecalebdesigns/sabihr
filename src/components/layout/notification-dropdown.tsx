import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCircle,
  Receipt,
  ArrowRightLeft,
  Megaphone,
  CalendarDays,
  BellOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { EmployeeNotification, NotificationType } from "@/types/employee";

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notifications: EmployeeNotification[];
  onMarkAllRead: () => void;
}

const TYPE_CONFIG: Record<NotificationType, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  "leave-approved": { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  "leave-rejected": { icon: XCircle, color: "text-destructive", bg: "bg-red-100" },
  "document-expiry": { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
  "profile-update": { icon: UserCircle, color: "text-violet-600", bg: "bg-violet-100" },
  "payslip-available": { icon: Receipt, color: "text-emerald-600", bg: "bg-emerald-100" },
  "redeployment-update": { icon: ArrowRightLeft, color: "text-primary", bg: "bg-primary/10" },
  announcement: { icon: Megaphone, color: "text-primary", bg: "bg-primary/10" },
  "event-reminder": { icon: CalendarDays, color: "text-amber-600", bg: "bg-amber-100" },
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

export function NotificationDropdown({ open, onClose, notifications, onMarkAllRead }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!open) return null;

  function handleClick(notif: EmployeeNotification) {
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
    onClose();
  }

  return (
    <div className="absolute right-0 top-full mt-1 w-80 rounded-xl border border-border bg-card shadow-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Badge className="text-[10px] h-5 px-1.5 bg-primary text-primary-foreground">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-primary hover:underline font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <BellOff className="w-6 h-6 text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">No notifications</p>
          </div>
        ) : (
          notifications.slice(0, 6).map((notif) => {
            const config = TYPE_CONFIG[notif.type];
            const Icon = config.icon;
            return (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0",
                  !notif.read && "bg-primary/5 border-l-2 border-l-primary"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", config.bg)}>
                  <Icon className={cn("w-3.5 h-3.5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs truncate", !notif.read ? "font-semibold" : "font-medium")}>
                    {notif.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {formatRelativeTime(notif.timestamp)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => {
            navigate("/employee/notifications");
            onClose();
          }}
          className="w-full text-center text-xs font-medium text-primary hover:underline py-1.5"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
