import { useState } from "react";
import {
  MapPin,
  Plus,
  X,
  Globe,
  Users,
  Radius,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MOCK_GEOFENCE_ZONES } from "@/lib/attendance-extended-mock-data";
import type { GeofenceZone } from "@/lib/attendance-extended-mock-data";

export default function AttendanceGeofencingPage() {
  const [zones, setZones] = useState<GeofenceZone[]>(MOCK_GEOFENCE_ZONES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    radiusMeters: 200,
    isActive: true,
  });

  const activeZones = zones.filter((z) => z.isActive).length;
  const totalEmployees = zones.reduce((sum, z) => sum + z.employeesAssigned, 0);
  const avgRadius = Math.round(zones.reduce((sum, z) => sum + z.radiusMeters, 0) / zones.length);

  const summaryCards = [
    { label: "Total Zones", value: zones.length, icon: MapPin, iconBg: "bg-slate-100 text-slate-600" },
    { label: "Active Zones", value: activeZones, icon: Globe, iconBg: "bg-emerald-100 text-emerald-600" },
    { label: "Employees Covered", value: totalEmployees, icon: Users, iconBg: "bg-blue-100 text-blue-600" },
    { label: "Avg Radius (m)", value: avgRadius, icon: Radius, iconBg: "bg-violet-100 text-violet-600" },
  ];

  function handleToggleActive(id: string) {
    setZones(zones.map((z) => (z.id === id ? { ...z, isActive: !z.isActive } : z)));
  }

  function handleAddZone() {
    if (!form.name || !form.address || !form.latitude || !form.longitude) return;
    const newZone: GeofenceZone = {
      id: `gf-${Date.now()}`,
      name: form.name,
      address: form.address,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      radiusMeters: form.radiusMeters,
      isActive: form.isActive,
      employeesAssigned: 0,
    };
    setZones([newZone, ...zones]);
    setForm({ name: "", address: "", latitude: "", longitude: "", radiusMeters: 200, isActive: true });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Geofencing</h1>
          <p className="text-sm text-slate-500">Configure GPS zones for location-based attendance</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? "Cancel" : "Add Zone"}
        </Button>
      </div>

      {/* Add Zone Form */}
      {showForm && (
        <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
          <h2 className="text-sm font-semibold">New Geofence Zone</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Zone Name</label>
              <Input placeholder="e.g. PH Branch Office" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
              <Input placeholder="e.g. 10 Aba Road, Port Harcourt" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Latitude</label>
              <Input type="number" step="0.0001" placeholder="e.g. 6.4281" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Longitude</label>
              <Input type="number" step="0.0001" placeholder="e.g. 3.4219" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Radius: {form.radiusMeters}m</label>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={form.radiusMeters}
                onChange={(e) => setForm({ ...form, radiusMeters: parseInt(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>50m</span>
                <span>500m</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                form.isActive ? "bg-emerald-500" : "bg-slate-300"
              )}
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
            >
              <span className={cn("inline-block size-3.5 rounded-full bg-white transition-transform", form.isActive ? "translate-x-4" : "translate-x-1")} />
            </button>
            <span className="text-xs text-slate-600">Active</span>
          </div>
          <Button onClick={handleAddZone}>Add Zone</Button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex items-center justify-center rounded-lg size-10", card.iconBg)}>
                <card.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div key={zone.id} className="rounded-xl border border-[#efefef] bg-white p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm">{zone.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{zone.address}</p>
              </div>
              <button
                type="button"
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0",
                  zone.isActive ? "bg-emerald-500" : "bg-slate-300"
                )}
                onClick={() => handleToggleActive(zone.id)}
              >
                <span className={cn("inline-block size-3.5 rounded-full bg-white transition-transform", zone.isActive ? "translate-x-4" : "translate-x-1")} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-400">Latitude</p>
                <p className="font-medium">{zone.latitude.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-slate-400">Longitude</p>
                <p className="font-medium">{zone.longitude.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-slate-400">Radius</p>
                <p className="font-medium">{zone.radiusMeters}m</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#efefef]">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="size-3.5" />
                {zone.employeesAssigned} employees assigned
              </div>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                  zone.isActive
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                )}
              >
                {zone.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
