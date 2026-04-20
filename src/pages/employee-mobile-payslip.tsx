import { useState } from "react";
import {
  FileText,
  Download,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_EMPLOYEE_PAYSLIPS,
  PAYSLIP_STATUS_STYLES,
} from "@/lib/employee-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";

export default function EmployeeMobilePayslipPage() {
  const [selectedPayslip, setSelectedPayslip] = useState<string | null>(null);
  const selected = MOCK_EMPLOYEE_PAYSLIPS.find((p) => p.id === selectedPayslip);

  if (selected) {
    const style = PAYSLIP_STATUS_STYLES[selected.status];
    return (
      <div className="max-w-[500px] mx-auto space-y-4">
        <button onClick={() => setSelectedPayslip(null)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />Back to Payslips
        </button>

        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4 text-center">
          <p className="text-sm text-slate-500">{selected.period}</p>
          <p className="text-3xl font-bold mt-1">{formatNaira(selected.netPay)}</p>
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-2", style?.bg, style?.color)}>{style?.label}</span>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] divide-y divide-[#efefef]">
          <div className="p-3">
            <p className="text-xs font-medium text-emerald-700 mb-2">Earnings</p>
            {selected.earnings.map((e, i) => (
              <div key={i} className="flex justify-between py-1.5 text-sm">
                <span className="text-slate-500">{e.name}</span>
                <span className="font-medium">{formatNaira(e.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 text-sm font-semibold border-t border-[#efefef] mt-1 pt-2">
              <span>Total Earnings</span>
              <span className="text-emerald-600">{formatNaira(selected.totalEarnings)}</span>
            </div>
          </div>

          <div className="p-3">
            <p className="text-xs font-medium text-red-700 mb-2">Deductions</p>
            {selected.deductions.map((d, i) => (
              <div key={i} className="flex justify-between py-1.5 text-sm">
                <span className="text-slate-500">{d.name}</span>
                <span className="font-medium text-red-600">-{formatNaira(d.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 text-sm font-semibold border-t border-[#efefef] mt-1 pt-2">
              <span>Total Deductions</span>
              <span className="text-red-600">-{formatNaira(selected.totalDeductions)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-xs text-emerald-700">Net Pay</p>
          <p className="text-2xl font-bold text-emerald-700">{formatNaira(selected.netPay)}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
          <div className="rounded-lg border border-[#efefef] bg-white p-2">
            <p>YTD Gross</p>
            <p className="font-medium text-slate-900">{formatNaira(selected.ytdGross)}</p>
          </div>
          <div className="rounded-lg border border-[#efefef] bg-white p-2">
            <p>YTD Net</p>
            <p className="font-medium text-slate-900">{formatNaira(selected.ytdNet)}</p>
          </div>
          <div className="rounded-lg border border-[#efefef] bg-white p-2">
            <p>YTD Tax</p>
            <p className="font-medium text-slate-900">{formatNaira(selected.ytdTax)}</p>
          </div>
        </div>

        <Button variant="outline" className="w-full"><Download className="w-4 h-4 mr-2" />Download Payslip</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[500px] mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Payslips</h1>
        <p className="text-sm text-slate-500">Tap to view and download</p>
      </div>

      {/* Latest Payslip Highlight */}
      {MOCK_EMPLOYEE_PAYSLIPS[0] && (
        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Latest Payslip</p>
              <p className="text-lg font-bold">{formatNaira(MOCK_EMPLOYEE_PAYSLIPS[0].netPay)}</p>
              <p className="text-xs text-slate-500">{MOCK_EMPLOYEE_PAYSLIPS[0].period}</p>
            </div>
            <Button size="sm" onClick={() => setSelectedPayslip(MOCK_EMPLOYEE_PAYSLIPS[0].id)}>
              View
            </Button>
          </div>
        </div>
      )}

      {/* Payslip List */}
      <div className="space-y-2">
        {MOCK_EMPLOYEE_PAYSLIPS.map((p) => {
          const style = PAYSLIP_STATUS_STYLES[p.status];
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPayslip(p.id)}
              className="w-full rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-4 flex items-center justify-between hover:bg-[#f8fafc] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f8fafc] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">{p.period}</p>
                  <p className="text-xs text-slate-500">{p.payDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatNaira(p.netPay)}</p>
                  <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium", style?.bg, style?.color)}>{style?.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
