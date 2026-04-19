import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Building,
  Users,
  MapPin,
  Edit,
  Trash2,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BranchStatus = "active" | "inactive";

interface Branch {
  id: string;
  name: string;
  code: string;
  type: "headquarters" | "regional" | "satellite";
  status: BranchStatus;
  address: string;
  city: string;
  phone: string;
  email: string;
  manager: string;
  employeeCount: number;
  parentBranchId: string | null;
  establishedDate: string;
}

const INITIAL_BRANCHES: Branch[] = [
  {
    id: "br-1",
    name: "Lagos Headquarters",
    code: "LAG-HQ",
    type: "headquarters",
    status: "active",
    address: "42 Marina Street, Victoria Island",
    city: "Lagos",
    phone: "+234 1 234 5678",
    email: "hq@sabihr.com",
    manager: "Fatima Abdullahi",
    employeeCount: 68,
    parentBranchId: null,
    establishedDate: "2019-03-15",
  },
  {
    id: "br-2",
    name: "Abuja Regional Office",
    code: "ABJ-RG",
    type: "regional",
    status: "active",
    address: "15 Aminu Kano Crescent, Wuse II",
    city: "Abuja",
    phone: "+234 9 876 5432",
    email: "abuja@sabihr.com",
    manager: "Ibrahim Musa",
    employeeCount: 32,
    parentBranchId: "br-1",
    establishedDate: "2020-06-20",
  },
  {
    id: "br-3",
    name: "Port Harcourt Branch",
    code: "PHC-RG",
    type: "regional",
    status: "active",
    address: "8 Aba Road, GRA Phase 2",
    city: "Port Harcourt",
    phone: "+234 84 123 456",
    email: "ph@sabihr.com",
    manager: "Emeka Okafor",
    employeeCount: 24,
    parentBranchId: "br-1",
    establishedDate: "2021-02-10",
  },
  {
    id: "br-4",
    name: "Kano Satellite Office",
    code: "KAN-ST",
    type: "satellite",
    status: "active",
    address: "23 Zoo Road, Nasarawa GRA",
    city: "Kano",
    phone: "+234 64 567 890",
    email: "kano@sabihr.com",
    manager: "Aisha Mohammed",
    employeeCount: 18,
    parentBranchId: "br-2",
    establishedDate: "2022-09-05",
  },
  {
    id: "br-5",
    name: "Ibadan Satellite Office",
    code: "IBA-ST",
    type: "satellite",
    status: "inactive",
    address: "5 Bodija Road",
    city: "Ibadan",
    phone: "+234 22 987 654",
    email: "ibadan@sabihr.com",
    manager: "Bukola Adeyemi",
    employeeCount: 14,
    parentBranchId: "br-1",
    establishedDate: "2023-01-15",
  },
];

const TYPE_LABELS: Record<Branch["type"], string> = {
  headquarters: "Headquarters",
  regional: "Regional",
  satellite: "Satellite",
};

export default function BranchesPage() {
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Branch["type"]>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return branches.filter((b) => {
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || b.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [branches, search, typeFilter]);

  const totals = {
    all: branches.length,
    active: branches.filter((b) => b.status === "active").length,
    employees: branches.reduce((s, b) => s + b.employeeCount, 0),
    cities: new Set(branches.map((b) => b.city)).size,
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Branches</h1>
          <p className="text-sm text-slate-500">Manage branch locations, contact info, and configuration.</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Branch
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Building} label="Total Branches" value={String(totals.all)} />
        <SummaryCard icon={Building} label="Active" value={String(totals.active)} />
        <SummaryCard icon={Users} label="Employees" value={String(totals.employees)} />
        <SummaryCard icon={MapPin} label="Cities" value={String(totals.cities)} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search branches, cities, or codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 border border-[#efefef] rounded-lg p-0.5">
          {(["all", "headquarters", "regional", "satellite"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize",
                typeFilter === t
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {t === "all" ? "All" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Branches grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => {
          const parent = branches.find((p) => p.id === b.parentBranchId);
          return (
            <div
              key={b.id}
              className="rounded-xl border border-[#efefef] bg-white p-5 space-y-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{b.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{b.code} · {TYPE_LABELS[b.type]}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium px-2 py-0.5 rounded-full",
                    b.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {b.status}
                </span>
              </div>

              <div className="space-y-1.5 text-sm text-slate-500">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{b.address}, {b.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{b.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{b.email}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#efefef] flex items-center justify-between text-sm">
                <div>
                  <p className="text-xs text-slate-500">Branch Manager</p>
                  <p className="font-medium text-slate-900">{b.manager}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Employees</p>
                  <p className="font-semibold text-slate-900">{b.employeeCount}</p>
                </div>
              </div>

              {parent && (
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  Reports to
                  <Link
                    to={`/branches/hierarchy`}
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5"
                  >
                    {parent.name}
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-1 pt-2 border-t border-[#efefef]">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                  Configure
                </button>
                <button className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Building className="w-10 h-10 text-slate-500/30 mb-3" />
          <p className="text-sm text-slate-500">No branches match your search</p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof Building; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-4">
      <div className="flex items-center gap-2 text-slate-500 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
