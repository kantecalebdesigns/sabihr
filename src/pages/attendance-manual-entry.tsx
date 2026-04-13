import { useState } from "react";
import {
  ClipboardEdit,
  Upload,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Tab = "manual" | "bulk";

const SAMPLE_MANUAL_ENTRIES = [
  { id: 1, employee: "Adebayo Ogunlesi", date: "2026-04-07", clockIn: "08:45", clockOut: "17:10", status: "present", location: "Lagos Office" },
  { id: 2, employee: "Chiamaka Eze", date: "2026-04-07", clockIn: "09:15", clockOut: "17:30", status: "late", location: "Lagos Office" },
  { id: 3, employee: "Fatima Abdullahi", date: "2026-04-08", clockIn: "08:50", clockOut: "17:05", status: "present", location: "Abuja Office" },
];

const SAMPLE_CSV_PREVIEW = [
  { employee: "Emeka Okafor", date: "2026-04-07", clockIn: "08:30", clockOut: "17:00", status: "Valid" },
  { employee: "Aisha Mohammed", date: "2026-04-07", clockIn: "08:40", clockOut: "17:15", status: "Valid" },
  { employee: "Unknown Name", date: "2026-04-07", clockIn: "09:00", clockOut: "17:00", status: "Error: Employee not found" },
];

const STATUS_ENTRY_STYLES: Record<string, { bg: string; color: string }> = {
  present: { bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  late: { bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  absent: { bg: "bg-red-50 border-red-200", color: "text-red-700" },
  "half-day": { bg: "bg-violet-50 border-violet-200", color: "text-violet-700" },
};

export default function AttendanceManualEntryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("manual");
  const [form, setForm] = useState({
    employee: "",
    date: "",
    clockIn: "",
    clockOut: "",
    status: "present",
    location: "",
  });
  const [showCsvPreview, setShowCsvPreview] = useState(false);

  const tabs: { id: Tab; label: string; icon: typeof ClipboardEdit }[] = [
    { id: "manual", label: "Manual Entry", icon: ClipboardEdit },
    { id: "bulk", label: "Bulk Upload", icon: Upload },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Manual Attendance Entry</h1>
        <p className="text-sm text-slate-500">Add attendance records manually or via bulk CSV upload</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Manual Entry Tab */}
      {activeTab === "manual" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <h2 className="text-sm font-semibold">New Manual Entry</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Employee Name</label>
                <Input placeholder="Search employee..." value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Clock-In Time</label>
                <Input type="time" value={form.clockIn} onChange={(e) => setForm({ ...form, clockIn: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Clock-Out Time</label>
                <Input type="time" value={form.clockOut} onChange={(e) => setForm({ ...form, clockOut: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
                <Input placeholder="e.g. Lagos Office" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <Button>Submit Entry</Button>
          </div>

          {/* Recent Manual Entries */}
          <div className="rounded-xl border border-[#efefef] bg-white">
            <div className="px-5 py-4 border-b border-[#efefef]">
              <h2 className="text-sm font-semibold">Recent Manual Entries</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fafc] text-left">
                    <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Date</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Clock In</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Clock Out</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_MANUAL_ENTRIES.map((entry) => {
                    const style = STATUS_ENTRY_STYLES[entry.status];
                    return (
                      <tr key={entry.id} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                        <td className="px-4 py-3 font-medium">{entry.employee}</td>
                        <td className="px-4 py-3 text-slate-600">{entry.date}</td>
                        <td className="px-4 py-3 text-slate-600">{entry.clockIn}</td>
                        <td className="px-4 py-3 text-slate-600">{entry.clockOut}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize", style?.bg, style?.color)}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{entry.location}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Tab */}
      {activeTab === "bulk" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <h2 className="text-sm font-semibold">CSV Bulk Upload</h2>

            {/* Drag-drop area */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              onClick={() => setShowCsvPreview(true)}
            >
              <FileSpreadsheet className="size-10 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-700">Drop your CSV file here, or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">Supports .csv files up to 5MB</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="size-3.5" />
                Download CSV Template
              </Button>
              <span className="text-xs text-slate-400">Template includes required columns: employee_id, date, clock_in, clock_out</span>
            </div>
          </div>

          {/* Validation Preview */}
          {showCsvPreview && (
            <div className="rounded-xl border border-[#efefef] bg-white">
              <div className="px-5 py-4 border-b border-[#efefef] flex items-center justify-between">
                <h2 className="text-sm font-semibold">Validation Preview</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowCsvPreview(false)}>Cancel</Button>
                  <Button size="sm">Import Valid Rows</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f8fafc] text-left">
                      <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
                      <th className="px-4 py-3 font-medium text-slate-600">Date</th>
                      <th className="px-4 py-3 font-medium text-slate-600">Clock In</th>
                      <th className="px-4 py-3 font-medium text-slate-600">Clock Out</th>
                      <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_CSV_PREVIEW.map((row, i) => (
                      <tr key={i} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                        <td className="px-4 py-3 font-medium">{row.employee}</td>
                        <td className="px-4 py-3 text-slate-600">{row.date}</td>
                        <td className="px-4 py-3 text-slate-600">{row.clockIn}</td>
                        <td className="px-4 py-3 text-slate-600">{row.clockOut}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                              row.status === "Valid"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-red-50 border-red-200 text-red-700"
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
