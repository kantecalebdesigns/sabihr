import { ShieldAlert, CheckCircle2, AlertTriangle, FileWarning, Gavel } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_CASES,
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

const SEVERITY_PILL: Record<Severity, { label: string; cls: string; dot: string }> = {
  minor: { label: "Minor", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  major: { label: "Major", cls: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  gross: { label: "Gross", cls: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
};

const STATUS_PILL: Record<CaseStatus, { label: string; cls: string; dot: string }> = {
  reported: { label: "Reported", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  investigating: { label: "Investigating", cls: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  hearing: { label: "Hearing", cls: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  sanctioned: { label: "Sanctioned", cls: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
  appealed: { label: "Appealed", cls: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  closed: { label: "Closed", cls: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

const CARD_SHELL =
  "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EmployeeDisciplinaryPage() {
  const allCases = [...MOCK_CASES, ...inlineCases];
  const myCases = allCases.filter((c) => c.employeeId === EMPLOYEE_ID);

  const openCases = myCases.filter((c) =>
    ["reported", "investigating", "hearing"].includes(c.status)
  ).length;
  const sanctioned = myCases.filter((c) => c.status === "sanctioned").length;
  const closed = myCases.filter((c) => c.status === "closed").length;

  const kpis = [
    { label: "Total Cases", value: myCases.length, icon: FileWarning },
    { label: "Open", value: openCases, icon: ShieldAlert },
    { label: "Sanctions", value: sanctioned, icon: Gavel },
    { label: "Closed", value: closed, icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Disciplinary Records
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View any disciplinary cases and their outcomes from your record.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={cn(CARD_SHELL, "px-5 pt-5 pb-5 flex flex-col gap-7")}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="text-blue-600 w-[18px] h-[18px]" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none tabular-nums">
                  {c.value}
                </p>
                <p className="text-sm text-slate-500 mt-2">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {myCases.length === 0 ? (
        /* No cases banner */
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-800">
            No active disciplinary cases on your record
          </p>
        </div>
      ) : (
        /* Cases list */
        <div className="space-y-4">
          {myCases.map((c) => {
            const sev = SEVERITY_PILL[c.severity];
            const stat = STATUS_PILL[c.status];
            return (
              <div
                key={c.id}
                className={cn(CARD_SHELL, "p-5 space-y-3")}
              >
                {/* Top row: offence + badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ShieldAlert className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mr-1">
                    {c.offence}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                      sev.cls
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", sev.dot)} />
                    {sev.label}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                      stat.cls
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", stat.dot)} />
                    {stat.label}
                  </span>
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
                  <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                    <AlertTriangle className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-500">Sanction:</span>
                    <span className="text-xs font-semibold text-slate-900">
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
            );
          })}
        </div>
      )}
    </div>
  );
}
