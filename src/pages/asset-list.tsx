import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  ChevronDown,
  Laptop,
  Monitor,
  Smartphone,
  Armchair,
  Car,
  Wifi,
  Printer,
  Box,
  MoreHorizontal,
  ArrowRightLeft,
  Trash2,
  Download,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_ASSET_CATEGORIES,
  ASSET_STATUS_STYLES,
  ASSET_CONDITION_STYLES,
  formatCurrency,
} from "@/lib/asset-mock-data";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  laptop: <Laptop className="w-4 h-4" />,
  monitor: <Monitor className="w-4 h-4" />,
  smartphone: <Smartphone className="w-4 h-4" />,
  armchair: <Armchair className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
  wifi: <Wifi className="w-4 h-4" />,
  printer: <Printer className="w-4 h-4" />,
  box: <Box className="w-4 h-4" />,
};

type ViewMode = "table" | "grid";

export default function AssetListPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchOpen, setBatchOpen] = useState(false);

  const locations = useMemo(
    () => [...new Set(MOCK_ASSETS.map((a) => a.location))],
    []
  );

  const filtered = useMemo(() => {
    return MOCK_ASSETS.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        (a.assignedToName ?? "").toLowerCase().includes(q);
      const matchesCat =
        categoryFilter === "all" || a.categoryId === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || a.status === statusFilter;
      const matchesLocation =
        locationFilter === "all" || a.location === locationFilter;
      const matchesCondition =
        conditionFilter === "all" || a.condition === conditionFilter;
      return (
        matchesSearch &&
        matchesCat &&
        matchesStatus &&
        matchesLocation &&
        matchesCondition
      );
    });
  }, [search, categoryFilter, statusFilter, locationFilter, conditionFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((a) => a.id)));
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const cat = MOCK_ASSET_CATEGORIES.find((c) => c.id === categoryId);
    return cat ? CATEGORY_ICONS[cat.icon] ?? <Box className="w-4 h-4" /> : <Box className="w-4 h-4" />;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Asset Register
          </h1>
          <p className="text-sm text-muted-foreground">
            {MOCK_ASSETS.length} total assets &middot; {filtered.length} shown
          </p>
        </div>
        <Button onClick={() => navigate("/assets/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBatchOpen(!batchOpen)}
              >
                {selected.size} selected
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              {batchOpen && (
                <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-border bg-card shadow-lg py-1">
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <UserPlus className="w-4 h-4" /> Assign
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <ArrowRightLeft className="w-4 h-4" /> Transfer
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Trash2 className="w-4 h-4" /> Dispose
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setView("table")}
              className={cn(
                "p-2 transition-colors",
                view === "table"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-2 transition-colors",
                view === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-border bg-card p-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Category
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {MOCK_ASSET_CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(ASSET_STATUS_STYLES).map(([key, style]) => (
                  <SelectItem key={key} value={key}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Location
            </label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Condition
            </label>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {Object.entries(ASSET_CONDITION_STYLES).map(([key, style]) => (
                  <SelectItem key={key} value={key}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 && selected.size === filtered.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Asset Tag
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Name
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Category
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Condition
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Location
                </th>
                <th className="p-3 text-left font-medium text-muted-foreground">
                  Assigned To
                </th>
                <th className="p-3 text-right font-medium text-muted-foreground">
                  Book Value
                </th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => {
                const statusStyle = ASSET_STATUS_STYLES[asset.status];
                const condStyle = ASSET_CONDITION_STYLES[asset.condition];
                return (
                  <tr
                    key={asset.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/assets/${asset.id}`)}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(asset.id)}
                        onChange={() => toggleSelect(asset.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3 font-mono text-xs">{asset.tag}</td>
                    <td className="p-3 font-medium">{asset.name}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5">
                        {getCategoryIcon(asset.categoryId)}
                        {asset.categoryName}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                          statusStyle?.bg,
                          statusStyle?.color
                        )}
                      >
                        {statusStyle?.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                          condStyle?.bg,
                          condStyle?.color
                        )}
                      >
                        {condStyle?.label}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {asset.location}
                    </td>
                    <td className="p-3">
                      {asset.assignedToName ?? (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatCurrency(asset.currentBookValue)}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 rounded hover:bg-muted transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No assets match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asset) => {
            const statusStyle = ASSET_STATUS_STYLES[asset.status];
            const condStyle = ASSET_CONDITION_STYLES[asset.condition];
            return (
              <div
                key={asset.id}
                className={cn(
                  "rounded-xl border bg-card p-4 space-y-3 transition-shadow hover:shadow-md cursor-pointer",
                  selected.has(asset.id) ? "border-primary ring-1 ring-primary/20" : "border-border"
                )}
                onClick={() => navigate(`/assets/${asset.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.has(asset.id)}
                      onChange={() => toggleSelect(asset.id)}
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{asset.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {asset.tag}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                      statusStyle?.bg,
                      statusStyle?.color
                    )}
                  >
                    {statusStyle?.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    {getCategoryIcon(asset.categoryId)}
                    {asset.categoryName}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-xs border",
                      condStyle?.bg,
                      condStyle?.color
                    )}
                  >
                    {condStyle?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                  <span className="text-muted-foreground">
                    {asset.assignedToName ?? "Unassigned"}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(asset.currentBookValue)}
                  </span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center p-8 text-muted-foreground">
              No assets match your filters
            </div>
          )}
        </div>
      )}
    </div>
  );
}
