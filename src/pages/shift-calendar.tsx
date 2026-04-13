import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_SHIFT_ASSIGNMENTS, MOCK_SHIFTS } from "@/lib/attendance-extended-mock-data";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonthWeeks(year: number, month: number): string[][] {
  const weeks: string[][] = [];
  const firstDay = new Date(year, month, 1);
  // Adjust to Monday start (0=Sun -> shift to 6)
  let dayOfWeek = firstDay.getDay();
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - dayOfWeek);

  for (let w = 0; w < 5; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);
      week.push(date.toISOString().split("T")[0]);
    }
    weeks.push(week);
  }
  return weeks;
}

export default function ShiftCalendarPage() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const baseDate = new Date(2026, 3, 1); // April 2026
  baseDate.setMonth(baseDate.getMonth() + monthOffset);
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const monthLabel = baseDate.toLocaleDateString("en-NG", { month: "long", year: "numeric" });

  const weeks = useMemo(() => getMonthWeeks(year, month), [year, month]);

  const departments = useMemo(() => {
    const set = new Set(MOCK_SHIFT_ASSIGNMENTS.map(a => a.department));
    return Array.from(set).sort();
  }, []);

  const filteredAssignments = useMemo(() => {
    if (departmentFilter === "all") return MOCK_SHIFT_ASSIGNMENTS;
    return MOCK_SHIFT_ASSIGNMENTS.filter(a => a.department === departmentFilter);
  }, [departmentFilter]);

  // Build a map: date -> { shiftId -> count }
  const dateShiftCounts = useMemo(() => {
    const m = new Map<string, Map<string, number>>();
    filteredAssignments.forEach(a => {
      if (!m.has(a.date)) m.set(a.date, new Map());
      const shiftMap = m.get(a.date)!;
      shiftMap.set(a.shiftId, (shiftMap.get(a.shiftId) || 0) + 1);
    });
    return m;
  }, [filteredAssignments]);

  const shiftMap = useMemo(() => {
    const m = new Map<string, typeof MOCK_SHIFTS[0]>();
    MOCK_SHIFTS.forEach(s => m.set(s.id, s));
    return m;
  }, []);

  const isCurrentMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getMonth() === month && d.getFullYear() === year;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Shift Calendar</h1>
          <p className="text-sm text-slate-500">Monthly overview of shift assignments across the organization</p>
        </div>
        <div>
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => setMonthOffset(o => o - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Calendar className="h-4 w-4 text-slate-500" />
          {monthLabel}
        </div>
        <Button variant="outline" size="sm" onClick={() => setMonthOffset(o => o + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-[#efefef] bg-white overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-[#f8fafc]">
          {DAY_LABELS.map(day => (
            <div key={day} className="px-3 py-2 text-center text-xs font-medium text-slate-600 border-b border-[#efefef]">
              {day}
            </div>
          ))}
        </div>
        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map(date => {
              const inMonth = isCurrentMonth(date);
              const shifts = dateShiftCounts.get(date);
              const dayNum = new Date(date).getDate();
              return (
                <div
                  key={date}
                  className={`min-h-[90px] p-2 border-b border-r border-[#efefef] ${!inMonth ? "bg-slate-50/50" : ""}`}
                >
                  <div className={`text-xs font-medium mb-1 ${inMonth ? "text-slate-700" : "text-slate-300"}`}>
                    {dayNum}
                  </div>
                  {shifts && (
                    <div className="space-y-0.5">
                      {Array.from(shifts.entries()).map(([shiftId, count]) => {
                        const shift = shiftMap.get(shiftId);
                        if (!shift) return null;
                        return (
                          <div key={shiftId} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: shift.color }} />
                            <span className="text-[10px] text-slate-600 truncate">{shift.code}: {count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm text-slate-500">Legend:</span>
        {MOCK_SHIFTS.filter(s => s.status === "active").map(shift => (
          <div key={shift.id} className="flex items-center gap-1.5 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: shift.color }} />
            <span>{shift.code} - {shift.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
