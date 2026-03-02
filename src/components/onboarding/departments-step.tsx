import { Plus, X, Building2, Briefcase, Code, DollarSign, Users, Megaphone, Scale, Monitor, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRESET_DEPARTMENTS } from "@/lib/mock-data";
import type { Department, DepartmentsData } from "@/types/onboarding";
import type { ValidationErrors } from "@/lib/validators";

const DEPT_ICONS: Record<string, { icon: typeof Building2; color: string; bg: string }> = {
  "Engineering": { icon: Code, color: "text-blue-600", bg: "bg-blue-50" },
  "Finance": { icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  "Human Resources": { icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
  "Marketing": { icon: Megaphone, color: "text-pink-600", bg: "bg-pink-50" },
  "Operations": { icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  "Sales": { icon: Briefcase, color: "text-orange-600", bg: "bg-orange-50" },
  "Legal": { icon: Scale, color: "text-slate-600", bg: "bg-slate-100" },
  "Information Technology": { icon: Monitor, color: "text-cyan-600", bg: "bg-cyan-50" },
};

function getDeptIcon(name: string) {
  return DEPT_ICONS[name] || { icon: Building2, color: "text-primary", bg: "bg-primary/10" };
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
    <div className="space-y-6">
      {/* Header with illustration */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Set Up Departments</h2>
          <p className="text-sm text-muted-foreground">
            Structure your organization by adding departments. Pick from suggestions or create your own.
          </p>
        </div>
      </div>

      {/* Preset suggestions */}
      <div className="rounded-xl bg-muted/40 border border-border/50 p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Add</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_DEPARTMENTS.map((name) => {
            const isAdded = addedNames.includes(name.toLowerCase());
            const { icon: Icon, color, bg } = getDeptIcon(name);
            return (
              <button
                key={name}
                type="button"
                disabled={isAdded}
                onClick={() => onAdd(name)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-150",
                  isAdded
                    ? "bg-primary/5 text-primary border-primary/20 cursor-default shadow-sm"
                    : "bg-card text-foreground border-border hover:border-primary/40 hover:shadow-sm"
                )}
              >
                <span className={cn("w-5 h-5 rounded-md flex items-center justify-center", isAdded ? "bg-primary/10" : bg)}>
                  <Icon className={cn("w-3 h-3", isAdded ? "text-primary" : color)} />
                </span>
                {name}
                {isAdded && <span className="text-primary ml-0.5">&#10003;</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Department list */}
      {data.departments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Your Departments</span>
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
              {data.departments.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {data.departments.map((dept, index) => {
            const { icon: Icon, color, bg } = getDeptIcon(dept.name);
            return (
              <div
                key={dept.id}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm"
              >
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", bg)}>
                  <Icon className={cn("w-4 h-4", color)} />
                </div>
                <div className="flex-1 space-y-2.5">
                  <Input
                    placeholder="Department name"
                    value={dept.name}
                    onChange={(e) => onUpdate(dept.id, "name", e.target.value)}
                    className="font-medium"
                    autoFocus={!dept.name && index === data.departments.length - 1}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Department head (optional)"
                      value={dept.head}
                      onChange={(e) => onUpdate(dept.id, "head", e.target.value)}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={dept.description}
                      onChange={(e) => onUpdate(dept.id, "description", e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(dept.id)}
                  className="mt-2 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
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
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Custom Department
      </Button>
    </div>
  );
}
