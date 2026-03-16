import { useState } from "react";
import {
  QrCode,
  Download,
  Printer as PrinterIcon,
  Check,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MOCK_ASSETS } from "@/lib/asset-mock-data";

type LabelSize = "small" | "medium" | "large";

const LABEL_SIZES: { value: LabelSize; label: string; width: string; height: string }[] = [
  { value: "small", label: "Small (50x25mm)", width: "w-48", height: "h-24" },
  { value: "medium", label: "Medium (70x35mm)", width: "w-64", height: "h-32" },
  { value: "large", label: "Large (100x50mm)", width: "w-80", height: "h-40" },
];

export default function BarcodeLabelPreview() {
  const [selectedSize, setSelectedSize] = useState<LabelSize>("medium");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(
    new Set([MOCK_ASSETS[0].id])
  );

  const sizeConfig = LABEL_SIZES.find((s) => s.value === selectedSize)!;

  const toggleAsset = (id: string) => {
    setSelectedAssets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedAssets.size === MOCK_ASSETS.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(MOCK_ASSETS.map((a) => a.id)));
    }
  };

  const selectedAssetsList = MOCK_ASSETS.filter((a) =>
    selectedAssets.has(a.id)
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Barcode Label Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate and print barcode/QR labels for assets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Selection */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/50 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Select Assets ({selectedAssets.size})
            </p>
            <button
              onClick={selectAll}
              className="text-xs text-primary font-medium hover:underline"
            >
              {selectedAssets.size === MOCK_ASSETS.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
            {MOCK_ASSETS.map((asset) => (
              <button
                key={asset.id}
                onClick={() => toggleAsset(asset.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 text-left transition-colors",
                  selectedAssets.has(asset.id)
                    ? "bg-primary/5"
                    : "hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                    selectedAssets.has(asset.id)
                      ? "bg-primary border-primary text-white"
                      : "border-muted-foreground/30"
                  )}
                >
                  {selectedAssets.has(asset.id) && (
                    <Check className="w-3 h-3" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{asset.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {asset.tag}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Label Format
              </label>
              <Select
                value={selectedSize}
                onValueChange={(v) => setSelectedSize(v as LabelSize)}
              >
                <SelectTrigger className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LABEL_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button>
                <PrinterIcon className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* Label Preview */}
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Print Preview
            </p>
            {selectedAssetsList.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Select assets to preview labels
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {selectedAssetsList.map((asset) => (
                  <div
                    key={asset.id}
                    className={cn(
                      "border-2 border-dashed border-border rounded-lg p-3 flex gap-3 items-center bg-white",
                      sizeConfig.width,
                      sizeConfig.height
                    )}
                  >
                    {/* QR Code Mock */}
                    <div
                      className={cn(
                        "shrink-0 rounded border border-border bg-muted flex items-center justify-center",
                        selectedSize === "small"
                          ? "w-14 h-14"
                          : selectedSize === "medium"
                            ? "w-20 h-20"
                            : "w-24 h-24"
                      )}
                    >
                      <QrCode
                        className={cn(
                          "text-foreground",
                          selectedSize === "small"
                            ? "w-8 h-8"
                            : selectedSize === "medium"
                              ? "w-12 h-12"
                              : "w-16 h-16"
                        )}
                      />
                    </div>

                    {/* Label Info */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p
                        className={cn(
                          "font-bold text-foreground leading-tight truncate",
                          selectedSize === "small"
                            ? "text-[10px]"
                            : selectedSize === "medium"
                              ? "text-xs"
                              : "text-sm"
                        )}
                      >
                        {asset.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Tag
                          className={cn(
                            "shrink-0 text-muted-foreground",
                            selectedSize === "small"
                              ? "w-2 h-2"
                              : "w-3 h-3"
                          )}
                        />
                        <p
                          className={cn(
                            "font-mono font-bold text-foreground",
                            selectedSize === "small"
                              ? "text-[9px]"
                              : selectedSize === "medium"
                                ? "text-[10px]"
                                : "text-xs"
                          )}
                        >
                          {asset.tag}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "text-muted-foreground",
                          selectedSize === "small"
                            ? "text-[8px]"
                            : selectedSize === "medium"
                              ? "text-[9px]"
                              : "text-[10px]"
                        )}
                      >
                        {asset.categoryName}
                      </p>
                      {selectedSize !== "small" && (
                        <p
                          className={cn(
                            "text-muted-foreground font-mono",
                            selectedSize === "medium"
                              ? "text-[8px]"
                              : "text-[9px]"
                          )}
                        >
                          S/N: {asset.serialNumber}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Batch Info */}
          {selectedAssetsList.length > 0 && (
            <div className="rounded-lg bg-muted/50 border border-border p-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {selectedAssetsList.length} label(s) ready for printing
              </p>
              <p className="text-xs text-muted-foreground">
                Format: {LABEL_SIZES.find((s) => s.value === selectedSize)?.label}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
