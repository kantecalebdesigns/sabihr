import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Building2,
  FileText,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  Banknote,
  Hash,
  RotateCcw,
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
  MOCK_BANK_CONFIGS,
  MOCK_PAYMENT_FILES,
  MOCK_TRANSACTIONS,
  MOCK_RECONCILIATIONS,
  BANK_STATUS_STYLES,
  PAYMENT_FILE_STATUS_STYLES,
  TRANSACTION_STATUS_STYLES,
  RECON_STATUS_STYLES,
  type PaymentTransaction,
} from "@/lib/payment-disbursement-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type DisbursementTab = "bank-integration" | "payment-files" | "payment-tracking" | "reconciliation";

const TABS: { key: DisbursementTab; label: string; icon: typeof Building2 }[] = [
  { key: "bank-integration", label: "Bank Integration", icon: Building2 },
  { key: "payment-files", label: "Payment Files", icon: FileText },
  { key: "payment-tracking", label: "Payment Tracking", icon: ArrowRightLeft },
  { key: "reconciliation", label: "Reconciliation", icon: CheckCircle2 },
];

export default function PaymentDisbursementPage() {
  const [activeTab, setActiveTab] = useState<DisbursementTab>("bank-integration");
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payment Disbursement</h1>
          <p className="text-sm text-slate-500">
            Manage bank integrations, generate payment files, track transactions, and reconcile disbursements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#efefef] overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(""); }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "bank-integration" && <BankIntegrationTab search={search} setSearch={setSearch} />}
      {activeTab === "payment-files" && <PaymentFilesTab search={search} setSearch={setSearch} />}
      {activeTab === "payment-tracking" && <PaymentTrackingTab search={search} setSearch={setSearch} />}
      {activeTab === "reconciliation" && <ReconciliationTab search={search} setSearch={setSearch} />}
    </div>
  );
}

/* ── Bank Integration Tab ── */
function BankIntegrationTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_BANK_CONFIGS.filter(
      (b) => !q || b.bankName.toLowerCase().includes(q) || b.bankCode.includes(q)
    );
  }, [search]);

  const activeCount = MOCK_BANK_CONFIGS.filter((b) => b.status === "active").length;
  const apiCount = MOCK_BANK_CONFIGS.filter((b) => b.apiIntegrated).length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Building2} label="Total Banks" value={String(MOCK_BANK_CONFIGS.length)} />
        <SummaryCard icon={CheckCircle2} label="Active" value={String(activeCount)} />
        <SummaryCard icon={Wifi} label="API Integrated" value={String(apiCount)} />
        <SummaryCard icon={WifiOff} label="Manual Only" value={String(MOCK_BANK_CONFIGS.length - apiCount)} />
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search banks..." />

      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#efefef] bg-[#f8fafc]">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Bank Name</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Code</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Account</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Type</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Currency</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">API Status</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Last Sync</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const style = BANK_STATUS_STYLES[b.status];
              return (
                <tr key={b.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                  <td className="p-3 font-medium">
                    {b.bankName}
                    {b.isDefault && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#f8fafc] text-blue-600">
                        Default
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500">{b.bankCode}</td>
                  <td className="p-3 font-mono text-xs">{b.accountNumber}</td>
                  <td className="p-3 capitalize text-slate-500">{b.accountType}</td>
                  <td className="p-3 text-slate-500">{b.currency}</td>
                  <td className="p-3">
                    {b.apiIntegrated ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <Wifi className="w-3 h-3" /> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <WifiOff className="w-3 h-3" /> Not Connected
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500 text-xs">
                    {b.lastSyncDate
                      ? new Date(b.lastSyncDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "Never"}
                  </td>
                  <td className="p-3">
                    <StatusBadge style={style} />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <EmptyRow colSpan={8} />}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Payment Files Tab ── */
function PaymentFilesTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_PAYMENT_FILES.filter((f) => {
      const matchesSearch = !q || f.period.toLowerCase().includes(q) || f.bankName.toLowerCase().includes(q) || f.fileName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalAmount = MOCK_PAYMENT_FILES.reduce((s, f) => s + f.totalAmount, 0);
  const totalTxns = MOCK_PAYMENT_FILES.reduce((s, f) => s + f.transactionCount, 0);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={FileText} label="Total Files" value={String(MOCK_PAYMENT_FILES.length)} />
        <SummaryCard icon={Banknote} label="Total Amount" value={formatNaira(totalAmount)} />
        <SummaryCard icon={Hash} label="Total Transactions" value={String(totalTxns)} />
        <SummaryCard icon={CheckCircle2} label="Processed" value={String(MOCK_PAYMENT_FILES.filter((f) => f.status === "processed").length)} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search payment files..." />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="generated">Generated</SelectItem>
            <SelectItem value="downloaded">Downloaded</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#efefef] bg-[#f8fafc]">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Period</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Bank</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Format</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Amount</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Transactions</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">File Size</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => {
              const style = PAYMENT_FILE_STATUS_STYLES[f.status];
              return (
                <tr key={f.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                  <td className="p-3 font-medium">{f.period}</td>
                  <td className="p-3 text-slate-500">{f.bankName}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f8fafc] text-xs font-mono font-medium">
                      {f.format}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium">{formatNaira(f.totalAmount)}</td>
                  <td className="p-3 text-right text-slate-500">{f.transactionCount}</td>
                  <td className="p-3 text-slate-500">{f.fileSize}</td>
                  <td className="p-3">
                    <StatusBadge style={style} />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <EmptyRow colSpan={7} />}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Payment Tracking Tab ── */
function PaymentTrackingTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(MOCK_TRANSACTIONS);

  const handleRetry = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "processing" as const, failureReason: null } : t
      )
    );
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: "completed" as const, completedAt: new Date().toISOString(), failureReason: null }
            : t
        )
      );
    }, 1500);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter((t) => {
      const matchesSearch =
        !q ||
        t.employeeName.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.bankName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, transactions]);

  const completedAmount = transactions.filter((t) => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const failedCount = transactions.filter((t) => t.status === "failed").length;
  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={ArrowRightLeft} label="Total Transactions" value={String(MOCK_TRANSACTIONS.length)} />
        <SummaryCard icon={Banknote} label="Completed Amount" value={formatNaira(completedAmount)} />
        <SummaryCard icon={AlertTriangle} label="Failed" value={String(failedCount)} />
        <SummaryCard icon={RefreshCw} label="Pending" value={String(pendingCount)} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by employee, reference, bank..." />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="reversed">Reversed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#efefef] bg-[#f8fafc]">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Bank</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Amount</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Reference</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Failure Reason</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const style = TRANSACTION_STATUS_STYLES[t.status];
              return (
                <tr key={t.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                  <td className="p-3">
                    <div className="font-medium">{t.employeeName}</div>
                    <div className="text-xs text-slate-500">{t.accountNumber}</div>
                  </td>
                  <td className="p-3 text-slate-500">{t.bankName}</td>
                  <td className="p-3 text-right font-medium">{formatNaira(t.amount)}</td>
                  <td className="p-3 font-mono text-xs text-slate-500">{t.reference}</td>
                  <td className="p-3">
                    <StatusBadge style={style} />
                  </td>
                  <td className="p-3 text-xs text-red-600">
                    {t.failureReason ?? <span className="text-slate-500">—</span>}
                  </td>
                  <td className="p-3">
                    {t.status === "failed" && (
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleRetry(t.id)}>
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <EmptyRow colSpan={7} />}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Reconciliation Tab ── */
function ReconciliationTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_RECONCILIATIONS.filter((r) => {
      const matchesSearch = !q || r.period.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalExpected = MOCK_RECONCILIATIONS.reduce((s, r) => s + r.totalExpected, 0);
  const totalDisbursed = MOCK_RECONCILIATIONS.reduce((s, r) => s + r.totalDisbursed, 0);
  const totalVariance = MOCK_RECONCILIATIONS.reduce((s, r) => s + r.variance, 0);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Banknote} label="Total Expected" value={formatNaira(totalExpected)} />
        <SummaryCard icon={CheckCircle2} label="Total Disbursed" value={formatNaira(totalDisbursed)} />
        <SummaryCard icon={AlertTriangle} label="Total Variance" value={formatNaira(totalVariance)} />
        <SummaryCard icon={Hash} label="Records" value={String(MOCK_RECONCILIATIONS.length)} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search reconciliations..." />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="reconciled">Reconciled</SelectItem>
            <SelectItem value="discrepancy">Discrepancy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#efefef] bg-[#f8fafc]">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Period</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Expected</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Disbursed</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Failed</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Variance</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Matched</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Unmatched</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const style = RECON_STATUS_STYLES[r.status];
              return (
                <tr key={r.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                  <td className="p-3 font-medium">{r.period}</td>
                  <td className="p-3 text-right">{formatNaira(r.totalExpected)}</td>
                  <td className="p-3 text-right">{formatNaira(r.totalDisbursed)}</td>
                  <td className="p-3 text-right text-red-600">{formatNaira(r.totalFailed)}</td>
                  <td className="p-3 text-right font-medium">
                    <span className={r.variance > 0 ? "text-amber-600" : "text-emerald-600"}>
                      {formatNaira(r.variance)}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-500">{r.matchedCount}</td>
                  <td className="p-3 text-right text-slate-500">{r.unmatchedCount}</td>
                  <td className="p-3">
                    <StatusBadge style={style} />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <EmptyRow colSpan={8} />}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Shared Helpers ── */
function SummaryCard({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-4">
      <div className="flex items-center gap-2 text-slate-500 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}

function StatusBadge({ style }: { style: { label: string; bg: string; color: string } | undefined }) {
  if (!style) return null;
  return (
    <span className={cn("text-sm font-medium", style.color)}>
      {style.label}
    </span>
  );
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-12 text-center text-slate-500">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No items found</p>
        <p className="text-xs mt-1">Try adjusting your search or filters</p>
      </td>
    </tr>
  );
}
