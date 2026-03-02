import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDER_OPTIONS, RELATIONSHIP_OPTIONS } from "@/lib/employee-mock-data";
import type { FamilyDependentsData } from "@/types/employee-onboarding";
import type { FamilyDependent, Gender, Relationship } from "@/types/employee";
import type { ValidationErrors } from "@/lib/validators";

interface Props {
  data: FamilyDependentsData;
  errors: ValidationErrors<FamilyDependentsData>;
  onChange: (updates: FamilyDependentsData) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function createEmptyDependent(): FamilyDependent {
  return { id: generateId(), name: "", relationship: "", dateOfBirth: "", gender: "" };
}

export function FamilyDependentsStep({ data, errors, onChange }: Props) {
  function addDependent() {
    onChange({ dependents: [...data.dependents, createEmptyDependent()] });
  }

  function removeDependent(id: string) {
    onChange({ dependents: data.dependents.filter((d) => d.id !== id) });
  }

  function updateDependent(id: string, updates: Partial<FamilyDependent>) {
    onChange({
      dependents: data.dependents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Family & Dependents</h3>
        <p className="text-sm text-muted-foreground">
          Add your family members and dependents. This section is optional — you can skip it and add later.
        </p>
      </div>

      {errors.dependents && (
        <div className="px-3 py-2.5 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {errors.dependents}
        </div>
      )}

      {data.dependents.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">No dependents added yet</p>
          <Button type="button" variant="outline" onClick={addDependent}>
            <Plus className="w-4 h-4 mr-2" />
            Add Dependent
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data.dependents.map((dep, index) => (
              <div
                key={dep.id}
                className="border border-border rounded-lg p-4 space-y-4 bg-card"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Dependent {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeDependent(dep.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input
                      placeholder="Full name"
                      value={dep.name}
                      onChange={(e) => updateDependent(dep.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Relationship</Label>
                    <Select
                      value={dep.relationship}
                      onValueChange={(v) => updateDependent(dep.id, { relationship: v as Relationship })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIP_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={dep.dateOfBirth}
                      onChange={(e) => updateDependent(dep.id, { dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Gender</Label>
                    <Select
                      value={dep.gender}
                      onValueChange={(v) => updateDependent(dep.id, { gender: v as Gender })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addDependent} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Dependent
          </Button>
        </>
      )}
    </div>
  );
}
