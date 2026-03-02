import { Briefcase, TrendingUp, ArrowRightLeft, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_EMPLOYMENT_HISTORY } from "@/lib/employee-mock-data";

const TYPE_CONFIG = {
  hire: { icon: UserPlus, color: "text-success", bg: "bg-success/10", label: "Hired" },
  promotion: { icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", label: "Promoted" },
  transfer: { icon: ArrowRightLeft, color: "text-amber-600", bg: "bg-amber-100", label: "Transferred" },
  "role-change": { icon: Briefcase, color: "text-violet-600", bg: "bg-violet-100", label: "Role Change" },
};

export function EmploymentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Employment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-6">
            {MOCK_EMPLOYMENT_HISTORY.map((entry) => {
              const config = TYPE_CONFIG[entry.type];
              const Icon = config.icon;
              const isCurrent = !entry.endDate;

              return (
                <div key={entry.id} className="relative flex gap-4 pl-1">
                  <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center shrink-0 z-10 border-2 border-card`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{entry.title}</p>
                      {isCurrent && (
                        <span className="text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{entry.department}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      {new Date(entry.startDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                      {" — "}
                      {entry.endDate
                        ? new Date(entry.endDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })
                        : "Present"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
