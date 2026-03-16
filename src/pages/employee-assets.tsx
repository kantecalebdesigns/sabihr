import { useState } from "react";
import {
  Laptop,
  Monitor,
  Smartphone,
  Armchair,
  Car,
  Wifi,
  Printer,
  Box,
  Plus,
  AlertTriangle,
  RotateCcw,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_ASSETS, ASSET_CONDITION_STYLES } from "@/lib/asset-mock-data";
import type { Asset } from "@/types/asset";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Laptops: Laptop,
  Monitors: Monitor,
  Phones: Smartphone,
  Furniture: Armchair,
  Vehicles: Car,
  Networking: Wifi,
  Printers: Printer,
  Other: Box,
};

const CURRENT_EMPLOYEE_ID = "emp-001";

export default function EmployeeAssetsPage() {
  const myAssets = MOCK_ASSETS.filter(
    (a) => a.assignedTo === CURRENT_EMPLOYEE_ID
  );
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", ...new Set(myAssets.map((a) => a.categoryName))];
  const filtered =
    filter === "all"
      ? myAssets
      : myAssets.filter((a) => a.categoryName === filter);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Assets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            You have{" "}
            <span className="font-medium text-foreground">
              {myAssets.length}
            </span>{" "}
            asset{myAssets.length !== 1 ? "s" : ""} assigned to you
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          Request New Asset
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
          >
            {cat === "all" ? "All" : cat}
          </Button>
        ))}
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="size-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No assets found in this category.</p>
        </div>
      )}
    </div>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  const IconComp = CATEGORY_ICONS[asset.categoryName] || Box;
  const conditionStyle = ASSET_CONDITION_STYLES[asset.condition];

  return (
    <Card className="rounded-xl border-border bg-card">
      <CardContent className="space-y-4">
        {/* Icon + Name */}
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <IconComp className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-tight truncate">
              {asset.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{asset.tag}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Category</p>
            <p className="font-medium">{asset.categoryName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Assigned</p>
            <p className="font-medium">
              {asset.assignedDate
                ? new Date(asset.assignedDate).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </p>
          </div>
        </div>

        {/* Condition Badge */}
        {conditionStyle && (
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              conditionStyle.color,
              conditionStyle.bg
            )}
          >
            {conditionStyle.label}
          </Badge>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-1 border-t border-border">
          <Button variant="ghost" size="sm" className="flex-1 text-xs">
            <AlertTriangle className="size-3.5" />
            Report Issue
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-xs">
            <RotateCcw className="size-3.5" />
            Request Return
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
