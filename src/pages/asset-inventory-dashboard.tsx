import { useState, useMemo } from "react";
import {
  Package,
  UserCheck,
  CheckCircle2,
  Wrench,
  FileDown,
  FileSpreadsheet,
  CalendarDays,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_ASSET_CATEGORIES,
  ASSET_STATUS_STYLES,
  formatCurrency,
} from "@/lib/asset-mock-data";

const DATE_RANGES = [
  { label: "Last 30 Days", value: 30 },
  { label: "Last 90 Days", value: 90 },
  { label: "Last 365 Days", value: 365 },
] as const;

const STATUS_COLORS: Record<string, string> = {
  available: "bg-green-500",
  assigned: "bg-blue-500",
  maintenance: "bg-amber-500",
  disposed: "bg-gray-400",
  missing: "bg-red-500",
};

const CATEGORY_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-slate-500",
  "bg-gray-500",
];

export default function AssetInventoryDashboard() {
  const [dateRange, setDateRange] = useState<number>(365);
  const [showDropdown, setShowDropdown] = useState(false);

  const assets = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - dateRange);
    return MOCK_ASSETS.filter(
      (a) => new Date(a.purchaseDate) >= cutoff || a.status === "assigned"
    );
  }, [dateRange]);

  const totalValue = assets.reduce((s, a) => s + a.purchasePrice, 0);
  const assigned = assets.filter((a) => a.status === "assigned").length;
  const available = assets.filter((a) => a.status === "available").length;
  const maintenance = assets.filter((a) => a.status === "maintenance").length;

  const statCards = [
    {
      label: "Total Assets",
      value: assets.length,
      sub: formatCurrency(totalValue),
      icon: Package,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Assigned",
      value: assigned,
      sub: `${Math.round((assigned / (assets.length || 1)) * 100)}%`,
      icon: UserCheck,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Available",
      value: available,
      sub: "Ready to assign",
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Under Maintenance",
      value: maintenance,
      sub: maintenance === 1 ? "1 asset" : `${maintenance} assets`,
      icon: Wrench,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  // Distribution by category
  const categoryDist = MOCK_ASSET_CATEGORIES.map((cat, i) => ({
    name: cat.name,
    count: assets.filter((a) => a.categoryId === cat.id).length,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  })).filter((c) => c.count > 0);
  const maxCatCount = Math.max(...categoryDist.map((c) => c.count), 1);

  // Distribution by status
  const statusDist = Object.entries(ASSET_STATUS_STYLES).map(([key, style]) => ({
    key,
    label: style.label,
    count: assets.filter((a) => a.status === key).length,
    color: STATUS_COLORS[key] ?? "bg-gray-400",
  }));
  const totalStatusCount = statusDist.reduce((s, d) => s + d.count, 0) || 1;

  // Age distribution
  const now = new Date();
  const ageBuckets = [
    { label: "0 – 12 months", min: 0, max: 12 },
    { label: "1 – 2 years", min: 12, max: 24 },
    { label: "2 – 3 years", min: 24, max: 36 },
    { label: "3+ years", min: 36, max: Infinity },
  ].map((b) => ({
    ...b,
    count: assets.filter((a) => {
      const months =
        (now.getFullYear() - new Date(a.purchaseDate).getFullYear()) * 12 +
        (now.getMonth() - new Date(a.purchaseDate).getMonth());
      return months >= b.min && months < b.max;
    }).length,
  }));

  // Warranty status
  const warrantyValid = assets.filter(
    (a) => a.warrantyExpiry && new Date(a.warrantyExpiry) > new Date(now.getTime() + 90 * 86400000)
  ).length;
  const warrantySoon = assets.filter(
    (a) =>
      a.warrantyExpiry &&
      new Date(a.warrantyExpiry) > now &&
      new Date(a.warrantyExpiry) <= new Date(now.getTime() + 90 * 86400000)
  ).length;
  const warrantyExpired = assets.filter(
    (a) => a.warrantyExpiry && new Date(a.warrantyExpiry) <= now
  ).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Asset Inventory Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of all company assets, their status, and value.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date range selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <CalendarDays className="size-4" />
              {DATE_RANGES.find((d) => d.value === dateRange)?.label}
              <ChevronDown className="size-3" />
            </Button>
            {showDropdown && (
              <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-border bg-card p-1 shadow-lg">
                {DATE_RANGES.map((d) => (
                  <button
                    key={d.value}
                    className={cn(
                      "w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-accent",
                      dateRange === d.value && "bg-accent font-medium"
                    )}
                    onClick={() => {
                      setDateRange(d.value);
                      setShowDropdown(false);
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <FileDown className="size-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileSpreadsheet className="size-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={cn("rounded-lg p-2", card.color)}>
                <card.icon className="size-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Distribution by Category */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Distribution by Category</h2>
          <div className="space-y-3">
            {categoryDist.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-sm text-muted-foreground">
                  {cat.name}
                </span>
                <div className="relative h-6 flex-1 rounded-md bg-muted">
                  <div
                    className={cn("h-full rounded-md", cat.color)}
                    style={{
                      width: `${(cat.count / maxCatCount) * 100}%`,
                      minWidth: "1.5rem",
                    }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution by Status */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Distribution by Status</h2>
          {/* Stacked bar */}
          <div className="mb-4 flex h-8 overflow-hidden rounded-lg">
            {statusDist
              .filter((s) => s.count > 0)
              .map((s) => (
                <div
                  key={s.key}
                  className={cn("flex items-center justify-center text-xs font-medium text-white", s.color)}
                  style={{ width: `${(s.count / totalStatusCount) * 100}%` }}
                >
                  {s.count}
                </div>
              ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {statusDist.map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <span className={cn("inline-block size-3 rounded-full", s.color)} />
                <span className="text-sm text-muted-foreground">
                  {s.label} ({s.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Age Distribution</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ageBuckets.map((b) => (
              <div
                key={b.label}
                className="rounded-xl border border-border bg-muted/40 p-4 text-center"
              >
                <p className="text-2xl font-bold">{b.count}</p>
                <p className="mt-1 text-xs text-muted-foreground">{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warranty Status */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Warranty Status</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4">
              <ShieldCheck className="size-6 text-green-600" />
              <p className="text-2xl font-bold text-green-700">{warrantyValid}</p>
              <p className="text-xs text-green-600">Valid</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <ShieldAlert className="size-6 text-amber-600" />
              <p className="text-2xl font-bold text-amber-700">{warrantySoon}</p>
              <p className="text-xs text-amber-600">Expiring Soon</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
              <ShieldX className="size-6 text-red-600" />
              <p className="text-2xl font-bold text-red-700">{warrantyExpired}</p>
              <p className="text-xs text-red-600">Expired</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
