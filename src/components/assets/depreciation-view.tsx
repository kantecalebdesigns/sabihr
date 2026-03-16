import {
  DollarSign,
  TrendingDown,
  Clock,
  BarChart3,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/asset-mock-data";
import type { Asset, DepreciationEntry } from "@/types/asset";

interface DepreciationViewProps {
  asset: Asset;
  schedule: DepreciationEntry[];
}

export default function DepreciationView({
  asset,
  schedule,
}: DepreciationViewProps) {
  const totalDepreciated = asset.purchasePrice - asset.currentBookValue;
  const depreciationPct =
    asset.purchasePrice > 0
      ? ((totalDepreciated / asset.purchasePrice) * 100).toFixed(1)
      : "0";

  const elapsedMonths = Math.round(
    (Date.now() - new Date(asset.purchaseDate).getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );
  const remainingMonths = Math.max(0, asset.usefulLifeMonths - elapsedMonths);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium">Purchase Price</span>
          </div>
          <p className="text-lg font-bold">
            {formatCurrency(asset.purchasePrice)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-medium">Current Book Value</span>
          </div>
          <p className="text-lg font-bold">
            {formatCurrency(asset.currentBookValue)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-medium">Total Depreciated</span>
          </div>
          <p className="text-lg font-bold text-red-600">
            {formatCurrency(totalDepreciated)}
          </p>
          <p className="text-xs text-muted-foreground">{depreciationPct}%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Remaining Life</span>
          </div>
          <p className="text-lg font-bold">{remainingMonths} months</p>
          <p className="text-xs text-muted-foreground">
            of {asset.usefulLifeMonths} months
          </p>
        </div>
      </div>

      {/* Method Indicator */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium capitalize">
              {asset.depreciationMethod.replace("-", " ")} Method
            </p>
            <p className="text-xs text-muted-foreground">
              Salvage value: {formatCurrency(asset.salvageValue)}
            </p>
          </div>
        </div>
        <button className="text-xs text-primary font-medium hover:underline underline-offset-2">
          Compare methods
        </button>
      </div>

      {/* Depreciation Table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">
                Period
              </th>
              <th className="p-3 text-right font-medium text-muted-foreground">
                Opening Value
              </th>
              <th className="p-3 text-right font-medium text-muted-foreground">
                Depreciation Charge
              </th>
              <th className="p-3 text-right font-medium text-muted-foreground">
                Accumulated
              </th>
              <th className="p-3 text-right font-medium text-muted-foreground">
                Closing Value
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((entry, i) => (
              <tr
                key={entry.period}
                className={cn(
                  "border-b border-border last:border-0 transition-colors",
                  i === schedule.length - 1 && "bg-primary/5 font-medium"
                )}
              >
                <td className="p-3">{entry.period}</td>
                <td className="p-3 text-right">
                  {formatCurrency(entry.openingValue)}
                </td>
                <td className="p-3 text-right text-red-600">
                  -{formatCurrency(entry.charge)}
                </td>
                <td className="p-3 text-right text-muted-foreground">
                  {formatCurrency(entry.accumulated)}
                </td>
                <td className="p-3 text-right font-medium">
                  {formatCurrency(entry.closingValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
