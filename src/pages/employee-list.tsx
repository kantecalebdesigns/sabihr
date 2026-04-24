import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Users,
  Briefcase,
  UserCircle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MOCK_EMPLOYEE_LIST,
  EMPLOYEE_STATUS_STYLES,
} from "@/lib/employee-list-mock-data";
import type { EmploymentStatus } from "@/types/employee";

const AVATAR_PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function formatJoined(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const STATUS_DOT: Record<EmploymentStatus, string> = {
  active: "bg-emerald-500",
  "on-leave": "bg-amber-500",
  suspended: "bg-rose-500",
  inactive: "bg-slate-400",
  terminated: "bg-slate-400",
};

const STATUS_PILL: Record<EmploymentStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  "on-leave": "bg-amber-50 text-amber-700",
  suspended: "bg-rose-50 text-rose-700",
  inactive: "bg-slate-100 text-slate-600",
  terminated: "bg-slate-100 text-slate-600",
};

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "joined" | "role">("name");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const rows = MOCK_EMPLOYEE_LIST.filter((e) => {
      const matchesSearch =
        !q ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q);
      return matchesSearch;
    });

    rows.sort((a, b) => {
      if (sortBy === "name") return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      if (sortBy === "role") return a.jobTitle.localeCompare(b.jobTitle);
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
    return rows;
  }, [search, sortBy]);

  const totalHeadcount = MOCK_EMPLOYEE_LIST.length;
  const fullTime = MOCK_EMPLOYEE_LIST.filter((e) => e.employmentType === "full-time").length;
  const contractors = MOCK_EMPLOYEE_LIST.filter((e) => e.employmentType === "contract").length;
  const onboarding = MOCK_EMPLOYEE_LIST.filter((e) => {
    const days = (Date.now() - new Date(e.startDate).getTime()) / (1000 * 60 * 60 * 24);
    return days < 90 && e.employmentStatus === "active";
  }).length;

  const kpis = [
    { value: totalHeadcount, label: "Total headcount", icon: Users, wellBg: "bg-blue-50", iconColor: "text-blue-600", trend: 4 },
    { value: fullTime, label: "Full-time", icon: Briefcase, wellBg: "bg-blue-50", iconColor: "text-blue-600", trend: 3 },
    { value: contractors, label: "Contractors", icon: UserCircle, wellBg: "bg-blue-50", iconColor: "text-blue-600", trend: 1 },
    { value: onboarding, label: "Onboarding", icon: ArrowUpRight, wellBg: "bg-blue-50", iconColor: "text-blue-600", trend: 2 },
  ];

  return (
    <div className="max-w-[1500px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Employees</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Manage your whole workforce in one place — onboard new hires, update roles and
            departments, track statuses and leave, and export directory reports.
          </p>
        </div>
        <Button
          onClick={() => navigate("/employees/create")}
          className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add employee
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/70 bg-white px-5 pt-5 pb-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-7"
            >
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.wellBg)}>
                  <Icon className={cn("w-[18px] h-[18px]", kpi.iconColor)} />
                </div>
                <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{kpi.trend}</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between px-5 py-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, role, email..."
                className="pl-9 bg-white border-slate-200 h-10 rounded-lg"
              />
            </div>
            <p className="text-sm text-slate-500 whitespace-nowrap">{filtered.length} people</p>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "joined" | "role")}
              className="appearance-none h-10 pl-3 pr-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 cursor-pointer"
            >
              <option value="name">Sort: Name</option>
              <option value="role">Sort: Role</option>
              <option value="joined">Sort: Joined</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70">
                <th className="w-12 pl-5 py-3">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                </th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Name</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Role</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Department</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Location</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Status</th>
                <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5">Joined</th>
                <th className="w-10 px-2" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <td className="pl-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  </td>
                  <td className="py-4 pr-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0",
                          avatarColor(emp.id)
                        )}
                      >
                        {initials(emp.firstName, emp.lastName)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 leading-tight">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-5 text-slate-700">{emp.jobTitle}</td>
                  <td className="py-4 pr-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {emp.department}
                    </span>
                  </td>
                  <td className="py-4 pr-5 text-slate-700">{emp.location}</td>
                  <td className="py-4 pr-5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                        STATUS_PILL[emp.employmentStatus]
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[emp.employmentStatus])} />
                      {EMPLOYEE_STATUS_STYLES[emp.employmentStatus]?.label}
                    </span>
                  </td>
                  <td className="py-4 pr-5 text-slate-600">{formatJoined(emp.startDate)}</td>
                  <td className="px-2 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <UserCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-slate-900">No employees found</p>
                    <p className="text-xs mt-1 text-slate-500">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
