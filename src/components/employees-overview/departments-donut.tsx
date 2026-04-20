import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DEPARTMENTS_DONUT } from "@/lib/employees-overview-data";

export function DepartmentsDonut() {
  const total = DEPARTMENTS_DONUT.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.05)] h-full">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Departments</h3>
        <p className="text-xs text-slate-500 mt-0.5">Headcount by team</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-[150px] h-[150px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DEPARTMENTS_DONUT}
                dataKey="count"
                nameKey="name"
                innerRadius={48}
                outerRadius={70}
                stroke="#ffffff"
                strokeWidth={3}
                startAngle={90}
                endAngle={-270}
              >
                {DEPARTMENTS_DONUT.map((slice) => (
                  <Cell key={slice.name} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold text-slate-900 leading-none">{total}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">total</p>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {DEPARTMENTS_DONUT.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="flex-1 text-slate-700 font-medium truncate">{d.name}</span>
              <span className="text-slate-500 tabular-nums">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
