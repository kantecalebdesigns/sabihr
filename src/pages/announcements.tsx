import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Pin, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_ANNOUNCEMENTS, PRIORITY_STYLES } from "@/lib/announcements-mock-data";

export default function AnnouncementsPage() {
  const sorted = useMemo(() => {
    const pinned = MOCK_ANNOUNCEMENTS.filter((a) => a.pinned).sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
    const unpinned = MOCK_ANNOUNCEMENTS.filter((a) => !a.pinned).sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
    return [...pinned, ...unpinned];
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
        <Link to="/announcements/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Announcement
          </Button>
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#efefef] p-12 text-center">
          <Megaphone className="mx-auto h-10 w-10 text-slate-500" />
          <p className="mt-3 text-sm text-slate-500">No announcements yet</p>
          <Link to="/announcements/create">
            <Button variant="outline" className="mt-4">
              Create Announcement
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((a) => {
            const priority = PRIORITY_STYLES[a.priority];
            return (
              <Link
                key={a.id}
                to={`/announcements/${a.id}`}
                className="block rounded-xl border border-[#efefef] bg-white p-5 transition-colors hover:bg-[#f8fafc]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {a.pinned && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Pin className="h-3 w-3" />
                          Pinned
                        </span>
                      )}
                      <span className={cn("text-sm font-medium", priority.color)}>
                        {priority.label}
                      </span>
                    </div>
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {a.preview}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{a.author}</span>
                      <span>&middot;</span>
                      <span>{new Date(a.publishDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">
                    {a.readCount}/{a.totalRecipients} read
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
