import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

const LOCATIONS = ["Lagos Office", "Abuja Office", "Port Harcourt Office"];

export default function DepartmentCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [head, setHead] = useState("");
  const [headTitle, setHeadTitle] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Department name is required";
    if (!code.trim()) errs.code = "Department code is required";
    if (!location) errs.location = "Location is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsSubmitting(true);
    // Mock API call
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    navigate("/departments");
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/departments")}
          className="w-9 h-9 rounded-lg border border-[#efefef] bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-[#f8fafc] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Create Department
          </h1>
          <p className="text-sm text-slate-500">
            Add a new department to your organization
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-[#efefef] bg-white p-6 space-y-6">
        <div className="space-y-5">
          {/* Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="deptName">
                Department name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deptName"
                placeholder="e.g. Engineering"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                autoFocus
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deptCode">
                Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deptCode"
                placeholder="e.g. ENG"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setErrors((p) => ({ ...p, code: "" })); }}
                maxLength={5}
              />
              {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="deptDesc">Description</Label>
            <Input
              id="deptDesc"
              placeholder="Brief description of the department's responsibilities"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Head of Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="deptHead">Head of Department</Label>
              <Input
                id="deptHead"
                placeholder="e.g. John Doe"
                value={head}
                onChange={(e) => setHead(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deptHeadTitle">Title</Label>
              <Input
                id="deptHeadTitle"
                placeholder="e.g. VP of Engineering"
                value={headTitle}
                onChange={(e) => setHeadTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Location & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="deptLocation">
                Location <span className="text-red-500">*</span>
              </Label>
              <Select value={location} onValueChange={(v) => { setLocation(v); setErrors((p) => ({ ...p, location: "" })); }}>
                <SelectTrigger id="deptLocation" className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deptBudget">Annual Budget (NGN)</Label>
              <Input
                id="deptBudget"
                placeholder="e.g. 5000000"
                value={budget}
                onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#efefef]">
          <Button
            variant="outline"
            onClick={() => navigate("/departments")}
            className="border-[#efefef]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium"
          >
            {isSubmitting ? "Creating..." : "Create Department"}
          </Button>
        </div>
      </div>
    </div>
  );
}
