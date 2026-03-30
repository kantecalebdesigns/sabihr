import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Shield,
  Landmark,
  Building2,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
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
  MOCK_PAYE_CONFIG,
  MOCK_PENSION_CONFIGS,
  MOCK_STATUTORY_BODIES,
  MOCK_COMPLIANCE_OVERVIEW,
  COMPLIANCE_STATUS_STYLES,
  PAYMENT_STATUS_STYLES,
  PAYE_CONFIG_STATUS_STYLES,
} from "@/lib/statutory-compliance-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type ComplianceTab = "paye" | "pension" | "statutory-bodies" | "overview";

const TABS: { key: ComplianceTab; label: string; icon: typeof Shield }[] = [
  { key: "paye", label: "PAYE Tax", icon: Landmark },
  { key: "pension", label: "Pension", icon: Building2 },
  { key: "statutory-bodies", label: "NHF / ITF / NSITF / NHIS", icon: Shield },
  { key: "overview", label: "Compliance Overview", icon: BarChart3 },
];

export default function StatutoryCompliancePage() {
  const [activeTab, setActiveTab] = useState<ComplianceTab>("overview");

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Statutory Compliance</h1>
          <p className="text-sm text-muted-foreground">Tax configuration, pension, and statutory deduction management</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => alert("Statutory compliance data exported successfully.")}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "paye" && <PAYETab />}
      {activeTab === "pension" && <PensionTab />}
      {activeTab === "statutory-bodies" && <StatutoryBodiesTab />}
      {activeTab === "overview" && <ComplianceOverviewTab />}
    </div>
  );
}

function PAYETab() {
  const config = MOCK_PAYE_CONFIG;
  const style = PAYE_CONFIG_STATUS_STYLES[config.status];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Landmark} label="Tax Bands" value={String(config.taxBands.length)} />
        <SummaryCard icon={Shield} label="CRA" value={formatNaira(config.consolidatedRelief)} />
        <SummaryCard icon={BarChart3} label="GI Relief" value={`${config.grossIncomeRelief}%`} />
        <SummaryCard icon={Clock} label="Effective From" value={config.effectiveFrom} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{config.name}</h3>
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>
            {style?.label}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-muted-foreground">Consolidated Relief:</span><br /><span className="font-medium">{formatNaira(config.consolidatedRelief)}</span></div>
          <div><span className="text-muted-foreground">GI Relief Rate:</span><br /><span className="font-medium">{config.grossIncomeRelief}%</span></div>
          <div><span className="text-muted-foreground">Minimum Tax Rate:</span><br /><span className="font-medium">{config.minimumTaxRate}%</span></div>
          <div><span className="text-muted-foreground">Effective From:</span><br /><span className="font-medium">{config.effectiveFrom}</span></div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <div className="p-3 border-b border-border bg-muted/30">
          <h3 className="font-medium text-sm">Tax Bands</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Band</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Income Range</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Rate</th>
            </tr>
          </thead>
          <tbody>
            {config.taxBands.map((band) => (
              <tr key={band.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium">{band.description}</td>
                <td className="p-3 text-muted-foreground">
                  {formatNaira(band.min)} — {band.max ? formatNaira(band.max) : "Above"}
                </td>
                <td className="p-3 font-medium">{band.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PensionTab() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Building2} label="PFAs Configured" value={String(MOCK_PENSION_CONFIGS.length)} />
        <SummaryCard icon={Shield} label="Employee Rate" value="8%" />
        <SummaryCard icon={Shield} label="Employer Rate" value="10%" />
        <SummaryCard icon={CheckCircle2} label="Active" value={String(MOCK_PENSION_CONFIGS.filter((p) => p.status === "active").length)} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">PFA</th>
              <th className="p-3 text-left font-medium text-muted-foreground">PFA Code</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Employee %</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Employer %</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Voluntary %</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Computation Base</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Effective From</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PENSION_CONFIGS.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium">{p.pfa}</td>
                <td className="p-3 text-muted-foreground">{p.pfaCode}</td>
                <td className="p-3">{p.employeeRate}%</td>
                <td className="p-3">{p.employerRate}%</td>
                <td className="p-3">{p.voluntaryRate}%</td>
                <td className="p-3 text-muted-foreground">{p.computationBase.join(" + ")}</td>
                <td className="p-3 text-muted-foreground">{p.effectiveFrom}</td>
                <td className="p-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", p.status === "active" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-700")}>
                    {p.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatutoryBodiesTab() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MOCK_STATUTORY_BODIES.map((body) => {
          const style = COMPLIANCE_STATUS_STYLES[body.complianceStatus];
          return (
            <div key={body.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{body.code}</span>
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>
                  {style?.label}
                </span>
              </div>
              <p className="text-sm font-medium mb-1">{body.name}</p>
              <p className="text-xs text-muted-foreground">Rate: {body.rate}% of {body.computationBase}</p>
              <p className="text-xs text-muted-foreground">Next Due: {body.nextDueDate}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Body</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Code</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Rate</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Employer %</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Employee %</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Frequency</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Next Due</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STATUTORY_BODIES.map((body) => {
              const style = COMPLIANCE_STATUS_STYLES[body.complianceStatus];
              return (
                <tr key={body.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{body.name}</td>
                  <td className="p-3 text-muted-foreground">{body.code}</td>
                  <td className="p-3">{body.rate}%</td>
                  <td className="p-3">{body.employerPortion}%</td>
                  <td className="p-3">{body.employeePortion}%</td>
                  <td className="p-3 text-muted-foreground capitalize">{body.remittanceFrequency}</td>
                  <td className="p-3 text-muted-foreground">{body.nextDueDate}</td>
                  <td className="p-3"><span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ComplianceOverviewTab() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_COMPLIANCE_OVERVIEW.filter((item) => {
      const matchesSearch = !q || item.body.toLowerCase().includes(q) || item.period.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalDue = MOCK_COMPLIANCE_OVERVIEW.reduce((s, i) => s + i.balance, 0);
  const overdueCount = MOCK_COMPLIANCE_OVERVIEW.filter((i) => i.status === "overdue").length;
  const paidCount = MOCK_COMPLIANCE_OVERVIEW.filter((i) => i.status === "paid").length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Landmark} label="Total Outstanding" value={formatNaira(totalDue)} />
        <SummaryCard icon={AlertTriangle} label="Overdue" value={String(overdueCount)} />
        <SummaryCard icon={CheckCircle2} label="Paid This Period" value={String(paidCount)} />
        <SummaryCard icon={Clock} label="Pending" value={String(MOCK_COMPLIANCE_OVERVIEW.filter((i) => i.status === "pending").length)} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Body</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Period</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Amount Due</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Amount Paid</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Balance</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Due Date</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Filed Date</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const style = PAYMENT_STATUS_STYLES[item.status];
              return (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{item.body}</td>
                  <td className="p-3 text-muted-foreground">{item.period}</td>
                  <td className="p-3">{formatNaira(item.amountDue)}</td>
                  <td className="p-3">{formatNaira(item.amountPaid)}</td>
                  <td className={cn("p-3 font-medium", item.balance > 0 ? "text-red-600" : "text-emerald-600")}>{formatNaira(item.balance)}</td>
                  <td className="p-3 text-muted-foreground">{item.dueDate}</td>
                  <td className="p-3 text-muted-foreground">{item.filedDate || "—"}</td>
                  <td className="p-3"><span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span></td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="font-medium">No records found</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof Shield; label: string; value: string }) {
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
