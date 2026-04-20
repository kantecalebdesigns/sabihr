import { useState } from "react";
import { Plus, Moon, X, Clock, CheckCircle2, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MOCK_SHIFTS, formatNaira } from "@/lib/attendance-extended-mock-data";
import type { ShiftDefinition } from "@/lib/attendance-extended-mock-data";

export default function ShiftConfigPage() {
  const [shifts, setShifts] = useState<ShiftDefinition[]>(MOCK_SHIFTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    startTime: "09:00",
    endTime: "17:00",
    breakMinutes: 60,
    allowance: 0,
    isNight: false,
    status: "active" as "active" | "draft",
  });

  const totalShifts = shifts.length;
  const activeShifts = shifts.filter((s) => s.status === "active").length;
  const draftShifts = shifts.filter((s) => s.status === "draft").length;
  const nightShifts = shifts.filter((s) => s.isNight).length;

  const kpis = [
    { value: totalShifts, label: "Total shifts", icon: Clock, trend: 1 },
    { value: activeShifts, label: "Active", icon: CheckCircle2, trend: 2 },
    { value: draftShifts, label: "Draft", icon: FileText, trend: 0 },
    { value: nightShifts, label: "Night shifts", icon: Moon, trend: 1 },
  ];

  const handleCreate = () => {
    const newShift: ShiftDefinition = {
      id: `sh-${Date.now()}`,
      ...form,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
    };
    setShifts([...shifts, newShift]);
    setShowForm(false);
    setForm({ name: "", code: "", startTime: "09:00", endTime: "17:00", breakMinutes: 60, allowance: 0, isNight: false, status: "active" });
  };

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#1d4ed8] text-white">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6 px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[11px] font-medium">
              <Clock className="w-3 h-3" />
              Time · Northwind Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shifts</h1>
            <p className="text-sm text-white/85 max-w-xl leading-relaxed">
              Define <span className="font-semibold text-white">shift patterns</span> with start/end
              times, break durations, and allowances — then roster teams and track night shifts
              across the organization.
            </p>
          </div>

          <div className="hidden sm:flex shrink-0 w-48 h-36 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute top-0 right-4 w-24 h-24 rounded-2xl bg-white/15 backdrop-blur rotate-6" />
              <div className="absolute bottom-0 right-14 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur -rotate-12" />
              <div className="absolute top-4 right-16 w-16 h-16 rounded-xl bg-white/25 backdrop-blur rotate-12 flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setShowForm(true)} className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4">
          <Plus className="w-4 h-4 mr-1" />
          Create shift
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/70 bg-white px-5 pt-5 pb-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-7"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] text-blue-600" />
                </div>
                <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{kpi.trend}</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Create shift</h2>
            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Shift name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Morning shift" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Code</label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. MS" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Start time</label>
              <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">End time</label>
              <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Break (minutes)</label>
              <Input type="number" value={form.breakMinutes} onChange={(e) => setForm({ ...form, breakMinutes: +e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Allowance (NGN)</label>
              <Input type="number" value={form.allowance} onChange={(e) => setForm({ ...form, allowance: +e.target.value })} className="mt-1" />
            </div>
            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isNight} onChange={(e) => setForm({ ...form, isNight: e.target.checked })} className="rounded border-slate-300" />
                Night shift
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "draft" })}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)} className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!form.name || !form.code}
              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
            >
              Save shift
            </Button>
          </div>
        </div>
      )}

      {/* Shift cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0"
                  style={{ backgroundColor: shift.color }}
                >
                  {shift.code.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 leading-tight">{shift.name}</h3>
                  <p className="text-xs text-slate-500 font-mono leading-tight mt-0.5">{shift.code}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {shift.isNight && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                    <Moon className="h-3 w-3" /> Night
                  </span>
                )}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                    shift.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", shift.status === "active" ? "bg-emerald-500" : "bg-amber-500")} />
                  {shift.status === "active" ? "Active" : "Draft"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Time</p>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {shift.startTime}–{shift.endTime}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Break</p>
                <p className="font-semibold text-slate-900 mt-0.5">{shift.breakMinutes}m</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Allowance</p>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {shift.allowance > 0 ? formatNaira(shift.allowance) : "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
