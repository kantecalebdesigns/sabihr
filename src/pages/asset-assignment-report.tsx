import { useState, useMemo } from "react";
import {
  Users,
  PackageOpen,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_ASSETS,
  MOCK_ASSIGNMENTS,
  MOCK_RETURN_REQUESTS,
} from "@/lib/asset-mock-data";

const DEPT_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

export default function AssetAssignmentReport() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // Department distribution from active assignments
  const activeAssignments = MOCK_ASSIGNMENTS.filter((a) => a.status === "active");

  const deptDist = useMemo(() => {
    const map = new Map<string, number>();
    activeAssignments.forEach((a) => map.set(a.department, (map.get(a.department) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([dept, count], i) => ({
        dept,
        count,
        color: DEPT_COLORS[i % DEPT_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const maxDeptCount = Math.max(...deptDist.map((d) => d.count), 1);

  // Unassigned / idle assets
  const unassignedAssets = MOCK_ASSETS.filter((a) => a.status === "available");

  // Assets per employee
  const empAssets = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    activeAssignments.forEach((a) => {
      const existing = map.get(a.employeeId);
      if (existing) {
        existing.count++;
      } else {
        map.set(a.employeeId, { name: a.employeeName, count: 1 });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, []);

  // Overdue returns: return requests past proposed date that are not completed
  const now = new Date();
  const overdueReturns = MOCK_RETURN_REQUESTS.filter(
    (r) => r.status !== "completed" && r.status !== "returned" && new Date(r.proposedDate) < now
  );

  // Filtered assignments for drill-down
  const filteredAssignments = selectedDept
    ? activeAssignments.filter((a) => a.department === selectedDept)
    : activeAssignments;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Asset Assignment Report</h1>
        <p className="text-sm text-muted-foreground">
          Current assignment distribution, idle assets, and overdue returns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Assignments by Department */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Users className="size-4" />
            Assignments by Department
          </h2>
          <div className="space-y-3">
            {deptDist.map((d) => (
              <button
                key={d.dept}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-1.5 text-left transition hover:bg-accent",
                  selectedDept === d.dept && "bg-accent"
                )}
                onClick={() => setSelectedDept(selectedDept === d.dept ? null : d.dept)}
              >
                <span className="w-28 shrink-0 truncate text-sm">{d.dept}</span>
                <div className="relative h-6 flex-1 rounded-md bg-muted">
                  <div
                    className={cn("h-full rounded-md transition-all", d.color)}
                    style={{ width: `${(d.count / maxDeptCount) * 100}%`, minWidth: "1.5rem" }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium">{d.count}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Unassigned / Idle Assets */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <PackageOpen className="size-4" />
            Unassigned / Idle Assets
            <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {unassignedAssets.length}
            </span>
          </h2>
          {unassignedAssets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No idle assets at this time.</p>
          ) : (
            <div className="space-y-2">
              {unassignedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {asset.tag} &middot; {asset.categoryName} &middot; {asset.location}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    Available
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Employees by Asset Count */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <UserCheck className="size-4" />
            Assets per Employee
          </h2>
          <div className="space-y-2">
            {empAssets.map((emp, i) => (
              <div
                key={emp.name}
                className="flex items-center justify-between rounded-lg px-3 py-2 odd:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm">{emp.name}</span>
                </div>
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {emp.count} {emp.count === 1 ? "asset" : "assets"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Returns */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="size-4 text-red-500" />
            Overdue Returns
            {overdueReturns.length > 0 && (
              <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                {overdueReturns.length}
              </span>
            )}
          </h2>
          {overdueReturns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No overdue returns at this time.</p>
          ) : (
            <div className="space-y-2">
              {overdueReturns.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-red-800">{r.assetName}</p>
                    <span className="text-xs font-medium text-red-600">
                      Due: {r.proposedDate}
                    </span>
                  </div>
                  <p className="text-xs text-red-600">
                    {r.employeeName} &middot; {r.assetTag} &middot; Status: {r.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drill-down Table */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          {selectedDept && (
            <Button variant="ghost" size="icon-sm" onClick={() => setSelectedDept(null)}>
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <h2 className="text-sm font-semibold">
            {selectedDept ? `Assignments — ${selectedDept}` : "All Active Assignments"}
          </h2>
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
            {filteredAssignments.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Asset</th>
                <th className="pb-2 pr-4 font-medium">Tag</th>
                <th className="pb-2 pr-4 font-medium">Employee</th>
                <th className="pb-2 pr-4 font-medium">Department</th>
                <th className="pb-2 pr-4 font-medium">Assigned Date</th>
                <th className="pb-2 font-medium">Acknowledged</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4 font-medium">{a.assetName}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{a.assetTag}</td>
                  <td className="py-2.5 pr-4">{a.employeeName}</td>
                  <td className="py-2.5 pr-4">{a.department}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{a.assignedDate}</td>
                  <td className="py-2.5">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        a.acknowledged
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-amber-50 border border-amber-200 text-amber-700"
                      )}
                    >
                      {a.acknowledged ? "Yes" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
