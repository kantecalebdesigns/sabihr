import { Plus, X, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRESET_DEPARTMENTS } from "@/lib/mock-data";
import type { Department, DepartmentsData } from "@/types/onboarding";
import type { ValidationErrors } from "@/lib/validators";

const AVATAR_PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

interface DepartmentsStepProps {
  data: DepartmentsData;
  errors: ValidationErrors<DepartmentsData>;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Department, value: string) => void;
}

export function DepartmentsStep({ data, errors, onAdd, onRemove, onUpdate }: DepartmentsStepProps) {
  const addedNames = data.departments.map((d) => d.name.trim().toLowerCase());

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Building2 className="w-[18px] h-[18px] text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Set up departments</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Structure your organization. Pick from suggestions or create your own.
          </p>
        </div>
      </div>

      {/* Quick add chips */}
      <div className="rounded-xl bg-slate-50 p-4 flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quick add</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_DEPARTMENTS.map((name) => {
            const isAdded = addedNames.includes(name.toLowerCase());
            return (
              <button
                key={name}
                type="button"
                disabled={isAdded}
                onClick={() => onAdd(name)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-colors",
                  isAdded
                    ? "bg-blue-600 text-white cursor-default"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Department list */}
      {data.departments.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">Your departments</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
              {data.departments.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data.departments.map((dept, index) => (
              <div
                key={dept.id}
                className="group flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] transition-colors hover:border-slate-300"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-semibold text-sm",
                    avatarColor(dept.id)
                  )}
                >
                  {(dept.name?.[0] ?? "?").toUpperCase()}
                </div>
                <div className="flex-1 flex flex-col gap-2.5">
                  <Input
                    placeholder="Department name"
                    value={dept.name}
                    onChange={(e) => onUpdate(dept.id, "name", e.target.value)}
                    className="font-semibold h-9"
                    autoFocus={!dept.name && index === data.departments.length - 1}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Department head (optional)"
                      value={dept.head}
                      onChange={(e) => onUpdate(dept.id, "head", e.target.value)}
                      className="h-9"
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={dept.description}
                      onChange={(e) => onUpdate(dept.id, "description", e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(dept.id)}
                  className="mt-1 w-8 h-8 rounded-md flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  aria-label="Remove department"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {errors.departments && (
        <p className="text-xs text-rose-600">{errors.departments}</p>
      )}

      {/* Add custom */}
      <Button
        type="button"
        variant="outline"
        onClick={() => onAdd("")}
        className="w-full h-10 rounded-lg border-2 border-dashed border-slate-200 text-slate-700 font-semibold bg-white hover:bg-slate-50"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add custom department
      </Button>
    </div>
  );
}
