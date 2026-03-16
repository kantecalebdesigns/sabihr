import { useMemo } from "react";
import {
  TrendingDown,
  DollarSign,
  BarChart3,
  FileDown,
  CalendarRange,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_DEPRECIATION_SCHEDULE,
  formatCurrency,
} from "@/lib/asset-mock-data";

const CATEGORY_COLORS: Record<string, { bar: string; bg: string }> = {
  Laptops: { bar: "bg-blue-500", bg: "bg-blue-100" },
  Monitors: { bar: "bg-violet-500", bg: "bg-violet-100" },
  Phones: { bar: "bg-emerald-500", bg: "bg-emerald-100" },
  Furniture: { bar: "bg-amber-500", bg: "bg-amber-100" },
  Vehicles: { bar: "bg-red-500", bg: "bg-red-100" },
  Networking: { bar: "bg-cyan-500", bg: "bg-cyan-100" },
  Printers: { bar: "bg-slate-500", bg: "bg-slate-100" },
  Other: { bar: "bg-gray-500", bg: "bg-gray-100" },
};

export default function AssetDepreciationReport() {
  // Key metrics
  const totalOriginalCost = MOCK_ASSETS.reduce((s, a) => s + a.purchasePrice, 0);
  const currentTotalValue = MOCK_ASSETS.reduce((s, a) => s + a.currentBookValue, 0);
  const totalDepreciated = totalOriginalCost - currentTotalValue;
  const fullyDepreciatedAssets = MOCK_ASSETS.filter((a) => a.currentBookValue === 0);

  const metricCards = [
    {
      label: "Total Original Cost",
      value: formatCurrency(totalOriginalCost),
      icon: DollarSign,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Current Total Value",
      value: formatCurrency(currentTotalValue),
      icon: BarChart3,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total Depreciated",
      value: formatCurrency(totalDepreciated),
      icon: TrendingDown,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Fully Depreciated",
      value: `${fullyDepreciatedAssets.length} asset${fullyDepreciatedAssets.length !== 1 ? "s" : ""}`,
      icon: AlertCircle,
      color: "text-red-600 bg-red-50",
    },
  ];

  // Book value by category: stacked original vs current
  const categoryValues = useMemo(() => {
    const map = new Map<string, { name: string; original: number; current: number }>();
    MOCK_ASSETS.forEach((a) => {
      const entry = map.get(a.categoryName) ?? { name: a.categoryName, original: 0, current: 0 };
      entry.original += a.purchasePrice;
      entry.current += a.currentBookValue;
      map.set(a.categoryName, entry);
    });
    return Array.from(map.values()).sort((a, b) => b.original - a.original);
  }, []);
  const maxOriginal = Math.max(...categoryValues.map((c) => c.original), 1);

  // 12-month forecast: project monthly depreciation
  const forecast = useMemo(() => {
    const months: { period: string; charge: number }[] = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const period = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

      // Sum monthly depreciation charge for all non-disposed, non-fully-depreciated assets
      let totalCharge = 0;
      MOCK_ASSETS.forEach((a) => {
        if (a.status === "disposed" || a.currentBookValue <= 0) return;
        const depreciable = a.purchasePrice - a.salvageValue;
        const monthlyCharge = depreciable / a.usefulLifeMonths;
        totalCharge += monthlyCharge;
      });

      months.push({ period, charge: Math.round(totalCharge) });
    }
    return months;
  }, []);

  const maxCharge = Math.max(...forecast.map((f) => f.charge), 1);

  // Use actual depreciation schedule data
  const scheduleEntries = MOCK_DEPRECIATION_SCHEDULE;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Asset Depreciation Report</h1>
          <p className="text-sm text-muted-foreground">
            Financial overview of asset depreciation, book values, and forecasted charges.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <FileDown className="size-4" />
          Export for Finance
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={cn("rounded-lg p-2", card.color)}>
                <card.icon className="size-4" />
              </div>
            </div>
            <p className="mt-2 text-xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Book Value by Category */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Book Value by Category</h2>
          <div className="space-y-4">
            {categoryValues.map((cat) => {
              const colors = CATEGORY_COLORS[cat.name] ?? CATEGORY_COLORS.Other;
              const currentPct = (cat.current / (cat.original || 1)) * 100;
              const depreciatedPct = 100 - currentPct;
              return (
                <div key={cat.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{cat.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(cat.current)} / {formatCurrency(cat.original)}
                    </span>
                  </div>
                  <div className="flex h-5 w-full overflow-hidden rounded-md">
                    <div
                      className={cn("h-full", colors.bar)}
                      style={{
                        width: `${(cat.original / maxOriginal) * currentPct}%`,
                        minWidth: cat.current > 0 ? "4px" : "0",
                      }}
                    />
                    <div
                      className={cn("h-full", colors.bg)}
                      style={{
                        width: `${(cat.original / maxOriginal) * depreciatedPct}%`,
                        minWidth: depreciatedPct > 0 ? "2px" : "0",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded bg-blue-500" /> Current Value
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded bg-blue-100" /> Depreciated
            </span>
          </div>
        </div>

        {/* Fully Depreciated Assets Table */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">Fully Depreciated Assets</h2>
          {fullyDepreciatedAssets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No fully depreciated assets at this time.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Asset</th>
                    <th className="pb-2 pr-4 font-medium">Category</th>
                    <th className="pb-2 pr-4 font-medium">Original Cost</th>
                    <th className="pb-2 pr-4 font-medium">Salvage Value</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fullyDepreciatedAssets.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-4">
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.tag}</p>
                      </td>
                      <td className="py-2.5 pr-4">{a.categoryName}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {formatCurrency(a.purchasePrice)}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {formatCurrency(a.salvageValue)}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            a.status === "disposed"
                              ? "bg-gray-50 border-gray-200 text-gray-700"
                              : "bg-red-50 border-red-200 text-red-700"
                          )}
                        >
                          {a.status === "disposed" ? "Disposed" : "Active — Review"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 12-Month Forecast */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <CalendarRange className="size-4" />
          12-Month Depreciation Forecast
        </h2>
        <div className="flex items-end gap-2 overflow-x-auto pb-2">
          {forecast.map((f) => (
            <div key={f.period} className="flex flex-col items-center gap-1" style={{ minWidth: "4.5rem" }}>
              <span className="text-xs font-medium">{formatCurrency(f.charge)}</span>
              <div
                className="w-10 rounded-t-md bg-indigo-500"
                style={{
                  height: `${Math.max((f.charge / maxCharge) * 160, 8)}px`,
                }}
              />
              <span className="text-[10px] text-muted-foreground">{f.period}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Depreciation Schedule Table */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">
          Depreciation Schedule (MacBook Pro 16&quot; M3)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Period</th>
                <th className="pb-2 pr-4 text-right font-medium">Opening Value</th>
                <th className="pb-2 pr-4 text-right font-medium">Charge</th>
                <th className="pb-2 pr-4 text-right font-medium">Accumulated</th>
                <th className="pb-2 text-right font-medium">Closing Value</th>
              </tr>
            </thead>
            <tbody>
              {scheduleEntries.map((entry) => (
                <tr key={entry.period} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4 font-medium">{entry.period}</td>
                  <td className="py-2.5 pr-4 text-right text-muted-foreground">
                    {formatCurrency(entry.openingValue)}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-red-600">
                    -{formatCurrency(entry.charge)}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-muted-foreground">
                    {formatCurrency(entry.accumulated)}
                  </td>
                  <td className="py-2.5 text-right font-medium">
                    {formatCurrency(entry.closingValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
