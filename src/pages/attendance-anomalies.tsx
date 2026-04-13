import { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_ANOMALIES,
  ANOMALY_TYPE_LABELS,
  ANOMALY_SEVERITY_STYLES,
} from "@/lib/attendance-extended-mock-data";
import type { AttendanceAnomaly } from "@/lib/attendance-extended-mock-data";

export default function AttendanceAnomalies() {
  const [anomalies, setAnomalies] = useState<AttendanceAnomaly[]>(MOCK_ANOMALIES);
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const anomalyTypes = useMemo(
    () => [...new Set(MOCK_ANOMALIES.map((a) => a.type))],
    []
  );

  const filtered = useMemo(() => {
    return anomalies.filter((a) => {
      const matchesType = typeFilter === "all" || a.type === typeFilter;
      const matchesSeverity = severityFilter === "all" || a.severity === severityFilter;
      return matchesType && matchesSeverity;
    });
  }, [anomalies, typeFilter, severityFilter]);

  const totalAnomalies = anomalies.length;
  const unresolvedCount = anomalies.filter((a) => !a.resolved).length;
  const highSeverityCount = anomalies.filter((a) => a.severity === "high").length;
  const resolvedCount = anomalies.filter((a) => a.resolved).length;

  function handleResolve(id: string) {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  }

  const summaryCards = [
    { label: "Total Anomalies", value: totalAnomalies, icon: AlertTriangle, color: "text-slate-600", bg: "bg-slate-50" },
    { label: "Unresolved", value: unresolvedCount, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "High Severity", value: highSeverityCount, icon: Shield, color: "text-red-600", bg: "bg-red-50" },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Attendance Exceptions & Anomalies</h1>
        <p className="text-sm text-slate-500">Review and resolve attendance irregularities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", card.bg)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{card.label}</p>
                <p className="text-lg font-semibold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="all">All Types</option>
          {anomalyTypes.map((t) => (
            <option key={t} value={t}>{ANOMALY_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="all">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#efefef] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc] text-left">
                <th className="px-4 py-3 font-medium text-slate-600">Employee</th>
                <th className="px-4 py-3 font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 font-medium text-slate-600">Description</th>
                <th className="px-4 py-3 font-medium text-slate-600">Severity</th>
                <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const sevStyle = ANOMALY_SEVERITY_STYLES[a.severity];
                return (
                  <tr key={a.id} className="border-b border-[#efefef] hover:bg-[#f8fafc]">
                    <td className="px-4 py-3 font-medium">{a.employeeName}</td>
                    <td className="px-4 py-3 text-slate-600">{a.department}</td>
                    <td className="px-4 py-3 text-slate-600">{a.date}</td>
                    <td className="px-4 py-3 text-slate-600">{ANOMALY_TYPE_LABELS[a.type]}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[240px] truncate">{a.description}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", sevStyle.bg, sevStyle.color)}>
                        {sevStyle.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a.resolved ? (
                        <span className="inline-flex items-center rounded-full border bg-emerald-50 border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border bg-amber-50 border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Unresolved
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!a.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(a.id)}
                          className="h-7 text-xs"
                        >
                          Resolve
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No anomalies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
