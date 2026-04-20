import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus,
  Send,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_WALLET_INFO } from "@/lib/employee-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type Tab = "dashboard" | "funding";

const TABS: { key: Tab; label: string; icon: typeof Wallet }[] = [
  { key: "dashboard", label: "Wallet Dashboard", icon: Wallet },
  { key: "funding", label: "Funding & Spending", icon: Send },
];

export default function EmployeeWalletPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Wallet</h1>
        <p className="text-sm text-slate-500">Manage your multi-currency wallet, fund and spend</p>
      </div>

      <div className="flex items-center gap-1 border-b border-[#efefef]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap", activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900")}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "dashboard" && <WalletDashboard />}
      {activeTab === "funding" && <FundingTab />}
    </div>
  );
}

function WalletDashboard() {
  const wallet = MOCK_WALLET_INFO;

  return (
    <>
      {/* Total Balance Card */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-sm text-slate-500 mb-1">Total Wallet Balance</p>
        <p className="text-3xl font-bold">{formatNaira(wallet.totalBalanceNGN)}</p>
        <p className="text-xs text-slate-500 mt-1">{wallet.wallets.length} currencies</p>
      </div>

      {/* Currency Wallets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wallet.wallets.map((w, i) => (
          <div key={i} className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-blue-600 text-sm font-bold">
                  {w.symbol}
                </div>
                <span className="font-medium">{w.currency}</span>
              </div>
            </div>
            <p className="text-2xl font-semibold">{w.symbol}{w.balance.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">~ {formatNaira(w.ngnEquivalent)}</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => alert("Fund wallet would open here.")}><Plus className="w-3.5 h-3.5 mr-1" />Fund</Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => alert("Send funds would open here.")}><Send className="w-3.5 h-3.5 mr-1" />Send</Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => alert("Currency conversion would open here.")}><RefreshCw className="w-3.5 h-3.5 mr-1" />Convert</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="p-4 border-b border-[#efefef]">
          <h3 className="font-medium">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-[#efefef]">
          {wallet.recentTransactions.map((txn) => (
            <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-[#f8fafc] transition-colors">
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
              <div className="text-right">
                <p className={cn("text-sm font-semibold",
                  txn.type === "credit" ? "text-emerald-600" : txn.type === "debit" ? "text-red-600" : "text-blue-600"
                )}>
                  {txn.type === "credit" ? "+" : "-"}{txn.currency === "NGN" ? formatNaira(txn.amount) : `${txn.currency} ${txn.amount.toLocaleString()}`}
                </p>
                <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium", txn.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function FundingTab() {
  const fundingMethods = [
    { icon: DollarSign, title: "Fund from Salary", description: "Set up automatic top-up from your salary", action: "Set Up" },
    { icon: TrendingUp, title: "Bank Transfer", description: "Transfer funds from your bank account", action: "Fund" },
    { icon: RefreshCw, title: "Currency Conversion", description: "Convert between wallet currencies", action: "Convert" },
  ];

  const spendingOptions = [
    { icon: Send, title: "Withdraw to Bank", description: "Send wallet funds to your bank account", action: "Withdraw" },
    { icon: ArrowUpRight, title: "Send to Colleague", description: "Transfer to another employee's wallet", action: "Send" },
  ];

  return (
    <>
      <div className="space-y-4">
        <h3 className="font-medium">Fund Your Wallet</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fundingMethods.map((method, i) => {
            const Icon = method.icon;
            return (
              <div key={i} className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-1">{method.title}</h4>
                <p className="text-xs text-slate-500 mb-3">{method.description}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => alert(method.title + " would open here.")}>{method.action}</Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Spend & Withdraw</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {spendingOptions.map((option, i) => {
            const Icon = option.icon;
            return (
              <div key={i} className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-1">{option.title}</h4>
                <p className="text-xs text-slate-500 mb-3">{option.description}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => alert(option.title + " would open here.")}>{option.action}</Button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

