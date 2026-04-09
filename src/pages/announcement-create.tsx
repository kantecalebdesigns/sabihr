import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority } from "@/lib/announcements-mock-data";

export default function AnnouncementCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [targetAudience, setTargetAudience] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [pinned, setPinned] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/announcements"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Announcements
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Create Announcement</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[#efefef] bg-white p-6 space-y-5 max-w-2xl"
      >
        {submitted && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <Check className="h-4 w-4" />
            Announcement created successfully.
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Write your announcement..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Priority</label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="audience" className="text-sm font-medium">
              Target Audience
            </label>
            <Input
              id="audience"
              placeholder="e.g. All Employees, Engineering"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="publishDate" className="text-sm font-medium">
            Publish Date
          </label>
          <Input
            id="publishDate"
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="pinned"
            checked={pinned}
            onCheckedChange={(v) => setPinned(v === true)}
          />
          <label htmlFor="pinned" className="text-sm">
            Pin this announcement
          </label>
        </div>

        <Button type="submit" disabled={submitted}>
          {submitted ? "Published" : "Publish Announcement"}
        </Button>
      </form>
    </div>
  );
}
