import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_ANNOUNCEMENTS, PRIORITY_STYLES } from "@/lib/announcements-mock-data";

export default function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const announcement = MOCK_ANNOUNCEMENTS.find((a) => a.id === id);

  if (!announcement) {
    return (
      <div className="space-y-4">
        <Link
          to="/announcements"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Announcements
        </Link>
        <p className="text-slate-500">Announcement not found.</p>
      </div>
    );
  }

  const priority = PRIORITY_STYLES[announcement.priority];
  const readPct = Math.round(
    (announcement.readCount / announcement.totalRecipients) * 100
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        to="/announcements"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Announcements
      </Link>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className={cn("text-sm font-medium", priority.color)}>
            {priority.label}
          </span>
          {announcement.pinned && (
            <span className="text-xs text-slate-500">Pinned</span>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{announcement.title}</h1>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>{announcement.author}</span>
          <span>&middot;</span>
          <span>{announcement.department}</span>
          <span>&middot;</span>
          <span>
            {new Date(announcement.publishDate).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white p-6">
        <p className="whitespace-pre-line text-sm leading-relaxed">
          {announcement.content}
        </p>
      </div>

      <div className="rounded-xl border border-[#efefef] bg-white p-6 space-y-3">
        <h2 className="text-sm font-semibold">Read Receipts</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {announcement.readCount} of {announcement.totalRecipients} recipients
          </span>
          <span className="font-medium">{readPct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#f8fafc]">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${readPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
