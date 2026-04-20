import { useState } from "react";
import { Megaphone, Pin, ChevronDown, ChevronUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_ANNOUNCEMENTS,
  type Announcement,
  type Priority,
} from "@/lib/announcements-mock-data";

const priorityBadgeStyles: Record<Priority, string> = {
  urgent: "text-[#e7000b] bg-red-50",
  high: "text-amber-700 bg-amber-50",
  medium: "text-blue-700 bg-blue-50",
  low: "text-slate-500 bg-[#f8fafc]",
};

const priorityLabels: Record<Priority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        priorityBadgeStyles[priority]
      )}
    >
      {priorityLabels[priority]}
    </span>
  );
}

function AnnouncementCard({
  announcement,
  isExpanded,
  onToggle,
}: {
  announcement: Announcement;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-5 cursor-pointer transition-shadow hover:shadow-sm"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {announcement.pinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                <Pin className="h-3 w-3" />
                Pinned
              </span>
            )}
            <PriorityBadge priority={announcement.priority} />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mt-1">
            {announcement.title}
          </h3>
        </div>
        <div className="flex-shrink-0 pt-1">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {!isExpanded && (
        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
          {announcement.preview}
        </p>
      )}

      {isExpanded && (
        <div className="mt-3">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {announcement.content}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <User className="h-3.5 w-3.5 text-slate-400" />
          {announcement.author}
        </span>
        <span>{announcement.department}</span>
        <span>{formatDate(announcement.publishDate)}</span>
      </div>
    </div>
  );
}

export default function EmployeeAnnouncementsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const announcements = MOCK_ANNOUNCEMENTS;
  const pinnedAnnouncements = announcements.filter((a) => a.pinned);
  const unpinnedAnnouncements = announcements.filter((a) => !a.pinned);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#eff6ff]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="h-5 w-5 text-slate-400" />
            <h1 className="text-xl font-semibold text-slate-900">
              Announcements
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Stay updated with company news and updates
          </p>
        </div>

        {announcements.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] p-12 text-center">
            <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">
              No announcements
            </h3>
            <p className="text-sm text-slate-500">
              There are no announcements to display at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pinned announcements */}
            {pinnedAnnouncements.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Pinned
                </h2>
                <div className="space-y-3">
                  {pinnedAnnouncements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                      isExpanded={expandedId === announcement.id}
                      onToggle={() => handleToggle(announcement.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All other announcements */}
            {unpinnedAnnouncements.length > 0 && (
              <div>
                {pinnedAnnouncements.length > 0 && (
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Recent
                  </h2>
                )}
                <div className="space-y-3">
                  {unpinnedAnnouncements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                      isExpanded={expandedId === announcement.id}
                      onToggle={() => handleToggle(announcement.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
