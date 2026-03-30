import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Plus,
  Settings2,
  Layers,
  FileText,
  Calendar,
  UserCheck,
  Banknote,
  Percent,
  ToggleLeft,
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
  MOCK_PAY_GRADES,
  MOCK_SALARY_STRUCTURES,
  MOCK_TEMPLATES,
  MOCK_PAYROLL_CALENDAR,
  MOCK_SALARY_ASSIGNMENTS,
  PAY_GRADE_STATUS_STYLES,
  STRUCTURE_STATUS_STYLES,
  ASSIGNMENT_STATUS_STYLES,
  PERIOD_STATUS_STYLES,
} from "@/lib/payroll-config-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type ConfigTab = "pay-grades" | "salary-structures" | "templates" | "calendar" | "assignments";

const TABS: { key: ConfigTab; label: string; icon: typeof Settings2 }[] = [
  { key: "pay-grades", label: "Pay Grades", icon: Layers },
  { key: "salary-structures", label: "Salary Structures", icon: Banknote },
  { key: "templates", label: "Allowances & Deductions", icon: FileText },
  { key: "calendar", label: "Payroll Calendar", icon: Calendar },
  { key: "assignments", label: "Assignments", icon: UserCheck },
];

export default function PayrollConfigPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>("pay-grades");
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payroll Configuration</h1>
          <p className="text-sm text-muted-foreground">
            Manage pay grades, salary structures, and payroll schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("Payroll configuration exported successfully.")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => alert("Add new " + activeTab.replace("-", " ") + " form would open here.")}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
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

      {activeTab === "pay-grades" && <PayGradesTab search={search} setSearch={setSearch} />}
      {activeTab === "salary-structures" && <SalaryStructuresTab search={search} setSearch={setSearch} />}
      {activeTab === "templates" && <TemplatesTab search={search} setSearch={setSearch} />}
      {activeTab === "calendar" && <PayrollCalendarTab />}
      {activeTab === "assignments" && <AssignmentsTab search={search} setSearch={setSearch} />}
    </div>
  );
}

/* ── Pay Grades Tab ── */
function PayGradesTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_PAY_GRADES.filter(
      (g) => !q || g.name.toLowerCase().includes(q)
    );
  }, [search]);

  const totalEmployees = MOCK_PAY_GRADES.reduce((s, g) => s + g.employeeCount, 0);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Layers} label="Total Grades" value={String(MOCK_PAY_GRADES.length)} />
        <SummaryCard icon={UserCheck} label="Total Employees" value={String(totalEmployees)} />
        <SummaryCard icon={Banknote} label="Min Salary" value={formatNaira(MOCK_PAY_GRADES.reduce((m, g) => Math.min(m, g.minSalary), Infinity))} />
        <SummaryCard icon={Banknote} label="Max Salary" value={formatNaira(MOCK_PAY_GRADES.reduce((m, g) => Math.max(m, g.maxSalary), 0))} />
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search pay grades..." />

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Grade</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Level</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Min Salary</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Mid Salary</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Max Salary</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Employees</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const style = PAY_GRADE_STATUS_STYLES[g.status];
              return (
                <tr key={g.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{g.name}</td>
                  <td className="p-3 text-muted-foreground">{g.level}</td>
                  <td className="p-3">{formatNaira(g.minSalary)}</td>
                  <td className="p-3">{formatNaira(g.midSalary)}</td>
                  <td className="p-3">{formatNaira(g.maxSalary)}</td>
                  <td className="p-3">{g.employeeCount}</td>
                  <td className="p-3">
                    <StatusBadge style={style} />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <EmptyRow colSpan={7} />}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Salary Structures Tab ── */
function SalaryStructuresTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_SALARY_STRUCTURES.filter((s) => {
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.payGradeName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Banknote} label="Total Structures" value={String(MOCK_SALARY_STRUCTURES.length)} />
        <SummaryCard icon={ToggleLeft} label="Active" value={String(MOCK_SALARY_STRUCTURES.filter((s) => s.status === "active").length)} />
        <SummaryCard icon={UserCheck} label="Assigned Employees" value={String(MOCK_SALARY_STRUCTURES.reduce((s, st) => s + st.employeeCount, 0))} />
        <SummaryCard icon={FileText} label="Drafts" value={String(MOCK_SALARY_STRUCTURES.filter((s) => s.status === "draft").length)} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search structures..." />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Structure Name</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Pay Grade</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Total Earnings</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Deductions</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Net Pay</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Employees</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Effective From</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const style = STRUCTURE_STATUS_STYLES[s.status];
              return (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.description}</div>
                  </td>
                  <td className="p-3">{s.payGradeName}</td>
                  <td className="p-3">{formatNaira(s.totalEarnings)}</td>
                  <td className="p-3 text-red-600">{formatNaira(s.totalDeductions)}</td>
                  <td className="p-3 font-medium">{formatNaira(s.netPay)}</td>
                  <td className="p-3">{s.employeeCount}</td>
                  <td className="p-3 text-muted-foreground">{s.effectiveFrom}</td>
                  <td className="p-3"><StatusBadge style={style} /></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <EmptyRow colSpan={8} />}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Allowance & Deduction Templates Tab ── */
function TemplatesTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_TEMPLATES.filter((t) => {
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const allowances = MOCK_TEMPLATES.filter((t) => t.type === "allowance");
  const deductions = MOCK_TEMPLATES.filter((t) => t.type === "deduction");

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={FileText} label="Total Templates" value={String(MOCK_TEMPLATES.length)} />
        <SummaryCard icon={Plus} label="Allowances" value={String(allowances.length)} />
        <SummaryCard icon={Percent} label="Deductions" value={String(deductions.length)} />
        <SummaryCard icon={ToggleLeft} label="Statutory" value={String(MOCK_TEMPLATES.filter((t) => t.statutory).length)} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search templates..." />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="allowance">Allowances</SelectItem>
            <SelectItem value="deduction">Deductions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Calculation</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Default Value</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Taxable</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Statutory</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Applies To</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.description}</div>
                </td>
                <td className="p-3">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                    t.type === "allowance" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
                  )}>
                    {t.type === "allowance" ? "Allowance" : "Deduction"}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{t.category}</td>
                <td className="p-3 text-muted-foreground capitalize">{t.calculationType}</td>
                <td className="p-3">{t.calculationType === "fixed" ? formatNaira(t.defaultValue) : `${t.defaultValue}%`}{t.percentageOf ? ` of ${t.percentageOf}` : ""}</td>
                <td className="p-3">{t.taxable ? <span className="text-amber-600">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                <td className="p-3">{t.statutory ? <span className="text-blue-600">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                <td className="p-3 text-muted-foreground capitalize">{t.applicableTo.replace("-", " ")}</td>
                <td className="p-3"><StatusBadge style={PAY_GRADE_STATUS_STYLES[t.status]} /></td>
              </tr>
            ))}
            {filtered.length === 0 && <EmptyRow colSpan={9} />}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Payroll Calendar Tab ── */
function PayrollCalendarTab() {
  const cal = MOCK_PAYROLL_CALENDAR;
  const processed = cal.periods.filter((p) => p.status === "processed").length;
  const open = cal.periods.filter((p) => p.status === "open").length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Calendar} label="Frequency" value={cal.frequency.charAt(0).toUpperCase() + cal.frequency.slice(1)} />
        <SummaryCard icon={Banknote} label="Pay Day" value={`${cal.payDay}th of month`} />
        <SummaryCard icon={Settings2} label="Processed" value={`${processed} / ${cal.periods.length}`} />
        <SummaryCard icon={ToggleLeft} label="Open Periods" value={String(open)} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Calendar: {cal.name}</h3>
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
            PAY_GRADE_STATUS_STYLES[cal.status]?.bg,
            PAY_GRADE_STATUS_STYLES[cal.status]?.color,
          )}>
            {PAY_GRADE_STATUS_STYLES[cal.status]?.label}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm mb-4">
          <div><span className="text-muted-foreground">Cutoff Day:</span> <span className="font-medium">{cal.cutoffDay}th</span></div>
          <div><span className="text-muted-foreground">Processing Day:</span> <span className="font-medium">{cal.processingDay}nd</span></div>
          <div><span className="text-muted-foreground">Pay Day:</span> <span className="font-medium">{cal.payDay}th</span></div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Period</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Start Date</th>
              <th className="p-3 text-left font-medium text-muted-foreground">End Date</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Cutoff</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Processing</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Pay Date</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {cal.periods.map((p) => {
              const style = PERIOD_STATUS_STYLES[p.status];
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{p.periodName}</td>
                  <td className="p-3 text-muted-foreground">{p.startDate}</td>
                  <td className="p-3 text-muted-foreground">{p.endDate}</td>
                  <td className="p-3 text-muted-foreground">{p.cutoffDate}</td>
                  <td className="p-3 text-muted-foreground">{p.processingDate}</td>
                  <td className="p-3 text-muted-foreground">{p.payDate}</td>
                  <td className="p-3"><StatusBadge style={style} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Salary Assignments Tab ── */
function AssignmentsTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_SALARY_ASSIGNMENTS.filter((a) => {
      const matchesSearch = !q || a.employeeName.toLowerCase().includes(q) || a.structureName.toLowerCase().includes(q) || a.department.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={UserCheck} label="Total Assignments" value={String(MOCK_SALARY_ASSIGNMENTS.length)} />
        <SummaryCard icon={ToggleLeft} label="Active" value={String(MOCK_SALARY_ASSIGNMENTS.filter((a) => a.status === "active").length)} />
        <SummaryCard icon={Settings2} label="Pending" value={String(MOCK_SALARY_ASSIGNMENTS.filter((a) => a.status === "pending").length)} />
        <SummaryCard icon={Banknote} label="Total Monthly Gross" value={formatNaira(MOCK_SALARY_ASSIGNMENTS.filter((a) => a.status === "active").reduce((s, a) => s + a.grossPay, 0))} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search employees or structures..." />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Employee</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Department</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Structure</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Pay Grade</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Basic Salary</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Gross Pay</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Effective From</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const style = ASSIGNMENT_STATUS_STYLES[a.status];
              return (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="font-medium">{a.employeeName}</div>
                    <div className="text-xs text-muted-foreground">{a.employeeId}</div>
                  </td>
                  <td className="p-3 text-muted-foreground">{a.department}</td>
                  <td className="p-3">{a.structureName}</td>
                  <td className="p-3 text-muted-foreground">{a.payGradeName}</td>
                  <td className="p-3">{formatNaira(a.basicSalary)}</td>
                  <td className="p-3 font-medium">{formatNaira(a.grossPay)}</td>
                  <td className="p-3 text-muted-foreground">{a.effectiveFrom}</td>
                  <td className="p-3"><StatusBadge style={style} /></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <EmptyRow colSpan={8} />}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Shared Helpers ── */
function SummaryCard({ icon: Icon, label, value }: { icon: typeof Settings2; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}

function StatusBadge({ style }: { style: { label: string; bg: string; color: string } | undefined }) {
  if (!style) return null;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style.bg, style.color)}>
      {style.label}
    </span>
  );
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-12 text-center text-muted-foreground">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No items found</p>
        <p className="text-xs mt-1">Try adjusting your search or filters</p>
      </td>
    </tr>
  );
}
