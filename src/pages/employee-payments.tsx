import { useState } from "react";
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_PAYMENT_RECORDS,
  MOCK_BANK_DETAILS,
  PAYMENT_RECORD_STATUS_STYLES,
} from "@/lib/employee-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type Tab = "history" | "bank-details";

const TABS: { key: Tab; label: string; icon: typeof CreditCard }[] = [
  { key: "history", label: "Payment History", icon: CreditCard },
  { key: "bank-details", label: "Bank Details", icon: Building2 },
];

export default function EmployeePaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("history");

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Payments & Banking</h1>
        <p className="text-sm text-slate-500">View payment history and manage bank details</p>
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

      {activeTab === "history" && <PaymentHistoryTab />}
      {activeTab === "bank-details" && <BankDetailsTab />}
    </div>
  );
}

function PaymentHistoryTab() {
  const completedCount = MOCK_PAYMENT_RECORDS.filter((p) => p.status === "completed").length;
  const totalPaid = MOCK_PAYMENT_RECORDS.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><CheckCircle2 className="w-4 h-4" /><span className="text-xs font-medium">Completed Payments</span></div>
          <p className="text-xl font-semibold">{completedCount}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><CreditCard className="w-4 h-4" /><span className="text-xs font-medium">Total Received</span></div>
          <p className="text-xl font-semibold">{formatNaira(totalPaid)}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1"><Clock className="w-4 h-4" /><span className="text-xs font-medium">Pending</span></div>
          <p className="text-xl font-semibold">{MOCK_PAYMENT_RECORDS.filter((p) => p.status === "pending").length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#efefef] bg-[#f8fafc]">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Period</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Pay Date</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Amount</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Bank</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Reference</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PAYMENT_RECORDS.map((p) => {
              const style = PAYMENT_RECORD_STATUS_STYLES[p.status];
              return (
                <tr key={p.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                  <td className="p-3 font-medium">{p.period}</td>
                  <td className="p-3 text-slate-500">{p.payDate}</td>
                  <td className="p-3 text-right font-semibold">{formatNaira(p.amount)}</td>
                  <td className="p-3 text-slate-500">{p.bankName} ({p.accountNumber})</td>
                  <td className="p-3 font-mono text-xs text-slate-500">{p.reference}</td>
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

function BankDetailsTab() {
  const [bankDetails, setBankDetails] = useState(MOCK_BANK_DETAILS.map((b) => ({ ...b })));

  const handleSetPrimary = (id: string) => {
    setBankDetails((prev) =>
      prev.map((b) => ({ ...b, isPrimary: b.id === id }))
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{bankDetails.length} bank accounts on file</p>
        <Button size="sm" onClick={() => alert("Add bank account form would open here.")}><Plus className="w-4 h-4 mr-2" />Add Bank Account</Button>
      </div>

      <div className="space-y-4">
        {bankDetails.map((bank) => (
          <div key={bank.id} className="rounded-xl border border-[#efefef] bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f8fafc] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{bank.bankName}</h4>
                  <p className="text-xs text-slate-500">{bank.accountType.charAt(0).toUpperCase() + bank.accountType.slice(1)} Account</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {bank.isPrimary && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-50 border-blue-200 text-blue-700">Primary</span>}
                {bank.verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-700"><CheckCircle2 className="w-3 h-3" />Verified</span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-50 border-amber-200 text-amber-700"><AlertCircle className="w-3 h-3" />Unverified</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div><span className="text-slate-500">Account Name</span><br /><span className="font-medium">{bank.accountName}</span></div>
              <div><span className="text-slate-500">Account Number</span><br /><span className="font-medium font-mono">{bank.accountNumber}</span></div>
              <div><span className="text-slate-500">Added</span><br /><span className="font-medium">{bank.addedDate}</span></div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-[#efefef]">
              {!bank.isPrimary && <Button variant="outline" size="sm" className="text-xs" onClick={() => handleSetPrimary(bank.id)}>Set as Primary</Button>}
              <Button variant="outline" size="sm" className="text-xs" onClick={() => alert("Editing bank account: " + bank.bankName)}>Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

