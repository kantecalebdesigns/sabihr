import { Plus, X, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRESET_DEPARTMENTS } from "@/lib/mock-data";
import type { Department, DepartmentsData } from "@/types/onboarding";
import type { ValidationErrors } from "@/lib/validators";

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
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center shrink-0">
          <Settings className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">Set Up Departments</h2>
          <p className="text-sm text-slate-500">
            Structure your organization by adding departments. Pick from suggestions or create your own.
          </p>
        </div>
      </div>

      {/* Quick Add */}
      <div className="rounded-xl bg-[#f8fafc]/40 border border-slate-200/50 p-4 flex flex-col gap-2">
        <p className="text-xs font-bold text-neutral-600 uppercase tracking-[0.6px]">Quick Add</p>
        <div className="flex flex-wrap gap-3">
          {PRESET_DEPARTMENTS.map((name) => {
            const isAdded = addedNames.includes(name.toLowerCase());
            return (
              <button
                key={name}
                type="button"
                disabled={isAdded}
                onClick={() => onAdd(name)}
                className={cn(
                  "px-2 py-2 text-xs font-medium rounded-lg border transition-all duration-150",
                  isAdded
                    ? "bg-blue-600 text-white border-blue-600 cursor-default"
                    : "bg-white text-slate-900 border-slate-200 hover:border-blue-400"
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
            <span className="text-sm font-medium text-slate-900">Your Departments</span>
            <span className="text-xs bg-blue-600/10 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
              {data.departments.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data.departments.map((dept, index) => (
              <div
                key={dept.id}
                className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300"
              >
                <div className="flex-1 flex flex-col gap-2.5">
                  <Input
                    placeholder="Department name"
                    value={dept.name}
                    onChange={(e) => onUpdate(dept.id, "name", e.target.value)}
                    className="font-medium h-9"
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
                  className="mt-2 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {errors.departments && (
        <p className="text-xs text-destructive">{errors.departments}</p>
      )}

      {/* Add custom */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAdd("")}
        className="w-full border-dashed border-slate-200 text-slate-900 h-8 rounded-md"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Custom Department
      </Button>
    </div>
  );
}
