import { useState, useMemo } from "react";
import {
  DollarSign,
  Users,
  Layers,
  Plus,
  X,
  Pencil,
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

// ── Helpers ──

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    const m = amount / 1000000;
    return `\u20A6${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `\u20A6${amount.toLocaleString()}`;
}

function formatFullCurrency(amount: number): string {
  return `\u20A6${amount.toLocaleString()}`;
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

  const summaryCards = useMemo(() => {
    const active = payGroups.filter((g) => g.status === "active").length;
    const employees = payGroups.reduce((sum, g) => sum + g.employeeCount, 0);
    return [
      { label: "Total Groups", value: payGroups.length, icon: Layers },
      { label: "Active", value: active, icon: DollarSign },
      { label: "Employees Covered", value: employees, icon: Users },
    ];
  }, [payGroups]);

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
    { key: "groups" as const, label: "Pay Groups" },
    { key: "grades" as const, label: "Pay Grades" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Pay Grade &amp; Pay Group Management</h1>
        <p className="text-sm text-slate-500">Configure pay groups and grade structures for your organization</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#efefef]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === t.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════ PAY GROUPS TAB ═══════ */}
      {activeTab === "groups" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summaryCards.map((card) => (
              <div key={card.label} className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <card.icon className="w-4 h-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">{card.label}</p>
                </div>
                <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="flex justify-end">
            <Button size="sm" onClick={() => showGroupForm ? resetGroupForm() : setShowGroupForm(true)}>
              {showGroupForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {showGroupForm ? "Cancel" : "Create Pay Group"}
            </Button>
          </div>

          {/* Inline Form */}
          {showGroupForm && (
            <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
              <h3 className="text-sm font-semibold">{editingGroupId ? "Edit Pay Group" : "New Pay Group"}</h3>
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
                  <label className="text-xs font-medium text-slate-500">Min Salary (Annual)</label>
                  <Input type="number" value={gMin} onChange={(e) => setGMin(e.target.value)} placeholder="e.g. 4000000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Max Salary (Annual)</label>
                  <Input type="number" value={gMax} onChange={(e) => setGMax(e.target.value)} placeholder="e.g. 8000000" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={gTax} onChange={(e) => setGTax(e.target.checked)} className="rounded" />
                  Tax Inclusive
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={gStatus === "active"} onChange={(e) => setGStatus(e.target.checked ? "active" : "draft")} className="rounded" />
                  Active
                </label>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSaveGroup}>{editingGroupId ? "Save Changes" : "Create Group"}</Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Group Name</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Description</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Salary Range</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Tax Inclusive</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Employees</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {payGroups.map((g) => (
                  <tr key={g.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3 font-medium text-slate-900">{g.name}</td>
                    <td className="p-3 text-slate-500">{g.description}</td>
                    <td className="p-3 text-slate-900">{formatCurrency(g.minSalary)} — {formatCurrency(g.maxSalary)}</td>
                    <td className="p-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        g.taxInclusive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      )}>
                        {g.taxInclusive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        g.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {g.status === "active" ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3 text-slate-900">{g.employeeCount}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => handleEditGroup(g)}><Pencil className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════ PAY GRADES TAB ═══════ */}
      {activeTab === "grades" && (
        <div className="space-y-6">
          {/* Action */}
          <div className="flex justify-end">
            <Button size="sm" onClick={() => showGradeForm ? resetGradeForm() : setShowGradeForm(true)}>
              {showGradeForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {showGradeForm ? "Cancel" : "Create Pay Grade"}
            </Button>
          </div>

          {/* Inline Form */}
          {showGradeForm && (
            <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
              <h3 className="text-sm font-semibold">{editingGradeId ? "Edit Pay Grade" : "New Pay Grade"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Level</label>
                  <Input type="number" value={grLevel} onChange={(e) => setGrLevel(e.target.value)} placeholder="e.g. 5" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Grade Name</label>
                  <Input value={grName} onChange={(e) => setGrName(e.target.value)} placeholder="e.g. Senior Manager" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Pay Group</label>
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
                  <label className="text-xs font-medium text-slate-500">Basic Salary (Annual)</label>
                  <Input type="number" value={grBasic} onChange={(e) => setGrBasic(e.target.value)} placeholder="e.g. 6500000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Housing Allowance (%)</label>
                  <Input type="number" value={grHousing} onChange={(e) => setGrHousing(e.target.value)} placeholder="e.g. 35" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Transport Allowance (%)</label>
                  <Input type="number" value={grTransport} onChange={(e) => setGrTransport(e.target.value)} placeholder="e.g. 10" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSaveGrade}>{editingGradeId ? "Save Changes" : "Create Grade"}</Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#efefef] bg-[#f8fafc]">
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Level</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Grade Name</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Pay Group</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Basic Salary</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Housing</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Transport</th>
                  <th className="p-3 text-right text-xs font-medium text-slate-500">Total Package</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {payGrades.map((g) => (
                  <tr key={g.id} className="border-b border-[#efefef] last:border-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3 font-medium text-slate-900">{g.level}</td>
                    <td className="p-3 font-medium text-slate-900">{g.name}</td>
                    <td className="p-3 text-slate-500">{getGroupName(g.payGroupId)}</td>
                    <td className="p-3 text-right text-slate-900">{formatFullCurrency(g.basicSalary)}</td>
                    <td className="p-3 text-right text-slate-500">{g.housingPercent}%</td>
                    <td className="p-3 text-right text-slate-500">{g.transportPercent}%</td>
                    <td className="p-3 text-right font-medium text-slate-900">{formatFullCurrency(g.totalPackage)}</td>
                    <td className="p-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        g.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {g.status === "active" ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => handleEditGrade(g)}><Pencil className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
