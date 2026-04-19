import { useMemo } from "react";
import { Building, Users, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
  code: string;
  type: "headquarters" | "regional" | "satellite";
  city: string;
  manager: string;
  employeeCount: number;
  parentId: string | null;
}

const BRANCHES: Branch[] = [
  { id: "br-1", name: "Lagos Headquarters", code: "LAG-HQ", type: "headquarters", city: "Lagos", manager: "Fatima Abdullahi", employeeCount: 68, parentId: null },
  { id: "br-2", name: "Abuja Regional Office", code: "ABJ-RG", type: "regional", city: "Abuja", manager: "Ibrahim Musa", employeeCount: 32, parentId: "br-1" },
  { id: "br-3", name: "Port Harcourt Branch", code: "PHC-RG", type: "regional", city: "Port Harcourt", manager: "Emeka Okafor", employeeCount: 24, parentId: "br-1" },
  { id: "br-5", name: "Ibadan Satellite Office", code: "IBA-ST", type: "satellite", city: "Ibadan", manager: "Bukola Adeyemi", employeeCount: 14, parentId: "br-1" },
  { id: "br-4", name: "Kano Satellite Office", code: "KAN-ST", type: "satellite", city: "Kano", manager: "Aisha Mohammed", employeeCount: 18, parentId: "br-2" },
];

interface TreeNode extends Branch {
  children: TreeNode[];
}

function buildTree(branches: Branch[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  for (const b of branches) byId.set(b.id, { ...b, children: [] });
  const roots: TreeNode[] = [];
  for (const node of byId.values()) {
    if (node.parentId) {
      const parent = byId.get(node.parentId);
      if (parent) parent.children.push(node);
      else roots.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

const TYPE_LABEL: Record<Branch["type"], string> = {
  headquarters: "HQ",
  regional: "Regional",
  satellite: "Satellite",
};

function BranchNode({ node, depth }: { node: TreeNode; depth: number }) {
  return (
    <div className="space-y-2">
      <div
        className={cn(
          "rounded-xl border border-[#efefef] bg-white p-4 hover:border-slate-300 transition-colors",
          depth === 0 && "bg-slate-50/60"
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5 text-slate-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900">{node.name}</p>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {TYPE_LABEL[node.type]}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{node.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              {node.city}
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Users className="w-3.5 h-3.5" />
              {node.employeeCount}
            </div>
            <div className="text-slate-900 font-medium">{node.manager}</div>
          </div>
        </div>
      </div>
      {node.children.length > 0 && (
        <div className="relative pl-8 border-l-2 border-slate-200 ml-5 space-y-2">
          {node.children.map((child) => (
            <div key={child.id} className="relative">
              <div className="absolute -left-8 top-8 w-6 h-px bg-slate-200" />
              <BranchNode node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BranchHierarchyPage() {
  const tree = useMemo(() => buildTree(BRANCHES), []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Branch Hierarchy</h1>
        <p className="text-sm text-slate-500">
          Reporting structure across branches — which branches roll up into which.
        </p>
      </div>

      {/* Legend */}
      <div className="rounded-xl border border-[#efefef] bg-white p-4 flex items-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 font-medium">HQ</span>
          Headquarters
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 font-medium">Regional</span>
          Regional Office
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 font-medium">Satellite</span>
          Satellite Office
        </div>
      </div>

      {/* Tree */}
      <div className="space-y-4">
        {tree.map((root) => (
          <BranchNode key={root.id} node={root} depth={0} />
        ))}
      </div>
    </div>
  );
}
