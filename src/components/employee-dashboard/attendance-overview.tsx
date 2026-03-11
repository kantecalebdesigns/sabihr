import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { ATTENDANCE_SUMMARY } from "@/lib/employee-mock-data";

export function AttendanceOverview() {
  const att = ATTENDANCE_SUMMARY;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
            <LogIn className="w-3.5 h-3.5" />
            Clock In
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center pt-2.5 pb-3 rounded-lg border border-emerald-700 bg-white">
            <p className="text-lg font-bold text-emerald-700">{att.daysPresent}</p>
            <p className="text-[10px] text-emerald-600 font-medium">Present</p>
          </div>
          <div className="text-center pt-2.5 pb-3 rounded-lg border border-amber-600 bg-white">
            <p className="text-lg font-bold text-amber-700">{att.lateArrivals}</p>
            <p className="text-[10px] text-amber-600 font-medium">Late</p>
          </div>
          <div className="text-center pt-2.5 pb-3 rounded-lg border border-red-600 bg-white">
            <p className="text-lg font-bold text-red-700">{att.daysAbsent}</p>
            <p className="text-[10px] text-red-600 font-medium">Absent</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
