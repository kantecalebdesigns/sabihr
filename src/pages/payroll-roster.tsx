import { useState, useMemo } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Building2,
  CheckCircle2,
  XCircle,
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

// ── Types ──

interface RosterEmployee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  payGroup: string;
  payGrade: string;
  monthlyGross: number;
  included: boolean;
  lastPayrollRun: string;
}

// ── Mock Data ──

const INITIAL_ROSTER: RosterEmployee[] = [
  { id: "r-1", name: "Adebayo Ogunlesi", employeeId: "EMP-001", department: "Engineering", payGroup: "Mid-Level", payGrade: "Senior Manager", monthlyGross: 541667, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-2", name: "Chiamaka Eze", employeeId: "EMP-002", department: "Engineering", payGroup: "Senior Management", payGrade: "Director", monthlyGross: 1000000, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-3", name: "Oluwaseun Afolabi", employeeId: "EMP-003", department: "Engineering", payGroup: "Mid-Level", payGrade: "Manager", monthlyGross: 375000, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-4", name: "Fatima Abdullahi", employeeId: "EMP-004", department: "Human Resources", payGroup: "Senior Management", payGrade: "Senior Director", monthlyGross: 1143750, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-5", name: "Emeka Okafor", employeeId: "EMP-005", department: "Sales", payGroup: "Mid-Level", payGrade: "Senior Manager", monthlyGross: 541667, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-6", name: "Aisha Mohammed", employeeId: "EMP-006", department: "Finance", payGroup: "Mid-Level", payGrade: "Manager", monthlyGross: 375000, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-7", name: "Bukola Adeyemi", employeeId: "EMP-008", department: "Marketing", payGroup: "Senior Management", payGrade: "Director", monthlyGross: 1000000, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-8", name: "Ibrahim Musa", employeeId: "EMP-009", department: "IT", payGroup: "Mid-Level", payGrade: "Senior Manager", monthlyGross: 541667, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-9", name: "Kemi Adekunle", employeeId: "EMP-013", department: "Human Resources", payGroup: "Junior", payGrade: "Senior Officer", monthlyGross: 233333, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-10", name: "Damilola Osei", employeeId: "EMP-014", department: "Engineering", payGroup: "Junior", payGrade: "Senior Officer", monthlyGross: 233333, included: false, lastPayrollRun: "Feb 2026" },
  { id: "r-11", name: "Usman Bello", employeeId: "EMP-015", department: "IT", payGroup: "Junior", payGrade: "Senior Officer", monthlyGross: 233333, included: true, lastPayrollRun: "Mar 2026" },
  { id: "r-12", name: "Amara Obi", employeeId: "EMP-016", department: "Marketing", payGroup: "Intern", payGrade: "Intern", monthlyGross: 69000, included: false, lastPayrollRun: "Jan 2026" },
];

function formatCurrency(amount: number): string {
  return `\u20A6${amount.toLocaleString()}`;
}

// ── Component ──

export default function PayrollRosterPage() {
  const [roster, setRoster] = useState<RosterEmployee[]>(INITIAL_ROSTER);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const departments = useMemo(
    () => [...new Set(roster.map((e) => e.department))].sort(),
    [roster]
  );

  const filtered = useMemo(() => {
    return roster.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q);
      const matchesDept = departmentFilter === "all" || e.department === departmentFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "included" && e.included) ||
        (statusFilter === "excluded" && !e.included);
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [roster, search, departmentFilter, statusFilter]);

  const counts = useMemo(() => {
    const included = roster.filter((e) => e.included).length;
    const depts = new Set(roster.map((e) => e.department)).size;
    return {
      total: roster.length,
      included,
      excluded: roster.length - included,
      departments: depts,
    };
  }, [roster]);

  const toggleEmployee = (id: string) => {
    setRoster((prev) =>
      prev.map((e) => (e.id === id ? { ...e, included: !e.included } : e))
    );
  };

  const bulkAction = (include: boolean) => {
    const filteredIds = new Set(filtered.map((e) => e.id));
    setRoster((prev) =>
      prev.map((e) => (filteredIds.has(e.id) ? { ...e, included: include } : e))
    );
  };

  const summaryCards = [
    { label: "Total Employees", value: counts.total, icon: Users },
    { label: "Included in Payroll", value: counts.included, icon: UserCheck },
    { label: "Excluded", value: counts.excluded, icon: UserX },
    { label: "Departments", value: counts.departments, icon: Building2 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Payroll Roster</h1>
        <p className="text-sm text-slate-500">Manage which employees are included in payroll processing</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#efefef] bg-white px-[21px] pt-[21px] pb-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <card.icon className="w-4 h-4 text-slate-400" />
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
            </div>
            <p className="text-2xl font-bold tracking-[-0.6px] text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="included">Included</SelectItem>
            <SelectItem value="excluded">Excluded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => bulkAction(true)}>
          <UserCheck className="w-4 h-4 mr-2" />
          Include All Filtered
        </Button>
        <Button variant="outline" size="sm" onClick={() => bulkAction(false)}>
          <UserX className="w-4 h-4 mr-2" />
          Exclude All Filtered
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="p-3 text-left text-xs font-medium text-slate-500">Employee Name</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Employee ID</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Department</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Pay Group</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Pay Grade</th>
              <th className="p-3 text-right text-xs font-medium text-slate-500">Monthly Gross</th>
              <th className="p-3 text-center text-xs font-medium text-slate-500">Status</th>
              <th className="p-3 text-left text-xs font-medium text-slate-500">Last Payroll</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="p-3 font-medium text-slate-900">{emp.name}</td>
                <td className="p-3 text-slate-500">{emp.employeeId}</td>
                <td className="p-3 text-slate-500">{emp.department}</td>
                <td className="p-3 text-slate-500">{emp.payGroup}</td>
                <td className="p-3 text-slate-500">{emp.payGrade}</td>
                <td className="p-3 text-right text-slate-900">{formatCurrency(emp.monthlyGross)}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => toggleEmployee(emp.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                      emp.included
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    )}
                  >
                    {emp.included ? (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> Included</>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5" /> Excluded</>
                    )}
                  </button>
                </td>
                <td className="p-3 text-slate-500">{emp.lastPayrollRun}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-slate-900">No employees found</p>
                  <p className="text-xs mt-1 text-slate-500">Try adjusting your search or filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
