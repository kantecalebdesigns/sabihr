import { ATTENDANCE_SUMMARY } from "@/lib/employee-mock-data";

export function AttendanceOverview() {
  const att = ATTENDANCE_SUMMARY;

  return (
    <div className="rounded-xl border border-[#efefef] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Attendance</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center pt-2.5 pb-3 rounded-lg border border-[#2f781d] bg-white">
          <p className="text-lg font-bold text-[#009966]">{att.daysPresent}</p>
          <p className="text-[10px] text-[#009966] font-medium">Present</p>
        </div>
        <div className="text-center pt-2.5 pb-3 rounded-lg border border-[#ad6c21] bg-white">
          <p className="text-lg font-bold text-[#e17100]">{att.lateArrivals}</p>
          <p className="text-[10px] text-[#e17100] font-medium">Late</p>
        </div>
        <div className="text-center pt-2.5 pb-3 rounded-lg border border-[#b42121] bg-white">
          <p className="text-lg font-bold text-[#e7000b]">{att.daysAbsent}</p>
          <p className="text-[10px] text-[#e7000b] font-medium">Absent</p>
        </div>
      </div>
    </div>
  );
}
