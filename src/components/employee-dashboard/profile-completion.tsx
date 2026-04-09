import { Link } from "react-router-dom";
import { ArrowRight, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_EMPLOYEE_PROFILE } from "@/lib/employee-mock-data";

const CHECKLIST = [
  { label: "Basic details", complete: true },
  { label: "Contact information", complete: true },
  { label: "Emergency contacts", complete: true },
  { label: "Family dependents", complete: true },
  { label: "Upload documents", complete: false },
  { label: "Statutory IDs", complete: false },
];

export function ProfileCompletion() {
  const completion = MOCK_EMPLOYEE_PROFILE.profileCompletion;
  const completedCount = CHECKLIST.filter((item) => item.complete).length;

  if (completion >= 100) return null;

  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Profile Completion</h3>
        <span className="text-lg font-bold text-blue-600">{completion}%</span>
      </div>

      <div className="space-y-4">
        {/* Progress bar */}
        <div className="w-full h-2 bg-[#f0f4f8] rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {CHECKLIST.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              {item.complete ? (
                <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-blue-600" />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-slate-200 shrink-0" />
              )}
              <span
                className={cn(
                  "text-xs",
                  item.complete
                    ? "text-slate-400 line-through"
                    : "text-slate-900 font-medium"
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400">
            {completedCount} of {CHECKLIST.length} completed
          </p>
          <Link
            to="/employee/profile"
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Complete
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
