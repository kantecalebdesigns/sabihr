import { useMemo } from "react";
import {
  Activity,
  Clock,
  DollarSign,
  Lightbulb,
  ArrowRightLeft,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_ASSETS, formatCurrency } from "@/lib/asset-mock-data";

export default function AssetUtilization() {
  const now = new Date();

  // Utilization rate by category: assigned / total in category
  const categoryUtil = useMemo(() => {
    const map = new Map<string, { name: string; total: number; assigned: number }>();
    MOCK_ASSETS.forEach((a) => {
      const entry = map.get(a.categoryId) ?? { name: a.categoryName, total: 0, assigned: 0 };
      entry.total++;
      if (a.status === "assigned") entry.assigned++;
      map.set(a.categoryId, entry);
    });
    return Array.from(map.values()).sort((a, b) => {
      const rateA = a.total > 0 ? a.assigned / a.total : 0;
      const rateB = b.total > 0 ? b.assigned / b.total : 0;
      return rateB - rateA;
    });
  }, []);

  // Idle assets: available or maintenance, ranked by days idle
  const idleAssets = useMemo(() => {
    return MOCK_ASSETS.filter((a) => a.status === "available" || a.status === "maintenance")
      .map((a) => {
        const lastActivity = a.assignedDate ?? a.purchaseDate;
        const daysIdle = Math.floor(
          (now.getTime() - new Date(lastActivity).getTime()) / 86400000
        );
        return { ...a, daysIdle };
      })
      .sort((a, b) => b.daysIdle - a.daysIdle);
  }, []);

  // Cost per employee: total purchase price per assigned employee
  const costPerEmployee = useMemo(() => {
    const map = new Map<string, { name: string; cost: number }>();
    MOCK_ASSETS.filter((a) => a.assignedTo && a.assignedToName).forEach((a) => {
      const entry = map.get(a.assignedTo!) ?? { name: a.assignedToName!, cost: 0 };
      entry.cost += a.purchasePrice;
      map.set(a.assignedTo!, entry);
    });
    return Array.from(map.values())
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);
  }, []);

  const maxCost = Math.max(...costPerEmployee.map((e) => e.cost), 1);

  // Recommendations: underutilized assets
  const recommendations = useMemo(() => {
    const items: { asset: string; tag: string; reason: string; action: string; icon: typeof ArrowRightLeft }[] = [];

    // Available assets idle for 30+ days
    idleAssets.forEach((a) => {
      if (a.status === "available" && a.daysIdle > 30) {
        items.push({
          asset: a.name,
          tag: a.tag,
          reason: `Idle for ${a.daysIdle} days, current value ${formatCurrency(a.currentBookValue)}`,
          action: "Consider reallocation to a department in need",
          icon: ArrowRightLeft,
        });
      }
      if (a.status === "maintenance" && a.daysIdle > 60) {
        items.push({
          asset: a.name,
          tag: a.tag,
          reason: `In maintenance for ${a.daysIdle} days`,
          action: "Evaluate repair cost vs. replacement",
          icon: Trash2,
        });
      }
    });

    // Fully depreciated but still active
    MOCK_ASSETS.filter((a) => a.currentBookValue === 0 && a.status !== "disposed").forEach((a) => {
      items.push({
        asset: a.name,
        tag: a.tag,
        reason: "Fully depreciated with zero book value",
        action: "Consider disposal or donation",
        icon: TrendingDown,
      });
    });

    return items;
  }, [idleAssets]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Utilization Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Utilization rates, idle assets, cost allocation, and optimization recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Utilization Rate per Category */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Activity className="size-4" />
            Utilization Rate by Category
          </h2>
          <div className="space-y-4">
            {categoryUtil.map((cat) => {
              const rate = cat.total > 0 ? Math.round((cat.assigned / cat.total) * 100) : 0;
              return (
                <div key={cat.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm">{cat.name}</span>
                    <span className="text-sm font-medium">
                      {rate}%{" "}
                      <span className="text-xs text-muted-foreground">
                        ({cat.assigned}/{cat.total})
                      </span>
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        rate >= 75
                          ? "bg-green-500"
                          : rate >= 50
                            ? "bg-amber-500"
                            : rate > 0
                              ? "bg-red-500"
                              : "bg-gray-300"
                      )}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Idle Assets Ranking */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Clock className="size-4" />
            Idle Assets Ranking
          </h2>
          {idleAssets.length === 0 ? (
            <p className="text-sm text-muted-foreground">All assets are currently in use.</p>
          ) : (
            <div className="space-y-2">
              {idleAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {asset.tag} &middot; {asset.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        asset.daysIdle > 60 ? "text-red-600" : asset.daysIdle > 30 ? "text-amber-600" : "text-muted-foreground"
                      )}
                    >
                      {asset.daysIdle} days
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(asset.currentBookValue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cost per Employee */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="size-4" />
            Cost per Employee (Top 5)
          </h2>
          <div className="space-y-3">
            {costPerEmployee.map((emp) => (
              <div key={emp.name} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm">{emp.name}</span>
                <div className="relative h-6 flex-1 rounded-md bg-muted">
                  <div
                    className="h-full rounded-md bg-indigo-500"
                    style={{ width: `${(emp.cost / maxCost) * 100}%`, minWidth: "1.5rem" }}
                  />
                </div>
                <span className="w-28 text-right text-xs font-medium text-muted-foreground">
                  {formatCurrency(emp.cost)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="size-4 text-amber-500" />
            Recommendations
          </h2>
          {recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No optimization recommendations at this time.
            </p>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-amber-200 bg-amber-50 p-4"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <rec.icon className="size-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">{rec.asset}</span>
                    <span className="text-xs text-amber-600">({rec.tag})</span>
                  </div>
                  <p className="text-xs text-amber-700">{rec.reason}</p>
                  <p className="mt-1 text-xs font-medium text-amber-800">{rec.action}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
