import { useState, useMemo } from "react";
import { Users, Building, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type View = "company" | "department";

interface Person {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  avatarInitials: string;
  reportsTo: string | null;
}

const PEOPLE: Person[] = [
  { id: "p-ceo", name: "Chidi Okonkwo", title: "Chief Executive Officer", department: "Executive", email: "ceo@sabihr.com", avatarInitials: "CO", reportsTo: null },
  { id: "p-cto", name: "Chiamaka Eze", title: "Chief Technology Officer", department: "Engineering", email: "chiamaka@sabihr.com", avatarInitials: "CE", reportsTo: "p-ceo" },
  { id: "p-cfo", name: "Adebayo Okafor", title: "Chief Financial Officer", department: "Finance", email: "adebayo.o@sabihr.com", avatarInitials: "AO", reportsTo: "p-ceo" },
  { id: "p-chro", name: "Fatima Abdullahi", title: "Chief HR Officer", department: "Human Resources", email: "fatima@sabihr.com", avatarInitials: "FA", reportsTo: "p-ceo" },
  { id: "p-cmo", name: "Bukola Adeyemi", title: "Chief Marketing Officer", department: "Marketing", email: "bukola@sabihr.com", avatarInitials: "BA", reportsTo: "p-ceo" },

  { id: "p-eng-1", name: "Adebayo Ogunlesi", title: "VP Engineering", department: "Engineering", email: "adebayo.og@sabihr.com", avatarInitials: "AG", reportsTo: "p-cto" },
  { id: "p-eng-2", name: "Oluwaseun Afolabi", title: "Engineering Manager", department: "Engineering", email: "oluwaseun@sabihr.com", avatarInitials: "OA", reportsTo: "p-eng-1" },
  { id: "p-eng-3", name: "Ibrahim Musa", title: "Senior Engineer", department: "Engineering", email: "ibrahim@sabihr.com", avatarInitials: "IM", reportsTo: "p-eng-2" },
  { id: "p-eng-4", name: "Damilola Osei", title: "Software Engineer", department: "Engineering", email: "damilola@sabihr.com", avatarInitials: "DO", reportsTo: "p-eng-2" },

  { id: "p-hr-1", name: "Amina Bello", title: "HR Manager", department: "Human Resources", email: "amina@sabihr.com", avatarInitials: "AB", reportsTo: "p-chro" },
  { id: "p-hr-2", name: "Kemi Adekunle", title: "HR Officer", department: "Human Resources", email: "kemi@sabihr.com", avatarInitials: "KA", reportsTo: "p-hr-1" },

  { id: "p-fin-1", name: "Aisha Mohammed", title: "Finance Manager", department: "Finance", email: "aisha@sabihr.com", avatarInitials: "AM", reportsTo: "p-cfo" },
  { id: "p-fin-2", name: "Chibueze Okoro", title: "Senior Accountant", department: "Finance", email: "chibueze@sabihr.com", avatarInitials: "CO", reportsTo: "p-fin-1" },

  { id: "p-sales-1", name: "Emeka Okafor", title: "Head of Sales", department: "Sales", email: "emeka@sabihr.com", avatarInitials: "EO", reportsTo: "p-ceo" },
  { id: "p-sales-2", name: "Usman Bello", title: "Sales Manager", department: "Sales", email: "usman@sabihr.com", avatarInitials: "UB", reportsTo: "p-sales-1" },

  { id: "p-mkt-1", name: "Amara Obi", title: "Marketing Manager", department: "Marketing", email: "amara@sabihr.com", avatarInitials: "AO2", reportsTo: "p-cmo" },
];

interface TreeNode extends Person {
  children: TreeNode[];
}

function buildTree(people: Person[], rootFilter?: (p: Person) => boolean): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  for (const p of people) byId.set(p.id, { ...p, children: [] });
  const roots: TreeNode[] = [];
  for (const node of byId.values()) {
    if (node.reportsTo && byId.has(node.reportsTo)) {
      byId.get(node.reportsTo)!.children.push(node);
    } else if (!rootFilter || rootFilter(node)) {
      roots.push(node);
    }
  }
  return roots;
}

function PersonCard({ node, compact = false }: { node: TreeNode; compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#efefef] bg-white px-4 py-3 inline-flex items-center gap-3 shadow-sm",
        compact && "px-3 py-2"
      )}
    >
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shrink-0",
          compact ? "w-8 h-8 text-[11px]" : "w-10 h-10 text-xs"
        )}
      >
        {node.avatarInitials}
      </div>
      <div className="min-w-0">
        <p className={cn("font-semibold text-slate-900 truncate", compact ? "text-sm" : "text-sm")}>
          {node.name}
        </p>
        <p className={cn("text-slate-500 truncate", compact ? "text-[11px]" : "text-xs")}>
          {node.title}
        </p>
      </div>
    </div>
  );
}

function OrgNode({ node }: { node: TreeNode }) {
  return (
    <div className="flex flex-col items-center">
      <PersonCard node={node} />
      {node.children.length > 0 && (
        <>
          <div className="w-px h-4 bg-slate-300" />
          <div className="relative flex flex-wrap items-start justify-center gap-6 pt-4">
            {node.children.length > 1 && (
              <div
                className="absolute top-0 h-px bg-slate-300"
                style={{
                  left: "calc(50% - (var(--span) / 2))",
                  width: "var(--span)",
                }}
              />
            )}
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-slate-300" />
                <OrgNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrganogramPage() {
  const [view, setView] = useState<View>("company");
  const [selectedDept, setSelectedDept] = useState<string>("Engineering");

  const departments = useMemo(
    () => [...new Set(PEOPLE.map((p) => p.department))],
    []
  );

  const companyTree = useMemo(() => buildTree(PEOPLE), []);
  const departmentTree = useMemo(() => {
    const deptPeople = PEOPLE.filter((p) => p.department === selectedDept);
    const deptIds = new Set(deptPeople.map((p) => p.id));
    // Build a tree where the roots are those whose manager is outside this dept
    const byId = new Map<string, TreeNode>();
    for (const p of deptPeople) byId.set(p.id, { ...p, children: [] });
    const roots: TreeNode[] = [];
    for (const node of byId.values()) {
      if (node.reportsTo && deptIds.has(node.reportsTo)) {
        byId.get(node.reportsTo)!.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }, [selectedDept]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Organogram</h1>
          <p className="text-sm text-slate-500">
            Reporting structure across the company and within departments.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* View toggle + department picker */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-1 border border-[#efefef] rounded-lg p-0.5">
          <button
            onClick={() => setView("company")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              view === "company"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Building className="w-3.5 h-3.5" />
            Company
          </button>
          <button
            onClick={() => setView("department")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              view === "department"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            Department
          </button>
        </div>
        {view === "department" && (
          <div className="flex items-center gap-1 flex-wrap">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  selectedDept === d
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-white text-slate-500 border-[#efefef] hover:border-slate-300"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tree */}
      <div className="rounded-xl border border-[#efefef] bg-[#f8fafc] p-6 overflow-x-auto">
        <div className="min-w-max mx-auto">
          {view === "company" && companyTree.map((root) => <OrgNode key={root.id} node={root} />)}
          {view === "department" && (
            <div className="flex flex-col items-center gap-6">
              {departmentTree.length === 0 ? (
                <p className="text-sm text-slate-500 py-8">No reporting lines in this department.</p>
              ) : (
                departmentTree.map((root) => <OrgNode key={root.id} node={root} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
