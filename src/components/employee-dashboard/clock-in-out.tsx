import { useState, useEffect } from "react";
import { LogIn, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ClockInOut() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsed, setElapsed] = useState(0);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Elapsed time counter when clocked in
  useEffect(() => {
    if (!isClockedIn || !clockInTime) {
      return;
    }
    const timer = setInterval(() => {
      setElapsed(Date.now() - clockInTime.getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [isClockedIn, clockInTime]);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    setClockOutTime(null);
    setIsClockedIn(true);
    setElapsed(0);
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(now);
    setIsClockedIn(false);
  };

  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Left: Status & time */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isClockedIn
                ? "bg-green-50 border border-green-200"
                : "bg-slate-50 border border-[#efefef]"
            }`}
          >
            <Clock
              className={`w-6 h-6 ${isClockedIn ? "text-green-600" : "text-slate-400"}`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">
                {isClockedIn ? "You're clocked in" : "You're not clocked in"}
              </p>
              {isClockedIn && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatTime(currentTime)}
              {clockInTime && (
                <>
                  {" · "}
                  Clocked in at {formatTime(clockInTime)}
                </>
              )}
              {clockOutTime && (
                <>
                  {" · "}
                  Clocked out at {formatTime(clockOutTime)}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Center: Elapsed time (when clocked in) */}
        {isClockedIn && (
          <div className="hidden md:flex flex-col items-center px-4">
            <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {formatDuration(elapsed)}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Hours worked today</p>
          </div>
        )}

        {/* Right: Action button */}
        <div className="flex items-center gap-3 shrink-0">
          {!isClockedIn ? (
            <Button
              onClick={handleClockIn}
              className="h-10 px-5 text-sm font-medium gap-2 bg-[#009966] hover:bg-[#008855] text-white rounded-lg"
            >
              <LogIn className="w-4 h-4" />
              Clock In
            </Button>
          ) : (
            <Button
              onClick={handleClockOut}
              variant="outline"
              className="h-10 px-5 text-sm font-medium gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Clock Out
            </Button>
          )}
        </div>
      </div>

      {/* Mobile elapsed time */}
      {isClockedIn && (
        <div className="flex md:hidden items-center justify-between mt-4 pt-4 border-t border-[#efefef]">
          <p className="text-xs text-slate-500 font-medium">Hours worked today</p>
          <p className="text-lg font-bold tracking-tight text-slate-900 tabular-nums">
            {formatDuration(elapsed)}
          </p>
        </div>
      )}

      {/* Clock-in/out summary row */}
      {(clockInTime || clockOutTime) && (
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#efefef]">
          {clockInTime && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <LogIn className="w-3.5 h-3.5 text-green-600" />
              <span>In: <span className="font-medium text-slate-700">{formatTime(clockInTime)}</span></span>
            </div>
          )}
          {clockOutTime && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Out: <span className="font-medium text-slate-700">{formatTime(clockOutTime)}</span></span>
            </div>
          )}
          {clockOutTime && clockInTime && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Total: <span className="font-medium text-slate-700">{formatDuration(clockOutTime.getTime() - clockInTime.getTime())}</span></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
