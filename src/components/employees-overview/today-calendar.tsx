import { Link } from "react-router-dom";
import { TODAY_EVENTS } from "@/lib/employees-overview-data";
import { cn } from "@/lib/utils";

export function TodayCalendar() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] h-full">
      <div className="flex items-start justify-between mb-5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Today</h3>
        <Link to="/calendar" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Calendar
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {TODAY_EVENTS.map((event) => (
          <div key={event.id} className="flex items-start gap-4">
            <span className="text-xs font-semibold text-slate-500 tabular-nums w-10 pt-0.5">{event.time}</span>
            <div className={cn("w-0.5 rounded-full self-stretch", event.accent)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{event.title}</p>
              <p className="text-xs text-slate-500 leading-tight mt-1">{event.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
