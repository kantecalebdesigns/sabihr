import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Clock,
  Users,
  Edit2,
  Trash2,
  Copy,
  MoreHorizontal,
  CheckCircle2,
  ArrowLeft,
  Coffee,
  Sun,
  Moon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_SCHEDULES,
  MOCK_SCHEDULE_ASSIGNMENTS,
  SCHEDULE_STATUS_STYLES,
  DAYS_OF_WEEK,
  DAY_LABELS,
  type WorkSchedule,
  type DayOfWeek,
} from "@/lib/work-schedule-mock-data";

type View = "list" | "create" | "edit";

export default function WorkSchedulesPage() {
  const [view, setView] = useState<View>("list");
  const [editingSchedule, setEditingSchedule] = useState<WorkSchedule | null>(null);
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);

  const handleCreate = (schedule: WorkSchedule) => {
    setSchedules((prev) => [...prev, schedule]);
    setView("list");
  };

  const handleUpdate = (updated: WorkSchedule) => {
    setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setView("list");
    setEditingSchedule(null);
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDuplicate = (schedule: WorkSchedule) => {
    const dup: WorkSchedule = {
      ...schedule,
      id: `ws-${Date.now()}`,
      name: `${schedule.name} (Copy)`,
      isDefault: false,
      assignedEmployees: 0,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setSchedules((prev) => [...prev, dup]);
  };

  if (view === "create") {
    return (
      <ScheduleForm
        onBack={() => setView("list")}
        onSave={handleCreate}
      />
    );
  }

  if (view === "edit" && editingSchedule) {
    return (
      <ScheduleForm
        schedule={editingSchedule}
        onBack={() => { setView("list"); setEditingSchedule(null); }}
        onSave={handleUpdate}
      />
    );
  }

  return (
    <ScheduleList
      schedules={schedules}
      onCreateNew={() => setView("create")}
      onEdit={(s) => { setEditingSchedule(s); setView("edit"); }}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
    />
  );
}

/* ───────────────────────── List View ───────────────────────── */

function ScheduleList({
  schedules,
  onCreateNew,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  schedules: WorkSchedule[];
  onCreateNew: () => void;
  onEdit: (s: WorkSchedule) => void;
  onDelete: (id: string) => void;
  onDuplicate: (s: WorkSchedule) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return schedules.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || (s.department ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [schedules, search, statusFilter]);

  const totalEmployees = schedules.reduce((sum, s) => sum + s.assignedEmployees, 0);
  const activeCount = schedules.filter((s) => s.status === "active").length;
  const draftCount = schedules.filter((s) => s.status === "draft").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Work Schedules</h1>
          <p className="text-sm text-slate-500">Create and manage work schedules for your employees</p>
        </div>
        <Button onClick={onCreateNew}><Plus className="w-4 h-4 mr-2" />Create Schedule</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Clock className="w-4 h-4" /><span className="text-xs font-medium">Total Schedules</span></div>
          <p className="text-xl font-semibold">{schedules.length}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-1"><CheckCircle2 className="w-4 h-4" /><span className="text-xs font-medium">Active</span></div>
          <p className="text-xl font-semibold">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-1"><AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">Drafts</span></div>
          <p className="text-xl font-semibold">{draftCount}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1"><Users className="w-4 h-4" /><span className="text-xs font-medium">Employees Assigned</span></div>
          <p className="text-xl font-semibold">{totalEmployees}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search schedules..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5">
          {["all", "active", "draft", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                statusFilter === s ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((schedule) => {
          const style = SCHEDULE_STATUS_STYLES[schedule.status];
          return (
            <div key={schedule.id} className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{schedule.name}</h3>
                    {schedule.isDefault && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-200">Default</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{schedule.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>{style.label}</span>
                  <div className="relative">
                    <button onClick={() => setOpenMenu(openMenu === schedule.id ? null : schedule.id)} className="p-1 rounded-md hover:bg-slate-50">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>
                    {openMenu === schedule.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-[#efefef] shadow-lg py-1 z-10 w-36">
                        <button onClick={() => { onEdit(schedule); setOpenMenu(null); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-slate-50">
                          <Edit2 className="w-3.5 h-3.5" />Edit
                        </button>
                        <button onClick={() => { onDuplicate(schedule); setOpenMenu(null); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-slate-50">
                          <Copy className="w-3.5 h-3.5" />Duplicate
                        </button>
                        {!schedule.isDefault && (
                          <button onClick={() => { onDelete(schedule.id); setOpenMenu(null); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Work days */}
              <div className="flex items-center gap-1.5">
                {DAYS_OF_WEEK.map((day) => (
                  <span
                    key={day}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium",
                      schedule.workDays.includes(day)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-slate-50 text-slate-300 border border-transparent"
                    )}
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Time info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {schedule.startTime} — {schedule.endTime}
                </div>
                {schedule.breakStart && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Coffee className="w-3.5 h-3.5 text-slate-400" />
                    Break: {schedule.breakStart} — {schedule.breakEnd}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Sun className="w-3.5 h-3.5 text-slate-400" />
                  {schedule.totalHoursPerDay}h/day
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#efefef]">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{schedule.assignedEmployees} employees</span>
                  {schedule.department && <span className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-600">{schedule.department}</span>}
                </div>
                <button onClick={() => onEdit(schedule)} className="text-xs font-medium text-blue-600 hover:text-blue-800">
                  Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No schedules found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Create / Edit Form ───────────────────────── */

function ScheduleForm({
  schedule,
  onBack,
  onSave,
}: {
  schedule?: WorkSchedule;
  onBack: () => void;
  onSave: (schedule: WorkSchedule) => void;
}) {
  const isEdit = !!schedule;

  const [name, setName] = useState(schedule?.name ?? "");
  const [description, setDescription] = useState(schedule?.description ?? "");
  const [workDays, setWorkDays] = useState<DayOfWeek[]>(schedule?.workDays ?? ["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [startTime, setStartTime] = useState(schedule?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(schedule?.endTime ?? "17:00");
  const [breakStart, setBreakStart] = useState(schedule?.breakStart ?? "12:00");
  const [breakEnd, setBreakEnd] = useState(schedule?.breakEnd ?? "13:00");
  const [department, setDepartment] = useState(schedule?.department ?? "");
  const [status, setStatus] = useState<"active" | "draft">(schedule?.status === "active" ? "active" : "draft");
  const [isDefault, setIsDefault] = useState(schedule?.isDefault ?? false);
  const [step, setStep] = useState(1);

  // Assignments (only for edit view)
  const assignments = schedule
    ? MOCK_SCHEDULE_ASSIGNMENTS.filter((a) => a.scheduleId === schedule.id)
    : [];

  // Employee assignment for new/edit
  const ASSIGNABLE_EMPLOYEES = [
    { id: "emp-1", name: "Adebayo Ogunlesi", department: "Engineering" },
    { id: "emp-2", name: "Chiamaka Eze", department: "Engineering" },
    { id: "emp-3", name: "Tunde Bakare", department: "Sales" },
    { id: "emp-4", name: "Fatima Abdullahi", department: "Marketing" },
    { id: "emp-5", name: "Emeka Nwosu", department: "Finance" },
    { id: "emp-6", name: "Aisha Mohammed", department: "Human Resources" },
    { id: "emp-7", name: "Kola Adeniyi", department: "Operations" },
    { id: "emp-8", name: "Ngozi Okafor", department: "IT" },
  ];
  const [assignSearch, setAssignSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const filteredAssignable = ASSIGNABLE_EMPLOYEES.filter((e) => {
    const q = assignSearch.toLowerCase();
    return !q || e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
  });

  const toggleEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleDay = (day: DayOfWeek) => {
    setWorkDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const computeHours = () => {
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    let total = (eh * 60 + em) - (sh * 60 + sm);
    if (breakStart && breakEnd) {
      const [bsh, bsm] = breakStart.split(":").map(Number);
      const [beh, bem] = breakEnd.split(":").map(Number);
      total -= (beh * 60 + bem) - (bsh * 60 + bsm);
    }
    return Math.max(0, +(total / 60).toFixed(1));
  };

  const handleSave = () => {
    const now = new Date().toISOString().split("T")[0];
    onSave({
      id: schedule?.id ?? `ws-${Date.now()}`,
      name,
      description,
      workDays,
      startTime,
      endTime,
      breakStart,
      breakEnd,
      totalHoursPerDay: computeHours(),
      isDefault,
      assignedEmployees: schedule?.assignedEmployees ?? 0,
      department: department || null,
      status,
      createdAt: schedule?.createdAt ?? now,
      updatedAt: now,
    });
  };

  const canSave = name.trim().length > 0 && workDays.length > 0 && startTime && endTime;

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{isEdit ? "Edit Schedule" : "Create Work Schedule"}</h1>
          <p className="text-sm text-slate-500">Step {step} of 3</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {[
          { num: 1, label: "Schedule Info" },
          { num: 2, label: "Work Hours" },
          { num: 3, label: "Review & Save" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setStep(s.num)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors",
                step >= s.num ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
              )}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </button>
            <span className={cn("text-xs font-medium hidden sm:inline", step >= s.num ? "text-slate-900" : "text-slate-400")}>
              {s.label}
            </span>
            {i < 2 && <div className={cn("flex-1 h-0.5 rounded-full", step > s.num ? "bg-blue-600" : "bg-slate-100")} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic info */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Schedule Name</label>
              <Input placeholder="e.g. Standard Office Hours" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[70px] resize-none"
                placeholder="Brief description of this schedule..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Department (optional)</label>
                <Input placeholder="All departments" value={department} onChange={(e) => setDepartment(e.target.value)} />
                <p className="text-xs text-slate-400">Leave empty for company-wide</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <div className="flex gap-2">
                  {(["draft", "active"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-all",
                        status === s
                          ? "border-blue-600 bg-blue-50 text-blue-600 ring-1 ring-blue-600"
                          : "border-[#efefef] bg-white text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded border-slate-300" />
              <span className="text-sm">Set as default schedule for new employees</span>
            </label>
          </div>

          <div className="flex justify-end">
            <Button disabled={!name.trim()} onClick={() => setStep(2)}>Continue</Button>
          </div>
        </div>
      )}

      {/* Step 2: Work hours */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-5">
            {/* Work days */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Work Days</label>
              <div className="flex gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "flex-1 rounded-lg border py-3 text-center text-sm font-medium transition-all",
                      workDays.includes(day)
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                        : "border-[#efefef] bg-white text-slate-400 hover:border-slate-300"
                    )}
                  >
                    <span className="text-xs block">{day}</span>
                    <span className="text-[10px] block mt-0.5 hidden sm:block">{DAY_LABELS[day]}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">{workDays.length} days selected &middot; {(workDays.length * computeHours()).toFixed(1)} hrs/week</p>
            </div>

            {/* Time inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />Start Time
                </label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />End Time
                </label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            {/* Break */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-orange-500" />Break Period (optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} placeholder="Start" />
                <Input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} placeholder="End" />
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-[#f8fafc] p-4">
              <p className="text-xs font-medium text-slate-500 mb-2">Daily Summary</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Work Hours</span>
                  <p className="font-semibold">{computeHours()}h</p>
                </div>
                <div>
                  <span className="text-slate-500">Work Days</span>
                  <p className="font-semibold">{workDays.length} days/week</p>
                </div>
                <div>
                  <span className="text-slate-500">Weekly Hours</span>
                  <p className="font-semibold">{(workDays.length * computeHours()).toFixed(1)}h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button disabled={workDays.length === 0} onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & save */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <h3 className="font-semibold">Review Schedule</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Name</span>
                <p className="font-medium">{name}</p>
              </div>
              <div>
                <span className="text-slate-500">Status</span>
                <p className="font-medium capitalize">{status}</p>
              </div>
              <div>
                <span className="text-slate-500">Department</span>
                <p className="font-medium">{department || "All departments"}</p>
              </div>
              <div>
                <span className="text-slate-500">Default</span>
                <p className="font-medium">{isDefault ? "Yes" : "No"}</p>
              </div>
            </div>

            {description && (
              <div className="text-sm">
                <span className="text-slate-500">Description</span>
                <p className="font-medium mt-0.5">{description}</p>
              </div>
            )}

            <div className="pt-3 border-t border-[#efefef]">
              <p className="text-xs font-medium text-slate-500 mb-2">Work Days</p>
              <div className="flex gap-1.5">
                {DAYS_OF_WEEK.map((day) => (
                  <span
                    key={day}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium",
                      workDays.includes(day)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-slate-50 text-slate-300"
                    )}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#efefef] text-sm">
              <div>
                <span className="text-slate-500">Start</span>
                <p className="font-medium">{startTime}</p>
              </div>
              <div>
                <span className="text-slate-500">End</span>
                <p className="font-medium">{endTime}</p>
              </div>
              {breakStart && (
                <div>
                  <span className="text-slate-500">Break</span>
                  <p className="font-medium">{breakStart} — {breakEnd}</p>
                </div>
              )}
              <div>
                <span className="text-slate-500">Daily Hours</span>
                <p className="font-medium">{computeHours()}h</p>
              </div>
            </div>
          </div>

          {/* Assigned employees (edit only) */}
          {isEdit && assignments.length > 0 && (
            <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-3">
              <h3 className="font-semibold text-sm">Assigned Employees ({assignments.length})</h3>
              <div className="divide-y divide-[#efefef]">
                {assignments.map((a) => (
                  <div key={a.employeeId} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium">{a.employeeName}</p>
                      <p className="text-xs text-slate-500">{a.department}</p>
                    </div>
                    <span className="text-xs text-slate-400">Since {a.effectiveDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assign Employees */}
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Assign Employees</h3>
              <span className="text-xs text-slate-500">{selectedEmployees.length} selected</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or department..."
                className="pl-9"
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
              />
            </div>
            <div className="max-h-[240px] overflow-y-auto divide-y divide-[#efefef]">
              {filteredAssignable.map((emp) => (
                <label key={emp.id} className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-slate-50 px-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => toggleEmployee(emp.id)}
                    className="rounded border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.department}</p>
                  </div>
                </label>
              ))}
              {filteredAssignable.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center">No employees found</p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <div className="flex gap-2">
              {!isEdit && (
                <Button variant="outline" onClick={() => { setStatus("draft"); handleSave(); }}>
                  Save as Draft
                </Button>
              )}
              <Button disabled={!canSave} onClick={handleSave}>
                {isEdit ? "Update Schedule" : "Create Schedule"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
