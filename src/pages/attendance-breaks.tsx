import { useState } from "react";
import { Coffee, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MOCK_BREAK_POLICIES } from "@/lib/attendance-extended-mock-data";
import type { BreakPolicy } from "@/lib/attendance-extended-mock-data";

const MOCK_BREAK_COMPLIANCE = [
  { id: 1, employee: "Adebayo Ogunlesi", department: "Engineering", breaksTaken: 2, totalMinutes: 72, allowed: 75, compliant: true },
  { id: 2, employee: "Chiamaka Eze", department: "Engineering", breaksTaken: 1, totalMinutes: 55, allowed: 60, compliant: true },
  { id: 3, employee: "Oluwaseun Afolabi", department: "Engineering", breaksTaken: 3, totalMinutes: 95, allowed: 75, compliant: false },
  { id: 4, employee: "Emeka Nwosu", department: "Operations", breaksTaken: 2, totalMinutes: 60, allowed: 90, compliant: true },
  { id: 5, employee: "Bukola Adeyemi", department: "Marketing", breaksTaken: 1, totalMinutes: 78, allowed: 60, compliant: false },
];

export default function AttendanceBreaksPage() {
  const [policies, setPolicies] = useState<BreakPolicy[]>(MOCK_BREAK_POLICIES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    breakDurationMinutes: 30,
    maxBreaksPerDay: 1,
    paidBreak: false,
    autoDeduct: false,
    appliesTo: "All employees",
  });

  const handleAdd = () => {
    const newPolicy: BreakPolicy = {
      id: `bp-${Date.now()}`,
      ...form,
    };
    setPolicies([...policies, newPolicy]);
    setShowForm(false);
    setForm({ name: "", breakDurationMinutes: 30, maxBreaksPerDay: 1, paidBreak: false, autoDeduct: false, appliesTo: "All employees" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Break Time Configuration & Monitoring</h1>
          <p className="text-sm text-slate-500">Manage break policies and monitor employee break compliance</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Policy
        </Button>
      </div>

      {/* Add Policy Form */}
      {showForm && (
        <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">New Break Policy</h2>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Policy Name</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Lunch Break" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Duration (minutes)</label>
              <Input type="number" value={form.breakDurationMinutes} onChange={e => setForm({ ...form, breakDurationMinutes: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Max Breaks Per Day</label>
              <Input type="number" value={form.maxBreaksPerDay} onChange={e => setForm({ ...form, maxBreaksPerDay: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Applies To</label>
              <Input value={form.appliesTo} onChange={e => setForm({ ...form, appliesTo: e.target.value })} placeholder="e.g. All employees" />
            </div>
            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.paidBreak} onChange={e => setForm({ ...form, paidBreak: e.target.checked })} className="rounded border-slate-300" />
                Paid Break
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.autoDeduct} onChange={e => setForm({ ...form, autoDeduct: e.target.checked })} className="rounded border-slate-300" />
                Auto-Deduct
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name}>Save Policy</Button>
          </div>
        </div>
      )}

      {/* Policy Cards */}
      <div>
        <h2 className="text-base font-semibold mb-3">Break Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map(policy => (
            <div key={policy.id} className="rounded-xl border border-[#efefef] bg-white p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-slate-500" />
                  <h3 className="font-semibold text-sm">{policy.name}</h3>
                </div>
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                  policy.paidBreak
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                )}>
                  {policy.paidBreak ? "Paid" : "Unpaid"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-500">Duration</p>
                  <p className="font-medium">{policy.breakDurationMinutes} min</p>
                </div>
                <div>
                  <p className="text-slate-500">Max Per Day</p>
                  <p className="font-medium">{policy.maxBreaksPerDay}</p>
                </div>
                <div>
                  <p className="text-slate-500">Auto-Deduct</p>
                  <p className="font-medium">{policy.autoDeduct ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Applies To</p>
                  <p className="font-medium">{policy.appliesTo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monitoring Section */}
      <div>
        <h2 className="text-base font-semibold mb-3">Today's Break Compliance</h2>
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-200/70 text-left">
                <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
                <th className="px-4 py-3 font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 font-medium text-slate-600">Breaks Taken</th>
                <th className="px-4 py-3 font-medium text-slate-600">Total Minutes</th>
                <th className="px-4 py-3 font-medium text-slate-600">Allowed (min)</th>
                <th className="px-4 py-3 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_BREAK_COMPLIANCE.map(row => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium">{row.employee}</td>
                  <td className="px-4 py-3 text-slate-600">{row.department}</td>
                  <td className="px-4 py-3">{row.breaksTaken}</td>
                  <td className="px-4 py-3">{row.totalMinutes}</td>
                  <td className="px-4 py-3">{row.allowed}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                      row.compliant
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    )}>
                      {row.compliant ? "Compliant" : "Exceeded"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
