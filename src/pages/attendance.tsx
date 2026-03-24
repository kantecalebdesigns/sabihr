import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Clock,
  Users,
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  MOCK_ATTENDANCE_RECORDS,
  ATTENDANCE_STATUS_STYLES,
} from "@/lib/attendance-mock-data";
import type { AttendanceStatus } from "@/lib/attendance-mock-data";

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-03-24");

  const departments = useMemo(
    () => [...new Set(MOCK_ATTENDANCE_RECORDS.map((r) => r.department))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return MOCK_ATTENDANCE_RECORDS.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;
      const matchesDept =
        departmentFilter === "all" || r.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [search, statusFilter, departmentFilter]);

  const summary = useMemo(() => {
    const records = MOCK_ATTENDANCE_RECORDS;
    return {
      total: records.length,
      present: records.filter((r) => r.status === "present").length,
      late: records.filter((r) => r.status === "late").length,
      absent: records.filter((r) => r.status === "absent").length,
      onLeave: records.filter((r) => r.status === "on-leave").length,
      halfDay: records.filter((r) => r.status === "half-day").length,
    };
  }, []);

  const attendanceRate = Math.round(
    ((summary.present + summary.late + summary.halfDay) / summary.total) * 100
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Attendance Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Track and manage daily employee attendance
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Total</span>
          </div>
          <p className="text-2xl font-semibold">{summary.total}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Present</span>
          </div>
          <p className="text-2xl font-semibold text-emerald-700">
            {summary.present}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">Late</span>
          </div>
          <p className="text-2xl font-semibold text-amber-700">
            {summary.late}
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
          <div className="flex items-center gap-2 text-red-700 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Absent</span>
          </div>
          <p className="text-2xl font-semibold text-red-700">
            {summary.absent}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <CalendarDays className="w-4 h-4" />
            <span className="text-xs font-medium">On Leave</span>
          </div>
          <p className="text-2xl font-semibold text-blue-700">
            {summary.onLeave}
          </p>
        </div>
      </div>

      {/* Attendance Rate Bar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Today's Attendance Rate</span>
          <span className="text-sm font-semibold">{attendanceRate}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all"
            style={{
              width: `${(summary.present / summary.total) * 100}%`,
            }}
          />
          <div
            className="bg-amber-400 transition-all"
            style={{ width: `${(summary.late / summary.total) * 100}%` }}
          />
          <div
            className="bg-violet-400 transition-all"
            style={{
              width: `${(summary.halfDay / summary.total) * 100}%`,
            }}
          />
          <div
            className="bg-blue-400 transition-all"
            style={{
              width: `${(summary.onLeave / summary.total) * 100}%`,
            }}
          />
          <div
            className="bg-red-400 transition-all"
            style={{
              width: `${(summary.absent / summary.total) * 100}%`,
            }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Late
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" /> Half Day
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> On Leave
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" /> Absent
          </span>
        </div>
      </div>

      {/* Date Selector + Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <button className="p-1 rounded hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto border-0 shadow-none text-sm font-medium px-2"
            />
            <button className="p-1 rounded hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(ATTENDANCE_STATUS_STYLES).map(
                  ([key, style]) => (
                    <SelectItem key={key} value={key}>
                      {style.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Department
            </label>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">
                Employee
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Department
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Clock In
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Clock Out
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Hours
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => {
              const statusStyle =
                ATTENDANCE_STATUS_STYLES[record.status as AttendanceStatus];
              return (
                <tr
                  key={record.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                        {record.employeeName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium">{record.employeeName}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {record.department}
                  </td>
                  <td className="p-3 font-mono text-xs">
                    {record.clockIn ?? (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-xs">
                    {record.clockOut ?? (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </td>
                  <td className="p-3">
                    {record.hoursWorked != null ? (
                      <span className="font-medium">
                        {record.hoursWorked.toFixed(1)}h
                      </span>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        statusStyle?.bg,
                        statusStyle?.color
                      )}
                    >
                      {statusStyle?.label}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {record.location}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-12 text-center text-muted-foreground"
                >
                  <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No attendance records found</p>
                  <p className="text-xs mt-1">
                    Try adjusting your search or filters
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
