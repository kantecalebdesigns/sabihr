import {
  TrendingUp,
  Banknote,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_SALARY_BREAKDOWN,
  MOCK_PAYMENT_RECORDS,
  MOCK_SALARY_REVISIONS,
  PAYMENT_RECORD_STATUS_STYLES,
} from "@/lib/employee-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";

export default function EmployeeMobileSalaryPage() {
  const b = MOCK_SALARY_BREAKDOWN;

  return (
    <div className="max-w-[500px] mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Salary & Payments</h1>
        <p className="text-sm text-slate-500">Your salary details and payment history</p>
      </div>

      {/* Net Pay Card */}
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="text-sm text-emerald-700">Monthly Net Pay</p>
        <p className="text-3xl font-bold text-emerald-700">{formatNaira(b.netPay)}</p>
        <p className="text-xs text-slate-500 mt-1">{b.payGrade} - {b.salaryStructure}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-3 text-center">
          <Banknote className="w-5 h-5 mx-auto text-slate-500 mb-1" />
          <p className="text-xs text-slate-500">Gross</p>
          <p className="font-semibold">{formatNaira(b.grossPay)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-3 text-center">
          <TrendingUp className="w-5 h-5 mx-auto text-slate-500 mb-1" />
          <p className="text-xs text-slate-500">Deductions</p>
          <p className="font-semibold text-red-600">{formatNaira(b.totalDeductions)}</p>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4">
        <h3 className="text-sm font-medium mb-3">Earnings</h3>
        <div className="space-y-2">
          {[
            { name: "Basic Salary", amount: b.basicSalary },
            { name: "Housing", amount: b.housingAllowance },
            { name: "Transport", amount: b.transportAllowance },
            { name: "Meal", amount: b.mealAllowance },
            { name: "Other", amount: b.otherAllowances },
          ].map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-slate-500">{item.name}</span>
              <span className="font-medium">{formatNaira(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deductions Breakdown */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4">
        <h3 className="text-sm font-medium mb-3">Deductions</h3>
        <div className="space-y-2">
          {[
            { name: "PAYE Tax", amount: b.paye },
            { name: "Pension (8%)", amount: b.pension },
            { name: "NHF", amount: b.nhf },
            { name: "Health Insurance", amount: b.healthInsurance },
          ].map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-slate-500">{item.name}</span>
              <span className="font-medium text-red-600">-{formatNaira(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Salary Revisions */}
      {MOCK_SALARY_REVISIONS.length > 0 && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4">
          <h3 className="text-sm font-medium mb-3">Salary Revisions</h3>
          <div className="space-y-3">
            {MOCK_SALARY_REVISIONS.slice(0, 2).map((rev) => (
              <div key={rev.id} className="flex items-center justify-between py-2 border-b border-[#efefef] last:border-0">
                <div>
                  <p className="text-sm font-medium">{rev.effectiveDate}</p>
                  <p className="text-xs text-slate-500">{rev.reason}</p>
                </div>
                <span className={cn("text-sm font-semibold", rev.changePercent > 0 ? "text-emerald-600" : "text-red-600")}>
                  {rev.changePercent > 0 ? "+" : ""}{rev.changePercent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Payments */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="p-4 border-b border-[#efefef]">
          <h3 className="text-sm font-medium">Recent Payments</h3>
        </div>
        <div className="divide-y divide-[#efefef]">
          {MOCK_PAYMENT_RECORDS.slice(0, 4).map((p) => {
            const style = PAYMENT_RECORD_STATUS_STYLES[p.status];
            return (
              <div key={p.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", p.status === "completed" ? "bg-emerald-100" : "bg-amber-100")}>
                    {p.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.period}</p>
                    <p className="text-xs text-slate-500">{p.payDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatNaira(p.amount)}</p>
                  <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium", style?.bg, style?.color)}>{style?.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
