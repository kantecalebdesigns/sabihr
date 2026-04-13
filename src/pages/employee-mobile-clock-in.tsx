import { useState, useEffect } from "react";
import { Monitor, LogIn, LogOut, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ClockMethod = "web" | null;
type ClockStatus = "not-clocked" | "clocked-in" | "clocked-out";

const METHODS = [
  { id: "web" as const, label: "Web Clock-In", description: "Quick clock-in via browser", icon: Monitor, color: "text-blue-600 bg-blue-50 border-blue-200" },
];

export default function EmployeeMobileClockInPage() {
  const [now, setNow] = useState(new Date());
  const [selectedMethod, setSelectedMethod] = useState<ClockMethod>(null);
  const [status, setStatus] = useState<ClockStatus>("not-clocked");
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  const formatShortTime = (d: Date) =>
    d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false });

  const handleClockIn = () => {
    setClockInTime(formatShortTime(new Date()));
    setClockOutTime(null);
    setStatus("clocked-in");
  };

  const handleClockOut = () => {
    setClockOutTime(formatShortTime(new Date()));
    setStatus("clocked-out");
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Clock In</h1>
        <p className="text-sm text-slate-500">Choose a method to record attendance</p>
      </div>

      {/* Time Display */}
      <div className="rounded-xl border border-[#efefef] bg-white p-6 text-center space-y-2">
        <p className="text-xs text-slate-500">{now.toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })}</p>
        <p className="text-4xl font-bold tracking-tight tabular-nums">{formatTime(now)}</p>
      </div>

      {/* Today's Status */}
      <div className="rounded-xl border border-[#efefef] bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Status</span>
          {status === "not-clocked" && <span className="text-slate-500">Not clocked in</span>}
          {status === "clocked-in" && (
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> In at {clockInTime}
            </span>
          )}
          {status === "clocked-out" && (
            <span className="text-blue-600 font-medium">Out at {clockOutTime}</span>
          )}
        </div>
      </div>

      {/* Method Cards */}
      <div className="space-y-3">
        {METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <div key={method.id}>
              <button
                onClick={() => setSelectedMethod(isSelected ? null : method.id)}
                className={cn(
                  "w-full rounded-xl border p-4 flex items-center gap-4 text-left transition-all",
                  isSelected ? "border-slate-900 bg-slate-50" : "border-[#efefef] bg-white"
                )}
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", method.color)}>
                  <method.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{method.label}</p>
                  <p className="text-xs text-slate-500">{method.description}</p>
                </div>
              </button>

              {/* Expanded Action */}
              {isSelected && status !== "clocked-out" && (
                <div className="mt-2 px-2">
                  <Button
                    className={cn(
                      "w-full h-12 text-base font-semibold rounded-xl",
                      status === "not-clocked"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    )}
                    onClick={status === "not-clocked" ? handleClockIn : handleClockOut}
                  >
                    {status === "not-clocked" ? (
                      <><LogIn className="w-5 h-5 mr-2" /> Clock In</>
                    ) : (
                      <><LogOut className="w-5 h-5 mr-2" /> Clock Out</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {status === "clocked-out" && (
        <div className="rounded-xl border border-[#efefef] bg-white p-4 text-center text-sm text-slate-400">
          You have completed your shift for today.
        </div>
      )}
    </div>
  );
}
