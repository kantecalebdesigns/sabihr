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
  FileText,
  ArrowLeft,
  Tag,
  Calendar,
  Hash,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_ASSETS, ASSET_CONDITION_STYLES } from "@/lib/asset-mock-data";

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

export default function EmployeeAssetDetailPage() {
  const asset = MOCK_ASSETS[0];
  const IconComp = CATEGORY_ICONS[asset.categoryName] || Box;
  const conditionStyle = ASSET_CONDITION_STYLES[asset.condition];

  const details = [
    {
      icon: Tag,
      label: "Asset Tag",
      value: asset.tag,
    },
    {
      icon: Layers,
      label: "Category",
      value: asset.categoryName,
    },
    {
      icon: Hash,
      label: "Serial Number",
      value: asset.serialNumber,
    },
    {
      icon: Calendar,
      label: "Assigned Date",
      value: asset.assignedDate
        ? new Date(asset.assignedDate).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-",
    },
  ];

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm">
        <ArrowLeft className="size-4" />
        Back to My Assets
      </Button>

      {/* Header card */}
      <Card className="rounded-xl border-[#efefef] bg-white">
        <CardContent className="flex flex-col sm:flex-row gap-6">
          {/* Icon placeholder */}
          <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#f8fafc]">
            <IconComp className="size-10 text-slate-500" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold">{asset.name}</h1>
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
            </div>
            <p className="text-sm text-slate-500">
              {asset.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="rounded-xl border-[#efefef] bg-white">
        <CardHeader>
          <CardTitle className="text-sm">Asset Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#f8fafc]">
                  <d.icon className="size-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{d.label}</p>
                  <p className="text-sm font-medium">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      {Object.keys(asset.specifications).length > 0 && (
        <Card className="rounded-xl border-[#efefef] bg-white">
          <CardHeader>
            <CardTitle className="text-sm">Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(asset.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between rounded-lg bg-[#f8fafc] px-3 py-2"
                >
                  <span className="text-sm text-slate-500">{key}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline">
          <AlertTriangle className="size-4" />
          Report Issue
        </Button>
        <Button variant="outline">
          <RotateCcw className="size-4" />
          Request Return
        </Button>
        <Button variant="outline">
          <FileText className="size-4" />
          View Acknowledgment Receipt
        </Button>
      </div>
    </div>
  );
}
