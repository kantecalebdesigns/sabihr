import { useState } from "react";
import {
  FileText,
  Download,
  Landmark,
  Building2,
  Shield,
  DollarSign,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_TAX_SUMMARY,
  MOCK_PENSION_SUMMARY,
  MOCK_STATUTORY_DEDUCTIONS,
} from "@/lib/employee-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type Tab = "tax" | "pension";

const TABS: { key: Tab; label: string; icon: typeof Landmark }[] = [
  { key: "tax", label: "Tax Summary & Certificate", icon: Landmark },
  { key: "pension", label: "Pension & Deductions", icon: Building2 },
];

export default function EmployeeTaxPage() {
  const [activeTab, setActiveTab] = useState<Tab>("tax");

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Tax & Statutory Info</h1>
        <p className="text-sm text-muted-foreground">View your tax summary, pension contributions, and statutory deductions</p>
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap", activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "tax" && <TaxSummaryTab />}
      {activeTab === "pension" && <PensionTab />}
    </div>
  );
}

function TaxSummaryTab() {
  const tax = MOCK_TAX_SUMMARY;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><DollarSign className="w-4 h-4" /><span className="text-xs font-medium">Taxable Income (YTD)</span></div>
          <p className="text-xl font-semibold">{formatNaira(tax.totalTaxableIncome)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Landmark className="w-4 h-4" /><span className="text-xs font-medium">Tax Paid (YTD)</span></div>
          <p className="text-xl font-semibold text-red-600">{formatNaira(tax.totalTaxPaid)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Percent className="w-4 h-4" /><span className="text-xs font-medium">Effective Tax Rate</span></div>
          <p className="text-xl font-semibold">{tax.effectiveTaxRate}%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><FileText className="w-4 h-4" /><span className="text-xs font-medium">Tax Certificate</span></div>
          <p className="text-sm font-medium">{tax.certificateAvailable ? "Available" : "Not yet available"}</p>
          <p className="text-[10px] text-muted-foreground">Generated after year-end</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-medium mb-4">Tax Relief Summary ({tax.year})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-muted-foreground">Consolidated Relief</span><br /><span className="font-medium">{formatNaira(tax.consolidatedRelief)}</span></div>
          <div><span className="text-muted-foreground">Pension Relief</span><br /><span className="font-medium">{formatNaira(tax.pensionRelief)}</span></div>
          <div><span className="text-muted-foreground">NHF Relief</span><br /><span className="font-medium">{formatNaira(tax.nhfRelief)}</span></div>
          <div><span className="text-muted-foreground">Other Relief</span><br /><span className="font-medium">{formatNaira(tax.otherRelief)}</span></div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <div className="p-3 border-b border-border bg-muted/30">
          <h3 className="font-medium text-sm">Monthly Tax Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Month</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Taxable Income</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Tax Paid</th>
            </tr>
          </thead>
          <tbody>
            {tax.monthlyBreakdown.map((m, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium">{m.month}</td>
                <td className="p-3 text-right">{formatNaira(m.taxableIncome)}</td>
                <td className="p-3 text-right text-red-600">-{formatNaira(m.taxPaid)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tax.certificateAvailable && (
        <Button variant="outline" onClick={() => alert("Downloading tax certificate for " + tax.year)}><Download className="w-4 h-4 mr-2" />Download Tax Certificate</Button>
      )}
    </>
  );
}

function PensionTab() {
  const pen = MOCK_PENSION_SUMMARY;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Building2 className="w-4 h-4" /><span className="text-xs font-medium">PFA</span></div>
          <p className="text-sm font-semibold">{pen.pfa}</p>
          <p className="text-[10px] text-muted-foreground">RSA: {pen.rsaNumber}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><DollarSign className="w-4 h-4" /><span className="text-xs font-medium">Total Balance</span></div>
          <p className="text-xl font-semibold">{formatNaira(pen.totalBalance)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Shield className="w-4 h-4" /><span className="text-xs font-medium">YTD Employee</span></div>
          <p className="text-xl font-semibold">{formatNaira(pen.ytdEmployee)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Shield className="w-4 h-4" /><span className="text-xs font-medium">YTD Employer</span></div>
          <p className="text-xl font-semibold">{formatNaira(pen.ytdEmployer)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <div className="p-3 border-b border-border bg-muted/30">
          <h3 className="font-medium text-sm">Monthly Pension Contributions</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Month</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Employee (8%)</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Employer (10%)</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {pen.monthlyBreakdown.map((m, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium">{m.month}</td>
                <td className="p-3 text-right">{formatNaira(m.employee)}</td>
                <td className="p-3 text-right">{formatNaira(m.employer)}</td>
                <td className="p-3 text-right font-medium">{formatNaira(m.employee + m.employer)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-medium mb-4">Other Statutory Deductions</h3>
        <div className="space-y-3">
          {MOCK_STATUTORY_DEDUCTIONS.map((d, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">Rate: {d.rate} | Code: {d.code}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatNaira(d.monthlyAmount)}/mo</p>
                <p className="text-xs text-muted-foreground">YTD: {formatNaira(d.ytdAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
