import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle, XCircle, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_ATTENDANCE_NOTIFICATIONS } from "@/lib/attendance-extended-mock-data";
import type { AttendanceNotification } from "@/lib/attendance-extended-mock-data";

const TYPE_ICONS: Record<AttendanceNotification["type"], React.ElementType> = {
  "late-warning": AlertTriangle,
  "missed-clock-out": Clock,
  "correction-approved": CheckCircle,
  "correction-rejected": XCircle,
  "overtime-approved": CheckCircle,
  "shift-change": Bell,
  reminder: Bell,
};

const TYPE_COLORS: Record<AttendanceNotification["type"], string> = {
  "late-warning": "text-amber-600 bg-amber-100",
  "missed-clock-out": "text-red-600 bg-red-100",
  "correction-approved": "text-emerald-600 bg-emerald-100",
  "correction-rejected": "text-red-600 bg-red-100",
  "overtime-approved": "text-emerald-600 bg-emerald-100",
  "shift-change": "text-blue-600 bg-blue-100",
  reminder: "text-violet-600 bg-violet-100",
};

export default function EmployeeAttendanceNotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_ATTENDANCE_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "all" ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Attendance Notifications</h1>
        <p className="text-sm text-slate-500">Stay updated on your attendance activity</p>
      </div>

      {/* Filter & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                filter === f ? "bg-slate-900 text-white" : "bg-white border border-[#efefef] text-slate-600 hover:bg-slate-50"
              )}
            >
              {f === "all" ? "All" : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
            <BellOff className="w-3.5 h-3.5" /> Mark all as read
          </Button>
        )}
      </div>

      {/* Notification Cards */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const Icon = TYPE_ICONS[n.type];
          const colorClass = TYPE_COLORS[n.type];
          const [iconBg, iconText] = colorClass.split(" ");
          return (
            <div
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={cn(
                "rounded-xl border bg-white p-4 flex items-start gap-4 cursor-pointer transition-colors",
                n.read ? "border-[#efefef]" : "border-blue-200 bg-blue-50/30"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", iconBg)}>
                <Icon className={cn("w-5 h-5", iconText)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn("text-sm font-semibold", n.read ? "text-slate-600" : "text-slate-900")}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1.5">
                  {new Date(n.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })} at{" "}
                  {new Date(n.date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false })}
                </p>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-8 text-center text-slate-400 text-sm">
            No notifications to show
          </div>
        )}
      </div>
    </div>
  );
}
