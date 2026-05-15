import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Plus,
  Users,
  ArrowRight,
  X,
  Check,
  TrendingUp,
  ClipboardCheck,
  AlertCircle,
  Wallet,
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

const CATEGORY_PILL: Record<PlanCategory, string> = {
  health: "bg-rose-50 text-rose-700",
  life: "bg-blue-50 text-blue-700",
  meal: "bg-orange-50 text-orange-700",
  transport: "bg-violet-50 text-violet-700",
  wellness: "bg-emerald-50 text-emerald-700",
};

const CATEGORY_LABEL: Record<PlanCategory, string> = {
  health: "Health",
  life: "Life",
  meal: "Meal",
  transport: "Transport",
  wellness: "Wellness",
};

export default function BenefitsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | PlanCategory>("all");
  const [showForm, setShowForm] = useState(false);
  const [formSaved, setFormSaved] = useState(false);

  const handleSave = () => {
    setFormSaved(true);
    setTimeout(() => {
      setShowForm(false);
      setFormSaved(false);
    }, 1500);
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
  const monthlyCost = MOCK_BENEFIT_PLANS.reduce(
    (s, p) => s + p.employerContribution * (enrollmentCounts[p.id] || 0),
    0
  );

  const filteredPlans =
    filter === "all" ? MOCK_BENEFIT_PLANS : MOCK_BENEFIT_PLANS.filter((p) => p.category === filter);

  const categories: { key: "all" | PlanCategory; label: string }[] = [
    { key: "all", label: "All plans" },
    { key: "health", label: "Health" },
    { key: "life", label: "Life" },
    { key: "meal", label: "Meal" },
    { key: "transport", label: "Transport" },
    { key: "wellness", label: "Wellness" },
  ];

  const kpis = [
    { value: MOCK_BENEFIT_PLANS.length, label: "Total plans", icon: ClipboardCheck, trend: 1 },
    { value: totalActiveEnrollments, label: "Active enrollments", icon: Users, trend: 4 },
    { value: totalPendingEnrollments, label: "Pending approvals", icon: AlertCircle, trend: 2 },
    { value: formatBenefitCurrency(monthlyCost), label: "Monthly employer cost", icon: Wallet, trend: 3 },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Benefits</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Manage the employee benefit plans you offer — health, life, meal, transport, and wellness — and
            keep enrollment costs visible.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => navigate("/benefits/enrollments")}
            className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
          >
            <Users className="w-4 h-4 mr-1" />
            Enrollments
          </Button>
          <Button
            onClick={() => {
              setShowForm(true);
              setFormSaved(false);
            }}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add plan
          </Button>
        </div>
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
                <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{kpi.trend}</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none tabular-nums">
                  {kpi.value}
                </p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Plan form */}
      {showForm && (
        <>
          {formSaved ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-center gap-2 text-emerald-800 text-sm font-medium">
              <Check className="w-4 h-4" />
              Benefit plan saved successfully
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">New benefit plan</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField label="Plan name" placeholder="e.g. Dental Coverage" />
                <FormField label="Category" placeholder="e.g. health, wellness" />
                <FormField label="Provider" placeholder="e.g. Leadway Health" />
                <FormField label="Coverage summary" placeholder="e.g. Dental, orthodontics" />
                <FormField label="Employer contribution (₦)" placeholder="e.g. 25000" />
                <FormField label="Employee contribution (₦)" placeholder="e.g. 10000" />
                <FormField label="Frequency" placeholder="monthly or annually" />
                <FormField label="Max dependents" placeholder="e.g. 4" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={handleSave}
                  className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
                >
                  Save plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="h-10 rounded-lg border-slate-200 text-slate-700 font-semibold bg-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Category tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto">
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

      {/* Plan cards */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => {
            const enrolled = enrollmentCounts[plan.id] || 0;
            const totalCost = plan.employerContribution + plan.employeeContribution;

            return (
              <div
                key={plan.id}
                className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-4 transition-colors hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{plan.provider}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium shrink-0",
                      CATEGORY_PILL[plan.category]
                    )}
                  >
                    {CATEGORY_LABEL[plan.category]}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{plan.coverageSummary}</p>

                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Benefit value</span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    {formatBenefitCurrency(totalCost)}
                    <span className="text-xs text-slate-500 font-normal">
                      /{plan.frequency === "monthly" ? "mo" : "yr"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{enrolled}</span> enrolled
                    {plan.maxDependents > 0 && (
                      <span className="text-slate-400"> · up to {plan.maxDependents} deps</span>
                    )}
                  </span>
                  <button
                    onClick={() => navigate("/benefits/enrollments")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Manage
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-12 text-center">
          <Heart className="w-10 h-10 mx-auto mb-3 text-slate-400" />
          <p className="text-sm font-semibold text-slate-900">No plans in this category</p>
          <p className="text-xs text-slate-500 mt-1">Try a different filter or add a new plan</p>
        </div>
      )}
    </div>
  );
}

function FormField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <Input placeholder={placeholder} className="h-10 rounded-lg bg-white border-slate-200" />
    </div>
  );
}
