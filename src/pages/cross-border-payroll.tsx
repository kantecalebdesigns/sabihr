import { useState, useMemo } from "react";
import {
  Search,
  Globe,
  ArrowRightLeft,
  ShieldCheck,
  Wallet,
  Download,
  RefreshCw,
  DollarSign,
  Lock,
  Unlock,
  CheckCircle,
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
  MOCK_CURRENCIES,
  MOCK_INTERNATIONAL_PAYMENTS,
  MOCK_COUNTRY_TAX_CONFIGS,
  MOCK_EMPLOYEE_WALLETS_ADMIN,
  CURRENCY_STATUS_STYLES,
  INTL_PAYMENT_STATUS_STYLES,
  WALLET_STATUS_STYLES,
} from "@/lib/cross-border-payroll-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type TabKey = "currencies" | "payments" | "tax" | "wallets";

const TABS: { key: TabKey; label: string; icon: typeof Globe }[] = [
  { key: "currencies", label: "Multi-Currency Config", icon: DollarSign },
  { key: "payments", label: "International Payments", icon: ArrowRightLeft },
  { key: "tax", label: "Tax & Compliance", icon: ShieldCheck },
  { key: "wallets", label: "Employee Wallets", icon: Wallet },
];

export default function CrossBorderPayrollPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("currencies");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [wallets, setWallets] = useState(MOCK_EMPLOYEE_WALLETS_ADMIN);

  // Summaries
  const activeCurrencies = MOCK_CURRENCIES.filter((c) => c.status === "active").length;
  const pendingPayments = MOCK_INTERNATIONAL_PAYMENTS.filter((p) => p.status === "pending" || p.status === "processing").length;
  const totalPaymentVolume = MOCK_INTERNATIONAL_PAYMENTS.reduce((sum, p) => sum + p.baseAmount, 0);
  const countriesConfigured = MOCK_COUNTRY_TAX_CONFIGS.filter((c) => c.status === "active").length;
  const totalWalletValue = wallets.reduce((sum, w) => sum + w.totalValueNGN, 0);

  // Filtered data
  const filteredCurrencies = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_CURRENCIES.filter((c) => {
      const matchesSearch = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const filteredPayments = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_INTERNATIONAL_PAYMENTS.filter((p) => {
      const matchesSearch =
        !q ||
        p.employeeName.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.currency.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const filteredTaxConfigs = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_COUNTRY_TAX_CONFIGS.filter((c) => {
      const matchesSearch = !q || c.country.toLowerCase().includes(q) || c.taxSystem.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const filteredWallets = useMemo(() => {
    const q = search.toLowerCase();
    return wallets.filter((w) => {
      const matchesSearch =
        !q ||
        w.employeeName.toLowerCase().includes(q) ||
        w.department.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, wallets]);

  // Reset filters when switching tabs
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Cross-Border Payroll
          </h1>
          <p className="text-sm text-slate-500">
            Manage multi-currency payroll, international payments, tax compliance, and employee wallets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => {}}>
            <Globe className="w-4 h-4 mr-2" />
            Add Currency
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium">Active Currencies</span>
          </div>
          <p className="text-xl font-semibold">{activeCurrencies}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {MOCK_CURRENCIES.length} total configured
          </p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <ArrowRightLeft className="w-4 h-4" />
            <span className="text-xs font-medium">Pending Payments</span>
          </div>
          <p className="text-xl font-semibold">{pendingPayments}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {formatNaira(totalPaymentVolume)} total volume
          </p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-medium">Countries Configured</span>
          </div>
          <p className="text-xl font-semibold">{countriesConfigured}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Tax & compliance active
          </p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-medium">Total Wallet Value</span>
          </div>
          <p className="text-xl font-semibold">{formatNaira(totalWalletValue)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {wallets.length} employee wallets
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#efefef] overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {activeTab === "currencies" && (
              <>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </>
            )}
            {activeTab === "payments" && (
              <>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </>
            )}
            {activeTab === "tax" && (
              <>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </>
            )}
            {activeTab === "wallets" && (
              <>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="frozen">Frozen</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Tab 1: Multi-Currency Config */}
      {activeTab === "currencies" && (
        <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Code</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Currency Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Symbol</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Exchange Rate (NGN)</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500">Base</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500">Auto-Update</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Last Updated</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCurrencies.map((cur) => {
                const style = CURRENCY_STATUS_STYLES[cur.status];
                return (
                  <tr key={cur.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3 font-mono font-medium">{cur.code}</td>
                    <td className="px-4 py-3">{cur.name}</td>
                    <td className="px-4 py-3">{cur.symbol}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {cur.baseCurrency ? "1 (base)" : cur.exchangeRate.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {cur.baseCurrency ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {cur.autoUpdate ? (
                        <RefreshCw className="w-3.5 h-3.5 text-blue-600 mx-auto" />
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{cur.lastUpdated}</td>
                    <td className={cn("px-4 py-3 text-sm font-medium", style.color)}>
                      {style.label}
                    </td>
                  </tr>
                );
              })}
              {filteredCurrencies.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No currencies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: International Payments */}
      {activeTab === "payments" && (
        <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Country</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Currency</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Local Amount</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Base Amount (NGN)</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Rate</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Bank / SWIFT</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Method</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Fees (NGN)</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((pmt) => {
                const style = INTL_PAYMENT_STATUS_STYLES[pmt.status];
                const methodLabel =
                  pmt.paymentMethod === "swift"
                    ? "SWIFT"
                    : pmt.paymentMethod === "local-transfer"
                    ? "Local Transfer"
                    : "Wallet";
                return (
                  <tr key={pmt.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-slate-500">{pmt.employeeName}</td>
                    <td className="px-4 py-3">{pmt.country}</td>
                    <td className="px-4 py-3 font-mono">{pmt.currency}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {pmt.localAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatNaira(pmt.baseAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{pmt.exchangeRate.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs">{pmt.bankName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{pmt.swiftCode}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">
                      {methodLabel}
                    </td>
                    <td className={cn("px-4 py-3 text-sm font-medium", style.color)}>
                      {style.label}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{formatNaira(pmt.fees)}</td>
                  </tr>
                );
              })}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Tax & Compliance */}
      {activeTab === "tax" && (
        <div className="grid gap-4">
          {filteredTaxConfigs.map((cfg) => (
            <div key={cfg.id} className="rounded-xl border border-[#efefef] bg-white p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f8fafc] flex items-center justify-center text-sm font-bold">
                    {cfg.countryCode}
                  </div>
                  <div>
                    <h3 className="font-semibold">{cfg.country}</h3>
                    <p className="text-xs text-slate-500">{cfg.taxSystem} &middot; {cfg.currency} &middot; {cfg.employeeCount} employees</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    cfg.status === "active"
                      ? "text-emerald-700"
                      : "text-amber-700"
                  )}
                >
                  {cfg.status === "active" ? "Active" : "Draft"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Employee Tax</p>
                  <p className="font-medium">{cfg.employeeTaxRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Employer Tax</p>
                  <p className="font-medium">{cfg.employerTaxRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Social Security</p>
                  <p className="font-medium">{cfg.socialSecurity}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Health Insurance</p>
                  <p className="font-medium">{cfg.healthInsurance}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Pension</p>
                  <p className="font-medium">{cfg.pensionRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Employee Burden</p>
                  <p className="font-semibold text-orange-600">{cfg.totalEmployeeBurden}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Employer Burden</p>
                  <p className="font-semibold text-red-600">{cfg.totalEmployerBurden}%</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 mt-3">
                Effective from {cfg.effectiveFrom}
              </p>
            </div>
          ))}
          {filteredTaxConfigs.length === 0 && (
            <div className="rounded-xl border border-[#efefef] bg-white p-8 text-center text-slate-500">
              No tax configurations found.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Employee Wallets */}
      {activeTab === "wallets" && (
        <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Department</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Wallet Balances</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Total (NGN)</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Last Transaction</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWallets.map((wallet) => {
                const style = WALLET_STATUS_STYLES[wallet.status];
                return (
                  <tr key={wallet.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{wallet.employeeName}</div>
                      <div className="text-[10px] text-slate-500">{wallet.employeeId}</div>
                    </td>
                    <td className="px-4 py-3">{wallet.department}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {wallet.wallets.map((wb) => (
                          <span
                            key={wb.currency}
                            className="text-sm font-medium text-blue-700"
                          >
                            {wb.currency}: {wb.balance.toLocaleString()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium">
                      {formatNaira(wallet.totalValueNGN)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{wallet.lastTransaction}</td>
                    <td className={cn("px-4 py-3 text-sm font-medium", style.color)}>
                      {style.label}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {wallet.status === "active" ? (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setWallets((prev) => prev.map((w) => w.id === wallet.id ? { ...w, status: "frozen" as const } : w))}>
                          <Lock className="w-3 h-3 mr-1" />
                          Freeze
                        </Button>
                      ) : wallet.status === "frozen" ? (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setWallets((prev) => prev.map((w) => w.id === wallet.id ? { ...w, status: "active" as const } : w))}>
                          <Unlock className="w-3 h-3 mr-1" />
                          Unfreeze
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredWallets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No wallets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
