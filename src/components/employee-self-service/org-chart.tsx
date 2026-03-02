import { MOCK_ORG_CHART } from "@/lib/employee-mock-data";
import type { OrgChartNode } from "@/types/employee";

function OrgNode({ node, isRoot = false }: { node: OrgChartNode; isRoot?: boolean }) {
  const initials = node.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center">
      {/* Node card */}
      <div className={`bg-card border rounded-xl px-4 py-3 text-center min-w-[160px] ${isRoot ? "border-primary shadow-sm" : "border-border"}`}>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
          <span className="text-xs font-semibold text-primary">{initials}</span>
        </div>
        <p className="text-sm font-medium leading-tight">{node.name}</p>
        <p className="text-[11px] text-muted-foreground">{node.title}</p>
        <p className="text-[10px] text-primary/70">{node.department}</p>
      </div>

      {/* Children */}
      {node.children.length > 0 && (
        <>
          {/* Vertical connector from parent */}
          <div className="w-px h-6 bg-border" />

          {/* Horizontal connector bar */}
          {node.children.length > 1 && (
            <div className="relative w-full flex justify-center">
              <div
                className="h-px bg-border absolute top-0"
                style={{
                  left: `${100 / (node.children.length * 2)}%`,
                  right: `${100 / (node.children.length * 2)}%`,
                }}
              />
            </div>
          )}

          {/* Child nodes */}
          <div className="flex gap-4 pt-0">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <OrgNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function OrgChart() {
  return (
    <div className="overflow-x-auto py-4">
      <div className="inline-flex justify-center min-w-full">
        <OrgNode node={MOCK_ORG_CHART} isRoot />
      </div>
    </div>
  );
}
