import { useState } from "react";
import { User, Briefcase, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfilePhoto } from "@/components/employee-profile/profile-photo";
import { PersonalInfoSection } from "@/components/employee-profile/personal-info-section";
import { EmploymentHistory } from "@/components/employee-profile/employment-history";
import { EmploymentInfoCard } from "@/components/employee-dashboard/employment-info-card";

type ProfileTab = "personal" | "employment" | "documents";

const TABS: { key: ProfileTab; label: string; icon: typeof User }[] = [
  { key: "personal", label: "Personal Info", icon: User },
  { key: "employment", label: "Employment", icon: Briefcase },
  { key: "documents", label: "Documents", icon: FileText },
];

export default function EmployeeProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header with photo */}
      <div className="bg-card border border-border rounded-xl p-6">
        <ProfilePhoto />
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "personal" && <PersonalInfoSection view="personal" />}

      {activeTab === "employment" && (
        <div className="space-y-6">
          <EmploymentInfoCard />
          <EmploymentHistory />
        </div>
      )}

      {activeTab === "documents" && <PersonalInfoSection view="documents" />}
    </div>
  );
}
