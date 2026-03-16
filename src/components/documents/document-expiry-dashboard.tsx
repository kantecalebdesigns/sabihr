import { useState, useMemo } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Bell,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExpiryStatus = "expired" | "expiring-soon" | "valid";

interface ExpiryDocument {
  id: string;
  employeeName: string;
  documentType: string;
  uploadDate: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: ExpiryStatus;
}

const MOCK_DATA: ExpiryDocument[] = [
  {
    id: "1",
    employeeName: "Adebayo Ogunlesi",
    documentType: "Work Permit",
    uploadDate: "2025-06-15",
    expiryDate: "2026-02-28",
    daysUntilExpiry: -13,
    status: "expired",
  },
  {
    id: "2",
    employeeName: "Chioma Nwosu",
    documentType: "Professional License",
    uploadDate: "2025-03-20",
    expiryDate: "2026-03-01",
    daysUntilExpiry: -12,
    status: "expired",
  },
  {
    id: "3",
    employeeName: "Emeka Eze",
    documentType: "Health Certificate",
    uploadDate: "2025-08-10",
    expiryDate: "2026-03-15",
    daysUntilExpiry: 2,
    status: "expiring-soon",
  },
  {
    id: "4",
    employeeName: "Fatima Bello",
    documentType: "NDA Agreement",
    uploadDate: "2025-01-05",
    expiryDate: "2026-03-20",
    daysUntilExpiry: 7,
    status: "expiring-soon",
  },
  {
    id: "5",
    employeeName: "Ibrahim Musa",
    documentType: "Safety Training Cert",
    uploadDate: "2025-09-22",
    expiryDate: "2026-04-01",
    daysUntilExpiry: 19,
    status: "expiring-soon",
  },
  {
    id: "6",
    employeeName: "Joy Adeyemi",
    documentType: "Employment Contract",
    uploadDate: "2025-04-11",
    expiryDate: "2026-04-10",
    daysUntilExpiry: 28,
    status: "expiring-soon",
  },
  {
    id: "7",
    employeeName: "Kunle Adekunle",
    documentType: "Compliance Certificate",
    uploadDate: "2025-07-03",
    expiryDate: "2026-05-15",
    daysUntilExpiry: 63,
    status: "expiring-soon",
  },
  {
    id: "8",
    employeeName: "Lola Okafor",
    documentType: "Insurance Policy",
    uploadDate: "2025-11-18",
    expiryDate: "2026-06-01",
    daysUntilExpiry: 80,
    status: "expiring-soon",
  },
  {
    id: "9",
    employeeName: "Mohammed Aliyu",
    documentType: "Tax Clearance",
    uploadDate: "2025-12-01",
    expiryDate: "2026-12-01",
    daysUntilExpiry: 263,
    status: "valid",
  },
  {
    id: "10",
    employeeName: "Ngozi Uche",
    documentType: "ID Verification",
    uploadDate: "2026-01-10",
    expiryDate: "2027-01-10",
    daysUntilExpiry: 303,
    status: "valid",
  },
];

const STATUS_CONFIG: Record<
  ExpiryStatus,
  { label: string; className: string }
> = {
  expired: {
    label: "Expired",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  "expiring-soon": {
    label: "Expiring Soon",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  valid: {
    label: "Valid",
    className: "bg-green-100 text-green-700 border-green-200",
  },
};

export function DocumentExpiryDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortAsc, setSortAsc] = useState(true);

  const counts = useMemo(() => {
    const expired = MOCK_DATA.filter((d) => d.daysUntilExpiry < 0).length;
    const in30 = MOCK_DATA.filter(
      (d) => d.daysUntilExpiry >= 0 && d.daysUntilExpiry <= 30
    ).length;
    const in90 = MOCK_DATA.filter(
      (d) => d.daysUntilExpiry > 30 && d.daysUntilExpiry <= 90
    ).length;
    const valid = MOCK_DATA.filter((d) => d.daysUntilExpiry > 90).length;
    return { expired, in30, in90, valid };
  }, []);

  const filteredData = useMemo(() => {
    let data =
      statusFilter === "all"
        ? [...MOCK_DATA]
        : MOCK_DATA.filter((d) => d.status === statusFilter);

    data.sort((a, b) =>
      sortAsc
        ? a.daysUntilExpiry - b.daysUntilExpiry
        : b.daysUntilExpiry - a.daysUntilExpiry
    );

    return data;
  }, [statusFilter, sortAsc]);

  const summaryCards = [
    {
      label: "Expired",
      count: counts.expired,
      icon: AlertCircle,
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      iconColor: "text-red-500",
    },
    {
      label: "Expiring in 30 Days",
      count: counts.in30,
      icon: AlertTriangle,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      iconColor: "text-amber-500",
    },
    {
      label: "Expiring in 90 Days",
      count: counts.in90,
      icon: Clock,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      iconColor: "text-yellow-500",
    },
    {
      label: "Valid",
      count: counts.valid,
      icon: CheckCircle2,
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      iconColor: "text-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Document Expiry Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Monitor and manage document expiry across employees
          </p>
        </div>
        <Button className="gap-2">
          <Bell className="size-4" />
          Send Bulk Reminder
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={cn(
                "rounded-xl border p-4 flex items-center gap-4",
                card.bg,
                card.border
              )}
            >
              <div
                className={cn(
                  "size-10 rounded-lg flex items-center justify-center bg-white/60",
                  card.iconColor
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className={cn("text-2xl font-bold", card.text)}>
                  {card.count}
                </p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter & sort controls */}
      <div className="flex items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
            <SelectItem value="valid">Valid</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setSortAsc(!sortAsc)}
        >
          <ArrowUpDown className="size-3.5" />
          Expiry Date {sortAsc ? "(Nearest)" : "(Farthest)"}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left font-medium px-4 py-3">
                  Employee Name
                </th>
                <th className="text-left font-medium px-4 py-3">
                  Document Type
                </th>
                <th className="text-left font-medium px-4 py-3">
                  Upload Date
                </th>
                <th className="text-left font-medium px-4 py-3">
                  Expiry Date
                </th>
                <th className="text-left font-medium px-4 py-3">
                  Days Until Expiry
                </th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((doc) => {
                const statusCfg = STATUS_CONFIG[doc.status];
                return (
                  <tr
                    key={doc.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">
                      {doc.employeeName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {doc.documentType}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {doc.uploadDate}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {doc.expiryDate}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "font-medium",
                          doc.daysUntilExpiry < 0
                            ? "text-red-600"
                            : doc.daysUntilExpiry <= 30
                              ? "text-amber-600"
                              : doc.daysUntilExpiry <= 90
                                ? "text-yellow-600"
                                : "text-green-600"
                        )}
                      >
                        {doc.daysUntilExpiry < 0
                          ? `${Math.abs(doc.daysUntilExpiry)} days overdue`
                          : `${doc.daysUntilExpiry} days`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", statusCfg.className)}
                      >
                        {statusCfg.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="xs" className="gap-1">
                        <Bell className="size-3" />
                        Send Reminder
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
