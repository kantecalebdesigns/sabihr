import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DEPARTMENT_BREAKDOWN } from "@/lib/dashboard-data";

export function DepartmentChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Department Breakdown</h3>
        <p className="text-xs text-muted-foreground">Employees per department</p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={DEPARTMENT_BREAKDOWN}
            layout="vertical"
            margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              width={85}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [value, "Employees"]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
              {DEPARTMENT_BREAKDOWN.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
