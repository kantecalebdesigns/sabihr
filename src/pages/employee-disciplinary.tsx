import { ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_CASES,
  CASE_STATUS_STYLES,
  SEVERITY_STYLES,
  type DisciplinaryCase,
  type Severity,
  type CaseStatus,
} from "@/lib/disciplinary-mock-data";

const EMPLOYEE_ID = "emp-001";

const inlineCases: DisciplinaryCase[] = [
  {
    id: "dc-emp1-1",
    employeeId: "emp-001",
    employeeName: "Adebayo Ogunlesi",
    department: "Engineering",
    offence: "Late Attendance",
    severity: "minor" as Severity,
    status: "closed" as CaseStatus,
    reportedBy: "Chiamaka Eze",
    reportedDate: "2025-09-15",
    description: "Three instances of late arrival in September 2025.",
    sanction: "Verbal Warning",
    sanctionDate: "2025-09-20",
  },
  {
    id: "dc-emp1-2",
    employeeId: "emp-001",
    employeeName: "Adebayo Ogunlesi",
    department: "Engineering",
    offence: "Policy Violation",
    severity: "minor" as Severity,
    status: "sanctioned" as CaseStatus,
    reportedBy: "Ibrahim Musa",
    reportedDate: "2026-01-10",
    description:
      "Used personal device to access company resources without prior approval from IT.",
    sanction: "Written Warning",
    sanctionDate: "2026-01-22",
  },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const style = SEVERITY_STYLES[severity];
  const bgMap: Record<Severity, string> = {
    minor: "bg-amber-50",
    major: "bg-orange-50",
    gross: "bg-red-50",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style.color,
        bgMap[severity]
      )}
    >
      {style.label}
    </span>
  );
}

function StatusBadge({ status }: { status: CaseStatus }) {
  const style = CASE_STATUS_STYLES[status];
  const bgMap: Record<CaseStatus, string> = {
    reported: "bg-amber-50",
    investigating: "bg-blue-50",
    hearing: "bg-violet-50",
    sanctioned: "bg-red-50",
    closed: "bg-gray-100",
    appealed: "bg-orange-50",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style.color,
        bgMap[status]
      )}
    >
      {style.label}
    </span>
  );
}

export default function EmployeeDisciplinaryPage() {
  const allCases = [...MOCK_CASES, ...inlineCases];
  const myCases = allCases.filter((c) => c.employeeId === EMPLOYEE_ID);

  return (
    <div className="min-h-screen bg-[#f7fbff] p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Disciplinary Records
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View any disciplinary cases and their outcomes
        </p>
      </div>

      {myCases.length === 0 ? (
        /* No cases banner */
        <div className="rounded-xl border border-green-200 bg-green-50 p-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-sm font-medium text-green-800">
            No active disciplinary cases on your record
          </p>
        </div>
      ) : (
        /* Cases list */
        <div className="space-y-4">
          {myCases.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-3"
            >
              {/* Top row: offence + badges */}
              <div className="flex flex-wrap items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {c.offence}
                </h3>
                <SeverityBadge severity={c.severity} />
                <StatusBadge status={c.status} />
              </div>

              {/* Reported date */}
              <p className="text-xs text-slate-500">
                Reported on {formatDate(c.reportedDate)} by {c.reportedBy}
              </p>

              {/* Description */}
              <p className="text-sm text-slate-700 leading-relaxed">
                {c.description}
              </p>

              {/* Sanction */}
              {c.sanction && (
                <div className="flex items-center gap-2 rounded-lg bg-[#f8fafc] px-3 py-2 border border-[#efefef]">
                  <AlertTriangle className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-500">Sanction:</span>
                  <span className="text-xs font-medium text-slate-900">
                    {c.sanction}
                  </span>
                  {c.sanctionDate && (
                    <span className="text-xs text-slate-400">
                      — {formatDate(c.sanctionDate)}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
