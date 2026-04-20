import {
  CalendarDays,
  Clock,
  Wallet,
  Bell,
} from "lucide-react";
import {
  LEAVE_BALANCE,
  ATTENDANCE_SUMMARY,
  PAYSLIP_SUMMARY,
  PENDING_REQUESTS,
} from "@/lib/employee-mock-data";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

const stats = [
  {
    label: "Leave Balance",
    value: `${LEAVE_BALANCE.annual.total - LEAVE_BALANCE.annual.used - LEAVE_BALANCE.annual.pending}`,
    sub: `of ${LEAVE_BALANCE.annual.total} annual days`,
    icon: CalendarDays,
  },
  {
    label: "Attendance",
    value: `${Math.round((ATTENDANCE_SUMMARY.daysPresent / (ATTENDANCE_SUMMARY.workingDays - ATTENDANCE_SUMMARY.daysRemaining)) * 100)}%`,
    sub: `${ATTENDANCE_SUMMARY.daysPresent}/${ATTENDANCE_SUMMARY.workingDays - ATTENDANCE_SUMMARY.daysRemaining} days this month`,
    icon: Clock,
  },
  {
    label: "Next Payday",
    value: formatCurrency(PAYSLIP_SUMMARY.netPay),
    sub: new Date(PAYSLIP_SUMMARY.nextPayday).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
    }),
    icon: Wallet,
  },
  {
    label: "Pending Requests",
    value: `${PENDING_REQUESTS.total}`,
    sub: PENDING_REQUESTS.total === 0 ? "All clear" : "Awaiting approval",
    icon: Bell,
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200/70 bg-white px-5 pt-5 pb-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] flex flex-col gap-6"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <stat.icon className="w-[18px] h-[18px] text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-2">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
