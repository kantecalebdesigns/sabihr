import { Calendar, AlertCircle, Info } from "lucide-react";
import { UPCOMING_EVENTS } from "@/lib/employee-mock-data";

const EVENT_CONFIG = {
  info: { icon: Info },
  warning: { icon: AlertCircle },
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
    <div className="rounded-xl border border-[#efefef] bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-900">Upcoming</h3>
      </div>
      <div className="space-y-3">
        {sorted.map((event) => {
          const config = EVENT_CONFIG[event.type];
          const Icon = config.icon;
          return (
            <div key={event.id} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#f0f4f8] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{event.title}</p>
                <p className="text-xs text-slate-500">{event.description}</p>
              </div>
              <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap mt-0.5">
                {getDaysUntil(event.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
