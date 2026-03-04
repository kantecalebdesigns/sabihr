import { Plus, X, Clock, CalendarDays, Palmtree } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DAYS_OF_WEEK } from "@/lib/mock-data";
import type { DayOfWeek, LeaveType, WorkScheduleData } from "@/types/onboarding";
import type { ValidationErrors } from "@/lib/validators";

interface WorkScheduleStepProps {
  data: WorkScheduleData;
  errors: ValidationErrors<WorkScheduleData>;
  onToggleDay: (day: DayOfWeek) => void;
  onChangeField: (field: "startTime" | "endTime", value: string) => void;
  onAddLeaveType: () => void;
  onRemoveLeaveType: (id: string) => void;
  onUpdateLeaveType: (id: string, field: keyof LeaveType, value: string | number) => void;
}

export function WorkScheduleStep({
  data,
  errors,
  onToggleDay,
  onChangeField,
  onAddLeaveType,
  onRemoveLeaveType,
  onUpdateLeaveType,
}: WorkScheduleStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Work Schedule & Leave Policy</h2>
          <p className="text-sm text-muted-foreground">
            Define when your team works and how much time off they get.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Work Schedule Section */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold">Work Schedule</span>
        </div>

        {/* Work days */}
        <div className="space-y-2.5">
          <Label className="text-xs text-muted-foreground">Work days</Label>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS_OF_WEEK.map((day) => {
              const isChecked = data.workDays.includes(day.value);
              return (
                <label
                  key={day.value}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 rounded-lg border cursor-pointer transition-all duration-150",
                    isChecked
                      ? "border-primary bg-background shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onToggleDay(day.value)}
                    className="sr-only"
                  />
                  <span className={cn(
                    "text-[11px] font-medium",
                    isChecked ? "text-primary" : "text-muted-foreground"
                  )}>
                    {day.value}
                  </span>
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    isChecked ? "bg-primary" : "bg-border"
                  )} />
                </label>
              );
            })}
          </div>
          {errors.workDays && (
            <p className="text-xs text-destructive">{errors.workDays}</p>
          )}
        </div>

        {/* Work hours */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="startTime" className="text-xs text-muted-foreground">Start time</Label>
            <Input
              id="startTime"
              type="time"
              value={data.startTime}
              onChange={(e) => onChangeField("startTime", e.target.value)}
            />
            {errors.startTime && (
              <p className="text-xs text-destructive">{errors.startTime}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="endTime" className="text-xs text-muted-foreground">End time</Label>
            <Input
              id="endTime"
              type="time"
              value={data.endTime}
              onChange={(e) => onChangeField("endTime", e.target.value)}
            />
            {errors.endTime && (
              <p className="text-xs text-destructive">{errors.endTime}</p>
            )}
          </div>
        </div>
      </div>

      {/* Leave Types Section */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold">Leave Types</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">
              {data.leaveTypes.length}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
          Set how many days employees get for each type of leave per year.
        </p>

        <div className="space-y-2">
          {data.leaveTypes.map((lt) => (
            <div
              key={lt.id}
              className="group flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/50"
            >
              <Input
                className="flex-1 bg-transparent border-0 shadow-none px-0 focus-visible:ring-0 text-sm"
                placeholder="Leave type name"
                value={lt.name}
                onChange={(e) => onUpdateLeaveType(lt.id, "name", e.target.value)}
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <Input
                  type="number"
                  className="w-16 text-center text-sm h-8"
                  min={0}
                  value={lt.annualAllowance}
                  onChange={(e) => onUpdateLeaveType(lt.id, "annualAllowance", parseInt(e.target.value) || 0)}
                />
                <span className="text-[11px] text-muted-foreground w-8">days</span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveLeaveType(lt.id)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {errors.leaveTypes && (
          <p className="text-xs text-destructive">{errors.leaveTypes}</p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddLeaveType}
          className="border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Leave Type
        </Button>
      </div>
      </div>
    </div>
  );
}
