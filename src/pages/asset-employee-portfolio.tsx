import { useState, useMemo } from "react";
import {
  Package,
  RotateCcw,
  ArrowRightLeft,
  Wrench,
  History,
  CalendarDays,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_ASSIGNMENTS,
  ASSET_CONDITION_STYLES,
  formatCurrency,
} from "@/lib/asset-mock-data";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Derive employees from assignments
const EMPLOYEES = (() => {
  const map = new Map<
    string,
    { id: string; name: string; department: string }
  >();
  MOCK_ASSIGNMENTS.forEach((a) => {
    if (!map.has(a.employeeId)) {
      map.set(a.employeeId, {
        id: a.employeeId,
        name: a.employeeName,
        department: a.department,
      });
    }
  });
  return Array.from(map.values());
})();

type Tab = "assets" | "history";

export default function AssetEmployeePortfolioPage() {
  const [selectedEmpId, setSelectedEmpId] = useState(EMPLOYEES[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<Tab>("assets");
  const [actionToast, setActionToast] = useState<string | null>(null);

  const employee = EMPLOYEES.find((e) => e.id === selectedEmpId);

  const activeAssignments = useMemo(
    () =>
      MOCK_ASSIGNMENTS.filter(
        (a) => a.employeeId === selectedEmpId && a.status === "active"
      ),
    [selectedEmpId]
  );

  const allAssignments = useMemo(
    () => MOCK_ASSIGNMENTS.filter((a) => a.employeeId === selectedEmpId),
    [selectedEmpId]
  );

  const assignedAssets = useMemo(
    () =>
      activeAssignments
        .map((a) => {
          const asset = MOCK_ASSETS.find((ast) => ast.id === a.assetId);
          return asset ? { ...asset, assignmentDate: a.assignedDate } : null;
        })
        .filter(Boolean) as (typeof MOCK_ASSETS[0] & { assignmentDate: string })[],
    [activeAssignments]
  );

  const totalValue = assignedAssets.reduce(
    (sum, a) => sum + a.currentBookValue,
    0
  );

  function showToast(msg: string) {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 2000);
  }

  if (!employee) {
    return (
      <div className="max-w-[1200px] mx-auto py-12 text-center text-sm text-muted-foreground">
        No employee data available
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Employee selector */}
      <div className="flex items-center gap-3">
        <select
          value={selectedEmpId}
          onChange={(e) => {
            setSelectedEmpId(e.target.value);
            setActiveTab("assets");
          }}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          {EMPLOYEES.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} — {e.department}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Header */}
      <div className="border border-border rounded-xl bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold shrink-0">
            {getInitials(employee.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">
              {employee.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {employee.department}
            </p>
          </div>
          <div className="hidden sm:flex gap-6 text-center">
            <div>
              <p className="text-lg font-semibold">{assignedAssets.length}</p>
              <p className="text-xs text-muted-foreground">Assets</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {formatCurrency(totalValue)}
              </p>
              <p className="text-xs text-muted-foreground">Total Value</p>
            </div>
          </div>
        </div>
        {/* Mobile stats */}
        <div className="flex sm:hidden gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{assignedAssets.length}</span>
            <span className="text-muted-foreground">assets</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{formatCurrency(totalValue)}</span>
            <span className="text-muted-foreground">total value</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("assets")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "assets"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Package className="w-4 h-4" />
          Assigned Assets
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <History className="w-4 h-4" />
          Assignment History
        </button>
      </div>

      {/* Assets tab */}
      {activeTab === "assets" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedAssets.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground text-center py-12">
              No assets currently assigned
            </p>
          )}
          {assignedAssets.map((asset) => {
            const condStyle = ASSET_CONDITION_STYLES[asset.condition];
            return (
              <div
                key={asset.id}
                className="border border-border rounded-xl bg-card p-4 space-y-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{asset.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Tag className="w-3 h-3" />
                    {asset.tag}
                    <span>&middot;</span>
                    {asset.categoryName}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "inline-flex items-center text-xs px-2 py-0.5 rounded-full border",
                      condStyle.bg,
                      condStyle.color
                    )}
                  >
                    {condStyle.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="w-3 h-3" />
                    {asset.assignmentDate}
                  </span>
                </div>

                <div className="flex gap-2 pt-1 border-t border-border">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => showToast(`Return initiated for ${asset.name}`)}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Return
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      showToast(`Transfer started for ${asset.name}`)
                    }
                  >
                    <ArrowRightLeft className="w-3 h-3 mr-1" />
                    Transfer
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      showToast(`Condition update for ${asset.name}`)
                    }
                  >
                    <Wrench className="w-3 h-3 mr-1" />
                    Condition
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History tab */}
      {activeTab === "history" && (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Asset
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Tag
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Assigned
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Returned
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Assigned By
                  </th>
                </tr>
              </thead>
              <tbody>
                {allAssignments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No assignment history
                    </td>
                  </tr>
                )}
                {allAssignments.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">{a.assetName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.assetTag}
                    </td>
                    <td className="px-4 py-3">{a.assignedDate}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.returnedDate ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center text-xs px-2 py-0.5 rounded-full border",
                          a.status === "active"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : a.status === "returned"
                              ? "bg-gray-50 border-gray-200 text-gray-700"
                              : "bg-blue-50 border-blue-200 text-blue-700"
                        )}
                      >
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.assignedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast */}
      {actionToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm px-4 py-2.5 rounded-xl shadow-lg">
          {actionToast}
        </div>
      )}
    </div>
  );
}
