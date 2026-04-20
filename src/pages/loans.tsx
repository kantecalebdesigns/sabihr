import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Banknote,
  AlertCircle,
  CreditCard,
  Clock,
  Check,
  X,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_LOAN_PRODUCTS,
  MOCK_LOANS,
  MOCK_LOAN_APPLICATIONS,
  MOCK_SALARY_ADVANCES,
  LOAN_STATUS_STYLES,
  APPLICATION_STATUS_STYLES,
  ADVANCE_STATUS_STYLES,
  formatLoanCurrency,
} from "@/lib/loans-mock-data";
import type { ApplicationStatus, AdvanceStatus } from "@/lib/loans-mock-data";

type Tab = "products" | "active" | "applications" | "advances";

const TABS: { key: Tab; label: string }[] = [
  { key: "products", label: "Loan Products" },
  { key: "active", label: "Active Loans" },
  { key: "applications", label: "Applications" },
  { key: "advances", label: "Salary Advances" },
];

export default function LoansPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("active");
  const [search, setSearch] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [productSaved, setProductSaved] = useState(false);

  const handleSaveProduct = () => {
    setProductSaved(true);
    setTimeout(() => { setShowProductForm(false); setProductSaved(false); }, 1500);
  };

  const activeLoans = MOCK_LOANS.filter((l) => l.status === "active");
  const totalDisbursed = MOCK_LOANS.reduce((s, l) => s + l.principalAmount, 0);
  const pendingApps = MOCK_LOAN_APPLICATIONS.filter((a) => a.status === "pending").length;
  const defaulted = MOCK_LOANS.filter((l) => l.status === "defaulted").length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Loans & Advances</h1>
          <p className="text-sm text-slate-500">Manage employee loans, applications, and salary advances</p>
        </div>
        <Button size="sm" onClick={() => setShowProductForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Product
        </Button>
      </div>

      {/* Create Product Form */}
      {showProductForm && (
        productSaved ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-2 text-emerald-800 text-sm">
            <Check className="w-4 h-4" />
            Loan product created successfully
          </div>
        ) : (
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">New Loan Product</h3>
              <button onClick={() => setShowProductForm(false)} className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-[#f8fafc] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Product Name</label>
                <Input placeholder="e.g. Education Loan" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Interest Rate (%)</label>
                <Input placeholder="e.g. 12" type="number" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Max Amount (₦)</label>
                <Input placeholder="e.g. 3000000" type="number" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Max Tenure (months)</label>
                <Input placeholder="e.g. 24" type="number" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Description</label>
              <Input placeholder="Brief description of the loan product" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={handleSaveProduct}>Save Product</Button>
              <Button variant="outline" size="sm" onClick={() => setShowProductForm(false)}>Cancel</Button>
            </div>
          </div>
        )
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs font-medium">Active Loans</span>
          </div>
          <p className="text-xl font-semibold">{activeLoans.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">{formatLoanCurrency(activeLoans.reduce((s, l) => s + l.outstandingBalance, 0))} outstanding</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Banknote className="w-4 h-4" />
            <span className="text-xs font-medium">Total Disbursed</span>
          </div>
          <p className="text-xl font-semibold">{formatLoanCurrency(totalDisbursed)}</p>
          <p className="text-xs text-slate-500 mt-0.5">All time</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Pending Applications</span>
          </div>
          <p className="text-xl font-semibold">{pendingApps}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Default Rate</span>
          </div>
          <p className="text-xl font-semibold">{MOCK_LOANS.length > 0 ? Math.round((defaulted / MOCK_LOANS.length) * 100) : 0}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#efefef]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSearch(""); }}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              tab === t.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {t.label}
            {t.key === "applications" && pendingApps > 0 && (
              <span className="ml-1.5 text-xs text-amber-700">{pendingApps}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Loan Products Tab ── */}
      {tab === "products" && <ProductsTab />}

      {/* ── Active Loans Tab ── */}
      {tab === "active" && <ActiveLoansTab search={search} setSearch={setSearch} navigate={navigate} />}

      {/* ── Applications Tab ── */}
      {tab === "applications" && <ApplicationsTab search={search} setSearch={setSearch} />}

      {/* ── Salary Advances Tab ── */}
      {tab === "advances" && <AdvancesTab search={search} setSearch={setSearch} />}
    </div>
  );
}

/* ── Products ── */
function ProductsTab() {
  return (
    <>
      <p className="text-sm text-slate-500">Configure loan products available to employees.</p>
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Product</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Description</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Interest Rate</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Max Amount</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Max Tenure</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOAN_PRODUCTS.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-slate-500 text-xs max-w-[250px]">{p.description}</td>
                <td className="p-3 text-right font-medium">{p.interestRate}%</td>
                <td className="p-3 text-right">{formatLoanCurrency(p.maxAmount)}</td>
                <td className="p-3 text-right">{p.maxTenureMonths} months</td>
                <td className={cn("p-3 text-sm font-medium", p.status === "active" ? "text-emerald-700" : "text-gray-500")}>
                  {p.status === "active" ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Active Loans ── */
function ActiveLoansTab({ search, setSearch, navigate }: { search: string; setSearch: (v: string) => void; navigate: (path: string) => void }) {
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_LOANS.filter((l) =>
      !q || l.employeeName.toLowerCase().includes(q) || l.productName.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input placeholder="Search by employee or product..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Product</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Amount</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Balance</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Monthly</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Progress</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((loan) => {
              const style = LOAN_STATUS_STYLES[loan.status];
              const progress = loan.tenureMonths > 0 ? Math.round((loan.monthsPaid / loan.tenureMonths) * 100) : 0;
              return (
                <tr key={loan.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => navigate(`/loans/${loan.id}`)}>
                  <td className="p-3">
                    <p className="font-medium">{loan.employeeName}</p>
                    <p className="text-xs text-slate-500">{loan.department}</p>
                  </td>
                  <td className="p-3 text-slate-500">{loan.productName}</td>
                  <td className="p-3 text-right">{formatLoanCurrency(loan.principalAmount)}</td>
                  <td className="p-3 text-right font-medium">{formatLoanCurrency(loan.outstandingBalance)}</td>
                  <td className="p-3 text-right text-slate-500">{formatLoanCurrency(loan.monthlyDeduction)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 w-12">{loan.monthsPaid}/{loan.tenureMonths}</span>
                    </div>
                  </td>
                  <td className={cn("p-3 text-sm font-medium", style.color)}>{style.label}</td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/loans/${loan.id}`)} className="p-1.5 rounded-md text-slate-500 hover:bg-[#f8fafc] transition-colors" title="View details">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-12 text-center text-slate-500">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium text-slate-900">No loans found</p>
                <p className="text-xs mt-1">Try adjusting your search</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Applications ── */
function ApplicationsTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [applications, setApplications] = useState(MOCK_LOAN_APPLICATIONS);

  const updateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return applications.filter((a) =>
      !q || a.employeeName.toLowerCase().includes(q) || a.productName.toLowerCase().includes(q)
    );
  }, [search, applications]);

  return (
    <>
      <p className="text-sm text-slate-500">Review and approve employee loan applications.</p>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input placeholder="Search applications..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Product</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Amount</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Tenure</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Purpose</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Date</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => {
              const style = APPLICATION_STATUS_STYLES[app.status];
              return (
                <tr key={app.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="p-3">
                    <p className="font-medium">{app.employeeName}</p>
                    <p className="text-xs text-slate-500">{app.department}</p>
                  </td>
                  <td className="p-3 text-slate-500">{app.productName}</td>
                  <td className="p-3 text-right font-medium">{formatLoanCurrency(app.amount)}</td>
                  <td className="p-3 text-right">{app.tenureMonths} months</td>
                  <td className="p-3 text-slate-500 text-xs max-w-[200px] truncate" title={app.purpose}>{app.purpose}</td>
                  <td className="p-3 text-slate-500 text-xs">{new Date(app.appliedDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className={cn("p-3 text-sm font-medium", style.color)}>{style.label}</td>
                  <td className="p-3">
                    {app.status === "pending" && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateStatus(app.id, "approved")} className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve"><Check className="w-4 h-4" strokeWidth={2.5} /></button>
                        <button onClick={() => updateStatus(app.id, "rejected")} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" title="Reject"><X className="w-4 h-4" strokeWidth={2.5} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-12 text-center text-slate-500">
                <p className="text-sm font-medium text-slate-900">No applications found</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Salary Advances ── */
function AdvancesTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [advances, setAdvances] = useState(MOCK_SALARY_ADVANCES);

  const updateStatus = (id: string, status: AdvanceStatus) => {
    setAdvances((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return advances.filter((a) =>
      !q || a.employeeName.toLowerCase().includes(q)
    );
  }, [search, advances]);

  return (
    <>
      <p className="text-sm text-slate-500">Manage employee salary advance requests.</p>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input placeholder="Search advances..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Employee</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Amount</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Reason</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Request Date</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((adv) => {
              const style = ADVANCE_STATUS_STYLES[adv.status];
              return (
                <tr key={adv.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="p-3">
                    <p className="font-medium">{adv.employeeName}</p>
                    <p className="text-xs text-slate-500">{adv.department}</p>
                  </td>
                  <td className="p-3 text-right font-medium">{formatLoanCurrency(adv.amount)}</td>
                  <td className="p-3 text-slate-500 text-xs max-w-[200px] truncate" title={adv.reason}>{adv.reason}</td>
                  <td className="p-3 text-slate-500 text-xs">{new Date(adv.requestDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className={cn("p-3 text-sm font-medium", style.color)}>{style.label}</td>
                  <td className="p-3">
                    {adv.status === "pending" && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateStatus(adv.id, "approved")} className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve"><Check className="w-4 h-4" strokeWidth={2.5} /></button>
                        <button onClick={() => updateStatus(adv.id, "rejected" as AdvanceStatus)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" title="Reject"><X className="w-4 h-4" strokeWidth={2.5} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-slate-500">
                <p className="text-sm font-medium text-slate-900">No advance requests found</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
