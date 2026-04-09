import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  DollarSign,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_WALLET_INFO } from "@/lib/employee-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";

export default function EmployeeMobileWalletPage() {
  const wallet = MOCK_WALLET_INFO;

  return (
    <div className="max-w-[500px] mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Wallet</h1>
        <p className="text-sm text-slate-500">Multi-currency wallet & conversions</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 text-center">
        <Wallet className="w-8 h-8 mx-auto text-blue-600 mb-2" />
        <p className="text-sm text-slate-500">Total Balance</p>
        <p className="text-3xl font-bold">{formatNaira(wallet.totalBalanceNGN)}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="flex-col h-auto py-3 gap-1">
          <DollarSign className="w-5 h-5" />
          <span className="text-xs">Fund</span>
        </Button>
        <Button variant="outline" className="flex-col h-auto py-3 gap-1">
          <Send className="w-5 h-5" />
          <span className="text-xs">Send</span>
        </Button>
        <Button variant="outline" className="flex-col h-auto py-3 gap-1">
          <RefreshCw className="w-5 h-5" />
          <span className="text-xs">Convert</span>
        </Button>
      </div>

      {/* Currency Wallets */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">My Currencies</h3>
        {wallet.wallets.map((w, i) => (
          <div key={i} className="rounded-xl border border-[#efefef] bg-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center text-blue-600 font-bold">
                {w.symbol}
              </div>
              <div>
                <p className="font-medium">{w.currency}</p>
                <p className="text-xs text-slate-500">~ {formatNaira(w.ngnEquivalent)}</p>
              </div>
            </div>
            <p className="text-lg font-semibold">{w.symbol}{w.balance.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="rounded-xl border border-[#efefef] bg-white">
        <div className="p-3 border-b border-[#efefef]">
          <h3 className="text-sm font-medium">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-[#efefef]">
          {wallet.recentTransactions.map((txn) => (
            <div key={txn.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                  txn.type === "credit" ? "bg-emerald-100" : txn.type === "debit" ? "bg-red-100" : "bg-blue-100"
                )}>
                  {txn.type === "credit" ? <ArrowDownRight className="w-4 h-4 text-emerald-600" /> :
                   txn.type === "debit" ? <ArrowUpRight className="w-4 h-4 text-red-600" /> :
                   <RefreshCw className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{txn.description}</p>
                  <p className="text-xs text-slate-500">{txn.date}</p>
                </div>
              </div>
              <p className={cn("text-sm font-semibold",
                txn.type === "credit" ? "text-emerald-600" : txn.type === "debit" ? "text-red-600" : "text-blue-600"
              )}>
                {txn.type === "credit" ? "+" : "-"}{txn.currency === "NGN" ? formatNaira(txn.amount) : `${txn.currency} ${txn.amount}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
