import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import { RECENT_ACTIVITIES } from "@/lib/dashboard-data";
import type { ActivityType } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ActivityType, string> = {
  new_hire: "Onboarded",
  leave_approved: "Approved",
  leave_requested: "Awaiting",
  payroll_processed: "Completed",
  document_generated: "Generated",
  probation_ending: "Review due",
  employee_exit: "Exiting",
};

const STATUS_PILL: Record<ActivityType, { dot: string; pill: string }> = {
  new_hire: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700" },
  leave_approved: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700" },
  leave_requested: { dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700" },
  payroll_processed: { dot: "bg-blue-500", pill: "bg-blue-50 text-blue-700" },
  document_generated: { dot: "bg-violet-500", pill: "bg-violet-50 text-violet-700" },
  probation_ending: { dot: "bg-rose-500", pill: "bg-rose-50 text-rose-700" },
  employee_exit: { dot: "bg-slate-400", pill: "bg-slate-100 text-slate-600" },
};

const AVATAR_PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function ActivityAvatar({
  photo,
  name,
  isSystem,
  fallbackBg,
}: {
  photo?: string;
  name: string;
  isSystem: boolean;
  fallbackBg: string;
}) {
  const [errored, setErrored] = useState(false);
  if (photo && !errored) {
    return (
      <img
        src={photo}
        alt={name}
        onError={() => setErrored(true)}
        className="w-10 h-10 rounded-full object-cover shrink-0"
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold text-white",
        isSystem ? "bg-slate-400" : fallbackBg
      )}
    >
      {isSystem ? "SY" : initialsOf(name)}
    </div>
  );
}

export function ActivityTable() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Latest updates across your organization</p>
        </div>
        <Link
          to="/reports"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70">
              <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pl-5 pr-5">
                Employee
              </th>
              <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden md:table-cell">
                Status
              </th>
              <th className="text-left font-medium text-[11px] uppercase tracking-wider text-slate-500 py-3 pr-5 hidden sm:table-cell">
                When
              </th>
              <th className="w-10 px-2" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {RECENT_ACTIVITIES.slice(0, 6).map((row) => {
              const status = STATUS_PILL[row.type];
              const isSystem = row.employee === "System";
              return (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-4 pl-5 pr-5">
                    <div className="flex items-center gap-3 min-w-0">
                      <ActivityAvatar
                        photo={row.photo}
                        name={row.employee}
                        isSystem={isSystem}
                        fallbackBg={avatarColor(row.id)}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 leading-tight truncate">
                          {row.employee}
                        </p>
                        <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">
                          {row.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-5 hidden md:table-cell">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                        status.pill
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                      {STATUS_LABEL[row.type]}
                    </span>
                  </td>
                  <td className="py-4 pr-5 text-xs text-slate-600 hidden sm:table-cell">
                    {row.timestamp}
                  </td>
                  <td className="px-2 py-4 text-right">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
