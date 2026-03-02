import { cn } from "@/lib/utils";
import { ATTENDANCE_SUMMARY } from "@/lib/dashboard-data";

const SEGMENTS = [
  { key: "present" as const, label: "Present", color: "bg-emerald-500", textColor: "text-emerald-600" },
  { key: "late" as const, label: "Late", color: "bg-amber-500", textColor: "text-amber-600" },
  { key: "absent" as const, label: "Absent", color: "bg-red-500", textColor: "text-red-600" },
  { key: "onLeave" as const, label: "On Leave", color: "bg-blue-500", textColor: "text-blue-600" },
];

export function AttendanceOverview() {
  const data = ATTENDANCE_SUMMARY;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Today's Attendance</h3>
        <p className="text-xs text-muted-foreground">{data.total} total employees</p>
      </div>

      {/* Progress bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-muted">
        {SEGMENTS.map((seg) => {
          const value = data[seg.key];
          const pct = (value / data.total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={seg.key}
              className={cn("h-full transition-all", seg.color)}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {SEGMENTS.map((seg) => {
          const value = data[seg.key];
          const pct = ((value / data.total) * 100).toFixed(1);
          return (
            <div key={seg.key} className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", seg.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">{seg.label}</span>
                  <span className={cn("text-sm font-semibold", seg.textColor)}>{value}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
