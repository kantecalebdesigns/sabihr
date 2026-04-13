import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_SHIFT_ASSIGNMENTS, MOCK_SHIFTS } from "@/lib/attendance-extended-mock-data";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(weekOffset: number): string[] {
  const base = new Date("2026-04-06"); // Monday of base week
  base.setDate(base.getDate() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

export default function ShiftRosterPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  const employees = useMemo(() => {
    const map = new Map<string, { id: string; name: string; department: string }>();
    MOCK_SHIFT_ASSIGNMENTS.forEach(a => {
      if (!map.has(a.employeeId)) {
        map.set(a.employeeId, { id: a.employeeId, name: a.employeeName, department: a.department });
      }
    });
    return Array.from(map.values());
  }, []);

  const assignmentMap = useMemo(() => {
    const m = new Map<string, typeof MOCK_SHIFT_ASSIGNMENTS[0]>();
    MOCK_SHIFT_ASSIGNMENTS.forEach(a => {
      m.set(`${a.employeeId}-${a.date}`, a);
    });
    return m;
  }, []);

  const rangeLabel = `${formatDateShort(weekDates[0])} - ${formatDateShort(weekDates[6])}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Shift Roster</h1>
        <p className="text-sm text-slate-500">Weekly shift scheduling and assignment overview</p>
      </div>

      {/* Week Selector */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => setWeekOffset(o => o - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4 text-slate-500" />
          {rangeLabel}
        </div>
        <Button variant="outline" size="sm" onClick={() => setWeekOffset(o => o + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>Today</Button>
      </div>

      {/* Roster Grid */}
      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-[#f8fafc] text-left">
              <th className="px-4 py-3 font-medium text-slate-600 w-48 sticky left-0 bg-[#f8fafc] z-10">Employee</th>
              {weekDates.map((date, i) => (
                <th key={date} className="px-3 py-3 font-medium text-slate-600 text-center min-w-[100px]">
                  <div>{DAY_LABELS[i]}</div>
                  <div className="text-xs text-slate-400 font-normal">{formatDateShort(date)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                <td className="px-4 py-3 sticky left-0 bg-white z-10">
                  <div className="font-medium">{emp.name}</div>
                  <div className="text-xs text-slate-500">{emp.department}</div>
                </td>
                {weekDates.map(date => {
                  const assignment = assignmentMap.get(`${emp.id}-${date}`);
                  return (
                    <td key={date} className="px-3 py-3 text-center">
                      {assignment ? (
                        <div
                          className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-semibold text-white min-w-[40px]"
                          style={{ backgroundColor: assignment.color }}
                          title={`${assignment.shiftName} (${assignment.shiftCode})`}
                        >
                          {assignment.shiftCode}
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm text-slate-500">Legend:</span>
        {MOCK_SHIFTS.filter(s => s.status === "active").map(shift => (
          <div key={shift.id} className="flex items-center gap-1.5 text-sm">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: shift.color }} />
            <span>{shift.code} - {shift.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
