import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Layers } from "lucide-react";
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

export default function PayGroupCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [taxInclusive, setTaxInclusive] = useState<"yes" | "no">("yes");
  const [status, setStatus] = useState<"active" | "draft">("active");

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Group name is required";
    if (!minSalary) errs.minSalary = "Minimum salary is required";
    if (!maxSalary) errs.maxSalary = "Maximum salary is required";
    if (minSalary && maxSalary && Number(maxSalary) <= Number(minSalary)) {
      errs.maxSalary = "Max must be greater than min";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    navigate("/payroll/pay-grades");
  }

  return (
    <div className="max-w-[840px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/payroll/pay-grades")}
          className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">New pay group</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Define a salary band that grades and employees can be assigned to.
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200/70">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Layers className="w-[18px] h-[18px] text-blue-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 tracking-tight">Group details</p>
            <p className="text-xs text-slate-500 mt-0.5">Name, salary range, and tax treatment</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Name & description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pgName">
                Group name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="pgName"
                placeholder="e.g. Senior Management"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((p) => ({ ...p, name: "" }));
                }}
                autoFocus
              />
              {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pgDesc">Description</Label>
              <Input
                id="pgDesc"
                placeholder="Brief description of the band"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Salary range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pgMin">
                Min salary (annual) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="pgMin"
                inputMode="numeric"
                placeholder="e.g. 4000000"
                value={minSalary}
                onChange={(e) => {
                  setMinSalary(e.target.value.replace(/[^0-9]/g, ""));
                  setErrors((p) => ({ ...p, minSalary: "" }));
                }}
              />
              {errors.minSalary && <p className="text-xs text-rose-500">{errors.minSalary}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pgMax">
                Max salary (annual) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="pgMax"
                inputMode="numeric"
                placeholder="e.g. 8000000"
                value={maxSalary}
                onChange={(e) => {
                  setMaxSalary(e.target.value.replace(/[^0-9]/g, ""));
                  setErrors((p) => ({ ...p, maxSalary: "" }));
                }}
              />
              {errors.maxSalary && <p className="text-xs text-rose-500">{errors.maxSalary}</p>}
            </div>
          </div>

          {/* Tax & status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pgTax">Tax inclusive</Label>
              <Select value={taxInclusive} onValueChange={(v) => setTaxInclusive(v as "yes" | "no")}>
                <SelectTrigger id="pgTax" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes — gross of tax</SelectItem>
                  <SelectItem value="no">No — net of tax</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pgStatus">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "active" | "draft")}>
                <SelectTrigger id="pgStatus" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => navigate("/payroll/pay-grades")}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            {isSubmitting ? "Creating..." : "Create pay group"}
          </Button>
        </div>
      </div>
    </div>
  );
}
