import { Calendar, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UPCOMING_EVENTS } from "@/lib/employee-mock-data";

const EVENT_CONFIG = {
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
  warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" },
};

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {UPCOMING_EVENTS.map((event) => {
            const config = EVENT_CONFIG[event.type];
            const Icon = config.icon;
            return (
              <div key={event.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {new Date(event.date).toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
