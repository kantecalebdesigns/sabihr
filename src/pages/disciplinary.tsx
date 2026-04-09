import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_CASES,
  MOCK_OFFENCE_TYPES,
  MOCK_SANCTION_TYPES,
  CASE_STATUS_STYLES,
  SEVERITY_STYLES,
} from "@/lib/disciplinary-mock-data";

type Tab = "cases" | "offences" | "sanctions";

export default function DisciplinaryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("cases");
  const [search, setSearch] = useState("");

  const openCases = MOCK_CASES.filter((c) => ["reported", "investigating", "hearing"].includes(c.status)).length;
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
    { label: "Open Cases", value: openCases },
    { label: "Under Investigation", value: investigating },
    { label: "Sanctions Applied", value: sanctioned },
    { label: "Appeals Pending", value: appeals },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "cases", label: "Cases" },
    { key: "offences", label: "Offences Library" },
    { key: "sanctions", label: "Sanctions Library" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Disciplinary Management</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="rounded-xl border border-[#efefef] bg-white p-4">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-2xl font-semibold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#efefef]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors -mb-px",
              tab === t.key
                ? "border-b-2 border-blue-600 text-slate-900"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Cases tab */}
      {tab === "cases" && (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {filteredCases.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#efefef] bg-white p-12 text-center">
              <ShieldAlert className="w-10 h-10 mx-auto text-slate-500" />
              <p className="mt-3 text-sm text-slate-500">No cases found</p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="p-3 text-xs font-medium text-slate-500">Employee</th>
                    <th className="p-3 text-xs font-medium text-slate-500">Offence</th>
                    <th className="p-3 text-xs font-medium text-slate-500">Severity</th>
                    <th className="p-3 text-xs font-medium text-slate-500">Status</th>
                    <th className="p-3 text-xs font-medium text-slate-500">Reporter</th>
                    <th className="p-3 text-xs font-medium text-slate-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCases.map((c) => {
                    const sevStyle = SEVERITY_STYLES[c.severity];
                    const statStyle = CASE_STATUS_STYLES[c.status];
                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-[#f8fafc] cursor-pointer transition-colors"
                        onClick={() => navigate(`/disciplinary/cases/${c.id}`)}
                      >
                        <td className="p-3">
                          <p className="text-sm font-medium">{c.employeeName}</p>
                          <p className="text-xs text-slate-500">{c.department}</p>
                        </td>
                        <td className="p-3 text-sm">{c.offence}</td>
                        <td className={cn("p-3 text-sm font-medium", sevStyle.color)}>{sevStyle.label}</td>
                        <td className={cn("p-3 text-sm font-medium", statStyle.color)}>{statStyle.label}</td>
                        <td className="p-3 text-sm text-slate-500">{c.reportedBy}</td>
                        <td className="p-3 text-sm text-slate-500">{c.reportedDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Offences Library tab */}
      {tab === "offences" && (
        <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="p-3 text-xs font-medium text-slate-500">Name</th>
                <th className="p-3 text-xs font-medium text-slate-500">Severity</th>
                <th className="p-3 text-xs font-medium text-slate-500">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_OFFENCE_TYPES.map((o) => {
                const sevStyle = SEVERITY_STYLES[o.severity];
                return (
                  <tr key={o.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3 text-sm font-medium">{o.name}</td>
                    <td className={cn("p-3 text-sm font-medium", sevStyle.color)}>{sevStyle.label}</td>
                    <td className="p-3 text-sm text-slate-500">{o.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Sanctions Library tab */}
      {tab === "sanctions" && (
        <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="p-3 text-xs font-medium text-slate-500">Name</th>
                <th className="p-3 text-xs font-medium text-slate-500">Level</th>
                <th className="p-3 text-xs font-medium text-slate-500">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_SANCTION_TYPES.map((s) => (
                <tr key={s.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="p-3 text-sm font-medium">{s.name}</td>
                  <td className="p-3 text-sm">{s.level}</td>
                  <td className="p-3 text-sm text-slate-500">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
