import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Users,
  Layers,
  Plus,
  X,
  Pencil,
  Banknote,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Types ──

interface PayGroup {
  id: string;
  name: string;
  description: string;
  minSalary: number;
  maxSalary: number;
  taxInclusive: boolean;
  status: "active" | "draft";
  employeeCount: number;
}

interface PayGrade {
  id: string;
  level: number;
  name: string;
  payGroupId: string;
  basicSalary: number;
  housingPercent: number;
  transportPercent: number;
  totalPackage: number;
  status: "active" | "draft";
}

// ── Mock Data ──

const INITIAL_PAY_GROUPS: PayGroup[] = [
  { id: "pg-1", name: "Executive", description: "C-suite and executive leadership", minSalary: 15000000, maxSalary: 50000000, taxInclusive: true, status: "active", employeeCount: 5 },
  { id: "pg-2", name: "Senior Management", description: "Directors and senior managers", minSalary: 8000000, maxSalary: 15000000, taxInclusive: true, status: "active", employeeCount: 18 },
  { id: "pg-3", name: "Mid-Level", description: "Managers and senior specialists", minSalary: 4000000, maxSalary: 8000000, taxInclusive: true, status: "active", employeeCount: 45 },
  { id: "pg-4", name: "Junior", description: "Junior staff and entry-level roles", minSalary: 1500000, maxSalary: 4000000, taxInclusive: true, status: "active", employeeCount: 72 },
  { id: "pg-5", name: "Intern", description: "Interns and NYSC corps members", minSalary: 500000, maxSalary: 1500000, taxInclusive: false, status: "active", employeeCount: 16 },
];

const INITIAL_PAY_GRADES: PayGrade[] = [
  { id: "gr-1", level: 1, name: "Chief Executive", payGroupId: "pg-1", basicSalary: 25000000, housingPercent: 50, transportPercent: 15, totalPackage: 41250000, status: "active" },
  { id: "gr-2", level: 2, name: "Executive Director", payGroupId: "pg-1", basicSalary: 18000000, housingPercent: 50, transportPercent: 15, totalPackage: 29700000, status: "active" },
  { id: "gr-3", level: 3, name: "Senior Director", payGroupId: "pg-2", basicSalary: 12000000, housingPercent: 40, transportPercent: 12.5, totalPackage: 18300000, status: "active" },
  { id: "gr-4", level: 4, name: "Director", payGroupId: "pg-2", basicSalary: 9000000, housingPercent: 40, transportPercent: 12.5, totalPackage: 13725000, status: "active" },
  { id: "gr-5", level: 5, name: "Senior Manager", payGroupId: "pg-3", basicSalary: 6500000, housingPercent: 35, transportPercent: 10, totalPackage: 9425000, status: "active" },
  { id: "gr-6", level: 6, name: "Manager", payGroupId: "pg-3", basicSalary: 4500000, housingPercent: 35, transportPercent: 10, totalPackage: 6525000, status: "active" },
  { id: "gr-7", level: 7, name: "Senior Officer", payGroupId: "pg-4", basicSalary: 2800000, housingPercent: 30, transportPercent: 10, totalPackage: 3920000, status: "active" },
  { id: "gr-8", level: 8, name: "Intern", payGroupId: "pg-5", basicSalary: 720000, housingPercent: 0, transportPercent: 15, totalPackage: 828000, status: "active" },
];

const GROUP_PALETTE = [
  "bg-blue-500", "bg-violet-500", "bg-teal-500", "bg-amber-500", "bg-rose-500",
  "bg-emerald-500", "bg-indigo-500", "bg-pink-500", "bg-orange-500", "bg-cyan-500",
];

function paletteFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return GROUP_PALETTE[Math.abs(h) % GROUP_PALETTE.length];
}

// ── Helpers ──

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    const m = amount / 1000000;
    return `₦${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `₦${amount.toLocaleString()}`;
}

function formatFullCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

// ── Component ──

export default function PayGradesPage() {
  const [activeTab, setActiveTab] = useState<"groups" | "grades">("groups");
  const [payGroups, setPayGroups] = useState<PayGroup[]>(INITIAL_PAY_GROUPS);
  const [payGrades, setPayGrades] = useState<PayGrade[]>(INITIAL_PAY_GRADES);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showGradeForm, setShowGradeForm] = useState(false);

  // Pay Group form
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [gName, setGName] = useState("");
  const [gDesc, setGDesc] = useState("");
  const [gMin, setGMin] = useState("");
  const [gMax, setGMax] = useState("");
  const [gTax, setGTax] = useState(true);
  const [gStatus, setGStatus] = useState<"active" | "draft">("active");

  // Pay Grade form
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [grLevel, setGrLevel] = useState("");
  const [grName, setGrName] = useState("");
  const [grPayGroup, setGrPayGroup] = useState("");
  const [grBasic, setGrBasic] = useState("");
  const [grHousing, setGrHousing] = useState("");
  const [grTransport, setGrTransport] = useState("");

  const groupKpis = useMemo(() => {
    const active = payGroups.filter((g) => g.status === "active").length;
    const employees = payGroups.reduce((sum, g) => sum + g.employeeCount, 0);
    const avgRange = payGroups.length
      ? payGroups.reduce((sum, g) => sum + (g.minSalary + g.maxSalary) / 2, 0) / payGroups.length
      : 0;
    return [
      { label: "Total pay groups", value: String(payGroups.length), icon: Layers, trend: 1 },
      { label: "Active groups", value: String(active), icon: DollarSign, trend: 0 },
      { label: "Employees covered", value: String(employees), icon: Users, trend: 4 },
      { label: "Avg salary midpoint", value: formatCurrency(avgRange), icon: Banknote, trend: 2 },
    ];
  }, [payGroups]);

  const gradeKpis = useMemo(() => {
    const active = payGrades.filter((g) => g.status === "active").length;
    const avgBasic = payGrades.length
      ? payGrades.reduce((sum, g) => sum + g.basicSalary, 0) / payGrades.length
      : 0;
    const highest = payGrades.reduce((max, g) => (g.totalPackage > max ? g.totalPackage : max), 0);
    return [
      { label: "Total pay grades", value: String(payGrades.length), icon: Layers, trend: 1 },
      { label: "Active grades", value: String(active), icon: DollarSign, trend: 0 },
      { label: "Avg basic salary", value: formatCurrency(avgBasic), icon: Banknote, trend: 3 },
      { label: "Highest package", value: formatCurrency(highest), icon: TrendingUp, trend: 5 },
    ];
  }, [payGrades]);

  const resetGroupForm = () => {
    setGName(""); setGDesc(""); setGMin(""); setGMax(""); setGTax(true); setGStatus("active");
    setEditingGroupId(null);
    setShowGroupForm(false);
  };

  const handleEditGroup = (g: PayGroup) => {
    setEditingGroupId(g.id);
    setGName(g.name);
    setGDesc(g.description);
    setGMin(String(g.minSalary));
    setGMax(String(g.maxSalary));
    setGTax(g.taxInclusive);
    setGStatus(g.status);
    setShowGroupForm(true);
  };

  const handleSaveGroup = () => {
    if (!gName || !gMin || !gMax) return;
    if (editingGroupId) {
      setPayGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroupId
            ? { ...g, name: gName, description: gDesc, minSalary: Number(gMin), maxSalary: Number(gMax), taxInclusive: gTax, status: gStatus }
            : g
        )
      );
    } else {
      const newGroup: PayGroup = {
        id: `pg-${Date.now()}`,
        name: gName,
        description: gDesc,
        minSalary: Number(gMin),
        maxSalary: Number(gMax),
        taxInclusive: gTax,
        status: gStatus,
        employeeCount: 0,
      };
      setPayGroups((prev) => [...prev, newGroup]);
    }
    resetGroupForm();
  };

  const resetGradeForm = () => {
    setGrLevel(""); setGrName(""); setGrPayGroup(""); setGrBasic(""); setGrHousing(""); setGrTransport("");
    setEditingGradeId(null);
    setShowGradeForm(false);
  };

  const handleEditGrade = (g: PayGrade) => {
    setEditingGradeId(g.id);
    setGrLevel(String(g.level));
    setGrName(g.name);
    setGrPayGroup(g.payGroupId);
    setGrBasic(String(g.basicSalary));
    setGrHousing(String(g.housingPercent));
    setGrTransport(String(g.transportPercent));
    setShowGradeForm(true);
  };

  const handleSaveGrade = () => {
    if (!grLevel || !grName || !grPayGroup || !grBasic) return;
    const basic = Number(grBasic);
    const housing = Number(grHousing) || 0;
    const transport = Number(grTransport) || 0;
    const total = basic + (basic * housing / 100) + (basic * transport / 100);
    if (editingGradeId) {
      setPayGrades((prev) =>
        prev.map((g) =>
          g.id === editingGradeId
            ? { ...g, level: Number(grLevel), name: grName, payGroupId: grPayGroup, basicSalary: basic, housingPercent: housing, transportPercent: transport, totalPackage: total }
            : g
        )
      );
    } else {
      const newGrade: PayGrade = {
        id: `gr-${Date.now()}`,
        level: Number(grLevel),
        name: grName,
        payGroupId: grPayGroup,
        basicSalary: basic,
        housingPercent: housing,
        transportPercent: transport,
        totalPackage: total,
        status: "active",
      };
      setPayGrades((prev) => [...prev, newGrade]);
    }
    resetGradeForm();
  };

  const getGroupName = (id: string) => payGroups.find((g) => g.id === id)?.name ?? "—";

  const tabs = [
    { key: "groups" as const, label: "Pay groups", count: payGroups.length },
    { key: "grades" as const, label: "Pay grades", count: payGrades.length },
  ];

  const isGroupsTab = activeTab === "groups";
  const kpis = isGroupsTab ? groupKpis : gradeKpis;

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pay grades &amp; groups</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Configure salary bands and grade structures — keep compensation consistent across roles
            and align every employee to a clear, auditable pay band.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isGroupsTab ? (
            <Button
              asChild
              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
            >
              <Link to="/payroll/pay-groups/create">
                <Plus className="w-4 h-4 mr-1" />
                New pay group
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
            >
              <Link to="/payroll/pay-grades/create">
                <Plus className="w-4 h-4 mr-1" />
                New pay grade
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Chip tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label}
              <span className={cn("text-xs", active ? "text-white/80" : "text-slate-400")}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/70 bg-white px-5 pt-5 pb-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-7"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] text-blue-600" />
                </div>
                {kpi.trend > 0 && (
                  <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{kpi.trend}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════ PAY GROUPS TAB ═══════ */}
      {isGroupsTab && (
        <>
          {/* Inline form */}
          {showGroupForm && (
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {editingGroupId ? "Edit pay group" : "New pay group"}
                </h3>
                <button
                  onClick={resetGroupForm}
                  className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Name</label>
                  <Input value={gName} onChange={(e) => setGName(e.target.value)} placeholder="e.g. Senior Management" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Description</label>
                  <Input value={gDesc} onChange={(e) => setGDesc(e.target.value)} placeholder="Brief description" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Min salary (annual)</label>
                  <Input type="number" value={gMin} onChange={(e) => setGMin(e.target.value)} placeholder="e.g. 4000000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Max salary (annual)</label>
                  <Input type="number" value={gMax} onChange={(e) => setGMax(e.target.value)} placeholder="e.g. 8000000" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={gTax} onChange={(e) => setGTax(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
                  Tax inclusive
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={gStatus === "active"} onChange={(e) => setGStatus(e.target.checked ? "active" : "draft")} className="w-4 h-4 rounded border-slate-300" />
                  Active
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={resetGroupForm}
                  className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveGroup}
                  className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
                >
                  {editingGroupId ? "Save changes" : "Create group"}
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">Pay groups</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                  {payGroups.length}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200/70">
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Group</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Salary range</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Tax inclusive</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                    <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Employees</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {payGroups.map((g) => (
                    <tr key={g.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 pl-5 pr-5">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold", paletteFor(g.id))}>
                            {g.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{g.name}</p>
                            <p className="text-xs text-slate-500 leading-tight mt-0.5">{g.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-5 text-slate-700 tabular-nums">
                        {formatCurrency(g.minSalary)} <span className="text-slate-400">—</span> {formatCurrency(g.maxSalary)}
                      </td>
                      <td className="py-4 pr-5">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                          g.taxInclusive ? "bg-slate-100 text-slate-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {g.taxInclusive ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-4 pr-5">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                          g.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", g.status === "active" ? "bg-emerald-500" : "bg-amber-500")} />
                          {g.status === "active" ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 pr-5 text-right font-semibold text-slate-900 tabular-nums">{g.employeeCount}</td>
                      <td className="py-4 pr-5">
                        <button
                          onClick={() => handleEditGroup(g)}
                          className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════ PAY GRADES TAB ═══════ */}
      {!isGroupsTab && (
        <>
          {/* Inline form */}
          {showGradeForm && (
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {editingGradeId ? "Edit pay grade" : "New pay grade"}
                </h3>
                <button
                  onClick={resetGradeForm}
                  className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Level</label>
                  <Input type="number" value={grLevel} onChange={(e) => setGrLevel(e.target.value)} placeholder="e.g. 5" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Grade name</label>
                  <Input value={grName} onChange={(e) => setGrName(e.target.value)} placeholder="e.g. Senior Manager" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Pay group</label>
                  <select
                    value={grPayGroup}
                    onChange={(e) => setGrPayGroup(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Select group</option>
                    {payGroups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Basic salary (annual)</label>
                  <Input type="number" value={grBasic} onChange={(e) => setGrBasic(e.target.value)} placeholder="e.g. 6500000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Housing allowance (%)</label>
                  <Input type="number" value={grHousing} onChange={(e) => setGrHousing(e.target.value)} placeholder="e.g. 35" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Transport allowance (%)</label>
                  <Input type="number" value={grTransport} onChange={(e) => setGrTransport(e.target.value)} placeholder="e.g. 10" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={resetGradeForm}
                  className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveGrade}
                  className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
                >
                  {editingGradeId ? "Save changes" : "Create grade"}
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">Pay grades</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                  {payGrades.length}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200/70">
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">Grade</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Pay group</th>
                    <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Basic salary</th>
                    <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Housing</th>
                    <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Transport</th>
                    <th className="text-right font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Total package</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                    <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {payGrades.map((g) => (
                    <tr key={g.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 pl-5 pr-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white font-semibold tabular-nums">
                            {g.level}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{g.name}</p>
                            <p className="text-xs text-slate-500 leading-tight mt-0.5">Level {g.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {getGroupName(g.payGroupId)}
                        </span>
                      </td>
                      <td className="py-4 pr-5 text-right font-semibold text-slate-900 tabular-nums">{formatFullCurrency(g.basicSalary)}</td>
                      <td className="py-4 pr-5 text-right text-slate-600 tabular-nums">{g.housingPercent}%</td>
                      <td className="py-4 pr-5 text-right text-slate-600 tabular-nums">{g.transportPercent}%</td>
                      <td className="py-4 pr-5 text-right font-bold text-slate-900 tabular-nums">{formatFullCurrency(g.totalPackage)}</td>
                      <td className="py-4 pr-5">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                          g.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", g.status === "active" ? "bg-emerald-500" : "bg-amber-500")} />
                          {g.status === "active" ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 pr-5">
                        <button
                          onClick={() => handleEditGrade(g)}
                          className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
