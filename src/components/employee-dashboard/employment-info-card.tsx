import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  UserCheck,
  Shield,
  CreditCard,
  FileText,
  ScrollText,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_EMPLOYEE_PROFILE } from "@/lib/employee-mock-data";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  "on-leave": "bg-warning/10 text-warning border-warning/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
  terminated: "bg-destructive/10 text-destructive border-destructive/20",
};

const TYPE_COLORS: Record<string, string> = {
  "full-time": "bg-primary/10 text-primary border-primary/20",
  "part-time": "bg-violet-100 text-violet-700 border-violet-200",
  contract: "bg-amber-100 text-amber-700 border-amber-200",
  intern: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider pb-1 pt-1 border-b border-border mb-1">
      {children}
    </p>
  );
}

export function EmploymentInfoCard() {
  const emp = MOCK_EMPLOYEE_PROFILE.employment;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base">Employment Information</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={STATUS_COLORS[emp.employmentStatus]}>
              {emp.employmentStatus.charAt(0).toUpperCase() + emp.employmentStatus.slice(1)}
            </Badge>
            <Badge variant="outline" className={TYPE_COLORS[emp.employmentType]}>
              {emp.employmentType.charAt(0).toUpperCase() + emp.employmentType.slice(1).replace("-", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
          {/* Column 1: Role & Team */}
          <div>
            <SectionLabel>Role &amp; Team</SectionLabel>
            <InfoRow
              icon={<Briefcase className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Job Title"
              value={`${emp.jobTitle} — ${emp.role}`}
            />
            <InfoRow
              icon={<Building2 className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Department"
              value={`${emp.department} · ${emp.division}`}
            />
            <InfoRow
              icon={<UserCheck className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Reports to"
              value={`${emp.supervisor}`}
            />
            <InfoRow
              icon={<Hash className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Employee ID"
              value={emp.employeeId}
            />
          </div>

          {/* Column 2: Work Details */}
          <div>
            <SectionLabel>Work Details</SectionLabel>
            <InfoRow
              icon={<MapPin className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Location & Branch"
              value={`${emp.workLocation} · ${emp.branch}`}
            />
            <InfoRow
              icon={<Calendar className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Start Date"
              value={`${new Date(emp.startDate).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })} (${emp.tenure})`}
            />
            <InfoRow
              icon={<CreditCard className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Pay Grade"
              value={emp.payGrade}
            />
          </div>

          {/* Column 3: Contract & Compliance */}
          <div>
            <SectionLabel>Contract</SectionLabel>
            <InfoRow
              icon={<ScrollText className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Type"
              value={emp.contractType.charAt(0).toUpperCase() + emp.contractType.slice(1).replace("-", " ")}
            />
            <InfoRow
              icon={<FileText className="w-3.5 h-3.5 text-muted-foreground" />}
              label="End Date"
              value={
                emp.contractEndDate
                  ? new Date(emp.contractEndDate).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })
                  : "N/A — Permanent"
              }
            />
            <InfoRow
              icon={<Shield className="w-3.5 h-3.5 text-muted-foreground" />}
              label="Probation"
              value={
                emp.isProbation
                  ? `Until ${new Date(emp.probationEndDate!).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}`
                  : "Completed"
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
