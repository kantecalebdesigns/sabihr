import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Archive,
  Shield,
  CalendarCheck,
  Users,
  Banknote,
  FileText,
  Lock,
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
  MOCK_PAYROLL_ARCHIVES,
  MOCK_AUDIT_TRAIL,
  MOCK_YEAR_END_REPORTS,
  ARCHIVE_STATUS_STYLES,
  AUDIT_ACTION_STYLES,
  YEAR_END_STATUS_STYLES,
} from "@/lib/payroll-audit-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type AuditTab = "history" | "audit-trail" | "year-end";

const TABS: { key: AuditTab; label: string; icon: typeof Archive }[] = [
  { key: "history", label: "History & Archive", icon: Archive },
  { key: "audit-trail", label: "Audit Trail", icon: Shield },
  { key: "year-end", label: "Year-End Closure", icon: CalendarCheck },
];

export default function PayrollAuditPage() {
  const [activeTab, setActiveTab] = useState<AuditTab>("history");
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payroll History & Audit</h1>
          <p className="text-sm text-muted-foreground">
            Review payroll archives, audit trail, and year-end closures
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("Audit data exported successfully.")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(""); }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "history" && <HistoryTab search={search} setSearch={setSearch} />}
      {activeTab === "audit-trail" && <AuditTrailTab search={search} setSearch={setSearch} />}
      {activeTab === "year-end" && <YearEndTab />}
    </div>
  );
}

/* ── History & Archive Tab ── */
function HistoryTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [yearFilter, setYearFilter] = useState("all");

  const years = useMemo(() => {
    const unique = [...new Set(MOCK_PAYROLL_ARCHIVES.map((a) => a.year))];
    return unique.sort((a, b) => b - a);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_PAYROLL_ARCHIVES.filter((a) => {
      const matchYear = yearFilter === "all" || a.year === Number(yearFilter);
      const matchSearch =
        !q ||
        a.period.toLowerCase().includes(q) ||
        a.approvedBy.toLowerCase().includes(q);
      return matchYear && matchSearch;
    });
  }, [search, yearFilter]);

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Archive} label="Total Archives" value={String(MOCK_PAYROLL_ARCHIVES.length)} />
        <SummaryCard icon={Banknote} label="Total Gross (All)" value={formatNaira(MOCK_PAYROLL_ARCHIVES.reduce((s, a) => s + a.totalGross, 0))} />
        <SummaryCard icon={Banknote} label="Total Net (All)" value={formatNaira(MOCK_PAYROLL_ARCHIVES.reduce((s, a) => s + a.totalNet, 0))} />
        <SummaryCard icon={Users} label="Current Employees" value={String(MOCK_PAYROLL_ARCHIVES[0]?.employeeCount ?? 0)} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search archives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Period</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Year</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Gross Pay</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Net Pay</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Deductions</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Employees</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Processed</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Approved By</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const style = ARCHIVE_STATUS_STYLES[a.status];
              return (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{a.period}</td>
                  <td className="p-3 text-muted-foreground">{a.year}</td>
                  <td className="p-3 text-right">{formatNaira(a.totalGross)}</td>
                  <td className="p-3 text-right">{formatNaira(a.totalNet)}</td>
                  <td className="p-3 text-right text-muted-foreground">{formatNaira(a.totalDeductions)}</td>
                  <td className="p-3 text-center">{a.employeeCount}</td>
                  <td className="p-3 text-muted-foreground">{a.processedDate}</td>
                  <td className="p-3">{a.approvedBy}</td>
                  <td className="p-3 text-center">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                      {style.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted-foreground">No archives found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Audit Trail Tab ── */
function AuditTrailTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [moduleFilter, setModuleFilter] = useState("all");

  const modules = useMemo(() => {
    return [...new Set(MOCK_AUDIT_TRAIL.map((e) => e.module))].sort();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_AUDIT_TRAIL.filter((e) => {
      const matchModule = moduleFilter === "all" || e.module === moduleFilter;
      const matchSearch =
        !q ||
        e.description.toLowerCase().includes(q) ||
        e.performedBy.toLowerCase().includes(q) ||
        e.affectedEntity.toLowerCase().includes(q) ||
        e.actionLabel.toLowerCase().includes(q);
      return matchModule && matchSearch;
    });
  }, [search, moduleFilter]);

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Shield} label="Total Entries" value={String(MOCK_AUDIT_TRAIL.length)} />
        <SummaryCard icon={FileText} label="Modules" value={String(modules.length)} />
        <SummaryCard icon={Users} label="Unique Users" value={String(new Set(MOCK_AUDIT_TRAIL.map((e) => e.performedBy)).size)} />
        <SummaryCard icon={CalendarCheck} label="Latest Action" value={formatTimestamp(MOCK_AUDIT_TRAIL[0]?.timestamp ?? "")} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Timestamp</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Action</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Module</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Description</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Performed By</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Entity</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Old Value</th>
              <th className="p-3 text-left font-medium text-muted-foreground">New Value</th>
              <th className="p-3 text-left font-medium text-muted-foreground">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const actionStyle = AUDIT_ACTION_STYLES[e.action] ?? { label: e.actionLabel, bg: "bg-gray-50 border-gray-200", color: "text-gray-700" };
              return (
                <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-muted-foreground whitespace-nowrap">{formatTimestamp(e.timestamp)}</td>
                  <td className="p-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", actionStyle.bg, actionStyle.color)}>
                      {actionStyle.label}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">{e.module}</td>
                  <td className="p-3 max-w-[280px] truncate" title={e.description}>{e.description}</td>
                  <td className="p-3 whitespace-nowrap">{e.performedBy}</td>
                  <td className="p-3 font-mono text-xs">{e.affectedEntity}</td>
                  <td className="p-3 text-muted-foreground text-xs">{e.oldValue ?? "—"}</td>
                  <td className="p-3 text-xs">{e.newValue ?? "—"}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{e.ipAddress}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted-foreground">No audit entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Year-End Closure Tab ── */
function YearEndTab() {
  const [yearEndReports, setYearEndReports] = useState(MOCK_YEAR_END_REPORTS);

  const closeYear = (id: string) => {
    setYearEndReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "closed" as const, closedBy: "Admin", closedDate: new Date().toISOString().split("T")[0] }
          : r
      )
    );
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={CalendarCheck} label="Fiscal Years" value={String(yearEndReports.length)} />
        <SummaryCard icon={Banknote} label="Total Gross (All)" value={formatNaira(yearEndReports.reduce((s, r) => s + r.totalGrossPay, 0))} />
        <SummaryCard icon={Lock} label="Closed Years" value={String(yearEndReports.filter((r) => r.status === "closed").length)} />
        <SummaryCard icon={Users} label="Current Headcount" value={String(yearEndReports.find((r) => r.status === "open")?.employeeCount ?? 0)} />
      </div>

      {/* Year-End Cards */}
      <div className="grid gap-6">
        {yearEndReports.map((report) => {
          const style = YEAR_END_STATUS_STYLES[report.status];
          return (
            <div key={report.id} className="rounded-xl border border-border bg-card p-6 space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">Fiscal Year {report.year}</h3>
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
                    {style.label}
                  </span>
                </div>
                {report.status === "open" && (
                  <Button variant="destructive" size="sm" onClick={() => closeYear(report.id)}>
                    <Lock className="w-4 h-4 mr-2" />
                    Close Year
                  </Button>
                )}
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatItem label="Total Gross Pay" value={formatNaira(report.totalGrossPay)} />
                <StatItem label="Total Net Pay" value={formatNaira(report.totalNetPay)} />
                <StatItem label="Total Tax Paid" value={formatNaira(report.totalTaxPaid)} />
                <StatItem label="Total Pension" value={formatNaira(report.totalPensionPaid)} />
                <StatItem label="Total Statutory" value={formatNaira(report.totalStatutory)} />
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground border-t border-border pt-4">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {report.employeeCount} employees
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  {report.payrollRunCount} payroll runs
                </span>
                {report.status === "closed" && report.closedDate && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <CalendarCheck className="w-4 h-4" />
                      Closed on {report.closedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      Closed by {report.closedBy}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Shared Components ── */
function SummaryCard({ icon: Icon, label, value }: { icon: typeof Archive; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
