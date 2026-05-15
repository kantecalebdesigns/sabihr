import { useState } from "react";
import { Plus, Moon, X, Clock, CheckCircle2, FileText, TrendingUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MOCK_SHIFTS, formatNaira } from "@/lib/attendance-extended-mock-data";
import type { ShiftDefinition } from "@/lib/attendance-extended-mock-data";

const HOUR_TICKS = [0, 3, 6, 9, 12, 15, 18, 21, 24];

function timeToPct(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return ((h * 60 + m) / 1440) * 100;
}

function shiftSegments(start: string, end: string): { left: number; width: number }[] {
  const s = timeToPct(start);
  const e = timeToPct(end);
  if (e > s) return [{ left: s, width: e - s }];
  return [
    { left: s, width: 100 - s },
    { left: 0, width: e },
  ];
}

function shiftHours(start: string, end: string, breakMinutes: number): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) mins += 1440;
  mins -= breakMinutes;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

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

  const sortedForTimeline = [...shifts].sort((a, b) => timeToPct(a.startTime) - timeToPct(b.startTime));

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Shifts</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Define shift patterns with start/end times, break durations, and allowances — then
            roster teams and track night shifts across the organization.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 shrink-0"
        >
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

      {/* 24-hour coverage timeline */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">24-hour coverage</h3>
            <p className="text-xs text-slate-500 mt-0.5">How your shifts cover the day — spot overlaps and gaps at a glance</p>
          </div>
        </div>
        <div className="px-5 py-5 space-y-3">
          {/* Hour scale */}
          <div className="relative h-5 ml-[140px] mr-4">
            {HOUR_TICKS.map((h) => (
              <div
                key={h}
                className="absolute top-0 -translate-x-1/2 text-[10px] font-medium text-slate-400 tabular-nums"
                style={{ left: `${(h / 24) * 100}%` }}
              >
                {h.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {sortedForTimeline.map((shift) => {
              const segments = shiftSegments(shift.startTime, shift.endTime);
              return (
                <div key={shift.id} className="flex items-center gap-3">
                  <div className="w-[130px] shrink-0 flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: shift.color }}
                    >
                      {shift.code.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-900 truncate">{shift.name}</span>
                  </div>
                  <div className="relative flex-1 h-8 rounded-md bg-slate-50 overflow-hidden mr-4">
                    {/* Hour gridlines */}
                    {HOUR_TICKS.slice(1, -1).map((h) => (
                      <div
                        key={h}
                        className="absolute top-0 bottom-0 w-px bg-slate-200/80"
                        style={{ left: `${(h / 24) * 100}%` }}
                      />
                    ))}
                    {/* Shift segments */}
                    {segments.map((seg, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 flex items-center px-2"
                        style={{
                          left: `${seg.left}%`,
                          width: `${seg.width}%`,
                          backgroundColor: shift.color,
                          opacity: shift.status === "active" ? 1 : 0.45,
                        }}
                      >
                        {seg.width > 14 && i === 0 && (
                          <span className="text-[10px] font-semibold text-white tabular-nums whitespace-nowrap">
                            {shift.startTime}–{shift.endTime}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shift table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">All shifts</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
              {shifts.length}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Shift</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Schedule</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Duration</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Break</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Allowance</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                <th className="w-10 px-2" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr
                  key={shift.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-4 pl-5 pr-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-semibold text-sm"
                        style={{ backgroundColor: shift.color }}
                      >
                        {shift.code.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 leading-tight">{shift.name}</p>
                          {shift.isNight && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                              <Moon className="h-3 w-3" />
                              Night
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-tight mt-0.5 font-mono">{shift.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-5 text-slate-700 tabular-nums">
                    {shift.startTime}–{shift.endTime}
                  </td>
                  <td className="py-4 pr-5 font-semibold text-slate-900 tabular-nums">
                    {shiftHours(shift.startTime, shift.endTime, shift.breakMinutes)}
                  </td>
                  <td className="py-4 pr-5 text-slate-700 tabular-nums">{shift.breakMinutes}m</td>
                  <td className="py-4 pr-5 text-slate-700 tabular-nums">
                    {shift.allowance > 0 ? formatNaira(shift.allowance) : "—"}
                  </td>
                  <td className="py-4 pr-5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                        shift.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", shift.status === "active" ? "bg-emerald-500" : "bg-amber-500")} />
                      {shift.status === "active" ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-right">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
