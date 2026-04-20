import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { PENDING_APPROVALS, ON_LEAVE_TODAY } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

function ProfileHeader() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold shrink-0">
        AD
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
        <Link
          to="/profile"
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          View profile
        </Link>
      </div>
      <button
        type="button"
        aria-label="More"
        className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}

function PendingApprovals() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Pending approvals</h3>
          <p className="text-[11px] text-slate-500">
            {PENDING_APPROVALS.length} items need your review
          </p>
        </div>
        <Link
          to="/leave"
          className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {PENDING_APPROVALS.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 rounded-lg hover:bg-slate-50 px-1.5 py-1.5 transition-colors"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold text-white",
                item.avatarColor
              )}
            >
              {item.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
                {item.employeeName}
              </p>
              <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                {item.summary}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Review ${item.employeeName}`}
              className="shrink-0 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
            >
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function OnLeaveTodaySection() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">On leave today</h3>
          <p className="text-[11px] text-slate-500">{ON_LEAVE_TODAY.length} people away</p>
        </div>
        <Link
          to="/attendance"
          className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {ON_LEAVE_TODAY.map((person) => (
          <div key={person.id} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center text-[11px] font-semibold text-white",
                person.avatarColor
              )}
            >
              {person.initials}
            </div>
            <p className="text-[10px] text-slate-700 font-medium text-center truncate w-full leading-tight">
              {person.name.split(" ")[0]}
            </p>
            <span className="text-[9px] text-slate-400 leading-none">{person.returns}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RightRail() {
  return (
    <aside className="flex flex-col gap-4">
      <ProfileHeader />
      <PendingApprovals />
      <OnLeaveTodaySection />
    </aside>
  );
}
