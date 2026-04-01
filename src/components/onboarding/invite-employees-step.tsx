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
import { EMPLOYEE_ROLES } from "@/lib/mock-data";
import type { Department, EmployeeInvite, InviteEmployeesData } from "@/types/onboarding";
import type { ValidationErrors } from "@/lib/validators";

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
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">Add Your Employees</h2>
          <p className="text-sm text-slate-500">
            Start by adding your HR staff first, then add the rest of your team. They'll receive an invitation to join your workspace.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {!showBulk && data.invites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 space-y-5 rounded-xl border-2 border-dashed border-slate-200 bg-[#f8fafc]/40">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[#f8fafc] flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-slate-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="w-3 h-3 text-blue-600" />
            </div>
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-sm font-semibold text-slate-900">Start with your HR staff</p>
            <p className="text-xs text-slate-500 max-w-[280px]">
              Add your HR administrator first, then invite the rest of your team.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowBulk(true)} className="border-slate-200 h-9 text-sm">
              <Mail className="w-4 h-4 mr-2" />
              Paste Emails
            </Button>
          </div>
        </div>
      )}

      {/* Bulk add textarea */}
      {showBulk && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <Label className="text-sm font-medium text-slate-900">Paste multiple emails</Label>
          </div>
          <textarea
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm min-h-[100px] focus:outline-none focus:border-ring focus:ring-0 placeholder:text-muted-foreground"
            placeholder={"john@company.com, jane@company.com\nor one email per line"}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleBulkConfirm}>
              Add All
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowBulk(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Invite list */}
      {data.invites.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-900">Team Members</span>
              <span className="text-xs bg-blue-600/10 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                {data.invites.length}
              </span>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowBulk(true)}>
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Paste Emails
            </Button>
          </div>

          {data.invites.map((invite, index) => (
            <div
              key={invite.id}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300"
            >
              <div className="w-9 h-9 rounded-full bg-[#f8fafc] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-slate-500">
                  {invite.email ? invite.email[0].toUpperCase() : (index + 1)}
                </span>
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
                className="mt-2 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {errors.invites && (
            <p className="text-xs text-destructive">{errors.invites}</p>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="w-full border-dashed border-slate-200 text-slate-900"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another
          </Button>
        </div>
      )}
    </div>
  );
}
