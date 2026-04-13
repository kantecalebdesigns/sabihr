import { useState, useEffect } from "react";
import { Coffee, Play, Square, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_MY_BREAKS, MOCK_BREAK_POLICIES } from "@/lib/attendance-extended-mock-data";

type BreakStatus = "not-on-break" | "on-break";
type BreakType = "Lunch Break" | "Short Break";

const BREAK_STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  completed: { bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  exceeded: { bg: "bg-red-50 border-red-200", color: "text-red-700" },
  "on-break": { bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
};

export default function EmployeeBreakClockPage() {
  const [breakStatus, setBreakStatus] = useState<BreakStatus>("not-on-break");
  const [breakType, setBreakType] = useState<BreakType>("Lunch Break");
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (breakStatus !== "on-break" || !breakStartTime) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - breakStartTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [breakStatus, breakStartTime]);

  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatShortTime = (d: Date) =>
    d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false });

  const handleStartBreak = () => {
    setBreakStartTime(new Date());
    setElapsed(0);
    setBreakStatus("on-break");
  };

  const handleEndBreak = () => {
    setBreakStatus("not-on-break");
    setBreakStartTime(null);
    setElapsed(0);
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Break Clock</h1>
        <p className="text-sm text-slate-500">Track your break times during the workday</p>
      </div>

      {/* Current Break Status */}
      <div className="rounded-xl border border-[#efefef] bg-white p-6 text-center space-y-4">
        {breakStatus === "not-on-break" ? (
          <>
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
              <Coffee className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-semibold">Not on break</p>
            <p className="text-sm text-slate-500">Select a break type and start your break</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
              <Coffee className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-lg font-semibold">On {breakType}</p>
            <p className="text-sm text-slate-500">Started at {breakStartTime ? formatShortTime(breakStartTime) : "--"}</p>
            <p className="text-4xl font-bold tabular-nums text-amber-600">{formatElapsed(elapsed)}</p>
          </>
        )}
      </div>

      {/* Break Type & Action */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
        <h2 className="text-sm font-semibold">Break Type</h2>
        <div className="flex gap-3">
          {(["Lunch Break", "Short Break"] as BreakType[]).map((type) => (
            <button
              key={type}
              onClick={() => breakStatus === "not-on-break" && setBreakType(type)}
              className={cn(
                "flex-1 rounded-lg border p-3 text-sm font-medium text-center transition-colors",
                breakType === type
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-[#efefef] bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {breakStatus === "not-on-break" ? (
          <Button onClick={handleStartBreak} className="w-full h-12 gap-2 bg-amber-600 hover:bg-amber-700">
            <Play className="w-4 h-4" /> Start Break
          </Button>
        ) : (
          <Button onClick={handleEndBreak} className="w-full h-12 gap-2 bg-red-600 hover:bg-red-700">
            <Square className="w-4 h-4" /> End Break
          </Button>
        )}
      </div>

      {/* Today's Breaks */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-semibold mb-4">Today's Breaks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef]">
                <th className="text-left pb-3 font-medium text-slate-500">Type</th>
                <th className="text-left pb-3 font-medium text-slate-500">Start</th>
                <th className="text-left pb-3 font-medium text-slate-500">End</th>
                <th className="text-left pb-3 font-medium text-slate-500">Duration</th>
                <th className="text-left pb-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MY_BREAKS.filter((b) => b.date === "2026-04-09").map((b) => {
                const style = BREAK_STATUS_STYLES[b.status] || BREAK_STATUS_STYLES["completed"];
                return (
                  <tr key={b.id} className="border-b border-[#efefef] last:border-0">
                    <td className="py-3">{b.breakType}</td>
                    <td className="py-3">{b.startTime}</td>
                    <td className="py-3">{b.endTime || "--"}</td>
                    <td className="py-3">{b.durationMinutes ? `${b.durationMinutes} min` : "--"}</td>
                    <td className="py-3">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                        {b.status === "completed" ? "Completed" : b.status === "exceeded" ? "Exceeded" : "On Break"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Break Policy Info */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Info className="w-4 h-4" /> Break Policy
        </h2>
        <div className="space-y-3">
          {MOCK_BREAK_POLICIES.map((policy) => (
            <div key={policy.id} className="rounded-lg border border-[#efefef] p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{policy.name}</p>
                <p className="text-xs text-slate-500">
                  {policy.breakDurationMinutes} min | Max {policy.maxBreaksPerDay}/day | {policy.paidBreak ? "Paid" : "Unpaid"} | {policy.autoDeduct ? "Auto-deducted" : "Manual"}
                </p>
              </div>
              <span className="text-xs text-slate-400">{policy.appliesTo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
