import { useState, useEffect } from "react";
import { Camera, CheckCircle, LogIn, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VerifyStep = "idle" | "detecting" | "verifying" | "verified";
type ClockStatus = "not-clocked" | "clocked-in" | "clocked-out";

export default function EmployeeClockInFacialPage() {
  const [now, setNow] = useState(new Date());
  const [verifyStep, setVerifyStep] = useState<VerifyStep>("idle");
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

  const handleStartVerification = () => {
    setVerifyStep("detecting");
    setTimeout(() => setVerifyStep("verifying"), 1500);
    setTimeout(() => setVerifyStep("verified"), 3000);
  };

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
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Facial Recognition Clock In</h1>
        <p className="text-sm text-slate-500">Verify your identity using facial recognition</p>
      </div>

      {/* Clock */}
      <div className="rounded-xl border border-[#efefef] bg-white p-6 text-center space-y-2">
        <p className="text-sm text-slate-500">{now.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        <p className="text-4xl font-bold tracking-tight tabular-nums">{formatTime(now)}</p>
      </div>

      {/* Camera Area */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
        <h2 className="text-sm font-semibold">Face Verification</h2>

        <div className="rounded-xl bg-slate-900 h-64 flex flex-col items-center justify-center gap-3 text-slate-400 relative overflow-hidden">
          {verifyStep === "idle" && (
            <>
              <Camera className="w-12 h-12" />
              <p className="text-sm">Position your face in the frame</p>
            </>
          )}
          {verifyStep === "detecting" && (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
              <p className="text-sm text-amber-400 font-medium">Detecting face...</p>
            </>
          )}
          {verifyStep === "verifying" && (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
              <p className="text-sm text-blue-400 font-medium">Verifying identity...</p>
            </>
          )}
          {verifyStep === "verified" && (
            <>
              <CheckCircle className="w-12 h-12 text-emerald-400" />
              <p className="text-sm text-emerald-400 font-medium">Verified!</p>
            </>
          )}
          {/* Simulated frame overlay */}
          <div className="absolute inset-8 border-2 border-dashed border-slate-600 rounded-xl pointer-events-none" />
        </div>

        {/* Verification Steps */}
        <div className="flex items-center gap-4 text-xs">
          <div className={cn("flex items-center gap-1.5", verifyStep !== "idle" ? "text-emerald-600" : "text-slate-400")}>
            <div className={cn("w-2 h-2 rounded-full", verifyStep !== "idle" ? "bg-emerald-500" : "bg-slate-300")} />
            Face Detected
          </div>
          <div className={cn("flex items-center gap-1.5", verifyStep === "verifying" || verifyStep === "verified" ? "text-emerald-600" : "text-slate-400")}>
            <div className={cn("w-2 h-2 rounded-full", verifyStep === "verifying" || verifyStep === "verified" ? "bg-emerald-500" : "bg-slate-300")} />
            Identity Checked
          </div>
          <div className={cn("flex items-center gap-1.5", verifyStep === "verified" ? "text-emerald-600" : "text-slate-400")}>
            <div className={cn("w-2 h-2 rounded-full", verifyStep === "verified" ? "bg-emerald-500" : "bg-slate-300")} />
            Verified
          </div>
        </div>

        {verifyStep === "idle" && (
          <Button onClick={handleStartVerification} className="w-full">
            <Camera className="w-4 h-4 mr-2" /> Start Verification
          </Button>
        )}
      </div>

      {/* Clock In/Out Action (only visible after verification) */}
      {verifyStep === "verified" && (
        <div className="rounded-xl border border-[#efefef] bg-white p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            {status === "not-clocked" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600">Not Clocked In</span>
            )}
            {status === "clocked-in" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-4 h-4 mr-1.5" /> Clocked In at {clockInTime}
              </span>
            )}
            {status === "clocked-out" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Clocked Out at {clockOutTime}
              </span>
            )}
          </div>

          {status !== "clocked-out" ? (
            <Button
              size="lg"
              className={cn(
                "h-14 px-10 text-base font-semibold rounded-xl",
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
          ) : (
            <p className="text-sm text-slate-400">You have completed your shift for today.</p>
          )}
        </div>
      )}

      {/* Today's Status */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-semibold mb-4">Today's Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Clock In</p>
            <p className="font-medium">{clockInTime || "--:--"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Clock Out</p>
            <p className="font-medium">{clockOutTime || "--:--"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Verification</p>
            <p className="font-medium">{verifyStep === "verified" ? "Facial ID Verified" : "Not Verified"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Status</p>
            <p className="font-medium capitalize">{status === "not-clocked" ? "Pending" : status === "clocked-in" ? "In Progress" : "Completed"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
