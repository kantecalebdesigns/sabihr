import { useState } from "react";
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
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_NOTIFICATIONS } from "@/lib/employee-mock-data";
import type { EmployeeNotification, NotificationType } from "@/types/employee";

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

type Filter = "all" | "unread";

export default function EmployeeNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<EmployeeNotification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleClick(notif: EmployeeNotification) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-1.5">
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {(["all", "unread"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              filter === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "all" ? "All" : "Unread"}
            {tab === "unread" && unreadCount > 0 && (
              <Badge className="text-[10px] h-5 px-1.5 bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <BellOff className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => {
            const config = TYPE_CONFIG[notif.type];
            const Icon = config.icon;
            return (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={cn(
                  "w-full flex items-start gap-4 p-4 rounded-xl border border-border text-left hover:shadow-sm transition-all",
                  !notif.read && "bg-primary/5 border-l-2 border-l-primary"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", config.bg)}>
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm", !notif.read ? "font-semibold" : "font-medium")}>
                      {notif.title}
                    </p>
                    {notif.priority === "high" && (
                      <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 shrink-0">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                    {new Date(notif.timestamp).toLocaleDateString("en-NG", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(notif.timestamp).toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
