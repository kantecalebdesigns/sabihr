import { useState } from "react";
import {
  Fingerprint,
  Wifi,
  WifiOff,
  Wrench,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_BIOMETRIC_DEVICES,
  DEVICE_STATUS_STYLES,
} from "@/lib/attendance-extended-mock-data";
import type { BiometricDevice } from "@/lib/attendance-extended-mock-data";

const DEVICE_TYPE_LABELS: Record<string, string> = {
  fingerprint: "Fingerprint",
  facial: "Facial Recognition",
  iris: "Iris Scanner",
  card: "Card Reader",
};

export default function AttendanceBiometricPage() {
  const [devices, setDevices] = useState<BiometricDevice[]>(MOCK_BIOMETRIC_DEVICES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "fingerprint", location: "", ipAddress: "" });

  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.filter((d) => d.status === "offline").length;
  const maintenance = devices.filter((d) => d.status === "maintenance").length;

  const summaryCards = [
    { label: "Total Devices", value: devices.length, icon: Fingerprint, iconBg: "bg-slate-100 text-slate-600" },
    { label: "Online", value: online, icon: Wifi, iconBg: "bg-emerald-100 text-emerald-600" },
    { label: "Offline", value: offline, icon: WifiOff, iconBg: "bg-red-100 text-red-600" },
    { label: "Maintenance", value: maintenance, icon: Wrench, iconBg: "bg-amber-100 text-amber-600" },
  ];

  function handleAddDevice() {
    if (!form.name || !form.location || !form.ipAddress) return;
    const newDevice: BiometricDevice = {
      id: `bd-${Date.now()}`,
      name: form.name,
      type: form.type as BiometricDevice["type"],
      location: form.location,
      ipAddress: form.ipAddress,
      status: "online",
      lastSync: new Date().toISOString(),
      employeesEnrolled: 0,
      firmware: "v1.0.0",
    };
    setDevices([newDevice, ...devices]);
    setForm({ name: "", type: "fingerprint", location: "", ipAddress: "" });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Biometric Devices</h1>
          <p className="text-sm text-slate-500">Manage biometric device integration and monitoring</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? "Cancel" : "Add Device"}
        </Button>
      </div>

      {/* Add Device Form */}
      {showForm && (
        <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
          <h2 className="text-sm font-semibold">New Biometric Device</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Device Name</label>
              <Input
                placeholder="e.g. Lobby FP-300"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="fingerprint">Fingerprint</option>
                <option value="facial">Facial Recognition</option>
                <option value="iris">Iris Scanner</option>
                <option value="card">Card Reader</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
              <Input
                placeholder="e.g. Lagos Office - 2nd Floor"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">IP Address</label>
              <Input
                placeholder="e.g. 192.168.1.110"
                value={form.ipAddress}
                onChange={(e) => setForm({ ...form, ipAddress: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAddDevice}>Add Device</Button>
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

      {/* Devices Table */}
      <div className="rounded-xl border border-[#efefef] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc] text-left">
                <th className="px-4 py-3 font-medium text-slate-600">Device Name</th>
                <th className="px-4 py-3 font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 font-medium text-slate-600">Location</th>
                <th className="px-4 py-3 font-medium text-slate-600">IP Address</th>
                <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 font-medium text-slate-600">Last Sync</th>
                <th className="px-4 py-3 font-medium text-slate-600">Enrolled</th>
                <th className="px-4 py-3 font-medium text-slate-600">Firmware</th>
                <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => {
                const style = DEVICE_STATUS_STYLES[device.status];
                return (
                  <tr key={device.id} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                    <td className="px-4 py-3 font-medium">{device.name}</td>
                    <td className="px-4 py-3 text-slate-600">{DEVICE_TYPE_LABELS[device.type]}</td>
                    <td className="px-4 py-3 text-slate-600">{device.location}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{device.ipAddress}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                        {style.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(device.lastSync).toLocaleString("en-NG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{device.employeesEnrolled}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{device.firmware}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="xs">
                        <RefreshCw className="size-3" />
                        Sync
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
