import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  MOCK_EMPLOYEE_PAYSLIPS,
  MOCK_SALARY_BREAKDOWN,
  MOCK_SALARY_REVISIONS,
  PAYSLIP_STATUS_STYLES,
} from "@/lib/employee-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type Tab = "current" | "history" | "breakdown" | "revisions";

const TABS: { key: Tab; label: string; icon: typeof FileText }[] = [
  { key: "current", label: "Current Payslip", icon: FileText },
  { key: "history", label: "Payslip History", icon: Calendar },
  { key: "breakdown", label: "Salary Breakdown", icon: DollarSign },
  { key: "revisions", label: "Revision History", icon: TrendingUp },
];

export default function EmployeePayslipsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("current");

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Payslips & Salary</h1>
        <p className="text-sm text-slate-500">View your payslips, salary breakdown, and revision history</p>
      </div>

      <div className="flex items-center gap-1 border-b border-[#efefef] overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap", activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900")}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "current" && <CurrentPayslip />}
      {activeTab === "history" && <PayslipHistory />}
      {activeTab === "breakdown" && <SalaryBreakdown />}
      {activeTab === "revisions" && <RevisionHistory />}
    </div>
  );
}

function CurrentPayslip() {
  const payslip = MOCK_EMPLOYEE_PAYSLIPS[0];
  const style = PAYSLIP_STATUS_STYLES[payslip.status];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Banknote className="w-4 h-4" /><span className="text-xs font-medium">Gross Pay</span></div>
          <p className="text-xl font-semibold">{formatNaira(payslip.grossPay)}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><DollarSign className="w-4 h-4" /><span className="text-xs font-medium">Net Pay</span></div>
          <p className="text-xl font-semibold">{formatNaira(payslip.netPay)}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><TrendingUp className="w-4 h-4" /><span className="text-xs font-medium">Deductions</span></div>
          <p className="text-xl font-semibold text-red-600">{formatNaira(payslip.totalDeductions)}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Calendar className="w-4 h-4" /><span className="text-xs font-medium">Pay Date</span></div>
          <p className="text-xl font-semibold">{payslip.payDate}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white">
        <div className="p-4 border-b border-[#efefef] flex items-center justify-between">
          <div>
            <h3 className="font-medium">{payslip.period} Payslip</h3>
            <p className="text-xs text-slate-500">Pay date: {payslip.payDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span>
            <Button variant="outline" size="sm" onClick={() => alert("Downloading payslip for " + payslip.period + "...")}><Download className="w-4 h-4 mr-1" />Download</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#efefef]">
          <div className="p-4">
            <h4 className="text-sm font-medium text-slate-900 mb-3">Earnings</h4>
            <div className="space-y-2">
              {payslip.earnings.map((e, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-500">{e.name}</span>
                  <span className="font-medium">{formatNaira(e.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-[#efefef] font-semibold">
                <span>Total Earnings</span>
                <span>{formatNaira(payslip.totalEarnings)}</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h4 className="text-sm font-medium text-red-700 mb-3">Deductions</h4>
            <div className="space-y-2">
              {payslip.deductions.map((d, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-500">{d.name}</span>
                  <span className="font-medium text-red-600">-{formatNaira(d.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-[#efefef] font-semibold">
                <span>Total Deductions</span>
                <span className="text-red-600">-{formatNaira(payslip.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#efefef] bg-[#f8fafc]">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Net Pay</span>
            <span className="text-2xl font-bold text-slate-900">{formatNaira(payslip.netPay)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>YTD Gross: {formatNaira(payslip.ytdGross)}</span>
            <span>YTD Net: {formatNaira(payslip.ytdNet)}</span>
            <span>YTD Tax: {formatNaira(payslip.ytdTax)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function PayslipHistory() {
  const [yearFilter, setYearFilter] = useState("all");

  const filtered = MOCK_EMPLOYEE_PAYSLIPS.filter((p) => {
    return yearFilter === "all" || String(p.year) === yearFilter;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{MOCK_EMPLOYEE_PAYSLIPS.length} payslips available</p>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Year" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const style = PAYSLIP_STATUS_STYLES[p.status];
          return (
            <div key={p.id} className="rounded-xl border border-[#efefef] bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f8fafc] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{p.period}</h4>
                    <p className="text-xs text-slate-500">Paid: {p.payDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold">{formatNaira(p.netPay)}</p>
                    <p className="text-xs text-slate-500">Gross: {formatNaira(p.grossPay)}</p>
                  </div>
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", style?.bg, style?.color)}>{style?.label}</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => alert("Viewing payslip details for " + p.period)}><Eye className="w-3.5 h-3.5 mr-1" />View</Button>
                    <Button variant="outline" size="sm" className="h-8" onClick={() => alert("Downloading payslip for " + p.period + "...")}><Download className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SalaryBreakdown() {
  const b = MOCK_SALARY_BREAKDOWN;
  const earningsItems = [
    { name: "Basic Salary", amount: b.basicSalary },
    { name: "Housing Allowance", amount: b.housingAllowance },
    { name: "Transport Allowance", amount: b.transportAllowance },
    { name: "Meal Allowance", amount: b.mealAllowance },
    { name: "Other Allowances", amount: b.otherAllowances },
  ];
  const deductionItems = [
    { name: "PAYE Tax", amount: b.paye },
    { name: "Pension (8%)", amount: b.pension },
    { name: "NHF (2.5%)", amount: b.nhf },
    { name: "Health Insurance", amount: b.healthInsurance },
  ];

  return (
    <>
      <div className="rounded-xl border border-[#efefef] bg-white p-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><span className="text-slate-500">Pay Grade:</span><br /><span className="font-medium">{b.payGrade}</span></div>
          <div><span className="text-slate-500">Structure:</span><br /><span className="font-medium">{b.salaryStructure}</span></div>
          <div><span className="text-slate-500">Effective:</span><br /><span className="font-medium">{b.effectiveDate}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Earnings Breakdown</h3>
          <div className="space-y-3">
            {earningsItems.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">{item.name}</span>
                  <span className="font-medium">{formatNaira(item.amount)}</span>
                </div>
                <div className="w-full bg-[#f8fafc] rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(item.amount / b.grossPay) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-3 border-t border-[#efefef] font-semibold">
              <span>Gross Pay</span>
              <span>{formatNaira(b.grossPay)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h3 className="text-sm font-medium text-red-700 mb-4">Deductions Breakdown</h3>
          <div className="space-y-3">
            {deductionItems.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">{item.name}</span>
                  <span className="font-medium text-red-600">-{formatNaira(item.amount)}</span>
                </div>
                <div className="w-full bg-[#f8fafc] rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(item.amount / b.totalDeductions) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-3 border-t border-[#efefef] font-semibold">
              <span>Total Deductions</span>
              <span className="text-red-600">-{formatNaira(b.totalDeductions)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white p-5 text-center">
        <p className="text-sm text-slate-500 mb-1">Monthly Net Pay</p>
        <p className="text-3xl font-bold text-slate-900">{formatNaira(b.netPay)}</p>
      </div>
    </>
  );
}

function RevisionHistory() {
  return (
    <>
      <p className="text-sm text-slate-500">{MOCK_SALARY_REVISIONS.length} salary revisions on record</p>

      <div className="space-y-4">
        {MOCK_SALARY_REVISIONS.map((rev) => (
          <div key={rev.id} className="rounded-xl border border-[#efefef] bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">Effective: {rev.effectiveDate}</h4>
                <p className="text-xs text-slate-500">{rev.reason}</p>
              </div>
              <div className="flex items-center gap-1">
                {rev.changePercent > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={cn("text-sm font-semibold", rev.changePercent > 0 ? "text-emerald-600" : "text-red-600")}>
                  {rev.changePercent > 0 ? "+" : ""}{rev.changePercent}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><span className="text-slate-500">Previous Gross</span><br /><span className="font-medium">{formatNaira(rev.previousGross)}</span></div>
              <div><span className="text-slate-500">New Gross</span><br /><span className="font-medium">{formatNaira(rev.newGross)}</span></div>
              <div><span className="text-slate-500">Previous Net</span><br /><span className="font-medium">{formatNaira(rev.previousNet)}</span></div>
              <div><span className="text-slate-500">New Net</span><br /><span className="font-medium">{formatNaira(rev.newNet)}</span></div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Approved by: {rev.approvedBy}</p>
          </div>
        ))}
      </div>
    </>
  );
}
