import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Shield,
  UtensilsCrossed,
  Bus,
  Dumbbell,
  Plus,
  Check,
  Users,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_BENEFIT_PLANS,
  MOCK_ENROLLMENTS,
  formatBenefitCurrency,
} from "@/lib/benefits-mock-data";
import type { PlanCategory } from "@/lib/benefits-mock-data";

const CATEGORY_ICONS: Record<PlanCategory, typeof Heart> = {
  health: Heart,
  life: Shield,
  meal: UtensilsCrossed,
  transport: Bus,
  wellness: Dumbbell,
};

const CATEGORY_COLORS: Record<PlanCategory, string> = {
  health: "text-red-500",
  life: "text-blue-500",
  meal: "text-orange-500",
  transport: "text-violet-500",
  wellness: "text-emerald-500",
};

export default function BenefitsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | PlanCategory>("all");
  const [showForm, setShowForm] = useState(false);
  const [formSaved, setFormSaved] = useState(false);

  const handleSave = () => {
    setFormSaved(true);
    setTimeout(() => { setShowForm(false); setFormSaved(false); }, 1500);
  };

  const enrollmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_ENROLLMENTS.filter((e) => e.status === "active" || e.status === "pending").forEach((e) => {
      counts[e.planId] = (counts[e.planId] || 0) + 1;
    });
    return counts;
  }, []);

  const totalActiveEnrollments = MOCK_ENROLLMENTS.filter((e) => e.status === "active").length;
  const totalPendingEnrollments = MOCK_ENROLLMENTS.filter((e) => e.status === "pending").length;

  const filteredPlans = filter === "all"
    ? MOCK_BENEFIT_PLANS
    : MOCK_BENEFIT_PLANS.filter((p) => p.category === filter);

  const categories: { key: "all" | PlanCategory; label: string }[] = [
    { key: "all", label: "All Plans" },
    { key: "health", label: "Health" },
    { key: "life", label: "Life Insurance" },
    { key: "meal", label: "Meal" },
    { key: "transport", label: "Transport" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Benefits Administration</h1>
          <p className="text-sm text-slate-500">Manage employee benefit plans and enrollments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/benefits/enrollments")}>
            <Users className="w-4 h-4 mr-2" />
            View Enrollments
          </Button>
          <Button size="sm" onClick={() => { setShowForm(true); setFormSaved(false); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Add Plan Form */}
      {showForm && (
        formSaved ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-2 text-emerald-800 text-sm">
            <Check className="w-4 h-4" />
            Benefit plan saved successfully
          </div>
        ) : (
          <div className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">New Benefit Plan</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-[#f8fafc] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Plan Name</label>
                <Input placeholder="e.g. Dental Coverage" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Category</label>
                <Input placeholder="e.g. health, wellness" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Provider</label>
                <Input placeholder="e.g. Leadway Health" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Coverage Summary</label>
                <Input placeholder="e.g. Dental, orthodontics" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Employer Contribution (₦)</label>
                <Input placeholder="e.g. 25000" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Employee Contribution (₦)</label>
                <Input placeholder="e.g. 10000" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Frequency</label>
                <Input placeholder="monthly or annually" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Max Dependents</label>
                <Input placeholder="e.g. 4" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={handleSave}>Save Plan</Button>
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Total Plans</p>
          <p className="text-xl font-semibold mt-1">{MOCK_BENEFIT_PLANS.length}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Active Enrollments</p>
          <p className="text-xl font-semibold mt-1">{totalActiveEnrollments}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Pending Approvals</p>
          <p className="text-xl font-semibold mt-1">{totalPendingEnrollments}</p>
        </div>
        <div className="rounded-xl border border-[#efefef] bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Monthly Employer Cost</p>
          <p className="text-xl font-semibold mt-1">{formatBenefitCurrency(MOCK_BENEFIT_PLANS.reduce((s, p) => s + p.employerContribution * (enrollmentCounts[p.id] || 0), 0))}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-[#efefef]">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              filter === cat.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.map((plan) => {
          const Icon = CATEGORY_ICONS[plan.category];
          const iconColor = CATEGORY_COLORS[plan.category];
          const enrolled = enrollmentCounts[plan.id] || 0;
          const totalCost = plan.employerContribution + plan.employeeContribution;

          return (
            <div key={plan.id} className="rounded-xl border border-[#efefef] bg-white p-5 space-y-4 hover:border-slate-300 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", iconColor)} />
                  <div>
                    <h3 className="text-sm font-semibold">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{plan.provider}</p>
                  </div>
                </div>
                {enrolled > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <Check className="w-3.5 h-3.5" />
                    {enrolled} enrolled
                  </span>
                )}
              </div>

              {/* Coverage */}
              <p className="text-xs text-slate-500">{plan.coverageSummary}</p>

              {/* Amount */}
              <div className="pt-3 border-t border-[#efefef] space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Benefit value</span>
                  <span className="text-sm font-semibold">
                    {formatBenefitCurrency(totalCost)}
                    <span className="text-xs text-slate-500 font-normal">/{plan.frequency === "monthly" ? "mo" : "yr"}</span>
                  </span>
                </div>
                {plan.maxDependents > 0 && (
                  <p className="text-[11px] text-slate-500">Up to {plan.maxDependents} dependents</p>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => navigate("/benefits/enrollments")}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Manage enrollments <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No plans in this category</p>
        </div>
      )}
    </div>
  );
}
