import { useState } from "react";
import { MapPin, Building2, Pencil, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { WORK_LOCATIONS, BRANCHES } from "@/lib/admin-employee-mock-data";
import type { EmploymentInfo } from "@/types/employee";
import type { WorkLocationFormData } from "@/types/admin-employee";

interface Props {
  employment: EmploymentInfo;
  onSave: (updates: Partial<EmploymentInfo>) => void;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export function WorkLocationSection({ employment, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<WorkLocationFormData>({
    workLocation: employment.workLocation,
    branch: employment.branch,
    effectiveDate: "",
  });

  const selectedLocation = WORK_LOCATIONS.find((l) => l.name === formData.workLocation);
  const availableBranches = selectedLocation
    ? BRANCHES.filter((b) => b.locationId === selectedLocation.id)
    : BRANCHES;

  function handleLocationChange(value: string) {
    const loc = WORK_LOCATIONS.find((l) => l.name === value);
    const locBranches = loc ? BRANCHES.filter((b) => b.locationId === loc.id) : [];
    setFormData((prev) => ({
      ...prev,
      workLocation: value,
      branch: locBranches.length === 1 ? locBranches[0].name : "",
    }));
  }

  function handleSave() {
    onSave({
      workLocation: formData.workLocation,
      branch: formData.branch,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setFormData({
      workLocation: employment.workLocation,
      branch: employment.branch,
      effectiveDate: "",
    });
    setIsEditing(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Work Location & Branch</CardTitle>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow
              icon={<MapPin className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Work Location"
              value={employment.workLocation}
            />
            <InfoRow
              icon={<Building2 className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Branch"
              value={employment.branch}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Work Location <span className="text-destructive">*</span></Label>
                <Select value={formData.workLocation} onValueChange={handleLocationChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_LOCATIONS.map((loc) => (
                      <SelectItem key={loc.id} value={loc.name}>
                        {loc.name}
                        {loc.state && <span className="text-muted-foreground"> — {loc.state}</span>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Branch <span className="text-destructive">*</span></Label>
                <Select value={formData.branch} onValueChange={(v) => setFormData((prev) => ({ ...prev, branch: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBranches.map((br) => (
                      <SelectItem key={br.id} value={br.name}>
                        {br.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, effectiveDate: e.target.value }))}
                />
              </div>
            </div>
            {selectedLocation?.address && (
              <p className="text-xs text-muted-foreground">
                Address: {selectedLocation.address}
              </p>
            )}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Button size="sm" onClick={handleSave}>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-3.5 h-3.5 mr-1.5" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
