import { useState, useMemo } from "react";
import {
  Search,
  Download,
  FileText,
  BarChart3,
  Wrench,
  BookOpen,
  FileSpreadsheet,
  TrendingUp,
  Users,
  DollarSign,
  Calculator,
  RefreshCw,
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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  MOCK_STANDARD_REPORTS,
  MOCK_CUSTOM_REPORT_FIELDS,
  MOCK_PAYROLL_ANALYTICS,
  MOCK_DEPARTMENT_SUMMARIES,
  MOCK_GL_ENTRIES,
  GL_STATUS_STYLES,
} from "@/lib/payroll-reports-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type ReportsTab = "standard" | "builder" | "analytics" | "gl";

const TABS: { key: ReportsTab; label: string; icon: typeof FileText }[] = [
  { key: "standard", label: "Standard Reports", icon: FileText },
  { key: "builder", label: "Report Builder", icon: Wrench },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "gl", label: "GL Integration", icon: BookOpen },
];

export default function PayrollReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportsTab>("standard");
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payroll Reports & Analytics</h1>
          <p className="text-sm text-slate-500">
            Generate reports, build custom exports, and review payroll analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#efefef] overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(""); }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "standard" && <StandardReportsTab search={search} setSearch={setSearch} />}
      {activeTab === "builder" && <ReportBuilderTab />}
      {activeTab === "analytics" && <AnalyticsTab />}
      {activeTab === "gl" && <GLIntegrationTab search={search} setSearch={setSearch} />}
    </div>
  );
}

/* ── Summary Card ── */
function SummaryCard({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#f8fafc] text-blue-600">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

/* ── Tab 1: Standard Reports ── */
function StandardReportsTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_STANDARD_REPORTS.filter((r) => {
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (q && !r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, categoryFilter]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="summary">Summary</SelectItem>
            <SelectItem value="statutory">Statutory</SelectItem>
            <SelectItem value="department">Department</SelectItem>
            <SelectItem value="variance">Variance</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((report) => (
          <div key={report.id} className="rounded-lg border bg-white p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold">{report.name}</h3>
              </div>
              <span className={cn(
                "text-xs font-medium",
                report.status === "available" ? "text-emerald-700" :
                report.status === "generating" ? "text-blue-700" :
                "text-amber-700"
              )}>
                {report.status === "available" ? "Available" : report.status === "generating" ? "Generating" : "Scheduled"}
              </span>
            </div>
            <p className="text-xs text-slate-500">{report.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Last: {report.lastGenerated ?? "Never"}</span>
              <span className="capitalize">{report.frequency}</span>
              <span className="uppercase">{report.format}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => {}}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Generate
              </Button>
              <Button size="sm" className="flex-1" onClick={() => {}}>
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No reports match your search criteria.
        </div>
      )}
    </>
  );
}

/* ── Tab 2: Report Builder ── */
function ReportBuilderTab() {
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const cats: Record<string, typeof MOCK_CUSTOM_REPORT_FIELDS> = {};
    MOCK_CUSTOM_REPORT_FIELDS.forEach((f) => {
      if (!cats[f.category]) cats[f.category] = [];
      cats[f.category].push(f);
    });
    return cats;
  }, []);

  const toggleField = (id: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (category: string) => {
    const fields = categories[category];
    const allSelected = fields.every((f) => selectedFields.has(f.id));
    setSelectedFields((prev) => {
      const next = new Set(prev);
      fields.forEach((f) => {
        if (allSelected) next.delete(f.id);
        else next.add(f.id);
      });
      return next;
    });
  };

  const categoryLabels: Record<string, string> = {
    employee: "Employee Info",
    earnings: "Earnings",
    deductions: "Deductions",
    statutory: "Statutory",
    banking: "Banking",
  };

  return (
    <>
      <div className="rounded-lg border bg-white p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Custom Report Builder</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select fields to include in your custom report ({selectedFields.size} selected)
            </p>
          </div>
          <Button size="sm" disabled={selectedFields.size === 0} onClick={() => {}}>
            <FileText className="w-4 h-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categories).map(([category, fields]) => {
            const allSelected = fields.every((f) => selectedFields.has(f.id));
            const someSelected = fields.some((f) => selectedFields.has(f.id));
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <span className="text-sm font-medium capitalize">
                    {categoryLabels[category] ?? category}
                  </span>
                </div>
                <div className="ml-6 space-y-2">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedFields.has(field.id)}
                        onCheckedChange={() => toggleField(field.id)}
                      />
                      <span className="text-sm text-slate-500">{field.name}</span>
                      <span className="ml-auto text-[10px] text-slate-500/60 uppercase">{field.dataType}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ── Tab 3: Analytics ── */
function AnalyticsTab() {
  const latest = MOCK_PAYROLL_ANALYTICS[0];

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={DollarSign} label="Total Gross Pay" value={formatNaira(latest.totalGross)} />
        <SummaryCard icon={Calculator} label="Total Net Pay" value={formatNaira(latest.totalNet)} />
        <SummaryCard icon={TrendingUp} label="Average Salary" value={formatNaira(latest.averageSalary)} />
        <SummaryCard icon={Users} label="Employee Count" value={String(latest.employeeCount)} />
      </div>

      {/* Monthly Payroll Trends */}
      <div className="rounded-lg border bg-white">
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold">Monthly Payroll Trends</h2>
          <p className="text-xs text-slate-500 mt-0.5">Payroll summary over recent months</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-[#f8fafc]">
                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Period</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Gross Pay</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Net Pay</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Deductions</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Tax</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Pension</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Employees</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PAYROLL_ANALYTICS.map((row) => (
                <tr key={row.period} className="border-b last:border-0 hover:bg-[#f8fafc]">
                  <td className="px-4 py-2.5 font-medium">{row.period}</td>
                  <td className="px-4 py-2.5 text-right">{formatNaira(row.totalGross)}</td>
                  <td className="px-4 py-2.5 text-right">{formatNaira(row.totalNet)}</td>
                  <td className="px-4 py-2.5 text-right">{formatNaira(row.totalDeductions)}</td>
                  <td className="px-4 py-2.5 text-right">{formatNaira(row.totalTax)}</td>
                  <td className="px-4 py-2.5 text-right">{formatNaira(row.totalPension)}</td>
                  <td className="px-4 py-2.5 text-right">{row.employeeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="rounded-lg border bg-white">
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold">Department Breakdown</h2>
          <p className="text-xs text-slate-500 mt-0.5">Payroll distribution across departments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-[#f8fafc]">
                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Department</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Employees</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Total Gross</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">% of Payroll</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DEPARTMENT_SUMMARIES.map((dept) => (
                <tr key={dept.department} className="border-b last:border-0 hover:bg-[#f8fafc]">
                  <td className="px-4 py-2.5 font-medium">{dept.department}</td>
                  <td className="px-4 py-2.5 text-right">{dept.employeeCount}</td>
                  <td className="px-4 py-2.5 text-right">{formatNaira(dept.totalGross)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[#f8fafc] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${dept.percentOfPayroll}%` }}
                        />
                      </div>
                      <span className="w-12 text-right">{dept.percentOfPayroll}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ── Tab 4: GL Integration ── */
function GLIntegrationTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_GL_ENTRIES.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (q && !e.accountName.toLowerCase().includes(q) && !e.accountCode.includes(q) && !e.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, statusFilter]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search GL entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reversed">Reversed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* GL Table */}
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-[#f8fafc]">
                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Period</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Account Code</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Account Name</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Debit</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Credit</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Description</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Posting Date</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const style = GL_STATUS_STYLES[entry.status];
                return (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-[#f8fafc]">
                    <td className="px-4 py-2.5">{entry.period}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{entry.accountCode}</td>
                    <td className="px-4 py-2.5 font-medium">{entry.accountName}</td>
                    <td className="px-4 py-2.5 text-right">{entry.debit > 0 ? formatNaira(entry.debit) : "—"}</td>
                    <td className="px-4 py-2.5 text-right">{entry.credit > 0 ? formatNaira(entry.credit) : "—"}</td>
                    <td className="px-4 py-2.5 text-slate-500">{entry.description}</td>
                    <td className="px-4 py-2.5">{entry.postingDate}</td>
                    <td className={cn("px-4 py-2.5 text-sm font-medium", style.color)}>
                      {style.label}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No GL entries match your search criteria.
        </div>
      )}
    </>
  );
}
