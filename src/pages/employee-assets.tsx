import { useState } from "react";
import { Link } from "react-router-dom";
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
  Wrench,
  Package,
  X,
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

const ASSET_CATEGORIES = ["Laptops", "Monitors", "Phones", "Furniture", "Vehicles", "Networking", "Printers", "Other"];

export default function EmployeeAssetsPage() {
  const myAssets = MOCK_ASSETS.filter(
    (a) => a.assignedTo === CURRENT_EMPLOYEE_ID
  );
  const [filter, setFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formCategory, setFormCategory] = useState("Laptops");
  const [formAssetName, setFormAssetName] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formUrgency, setFormUrgency] = useState("normal");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowModal(false);
    setFormCategory("Laptops");
    setFormAssetName("");
    setFormReason("");
    setFormUrgency("normal");
    setSuccessMessage("Asset request submitted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

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
          <p className="text-sm text-slate-500 mt-1">
            You have{" "}
            <span className="font-medium text-slate-900">
              {myAssets.length}
            </span>{" "}
            asset{myAssets.length !== 1 ? "s" : ""} assigned to you
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
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
        <div className="text-center py-12 text-slate-500">
          <Package className="size-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No assets found in this category.</p>
        </div>
      )}

      {/* Toast */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Request Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-[#efefef] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Request New Asset
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  {ASSET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Asset Name / Description
                </label>
                <input
                  type="text"
                  required
                  value={formAssetName}
                  onChange={(e) => setFormAssetName(e.target.value)}
                  placeholder="e.g. MacBook Pro 16-inch"
                  className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Urgency
                </label>
                <select
                  value={formUrgency}
                  onChange={(e) => setFormUrgency(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#efefef] bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Reason
                </label>
                <textarea
                  required
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Why do you need this asset?"
                  className="w-full rounded-lg border border-[#efefef] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-9 rounded-lg border border-[#efefef] bg-white px-4 text-sm font-medium text-slate-700 hover:bg-[#f8fafc] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  const IconComp = CATEGORY_ICONS[asset.categoryName] || Box;
  const conditionStyle = ASSET_CONDITION_STYLES[asset.condition];

  return (
    <Card className="rounded-xl border-[#efefef] bg-white">
      <CardContent className="space-y-4">
        {/* Icon + Name */}
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f8fafc]">
            <IconComp className="size-5 text-slate-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-tight truncate">
              {asset.name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{asset.tag}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <p className="text-xs text-slate-500">Category</p>
            <p className="font-medium">{asset.categoryName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Assigned</p>
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
        <div className="flex gap-1 pt-1 border-t border-[#efefef]">
          <Button variant="ghost" size="sm" className="flex-1 text-xs px-2" asChild>
            <Link to="/employee/assets/report-issue">
              <AlertTriangle className="size-3.5" />
              Report
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-xs px-2" asChild>
            <Link to="/employee/assets/maintenance-request">
              <Wrench className="size-3.5" />
              Maintenance
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-xs px-2" asChild>
            <Link to="/employee/assets/return">
              <RotateCcw className="size-3.5" />
              Return
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
