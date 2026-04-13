import { useState, useEffect } from "react";
import { MapPin, LogIn, LogOut, CheckCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_GEOFENCE_ZONES } from "@/lib/attendance-extended-mock-data";

type ClockStatus = "not-clocked" | "clocked-in" | "clocked-out";

const MOCK_GPS = {
  latitude: 6.4285,
  longitude: 3.4222,
  accuracy: 12,
  distanceFromOffice: 45,
};

const assignedOffice = MOCK_GEOFENCE_ZONES[0];

export default function EmployeeClockInGpsPage() {
  const [now, setNow] = useState(new Date());
  const [status, setStatus] = useState<ClockStatus>("not-clocked");
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [withinGeofence] = useState(MOCK_GPS.distanceFromOffice <= assignedOffice.radiusMeters);

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
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">GPS-Verified Clock In</h1>
        <p className="text-sm text-slate-500">Your location is verified before clocking in</p>
      </div>

      {/* Clock Display */}
      <div className="rounded-xl border border-[#efefef] bg-white p-8 text-center space-y-4">
        <p className="text-sm text-slate-500">{now.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        <p className="text-5xl font-bold tracking-tight tabular-nums">{formatTime(now)}</p>

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

      {/* Location Verification */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Navigation className="w-4 h-4" /> Location Verification
        </h2>

        {/* Map placeholder */}
        <div className="rounded-lg bg-slate-100 border border-slate-200 h-48 flex flex-col items-center justify-center gap-2 text-slate-400">
          <MapPin className="w-10 h-10" />
          <span className="text-sm">Map View</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Your Coordinates</p>
            <p className="font-medium tabular-nums">{MOCK_GPS.latitude.toFixed(4)}, {MOCK_GPS.longitude.toFixed(4)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">GPS Accuracy</p>
            <p className="font-medium">{MOCK_GPS.accuracy}m</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Distance from Office</p>
            <p className="font-medium">{MOCK_GPS.distanceFromOffice}m</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Geofence Status</p>
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
              withinGeofence
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            )}>
              {withinGeofence ? "Within geofence" : "Outside geofence"}
            </span>
          </div>
        </div>
      </div>

      {/* Assigned Office */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-semibold mb-3">Assigned Office</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Office</p>
            <p className="font-medium">{assignedOffice.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Address</p>
            <p className="font-medium">{assignedOffice.address}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Geofence Radius</p>
            <p className="font-medium">{assignedOffice.radiusMeters}m</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Coordinates</p>
            <p className="font-medium tabular-nums">{assignedOffice.latitude.toFixed(4)}, {assignedOffice.longitude.toFixed(4)}</p>
          </div>
        </div>
      </div>

      {/* Clock Action */}
      <div className="rounded-xl border border-[#efefef] bg-white p-6 text-center">
        {status !== "clocked-out" ? (
          <Button
            size="lg"
            disabled={!withinGeofence}
            className={cn(
              "h-14 px-10 text-base font-semibold rounded-xl",
              status === "not-clocked"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            )}
            onClick={status === "not-clocked" ? handleClockIn : handleClockOut}
          >
            {status === "not-clocked" ? (
              <><LogIn className="w-5 h-5 mr-2" /> Clock In (GPS Verified)</>
            ) : (
              <><LogOut className="w-5 h-5 mr-2" /> Clock Out</>
            )}
          </Button>
        ) : (
          <p className="text-sm text-slate-400">You have completed your shift for today.</p>
        )}
        {!withinGeofence && status !== "clocked-out" && (
          <p className="text-xs text-red-500 mt-2">You must be within the office geofence to clock in.</p>
        )}
      </div>
    </div>
  );
}
