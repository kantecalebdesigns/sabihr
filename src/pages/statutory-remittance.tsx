import { useState, useMemo } from "react";
import {
  Search,
  Download,
  FileText,
  Calendar,
  Landmark,
  Building2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
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
  MOCK_PAYE_REMITTANCES,
  MOCK_PENSION_REMITTANCES,
  MOCK_OTHER_REMITTANCES,
  MOCK_REMITTANCE_CALENDAR,
  REMITTANCE_STATUS_STYLES,
  CALENDAR_STATUS_STYLES,
} from "@/lib/statutory-remittance-data";
import type { RemittanceRecord } from "@/lib/statutory-remittance-data";
import { formatNaira } from "@/lib/payroll-mock-data";

type TabKey = "paye" | "pension" | "other" | "calendar";

const TABS: { key: TabKey; label: string; icon: typeof FileText }[] = [
  { key: "paye", label: "PAYE Filing", icon: Landmark },
  { key: "pension", label: "Pension Remittance", icon: Building2 },
  { key: "other", label: "NHF/NHIS/ITF/NSITF", icon: ShieldCheck },
  { key: "calendar", label: "Remittance Calendar", icon: Calendar },
];

function StatusBadge({ status, styles }: { status: string; styles: Record<string, { label: string; bg: string; color: string }> }) {
  const s = styles[status] ?? { label: status, bg: "bg-gray-50 border-gray-200", color: "text-gray-700" };
  return (
    <span className={cn("text-sm font-medium", s.color)}>
      {s.label}
    </span>
  );
}

function SummaryCards({ records, label }: { records: RemittanceRecord[]; label: string }) {
  const totalDue = records.reduce((s, r) => s + r.amountDue, 0);
  const totalPaid = records.reduce((s, r) => s + r.amountPaid, 0);
  const totalBalance = records.reduce((s, r) => s + r.balance, 0);
  const pendingCount = records.filter((r) => r.status === "pending" || r.status === "overdue").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="rounded-xl border border-[#efefef] bg-white p-4">
        <div className="flex items-center gap-2 text-slate-500 mb-1">
          <DollarSign className="w-4 h-4" />
          <span className="text-xs font-medium">Total Due</span>
        </div>
        <p className="text-xl font-semibold">{formatNaira(totalDue)}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
      </div>
      <div className="rounded-xl border border-[#efefef] bg-white p-4">
        <div className="flex items-center gap-2 text-slate-500 mb-1">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-medium">Total Paid</span>
        </div>
        <p className="text-xl font-semibold">{formatNaira(totalPaid)}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
      </div>
      <div className="rounded-xl border border-[#efefef] bg-white p-4">
        <div className="flex items-center gap-2 text-slate-500 mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">Outstanding Balance</span>
        </div>
        <p className="text-xl font-semibold">{formatNaira(totalBalance)}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
      </div>
      <div className="rounded-xl border border-[#efefef] bg-white p-4">
        <div className="flex items-center gap-2 text-slate-500 mb-1">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-medium">Pending Actions</span>
        </div>
        <p className="text-xl font-semibold">{pendingCount}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Awaiting filing/payment</p>
      </div>
    </div>
  );
}

function RemittanceTable({
  records,
  showFiling,
  showPenCom,
  onFileReturn,
  onRecordPayment,
}: {
  records: RemittanceRecord[];
  showFiling?: boolean;
  showPenCom?: boolean;
  onFileReturn?: (id: string) => void;
  onRecordPayment?: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#efefef] bg-[#f8fafc]">
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Period</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Due Date</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Employees</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Amount Due</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Amount Paid</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Balance</th>
            {showFiling && (
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Filing Ref</th>
            )}
            {showPenCom && (
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">PenCom Ref</th>
            )}
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Authority</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-b border-[#efefef] last:border-b-0 hover:bg-[#f8fafc] transition-colors">
              <td className="px-4 py-3 font-medium">{r.period}</td>
              <td className="px-4 py-3 text-slate-500">{r.dueDate}</td>
              <td className="px-4 py-3 text-slate-500">{r.employeeCount}</td>
              <td className="px-4 py-3 text-right font-medium">{formatNaira(r.amountDue)}</td>
              <td className="px-4 py-3 text-right text-slate-500">{formatNaira(r.amountPaid)}</td>
              <td className="px-4 py-3 text-right font-medium">
                {r.balance > 0 ? (
                  <span className="text-red-600">{formatNaira(r.balance)}</span>
                ) : (
                  <span className="text-emerald-600">{formatNaira(0)}</span>
                )}
              </td>
              {showFiling && (
                <td className="px-4 py-3 text-slate-500 text-xs">{r.filingReference ?? "---"}</td>
              )}
              {showPenCom && (
                <td className="px-4 py-3 text-slate-500 text-xs">{r.paymentReference ?? "---"}</td>
              )}
              <td className="px-4 py-3 text-slate-500 text-xs">{r.taxAuthority}</td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} styles={REMITTANCE_STATUS_STYLES} />
              </td>
              <td className="px-4 py-3">
                {(r.status === "pending" || r.status === "overdue") && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onFileReturn?.(r.id)}>
                    <FileText className="w-3 h-3 mr-1" />
                    File Return
                  </Button>
                )}
                {r.status === "filed" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onRecordPayment?.(r.id)}>
                    <DollarSign className="w-3 h-3 mr-1" />
                    Record Payment
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={showFiling || showPenCom ? 11 : 10} className="px-4 py-8 text-center text-slate-500">
                No remittance records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function StatutoryRemittancePage() {
  const [tab, setTab] = useState<TabKey>("paye");
  const [search, setSearch] = useState("");
  const [otherTypeFilter, setOtherTypeFilter] = useState<string>("all");
  const [payeRecords, setPayeRecords] = useState<RemittanceRecord[]>(MOCK_PAYE_REMITTANCES);
  const [pensionRecords, setPensionRecords] = useState<RemittanceRecord[]>(MOCK_PENSION_REMITTANCES);
  const [otherRecords, setOtherRecords] = useState<RemittanceRecord[]>(MOCK_OTHER_REMITTANCES);

  const handleFileReturn = (
    setter: React.Dispatch<React.SetStateAction<RemittanceRecord[]>>
  ) => (id: string) => {
    setter((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "filed" as const, filedDate: new Date().toISOString().split("T")[0] }
          : r
      )
    );
  };

  const handleRecordPayment = (
    setter: React.Dispatch<React.SetStateAction<RemittanceRecord[]>>
  ) => (id: string) => {
    setter((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "paid" as const, paidDate: new Date().toISOString().split("T")[0], amountPaid: r.amountDue, balance: 0 }
          : r
      )
    );
  };

  const filteredOther = useMemo(() => {
    const q = search.toLowerCase();
    return otherRecords.filter((r) => {
      const matchesType = otherTypeFilter === "all" || r.type === otherTypeFilter;
      const matchesSearch =
        !q ||
        r.period.toLowerCase().includes(q) ||
        r.typeName.toLowerCase().includes(q) ||
        r.taxAuthority.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [search, otherTypeFilter, otherRecords]);

  const filteredPaye = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return payeRecords;
    return payeRecords.filter(
      (r) => r.period.toLowerCase().includes(q) || r.taxAuthority.toLowerCase().includes(q)
    );
  }, [search, payeRecords]);

  const filteredPension = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return pensionRecords;
    return pensionRecords.filter(
      (r) => r.period.toLowerCase().includes(q) || r.taxAuthority.toLowerCase().includes(q)
    );
  }, [search, pensionRecords]);

  // Calendar totals
  const calendarTotalDue = MOCK_REMITTANCE_CALENDAR.reduce((s, c) => s + c.amountDue, 0);
  const overdueCount = MOCK_REMITTANCE_CALENDAR.filter((c) => c.status === "overdue").length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Statutory Remittance</h1>
          <p className="text-sm text-slate-500">
            Manage PAYE, pension, and other statutory remittances to regulatory authorities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#efefef] overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                tab === t.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* PAYE Filing Tab */}
      {tab === "paye" && (
        <div className="space-y-6">
          <SummaryCards records={payeRecords} label="PAYE Tax" />

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by period..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <RemittanceTable records={filteredPaye} showFiling onFileReturn={handleFileReturn(setPayeRecords)} onRecordPayment={handleRecordPayment(setPayeRecords)} />
        </div>
      )}

      {/* Pension Remittance Tab */}
      {tab === "pension" && (
        <div className="space-y-6">
          <SummaryCards records={pensionRecords} label="Pension" />

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by period..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <RemittanceTable records={filteredPension} showPenCom onFileReturn={handleFileReturn(setPensionRecords)} onRecordPayment={handleRecordPayment(setPensionRecords)} />
        </div>
      )}

      {/* NHF/NHIS/ITF/NSITF Tab */}
      {tab === "other" && (
        <div className="space-y-6">
          <SummaryCards records={otherRecords} label="Other Statutory" />

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by period or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={otherTypeFilter} onValueChange={setOtherTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="nhf">NHF</SelectItem>
                <SelectItem value="nhis">NHIS</SelectItem>
                <SelectItem value="itf">ITF</SelectItem>
                <SelectItem value="nsitf">NSITF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Period</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Due Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Employees</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Amount Due</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Amount Paid</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Balance</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Authority</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOther.map((r) => (
                  <tr key={r.id} className="border-b border-[#efefef] last:border-b-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3 font-medium">{r.typeName}</td>
                    <td className="px-4 py-3">{r.period}</td>
                    <td className="px-4 py-3 text-slate-500">{r.dueDate}</td>
                    <td className="px-4 py-3 text-slate-500">{r.employeeCount}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatNaira(r.amountDue)}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{formatNaira(r.amountPaid)}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {r.balance > 0 ? (
                        <span className="text-red-600">{formatNaira(r.balance)}</span>
                      ) : (
                        <span className="text-emerald-600">{formatNaira(0)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{r.taxAuthority}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} styles={REMITTANCE_STATUS_STYLES} />
                    </td>
                    <td className="px-4 py-3">
                      {(r.status === "pending" || r.status === "overdue") && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleFileReturn(setOtherRecords)(r.id)}>
                          <FileText className="w-3 h-3 mr-1" />
                          File Return
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredOther.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                      No remittance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Remittance Calendar Tab */}
      {tab === "calendar" && (
        <div className="space-y-6">
          {/* Calendar Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#efefef] bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Upcoming Remittances</span>
              </div>
              <p className="text-xl font-semibold">{MOCK_REMITTANCE_CALENDAR.length}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Next 30 days</p>
            </div>
            <div className="rounded-xl border border-[#efefef] bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Total Amount Due</span>
              </div>
              <p className="text-xl font-semibold">{formatNaira(calendarTotalDue)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">All upcoming</p>
            </div>
            <div className="rounded-xl border border-[#efefef] bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium">Overdue</span>
              </div>
              <p className="text-xl font-semibold text-red-600">{overdueCount}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Requires attention</p>
            </div>
            <div className="rounded-xl border border-[#efefef] bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Regulatory Bodies</span>
              </div>
              <p className="text-xl font-semibold">6</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Active authorities</p>
            </div>
          </div>

          {/* Calendar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_REMITTANCE_CALENDAR
              .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
              .map((item) => {
                const statusStyle = CALENDAR_STATUS_STYLES[item.status];
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-xl border-2 p-5 transition-colors",
                      statusStyle?.bg ?? "bg-white border-[#efefef]"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-sm">{item.typeName}</h3>
                        <p className="text-xs text-slate-500">{item.period}</p>
                      </div>
                      <StatusBadge status={item.status} styles={CALENDAR_STATUS_STYLES} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Due Date</span>
                        <span className="text-sm font-medium">{item.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Days Until Due</span>
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            item.daysUntilDue < 0
                              ? "text-red-600"
                              : item.daysUntilDue <= 7
                                ? "text-amber-600"
                                : "text-emerald-600"
                          )}
                        >
                          {item.daysUntilDue < 0
                            ? `${Math.abs(item.daysUntilDue)} days overdue`
                            : item.daysUntilDue === 0
                              ? "Due today"
                              : `${item.daysUntilDue} days`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Amount Due</span>
                        <span className="text-sm font-semibold">{formatNaira(item.amountDue)}</span>
                      </div>
                    </div>

                    {item.status !== "completed" && (
                      <div className="mt-4">
                        <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={() => {}}>
                          <FileText className="w-3 h-3 mr-1" />
                          Process Remittance
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
