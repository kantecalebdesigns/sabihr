import { useState } from "react";
import { Search, GitBranch, Users, ArrowRightLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_COLLEAGUES } from "@/lib/employee-mock-data";
import { ColleagueCard } from "@/components/employee-self-service/colleague-card";
import { OrgChart } from "@/components/employee-self-service/org-chart";
import { RedeploymentForm } from "@/components/employee-self-service/redeployment-form";

type Tab = "directory" | "org-chart";

export default function EmployeeDirectoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("directory");
  const [search, setSearch] = useState("");
  const [redeployOpen, setRedeployOpen] = useState(false);

  const filteredColleagues = MOCK_COLLEAGUES.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.jobTitle.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Company Directory</h1>
          <p className="text-sm text-muted-foreground">
            Browse colleagues and view the organisational chart
          </p>
        </div>
        <Button variant="outline" onClick={() => setRedeployOpen(true)}>
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Request Redeployment
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("directory")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "directory"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="w-4 h-4" />
          Directory
        </button>
        <button
          onClick={() => setActiveTab("org-chart")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "org-chart"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <GitBranch className="w-4 h-4" />
          Org Chart
        </button>
      </div>

      {activeTab === "directory" ? (
        <>
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, title, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Grid */}
          {filteredColleagues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No colleagues found matching "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredColleagues.map((colleague) => (
                <ColleagueCard key={colleague.id} colleague={colleague} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6">
          <OrgChart />
        </div>
      )}

      <RedeploymentForm open={redeployOpen} onClose={() => setRedeployOpen(false)} />
    </div>
  );
}
