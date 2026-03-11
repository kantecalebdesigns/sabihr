import { Calendar, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UPCOMING_EVENTS } from "@/lib/employee-mock-data";

const EVENT_CONFIG = {
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
  warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
};

function getDaysUntil(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const days = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export function UpcomingEvents() {
  const sorted = [...UPCOMING_EVENTS].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.map((event) => {
            const config = EVENT_CONFIG[event.type];
            const Icon = config.icon;
            return (
              <div key={event.id} className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap mt-0.5">
                  {getDaysUntil(event.date)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
