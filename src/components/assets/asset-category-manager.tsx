import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  Save,
  X,
  Laptop,
  Monitor,
  Smartphone,
  Armchair,
  Car,
  Wifi,
  Printer,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MOCK_ASSET_CATEGORIES } from "@/lib/asset-mock-data";
import type { AssetCategory } from "@/types/asset";

const ICON_MAP: Record<string, React.ReactNode> = {
  laptop: <Laptop className="w-4 h-4" />,
  monitor: <Monitor className="w-4 h-4" />,
  smartphone: <Smartphone className="w-4 h-4" />,
  armchair: <Armchair className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
  wifi: <Wifi className="w-4 h-4" />,
  printer: <Printer className="w-4 h-4" />,
  box: <Box className="w-4 h-4" />,
};

export default function AssetCategoryManager() {
  const [categories] = useState<AssetCategory[]>(MOCK_ASSET_CATEGORIES);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_ASSET_CATEGORIES[0]?.id ?? null
  );
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");

  const selectedCategory = categories.find((c) => c.id === selectedId);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Asset Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage asset categories, sub-categories, and default settings
          </p>
        </div>
        <Button onClick={() => setAddingCategory(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Tree */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/50">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Categories
            </p>
          </div>

          {/* Add category inline form */}
          {addingCategory && (
            <div className="p-3 border-b border-border bg-primary/5">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Category name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="h-8 text-xs flex-1"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setAddingCategory(false);
                    setNewCatName("");
                  }}
                  className="p-1 rounded hover:bg-muted text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setAddingCategory(false);
                    setNewCatName("");
                  }}
                  className="p-1 rounded hover:bg-muted text-primary"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="divide-y divide-border">
            {categories.map((cat) => (
              <div key={cat.id}>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors",
                    selectedId === cat.id
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : "hover:bg-muted/50 border-l-2 border-l-transparent"
                  )}
                  onClick={() => setSelectedId(cat.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(cat.id);
                    }}
                    className="p-0.5 rounded hover:bg-muted text-muted-foreground"
                  >
                    {expandedId === cat.id ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className={cat.color}>
                    {ICON_MAP[cat.icon] ?? <Box className="w-4 h-4" />}
                  </span>

                  {editingId === cat.id ? (
                    <Input
                      defaultValue={cat.name}
                      className="h-7 text-xs flex-1"
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape")
                          setEditingId(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm font-medium flex-1">
                      {cat.name}
                    </span>
                  )}

                  <span className="text-xs text-muted-foreground">
                    {cat.assetCount}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(cat.id);
                    }}
                    className="p-1 rounded hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 hover:opacity-100"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Sub-categories */}
                {expandedId === cat.id && (
                  <div className="bg-muted/30">
                    {cat.subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-2 pl-10 pr-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        <span className="flex-1">{sub.name}</span>
                        <span className="text-xs">{sub.assetCount}</span>
                      </div>
                    ))}
                    {addingSubTo === cat.id ? (
                      <div className="flex items-center gap-2 pl-10 pr-3 py-2">
                        <Input
                          placeholder="Sub-category name"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          className="h-7 text-xs flex-1"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            setAddingSubTo(null);
                            setNewSubName("");
                          }}
                          className="p-1 rounded hover:bg-muted text-muted-foreground"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingSubTo(cat.id)}
                        className="flex items-center gap-1.5 pl-10 pr-3 py-2 text-xs text-primary hover:bg-primary/5 w-full transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add sub-category
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Category Detail Panel */}
        <div className="lg:col-span-2">
          {selectedCategory ? (
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "p-2.5 rounded-lg",
                    selectedCategory.color,
                    "bg-muted"
                  )}
                >
                  {ICON_MAP[selectedCategory.icon] ?? (
                    <Box className="w-5 h-5" />
                  )}
                </span>
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedCategory.assetCount} assets &middot;{" "}
                    {selectedCategory.subCategories.length} sub-categories
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Depreciation Method
                  </p>
                  <p className="text-sm font-medium capitalize">
                    {selectedCategory.defaultDepreciationMethod}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Default Useful Life
                  </p>
                  <p className="text-sm font-medium">
                    {selectedCategory.defaultUsefulLife} months
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Maintenance Frequency
                  </p>
                  <p className="text-sm font-medium">
                    {selectedCategory.defaultMaintenanceFrequency > 0
                      ? `Every ${selectedCategory.defaultMaintenanceFrequency} months`
                      : "Not scheduled"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Sub-Categories</h3>
                {selectedCategory.subCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No sub-categories defined
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCategory.subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <span className="text-sm">{sub.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {sub.assetCount} assets
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Default Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Depreciation Method</Label>
                    <Input
                      value={selectedCategory.defaultDepreciationMethod}
                      readOnly
                      className="h-8 text-xs capitalize"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Useful Life (months)</Label>
                    <Input
                      value={selectedCategory.defaultUsefulLife}
                      readOnly
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      Maintenance Frequency (months)
                    </Label>
                    <Input
                      value={selectedCategory.defaultMaintenanceFrequency || "N/A"}
                      readOnly
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground text-sm">
              Select a category to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
