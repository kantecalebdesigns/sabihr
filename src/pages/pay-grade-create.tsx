import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Banknote } from "lucide-react";
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

const PAY_GROUPS = [
  { id: "pg-1", name: "Executive" },
  { id: "pg-2", name: "Senior Management" },
  { id: "pg-3", name: "Mid-Level" },
  { id: "pg-4", name: "Junior" },
  { id: "pg-5", name: "Intern" },
];

export default function PayGradeCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [level, setLevel] = useState("");
  const [name, setName] = useState("");
  const [payGroup, setPayGroup] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [housing, setHousing] = useState("");
  const [transport, setTransport] = useState("");

  const totalPackage = useMemo(() => {
    const b = Number(basicSalary) || 0;
    const h = Number(housing) || 0;
    const t = Number(transport) || 0;
    return b + (b * h) / 100 + (b * t) / 100;
  }, [basicSalary, housing, transport]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!level) errs.level = "Level is required";
    if (!name.trim()) errs.name = "Grade name is required";
    if (!payGroup) errs.payGroup = "Pay group is required";
    if (!basicSalary) errs.basicSalary = "Basic salary is required";
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">New pay grade</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Create a grade level inside a pay group with a basic salary and allowance breakdown.
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200/70">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Banknote className="w-[18px] h-[18px] text-blue-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 tracking-tight">Grade details</p>
            <p className="text-xs text-slate-500 mt-0.5">Level, group, and compensation breakdown</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Level / name / group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="grLevel">
                Level <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="grLevel"
                inputMode="numeric"
                placeholder="e.g. 5"
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value.replace(/[^0-9]/g, ""));
                  setErrors((p) => ({ ...p, level: "" }));
                }}
              />
              {errors.level && <p className="text-xs text-rose-500">{errors.level}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grName">
                Grade name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="grName"
                placeholder="e.g. Senior Manager"
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
              <Label htmlFor="grGroup">
                Pay group <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={payGroup}
                onValueChange={(v) => {
                  setPayGroup(v);
                  setErrors((p) => ({ ...p, payGroup: "" }));
                }}
              >
                <SelectTrigger id="grGroup" className="w-full">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {PAY_GROUPS.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payGroup && <p className="text-xs text-rose-500">{errors.payGroup}</p>}
            </div>
          </div>

          {/* Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="grBasic">
                Basic salary (annual) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="grBasic"
                inputMode="numeric"
                placeholder="e.g. 6500000"
                value={basicSalary}
                onChange={(e) => {
                  setBasicSalary(e.target.value.replace(/[^0-9]/g, ""));
                  setErrors((p) => ({ ...p, basicSalary: "" }));
                }}
              />
              {errors.basicSalary && <p className="text-xs text-rose-500">{errors.basicSalary}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grHousing">Housing allowance (%)</Label>
              <Input
                id="grHousing"
                inputMode="decimal"
                placeholder="e.g. 35"
                value={housing}
                onChange={(e) => setHousing(e.target.value.replace(/[^0-9.]/g, ""))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grTransport">Transport allowance (%)</Label>
              <Input
                id="grTransport"
                inputMode="decimal"
                placeholder="e.g. 10"
                value={transport}
                onChange={(e) => setTransport(e.target.value.replace(/[^0-9.]/g, ""))}
              />
            </div>
          </div>

          {/* Live total */}
          <div className="rounded-xl bg-slate-50 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total annual package</p>
              <p className="text-xs text-slate-400 mt-0.5">Basic + housing % + transport %</p>
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              ₦{totalPackage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
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
            {isSubmitting ? "Creating..." : "Create pay grade"}
          </Button>
        </div>
      </div>
    </div>
  );
}
