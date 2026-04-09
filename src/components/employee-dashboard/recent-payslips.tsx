import { Link } from "react-router-dom";
import { ArrowRight, Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYSLIP_SUMMARY } from "@/lib/employee-mock-data";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function RecentPayslips() {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Payslips</h3>
        <Link
          to="/employee/payslips"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="space-y-3">
        {PAYSLIP_SUMMARY.recentPayslips.map((slip) => (
          <div
            key={slip.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-[#efefef] hover:bg-[#f8fafc] transition-colors"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#f0f4f8] flex items-center justify-center shrink-0">
              <Receipt className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{slip.month}</p>
              <p className="text-xs text-slate-500">
                Net: {formatCurrency(slip.netPay)}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Download className="w-3.5 h-3.5 text-slate-400" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
