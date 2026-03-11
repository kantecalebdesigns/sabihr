import { Link } from "react-router-dom";
import { ArrowRight, Download, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Payslips</CardTitle>
        <CardAction>
          <Link
            to="/employee/payslips"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {PAYSLIP_SUMMARY.recentPayslips.map((slip) => (
          <div
            key={slip.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Receipt className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{slip.month}</p>
              <p className="text-xs text-muted-foreground">
                Net: {formatCurrency(slip.netPay)}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Download className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
