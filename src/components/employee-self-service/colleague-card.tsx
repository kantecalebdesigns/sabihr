import { Mail, MapPin } from "lucide-react";
import type { ColleagueProfile } from "@/types/employee";

interface ColleagueCardProps {
  colleague: ColleagueProfile;
}

export function ColleagueCard({ colleague }: ColleagueCardProps) {
  const initials = colleague.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-semibold text-primary">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{colleague.name}</p>
          <p className="text-xs text-muted-foreground">{colleague.jobTitle}</p>
          <p className="text-xs text-primary/80">{colleague.department}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{colleague.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{colleague.location}</span>
        </div>
      </div>
    </div>
  );
}
