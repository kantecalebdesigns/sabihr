import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HEADCOUNT_TREND } from "@/lib/dashboard-data";

export function HeadcountChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Headcount Trend</h3>
        <p className="text-xs text-muted-foreground">Employee count over the last 6 months</p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={HEADCOUNT_TREND} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="headcountGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 10", "dataMax + 5"]}
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
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#headcountGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
