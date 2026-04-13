import { useState } from "react";
import { Plus, Moon, X } from "lucide-react";
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
  const activeShifts = shifts.filter(s => s.status === "active").length;
  const draftShifts = shifts.filter(s => s.status === "draft").length;
  const nightShifts = shifts.filter(s => s.isNight).length;

  const summaryCards = [
    { label: "Total Shifts", value: totalShifts, color: "text-slate-900" },
    { label: "Active", value: activeShifts, color: "text-emerald-600" },
    { label: "Draft", value: draftShifts, color: "text-amber-600" },
    { label: "Night Shifts", value: nightShifts, color: "text-indigo-600" },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Shift Configuration</h1>
          <p className="text-sm text-slate-500">Create and manage shift definitions</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Create Shift
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={cn("text-2xl font-bold mt-1", card.color)}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Create Shift</h2>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Shift Name</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Morning Shift" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Code</label>
              <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. MS" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Start Time</label>
              <Input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">End Time</label>
              <Input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Break (minutes)</label>
              <Input type="number" value={form.breakMinutes} onChange={e => setForm({ ...form, breakMinutes: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Allowance (NGN)</label>
              <Input type="number" value={form.allowance} onChange={e => setForm({ ...form, allowance: +e.target.value })} />
            </div>
            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isNight} onChange={e => setForm({ ...form, isNight: e.target.checked })} className="rounded border-slate-300" />
                Night Shift
              </label>
              <label className="flex items-center gap-2 text-sm">
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as "active" | "draft" })} className="rounded border border-slate-300 px-2 py-1 text-sm">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.name || !form.code}>Save Shift</Button>
          </div>
        </div>
      )}

      {/* Shift Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map(shift => (
          <div key={shift.id} className="rounded-xl border border-[#efefef] bg-white p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 rounded-full" style={{ backgroundColor: shift.color }} />
                <div>
                  <h3 className="font-semibold text-sm">{shift.name}</h3>
                  <p className="text-xs text-slate-500">Code: {shift.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {shift.isNight && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-indigo-50 border-indigo-200 text-indigo-700">
                    <Moon className="h-3 w-3" /> Night
                  </span>
                )}
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                  shift.status === "active"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                )}>
                  {shift.status === "active" ? "Active" : "Draft"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-slate-500">Time</p>
                <p className="font-medium">{shift.startTime} - {shift.endTime}</p>
              </div>
              <div>
                <p className="text-slate-500">Break</p>
                <p className="font-medium">{shift.breakMinutes} min</p>
              </div>
              <div>
                <p className="text-slate-500">Allowance</p>
                <p className="font-medium">{shift.allowance > 0 ? formatNaira(shift.allowance) : "None"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
