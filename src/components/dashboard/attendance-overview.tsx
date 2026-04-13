import { cn } from "@/lib/utils";
import { ATTENDANCE_SUMMARY } from "@/lib/dashboard-data";

const SEGMENTS = [
  { key: "present" as const, label: "Present", barColor: "bg-[#00bc7d]", dotColor: "bg-[#00bc7d]" },
  { key: "late" as const, label: "Late", barColor: "bg-[#fe9a00]", dotColor: "bg-[#fe9a00]" },
  { key: "absent" as const, label: "Absent", barColor: "bg-[#fb2c36]", dotColor: "bg-[#fb2c36]" },
  { key: "onLeave" as const, label: "On Leave", barColor: "bg-[#2b7fff]", dotColor: "bg-[#2b7fff]" },
];

export function AttendanceOverview() {
  const data = ATTENDANCE_SUMMARY;

  return (
    <div className="rounded-xl border border-[#efefef] bg-white pt-[21px] px-[21px] pb-4 flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Today's Attendance</h3>
        <p className="text-xs text-slate-500">{data.total} total employees</p>
      </div>

      {/* Progress bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-[#f8fafc]">
        {SEGMENTS.map((seg) => {
          const value = data[seg.key];
          const pct = (value / data.total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={seg.key}
              className={cn("h-full", seg.barColor)}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SEGMENTS.map((seg) => {
          const value = data[seg.key];
          const pct = ((value / data.total) * 100).toFixed(1);
          return (
            <div key={seg.key} className="rounded-lg border border-[#efefef] bg-white py-[17px] pl-[17px] pr-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full shrink-0", seg.dotColor)} />
                <span className="text-xs text-slate-500">{seg.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-slate-900">{value}</span>
                <span className="text-xs text-slate-400">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
