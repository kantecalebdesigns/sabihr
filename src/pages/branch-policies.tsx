import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ScrollText,
  Building,
  Calendar,
  Edit,
  Copy,
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

type PolicyCategory = "leave" | "attendance" | "payroll" | "benefits" | "conduct";
type PolicyStatus = "active" | "draft" | "archived";

interface BranchPolicy {
  id: string;
  name: string;
  category: PolicyCategory;
  branchName: string;
  branchCode: string;
  status: PolicyStatus;
  summary: string;
  effectiveFrom: string;
  lastUpdated: string;
  version: number;
}

const POLICIES: BranchPolicy[] = [
  { id: "p-1", name: "Annual Leave Policy", category: "leave", branchName: "Lagos Headquarters", branchCode: "LAG-HQ", status: "active", summary: "25 days annual leave for full-time; earn 2.08 days per month", effectiveFrom: "2025-01-01", lastUpdated: "2025-12-15", version: 3 },
  { id: "p-2", name: "Annual Leave Policy", category: "leave", branchName: "Abuja Regional Office", branchCode: "ABJ-RG", status: "active", summary: "22 days annual leave for full-time; staggered by tenure", effectiveFrom: "2025-01-01", lastUpdated: "2025-11-20", version: 2 },
  { id: "p-3", name: "Remote Work Policy", category: "attendance", branchName: "Lagos Headquarters", branchCode: "LAG-HQ", status: "active", summary: "Hybrid: up to 3 remote days/week with manager approval", effectiveFrom: "2025-06-01", lastUpdated: "2026-02-10", version: 2 },
  { id: "p-4", name: "Remote Work Policy", category: "attendance", branchName: "Port Harcourt Branch", branchCode: "PHC-RG", status: "active", summary: "On-site only due to plant operations; limited WFH for office roles", effectiveFrom: "2025-06-01", lastUpdated: "2025-09-05", version: 1 },
  { id: "p-5", name: "Overtime Rates", category: "payroll", branchName: "Lagos Headquarters", branchCode: "LAG-HQ", status: "active", summary: "Weekday: 1.5x, Weekend: 2x, Public holiday: 2.5x", effectiveFrom: "2024-07-01", lastUpdated: "2025-05-14", version: 2 },
  { id: "p-6", name: "Overtime Rates", category: "payroll", branchName: "Kano Satellite Office", branchCode: "KAN-ST", status: "active", summary: "Weekday: 1.3x, Weekend: 1.75x, Public holiday: 2x", effectiveFrom: "2024-07-01", lastUpdated: "2025-05-14", version: 1 },
  { id: "p-7", name: "Health Benefits Enrollment", category: "benefits", branchName: "Lagos Headquarters", branchCode: "LAG-HQ", status: "active", summary: "HMO eligibility after 30 days; dependents up to 4", effectiveFrom: "2025-01-01", lastUpdated: "2026-01-05", version: 3 },
  { id: "p-8", name: "Dress Code Policy", category: "conduct", branchName: "Abuja Regional Office", branchCode: "ABJ-RG", status: "draft", summary: "Business casual Mon–Thu, smart casual on Fridays", effectiveFrom: "2026-05-01", lastUpdated: "2026-03-11", version: 1 },
  { id: "p-9", name: "Clock-In Grace Period", category: "attendance", branchName: "Port Harcourt Branch", branchCode: "PHC-RG", status: "active", summary: "10-minute grace window before late mark applied", effectiveFrom: "2025-03-01", lastUpdated: "2025-08-12", version: 2 },
];

const CATEGORY_LABELS: Record<PolicyCategory, string> = {
  leave: "Leave",
  attendance: "Attendance",
  payroll: "Payroll",
  benefits: "Benefits",
  conduct: "Conduct",
};

const STATUS_STYLES: Record<PolicyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  draft: "bg-amber-50 text-amber-700",
  archived: "bg-slate-100 text-slate-500",
};

const BRANCHES = [...new Set(POLICIES.map((p) => p.branchName))];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BranchPoliciesPage() {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | PolicyCategory>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return POLICIES.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.branchName.toLowerCase().includes(q);
      const matchesBranch = branchFilter === "all" || p.branchName === branchFilter;
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesBranch && matchesCategory;
    });
  }, [search, branchFilter, categoryFilter]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Branch Policies</h1>
          <p className="text-sm text-slate-500">
            Configure policies per branch — leave, attendance, payroll, and conduct rules.
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Policy
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {BRANCHES.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}>
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#efefef] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8fafc] text-left">
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Policy</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Branch</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Category</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Effective</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Last Updated</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <ScrollText className="w-10 h-10 text-slate-500/30 mb-2 mx-auto" />
                  <p className="text-sm text-slate-500">No policies match your filters.</p>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-t border-[#efefef] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <ScrollText className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-md">{p.summary}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.branchCode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{CATEGORY_LABELS[p.category]}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(p.effectiveFrom)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">v{p.version} · {formatDate(p.lastUpdated)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full capitalize", STATUS_STYLES[p.status])}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="Duplicate to another branch">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
