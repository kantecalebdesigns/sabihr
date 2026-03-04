import { Link } from "react-router-dom";
import { UserCircle, Users, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ACTIONS = [
  {
    label: "Edit Profile",
    description: "Update your personal information",
    icon: UserCircle,
    path: "/employee/profile",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "View Colleagues",
    description: "Browse the employee directory",
    icon: Users,
    path: "/employee/directory",
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
  {
    label: "Org Chart",
    description: "View reporting structure",
    icon: GitBranch,
    path: "/employee/directory",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {ACTIONS.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors group"
            >
              <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}>
                <action.icon className={`w-4 h-4 ${action.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
