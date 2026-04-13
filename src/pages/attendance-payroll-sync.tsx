import { useState } from "react";
import { RefreshCw, Calendar, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_PAYROLL_SYNC, SYNC_STATUS_STYLES, formatNaira } from "@/lib/attendance-extended-mock-data";
import type { PayrollSyncRecord } from "@/lib/attendance-extended-mock-data";

export default function AttendancePayrollSyncPage() {
  const [records, setRecords] = useState<PayrollSyncRecord[]>(MOCK_PAYROLL_SYNC);

  const syncedRecords = records.filter(r => r.status === "synced");
  const pendingRecords = records.filter(r => r.status === "pending");
  const lastSyncDate = syncedRecords.length > 0
    ? new Date(syncedRecords.sort((a, b) => b.syncDate.localeCompare(a.syncDate))[0].syncDate).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const totalOTPayments = records.reduce((s, r) => s + r.overtimePayments, 0);

  const summaryCards = [
    { label: "Last Sync Date", value: lastSyncDate, icon: Calendar, color: "text-slate-900" },
    { label: "Synced Periods", value: syncedRecords.length, icon: RefreshCw, color: "text-emerald-600" },
    { label: "Pending Sync", value: pendingRecords.length, icon: Clock, color: "text-amber-600" },
    { label: "Total OT Payments", value: formatNaira(totalOTPayments), icon: DollarSign, color: "text-blue-600" },
  ];

  const handleSync = (id: string) => {
    setRecords(prev => prev.map(r =>
      r.id === id ? { ...r, status: "synced" as const, syncDate: new Date().toISOString().split("T")[0] } : r
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Attendance-to-Payroll Sync</h1>
        <p className="text-sm text-slate-500">Synchronize attendance data with payroll for accurate compensation</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{card.label}</p>
              <card.icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className={cn("text-2xl font-bold mt-1", card.color)}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[1100px]">
          <thead>
            <tr className="bg-[#f8fafc] text-left">
              <th className="px-4 py-3 font-medium text-slate-600">Period</th>
              <th className="px-4 py-3 font-medium text-slate-600">Sync Date</th>
              <th className="px-4 py-3 font-medium text-slate-600">Employees</th>
              <th className="px-4 py-3 font-medium text-slate-600">Regular Hrs</th>
              <th className="px-4 py-3 font-medium text-slate-600">OT Hrs</th>
              <th className="px-4 py-3 font-medium text-slate-600">Absence Ded.</th>
              <th className="px-4 py-3 font-medium text-slate-600">Late Ded.</th>
              <th className="px-4 py-3 font-medium text-slate-600">Shift Allow.</th>
              <th className="px-4 py-3 font-medium text-slate-600">OT Payments</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 font-medium text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => {
              const style = SYNC_STATUS_STYLES[rec.status];
              return (
                <tr key={rec.id} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                  <td className="px-4 py-3 font-medium">{rec.period}</td>
                  <td className="px-4 py-3">{rec.syncDate || "-"}</td>
                  <td className="px-4 py-3">{rec.totalEmployees}</td>
                  <td className="px-4 py-3">{rec.regularHours.toLocaleString()}</td>
                  <td className="px-4 py-3">{rec.overtimeHours}</td>
                  <td className="px-4 py-3">{formatNaira(rec.absenceDeductions)}</td>
                  <td className="px-4 py-3">{formatNaira(rec.lateDeductions)}</td>
                  <td className="px-4 py-3">{formatNaira(rec.shiftAllowances)}</td>
                  <td className="px-4 py-3">{formatNaira(rec.overtimePayments)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                      {style.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {rec.status === "pending" ? (
                      <Button size="sm" className="h-7 text-xs gap-1" onClick={() => handleSync(rec.id)}>
                        <RefreshCw className="h-3 w-3" /> Sync Now
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
