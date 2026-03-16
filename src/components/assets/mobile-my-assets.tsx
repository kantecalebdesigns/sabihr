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
  AlertTriangle,
  RotateCcw,
  Camera,
  X,
  Scan,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_ASSETS, ASSET_CONDITION_STYLES } from "@/lib/asset-mock-data";
import type { Asset } from "@/types/asset";

const CURRENT_EMPLOYEE_ID = "emp-001";

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

export function MobileMyAssets() {
  const myAssets = MOCK_ASSETS.filter(
    (a) => a.assignedTo === CURRENT_EMPLOYEE_ID
  );
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">My Assets</h1>
          <p className="text-xs text-muted-foreground">
            {myAssets.length} asset{myAssets.length !== 1 ? "s" : ""} assigned
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowScanner(true)}
        >
          <Camera className="size-4" />
          Scan QR Code
        </Button>
      </div>

      {/* Asset list — single column, mobile optimized */}
      <div className="space-y-3">
        {myAssets.map((asset) => (
          <MobileAssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {/* QR Scanner overlay */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm px-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-6 text-white hover:bg-white/10"
              onClick={() => setShowScanner(false)}
            >
              <X className="size-6" />
            </Button>

            {/* Viewfinder */}
            <div className="relative aspect-square w-full rounded-2xl border-2 border-white/40 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Scan className="size-16 text-white/60 animate-pulse" />
              </div>
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
              {/* Scan line */}
              <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-green-400/80 animate-pulse" />
            </div>

            <p className="text-center text-white/80 text-sm mt-4">
              Point your camera at an asset QR code to quickly report an issue
              or view details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileAssetCard({ asset }: { asset: Asset }) {
  const IconComp = CATEGORY_ICONS[asset.categoryName] || Box;
  const conditionStyle = ASSET_CONDITION_STYLES[asset.condition];

  return (
    <Card className="rounded-xl border-border bg-card">
      <CardContent className="space-y-3">
        {/* Top row */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
            <IconComp className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{asset.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">{asset.tag}</span>
              {conditionStyle && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    conditionStyle.color,
                    conditionStyle.bg
                  )}
                >
                  {conditionStyle.label}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{asset.categoryName}</span>
          <span>
            Assigned{" "}
            {asset.assignedDate
              ? new Date(asset.assignedDate).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
          </span>
        </div>

        {/* Action buttons — visible for mobile swipe-like actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-9"
          >
            <AlertTriangle className="size-3.5" />
            Report Issue
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-9"
          >
            <RotateCcw className="size-3.5" />
            Return
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
