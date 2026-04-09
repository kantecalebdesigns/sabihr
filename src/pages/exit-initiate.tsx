import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXIT_TYPE_STYLES } from "@/lib/exit-mock-data";
import type { ExitType } from "@/lib/exit-mock-data";

export default function ExitInitiatePage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [employee, setEmployee] = useState("");
  const [exitType, setExitType] = useState<ExitType | "">("");
  const [reason, setReason] = useState("");
  const [lastDay, setLastDay] = useState("");

  const canSubmit = employee.trim() && exitType && reason.trim() && lastDay;

  if (submitted) {
    return (
      <div className="max-w-[600px] mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <Check className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold">Exit Process Initiated</h2>
        <p className="text-sm text-slate-500">
          The exit process has been started. The employee and relevant departments will be notified.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate("/exit")}>
          Back to Exit Management
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto space-y-6">
      {/* Back */}
      <button onClick={() => navigate("/exit")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Exit Management
      </button>

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Initiate Exit</h1>
        <p className="text-sm text-slate-500">Start the offboarding process for an employee</p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-[#efefef] bg-white p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Employee</label>
          <Input placeholder="Search employee name..." value={employee} onChange={(e) => setEmployee(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Exit Type</label>
          <Select value={exitType} onValueChange={(v) => setExitType(v as ExitType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select exit type" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(EXIT_TYPE_STYLES) as [ExitType, { label: string }][]).map(([key, style]) => (
                <SelectItem key={key} value={key}>{style.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide the reason for this exit..."
            className="w-full rounded-lg border border-[#efefef] bg-background p-3 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Requested Last Working Day</label>
          <Input type="date" value={lastDay} onChange={(e) => setLastDay(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Additional Notes (optional)</label>
          <Input placeholder="Any additional notes..." />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button onClick={() => setSubmitted(true)} disabled={!canSubmit}>
            <LogOut className="w-4 h-4 mr-2" />
            Initiate Exit
          </Button>
          <Button variant="outline" onClick={() => navigate("/exit")}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
