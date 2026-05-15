import { useMemo, useState } from "react";
import { CheckCircle2, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEFAULT_SALARY_COMPONENTS } from "@/lib/salary-breakdown-data";
import type { SalaryComponent } from "@/lib/salary-breakdown-data";
import { formatNaira } from "@/lib/payroll-mock-data";

const SAMPLE_GROSS = 500000;

function makeId() {
  return `c-${Math.random().toString(36).slice(2, 9)}`;
}

export default function SalaryBreakdownPage() {
  const [initial, setInitial] = useState<SalaryComponent[]>(() =>
    DEFAULT_SALARY_COMPONENTS.map((c) => ({ ...c }))
  );
  const [components, setComponents] = useState<SalaryComponent[]>(() =>
    DEFAULT_SALARY_COMPONENTS.map((c) => ({ ...c }))
  );
  const [toast, setToast] = useState<string | null>(null);

  const update = (id: string, patch: Partial<SalaryComponent>) =>
    setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const remove = (id: string) =>
    setComponents((prev) => prev.filter((c) => c.id !== id || c.isMandatory));

  const add = () =>
    setComponents((prev) => [
      ...prev,
      { id: makeId(), name: "New component", percentage: 0 },
    ]);

  const total = useMemo(
    () => components.reduce((sum, c) => sum + (Number.isFinite(c.percentage) ? c.percentage : 0), 0),
    [components]
  );

  const dirty = useMemo(
    () => JSON.stringify(components) !== JSON.stringify(initial),
    [components, initial]
  );

  const isValid = Math.abs(total - 100) < 0.01;

  const handleSave = () => {
    setInitial(components.map((c) => ({ ...c })));
    setToast("Salary breakdown saved.");
  };
  const handleReset = () => {
    setComponents(initial.map((c) => ({ ...c })));
    setToast("Reverted to last saved.");
  };

  return (
    <div className="max-w-[820px] mx-auto space-y-5">
      {toast && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </div>
          <button onClick={() => setToast(null)} className="p-0.5 hover:opacity-70" aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Salary breakdown
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Define how an employee's gross salary splits into components. The total must add up to 100%.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!dirty}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!dirty || !isValid}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Components list */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] divide-y divide-slate-100">
        {components.map((c) => (
          <ComponentRow
            key={c.id}
            component={c}
            onUpdate={(patch) => update(c.id, patch)}
            onRemove={() => remove(c.id)}
          />
        ))}
        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-1.5 px-5 py-4 text-sm font-semibold text-blue-600 hover:bg-blue-50/60 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add component
        </button>
      </div>

      {/* Total bar */}
      <div
        className={cn(
          "rounded-2xl border bg-white px-5 py-4 flex items-center justify-between shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]",
          isValid ? "border-emerald-200" : "border-amber-200"
        )}
      >
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          )}
          <span className="text-sm font-semibold text-slate-900">
            Total
          </span>
          <span className="text-xs text-slate-500">
            {isValid ? "looks good" : `${total > 100 ? "over" : "under"} by ${Math.abs(100 - total).toFixed(1)}%`}
          </span>
        </div>
        <span
          className={cn(
            "text-lg font-bold tabular-nums",
            isValid ? "text-emerald-700" : "text-amber-700"
          )}
        >
          {total.toFixed(1)}%
        </span>
      </div>

      {/* Sample preview */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/70 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Preview</h3>
            <p className="text-xs text-slate-500 mt-0.5">How a sample salary would be broken down</p>
          </div>
          <span className="text-xs text-slate-500">
            Gross <span className="font-semibold text-slate-900 tabular-nums">{formatNaira(SAMPLE_GROSS)}</span>
          </span>
        </div>
        <ul className="divide-y divide-slate-100">
          {components.map((c) => {
            const amount = Math.round((c.percentage / 100) * SAMPLE_GROSS);
            return (
              <li key={c.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-slate-700">{c.name || "Unnamed"}</span>
                <span className="text-sm font-semibold text-slate-900 tabular-nums">
                  {formatNaira(amount)}
                  <span className="text-xs text-slate-400 ml-2 font-medium">{c.percentage.toFixed(1)}%</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ComponentRow({
  component,
  onUpdate,
  onRemove,
}: {
  component: SalaryComponent;
  onUpdate: (patch: Partial<SalaryComponent>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className="flex-1 min-w-0">
        <Input
          value={component.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Component name"
          className="bg-white border-slate-200 h-10 rounded-lg"
        />
        {component.isMandatory && (
          <p className="text-[11px] text-slate-400 mt-1">Mandatory · used for statutory calculations</p>
        )}
      </div>
      <div className="relative w-28 shrink-0">
        <Input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={Number.isFinite(component.percentage) ? component.percentage : 0}
          onChange={(e) => onUpdate({ percentage: parseFloat(e.target.value) || 0 })}
          aria-label={`${component.name} percentage`}
          className="bg-white border-slate-200 h-10 rounded-lg pr-7 tabular-nums text-right"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium pointer-events-none">
          %
        </span>
      </div>
      <button
        onClick={onRemove}
        disabled={component.isMandatory}
        className={cn(
          "w-9 h-9 rounded-md inline-flex items-center justify-center shrink-0 transition-colors",
          component.isMandatory
            ? "text-slate-200 cursor-not-allowed"
            : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
        )}
        aria-label={`Remove ${component.name}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
