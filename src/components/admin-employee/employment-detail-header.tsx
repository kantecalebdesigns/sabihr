import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EmployeeProfile } from "@/types/employee";

interface Props {
  employee: EmployeeProfile;
  onBack: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  "on-leave": "bg-amber-100 text-amber-700 border-amber-200",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
  terminated: "bg-destructive/10 text-destructive border-destructive/20",
};

const TYPE_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  intern: "Intern",
};

export function EmploymentDetailHeader({ employee, onBack }: Props) {
  const { basicDetails, employment } = employee;
  const fullName = `${basicDetails.firstName} ${basicDetails.lastName}`;
  const initials = `${basicDetails.firstName[0]}${basicDetails.lastName[0]}`.toUpperCase();

  return (
    <div className="flex items-start gap-4">
      <Button variant="ghost" size="icon" className="shrink-0 mt-0.5" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" />
      </Button>

      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold shrink-0">
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-semibold tracking-tight">{fullName}</h1>
          <Badge variant="outline" className={STATUS_COLORS[employment.employmentStatus] || ""}>
            {employment.employmentStatus.charAt(0).toUpperCase() + employment.employmentStatus.slice(1)}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {TYPE_LABELS[employment.employmentType] || employment.employmentType}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
          <span className="font-mono">{employment.employeeId}</span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            {employment.jobTitle} — {employment.department}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {employment.workLocation}
          </span>
        </div>
      </div>
    </div>
  );
}
