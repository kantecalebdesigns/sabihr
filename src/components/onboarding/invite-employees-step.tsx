import { useState } from "react";
import { Plus, X, UserPlus, Mail, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { EMPLOYEE_ROLES } from "@/lib/mock-data";
import type { Department, EmployeeInvite, InviteEmployeesData } from "@/types/onboarding";
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

interface InviteEmployeesStepProps {
  data: InviteEmployeesData;
  departments: Department[];
  errors: ValidationErrors<InviteEmployeesData>;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof EmployeeInvite, value: string) => void;
  onBulkAdd: (emails: string) => void;
}

export function InviteEmployeesStep({
  data,
  departments,
  errors,
  onAdd,
  onRemove,
  onUpdate,
  onBulkAdd,
}: InviteEmployeesStepProps) {
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");

  function handleBulkConfirm() {
    if (bulkText.trim()) {
      onBulkAdd(bulkText);
      setBulkText("");
      setShowBulk(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Users className="w-[18px] h-[18px] text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Add your employees</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Start with HR staff first, then add the rest of your team. They'll receive an invitation
            to join your workspace.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {!showBulk && data.invites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 space-y-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Mail className="w-3 h-3 text-blue-600" />
            </div>
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-sm font-bold text-slate-900">Start with your HR staff</p>
            <p className="text-xs text-slate-500 max-w-[280px]">
              Add your HR administrator first, then invite the rest of your team.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={onAdd}
              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add employee
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBulk(true)}
              className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
            >
              <Mail className="w-4 h-4 mr-1" />
              Paste emails
            </Button>
          </div>
        </div>
      )}

      {/* Bulk add textarea */}
      {showBulk && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 space-y-3 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <Label className="text-sm font-semibold text-slate-900">Paste multiple emails</Label>
          </div>
          <textarea
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm min-h-[100px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
            placeholder={"john@company.com, jane@company.com\nor one email per line"}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBulk(false)}
              className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleBulkConfirm}
              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
            >
              Add all
            </Button>
          </div>
        </div>
      )}

      {/* Invite list */}
      {data.invites.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">Team members</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                {data.invites.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowBulk(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              Paste emails
            </button>
          </div>

          {data.invites.map((invite, index) => (
            <div
              key={invite.id}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] transition-colors hover:border-slate-300"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm mt-0.5",
                  avatarColor(invite.id)
                )}
              >
                {invite.email ? invite.email[0].toUpperCase() : index + 1}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={invite.email}
                  onChange={(e) => onUpdate(invite.id, "email", e.target.value)}
                  autoFocus={!invite.email && index === data.invites.length - 1}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Select
                    value={invite.department}
                    onValueChange={(v) => onUpdate(invite.id, "department", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Department (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                      {departments.length === 0 && (
                        <SelectItem value="_none" disabled>
                          No departments added
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Select
                    value={invite.role}
                    onValueChange={(v) => onUpdate(invite.id, "role", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={index === 0 ? "HR Staff" : "Role (optional)"} />
                    </SelectTrigger>
                    <SelectContent>
                      {index === 0 ? (
                        <SelectItem value="HR Staff">HR Staff</SelectItem>
                      ) : (
                        EMPLOYEE_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(invite.id)}
                className="mt-1 w-8 h-8 rounded-md flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all"
                aria-label="Remove invite"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {errors.invites && (
            <p className="text-xs text-rose-600">{errors.invites}</p>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={onAdd}
            className="w-full h-10 rounded-lg border-2 border-dashed border-slate-200 text-slate-700 font-semibold bg-white hover:bg-slate-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add another
          </Button>
        </div>
      )}
    </div>
  );
}
