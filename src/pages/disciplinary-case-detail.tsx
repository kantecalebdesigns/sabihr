import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_CASES,
  CASE_STATUS_STYLES,
  SEVERITY_STYLES,
} from "@/lib/disciplinary-mock-data";
import type { CaseStatus } from "@/lib/disciplinary-mock-data";

const STAGES: CaseStatus[] = ["reported", "investigating", "hearing", "sanctioned", "closed"];

function getStageIndex(status: CaseStatus): number {
  if (status === "appealed") return STAGES.indexOf("sanctioned");
  return STAGES.indexOf(status);
}

export default function DisciplinaryCaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const caseData = MOCK_CASES.find((c) => c.id === id);

  if (!caseData) {
    return (
      <div className="space-y-6">
        <Link to="/disciplinary" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Disciplinary
        </Link>
        <div className="rounded-xl border border-dashed border-[#efefef] bg-white p-12 text-center">
          <ShieldAlert className="w-10 h-10 mx-auto text-slate-500" />
          <p className="mt-3 text-sm text-slate-500">Case not found</p>
        </div>
      </div>
    );
  }

  const statusStyle = CASE_STATUS_STYLES[caseData.status];
  const sevStyle = SEVERITY_STYLES[caseData.severity];
  const currentStageIdx = getStageIndex(caseData.status);

  const infoRows: { label: string; value: React.ReactNode }[] = [
    { label: "Offence", value: caseData.offence },
    { label: "Severity", value: <span className={cn("font-medium", sevStyle.color)}>{sevStyle.label}</span> },
    { label: "Reporter", value: caseData.reportedBy },
    { label: "Date Reported", value: caseData.reportedDate },
    { label: "Department", value: caseData.department },
  ];

  return (
    <div className="space-y-6">
      <Link to="/disciplinary" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Disciplinary
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{caseData.employeeName}</h1>
        <span className={cn("text-sm font-medium", statusStyle.color)}>{statusStyle.label}</span>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-medium text-slate-500 mb-4">Case Information</h2>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          {infoRows.map((row) => (
            <div key={row.label}>
              <dt className="text-xs text-slate-500">{row.label}</dt>
              <dd className="text-sm mt-0.5">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-medium text-slate-500 mb-2">Description</h2>
        <p className="text-sm">{caseData.description}</p>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-medium text-slate-500 mb-4">Progress</h2>
        <div className="flex items-center gap-0">
          {STAGES.map((stage, i) => {
            const completed = i <= currentStageIdx;
            const label = CASE_STATUS_STYLES[stage].label;
            return (
              <div key={stage} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
                      completed
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-[#efefef]"
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className={cn("text-xs mt-1.5", completed ? "text-slate-900 font-medium" : "text-slate-500")}>
                    {label}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div className={cn("h-0.5 flex-1 mx-1", i < currentStageIdx ? "bg-slate-900" : "bg-[#efefef]")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sanction */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-medium text-slate-500 mb-2">Sanction</h2>
        {caseData.sanction ? (
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-slate-500">Type</dt>
              <dd className="text-sm mt-0.5 font-medium">{caseData.sanction}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Date</dt>
              <dd className="text-sm mt-0.5">{caseData.sanctionDate}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-slate-500">No sanction applied yet</p>
        )}
      </div>
    </div>
  );
}
