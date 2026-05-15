import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShieldAlert,
  FileWarning,
  Eye,
  Gavel,
  Scale,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_CASES,
  MOCK_OFFENCE_TYPES,
  MOCK_SANCTION_TYPES,
} from "@/lib/disciplinary-mock-data";
import type { CaseStatus, Severity } from "@/lib/disciplinary-mock-data";

type Tab = "cases" | "offences" | "sanctions";

const AVATAR_PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const SEVERITY_PILL: Record<Severity, { label: string; cls: string; dot: string }> = {
  minor: {
    label: "Minor",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  major: {
    label: "Major",
    cls: "bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
  },
  gross: {
    label: "Gross",
    cls: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
};

const STATUS_PILL: Record<CaseStatus, { label: string; cls: string; dot: string }> = {
  reported: {
    label: "Reported",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  investigating: {
    label: "Investigating",
    cls: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  hearing: {
    label: "Hearing",
    cls: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  sanctioned: {
    label: "Sanctioned",
    cls: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
  appealed: {
    label: "Appealed",
    cls: "bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
  },
  closed: {
    label: "Closed",
    cls: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

const CARD_SHELL =
  "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]";

export default function DisciplinaryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("cases");
  const [search, setSearch] = useState("");

  const openCases = MOCK_CASES.filter((c) =>
    ["reported", "investigating", "hearing"].includes(c.status)
  ).length;
  const investigating = MOCK_CASES.filter((c) => c.status === "investigating").length;
  const sanctioned = MOCK_CASES.filter((c) => c.status === "sanctioned").length;
  const appeals = MOCK_CASES.filter((c) => c.status === "appealed").length;

  const filteredCases = useMemo(() => {
    if (!search.trim()) return MOCK_CASES;
    const q = search.toLowerCase();
    return MOCK_CASES.filter(
      (c) =>
        c.employeeName.toLowerCase().includes(q) ||
        c.offence.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
    );
  }, [search]);

  const summaryCards = [
    { label: "Open Cases", value: openCases, icon: FileWarning },
    { label: "Under Investigation", value: investigating, icon: Eye },
    { label: "Sanctions Applied", value: sanctioned, icon: Gavel },
    { label: "Appeals Pending", value: appeals, icon: Scale },
  ];

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "cases", label: "Cases", count: MOCK_CASES.length },
    { key: "offences", label: "Offences Library", count: MOCK_OFFENCE_TYPES.length },
    { key: "sanctions", label: "Sanctions Library", count: MOCK_SANCTION_TYPES.length },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Disciplinary Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track cases, manage investigations, and reference your offences and sanctions libraries.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((c) => {
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

      {/* Chip filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label}
              {typeof t.count === "number" && (
                <span
                  className={cn(
                    "text-xs",
                    active ? "text-white/80" : "text-slate-400"
                  )}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cases tab */}
      {tab === "cases" && (
        <div className={cn(CARD_SHELL, "overflow-hidden")}>
          {/* Toolbar */}
          <div className="flex items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search cases by employee, offence, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <span className="text-sm text-slate-500 shrink-0">
              {filteredCases.length} case{filteredCases.length === 1 ? "" : "s"}
            </span>
          </div>

          {filteredCases.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
              </div>
              <p className="mt-3 text-sm text-slate-500">No cases match your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200/70">
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
                      Employee
                    </th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                      Offence
                    </th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                      Severity
                    </th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                      Status
                    </th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                      Reported by
                    </th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                      Date
                    </th>
                    <th className="w-12 py-3 pr-5" />
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((c) => {
                    const sev = SEVERITY_PILL[c.severity];
                    const stat = STATUS_PILL[c.status];
                    return (
                      <tr
                        key={c.id}
                        onClick={() => navigate(`/disciplinary/cases/${c.id}`)}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                      >
                        <td className="py-4 pl-5 pr-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0",
                                avatarColor(c.id)
                              )}
                            >
                              {initials(c.employeeName)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">
                                {c.employeeName}
                              </p>
                              <p className="text-xs text-slate-500 leading-tight mt-0.5">
                                {c.department}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-5 text-sm text-slate-700">{c.offence}</td>
                        <td className="py-4 pr-5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                              sev.cls
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", sev.dot)} />
                            {sev.label}
                          </span>
                        </td>
                        <td className="py-4 pr-5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                              stat.cls
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", stat.dot)} />
                            {stat.label}
                          </span>
                        </td>
                        <td className="py-4 pr-5 text-sm text-slate-700">{c.reportedBy}</td>
                        <td className="py-4 pr-5 text-sm text-slate-500">
                          {c.reportedDate}
                        </td>
                        <td className="py-4 pr-5">
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Offences Library tab */}
      {tab === "offences" && (
        <div className={cn(CARD_SHELL, "overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
                    Offence
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Severity
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_OFFENCE_TYPES.map((o) => {
                  const sev = SEVERITY_PILL[o.severity];
                  return (
                    <tr
                      key={o.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 pl-5 pr-5 text-sm font-semibold text-slate-900">
                        {o.name}
                      </td>
                      <td className="py-4 pr-5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                            sev.cls
                          )}
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full", sev.dot)} />
                          {sev.label}
                        </span>
                      </td>
                      <td className="py-4 pr-5 text-sm text-slate-700">{o.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sanctions Library tab */}
      {tab === "sanctions" && (
        <div className={cn(CARD_SHELL, "overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/70">
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
                    Sanction
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Level
                  </th>
                  <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SANCTION_TYPES.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 pl-5 pr-5 text-sm font-semibold text-slate-900">
                      {s.name}
                    </td>
                    <td className="py-4 pr-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        Level {s.level}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-sm text-slate-700">{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
