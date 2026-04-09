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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-[#efefef] bg-white p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {stat.label}
            </span>
            <div className="w-9 h-9 rounded-[10px] bg-[#f0f4f8] flex items-center justify-center">
              <stat.icon className="w-[18px] h-[18px] text-slate-500" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
