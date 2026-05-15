import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, RotateCcw, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MOCK_STATUTORY_CONFIGS } from "@/lib/statutory-remittance-data";
import type { StatutoryBodyConfig } from "@/lib/statutory-remittance-data";

function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-label={ariaLabel}
      aria-pressed={checked}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 shrink-0",
        checked ? "bg-blue-600" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        )}
      />
    </button>
  );
}

export default function StatutoryRemittancePage() {
  const [initial, setInitial] = useState<StatutoryBodyConfig[]>(() =>
    MOCK_STATUTORY_CONFIGS.map((c) => ({ ...c }))
  );
  const [configs, setConfigs] = useState<StatutoryBodyConfig[]>(() =>
    MOCK_STATUTORY_CONFIGS.map((c) => ({ ...c }))
  );
  const [toast, setToast] = useState<string | null>(null);

  const update = (id: string, patch: Partial<StatutoryBodyConfig>) => {
    setConfigs((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const dirty = useMemo(
    () => JSON.stringify(configs) !== JSON.stringify(initial),
    [configs, initial]
  );

  const handleSave = () => {
    setInitial(configs.map((c) => ({ ...c })));
    setToast("Saved.");
  };
  const handleReset = () => {
    setConfigs(initial.map((c) => ({ ...c })));
    setToast("Reverted to last saved.");
  };

  const enabledCount = configs.filter((c) => c.enabled).length;

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
            Statutory deductions
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Turn on what your payroll remits and set the rate. {enabledCount} of {configs.length} active.
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
            disabled={!dirty}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Body list */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] divide-y divide-slate-100">
        {configs.map((c) => (
          <BodyRow key={c.id} config={c} onUpdate={(patch) => update(c.id, patch)} />
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Change salary base, caps, frequency, or PAYE bands in{" "}
        <Link to="/payroll/compliance" className="text-blue-600 hover:text-blue-700 font-semibold">
          advanced settings
        </Link>
        .
      </p>
    </div>
  );
}

function BodyRow({
  config,
  onUpdate,
}: {
  config: StatutoryBodyConfig;
  onUpdate: (patch: Partial<StatutoryBodyConfig>) => void;
}) {
  const disabled = !config.enabled;
  const total = config.employerPortion + config.employeePortion;

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 transition-opacity", disabled && "opacity-50")}>
      <Toggle
        checked={config.enabled}
        onChange={(next) => onUpdate({ enabled: next })}
        ariaLabel={`${config.enabled ? "Disable" : "Enable"} ${config.name}`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-slate-900 leading-tight">{config.name}</p>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-mono font-medium">
            {config.code}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-tight mt-0.5">{config.authority}</p>
      </div>
      <div className="shrink-0 sm:min-w-[280px] flex justify-end">
        {config.isTiered ? (
          <Link
            to={config.tieredConfigPath ?? "/payroll/compliance"}
            className="inline-flex items-center gap-0.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Configure tax bands
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <RateField
              label="Employer"
              value={config.employerPortion}
              onChange={(v) => onUpdate({ employerPortion: v })}
              disabled={disabled}
            />
            <span className="text-slate-300 font-medium">+</span>
            <RateField
              label="Employee"
              value={config.employeePortion}
              onChange={(v) => onUpdate({ employeePortion: v })}
              disabled={disabled}
            />
            <span className="text-xs text-slate-400 tabular-nums w-14 text-right">
              = {total.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function RateField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="relative w-20">
        <Input
          type="number"
          min={0}
          max={100}
          step={0.1}
          aria-label={`${label} percentage`}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          disabled={disabled}
          className="bg-white border-slate-200 h-9 rounded-lg pr-6 text-sm tabular-nums text-right disabled:cursor-not-allowed"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
          %
        </span>
      </div>
    </div>
  );
}
