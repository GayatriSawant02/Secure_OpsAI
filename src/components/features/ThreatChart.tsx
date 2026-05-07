// ============================================================
// SecureOps AI – Threat Distribution Chart
// ============================================================

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useSecurityStore } from "@/stores/securityStore";

const SEVERITY_CHART_DATA_COLORS = {
  High: "#ef4444",
  Medium: "#f97316",
  Low: "#eab308",
  Info: "#3b82f6",
};

export function ThreatDistributionChart() {
  const { stats, allThreats } = useSecurityStore();

  const pieData = [
    { name: "High", value: stats.highSeverity, color: SEVERITY_CHART_DATA_COLORS.High },
    { name: "Medium", value: stats.mediumSeverity, color: SEVERITY_CHART_DATA_COLORS.Medium },
    { name: "Low", value: stats.lowSeverity, color: SEVERITY_CHART_DATA_COLORS.Low },
  ].filter((d) => d.value > 0);

  // Threat type frequency
  const typeFreq = allThreats.reduce<Record<string, number>>((acc, t) => {
    const short = t.type.split(" ").slice(0, 2).join(" ");
    acc[short] = (acc[short] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(typeFreq)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-ops-card border border-ops-border rounded-lg px-3 py-2 text-xs shadow-card-shadow">
          <p className="text-ops-text font-medium">{payload[0].name}</p>
          <p className="font-mono" style={{ color: payload[0].payload.color }}>
            {payload[0].value} threats
          </p>
        </div>
      );
    }
    return null;
  };

  if (stats.totalThreats === 0) {
    return (
      <div className="cyber-card border border-ops-border rounded-xl p-6 flex flex-col items-center justify-center h-52">
        <div className="text-ops-text-muted text-sm text-center">
          <div className="text-2xl mb-2 opacity-30">📊</div>
          No threat data to visualize
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Pie chart */}
      <div className="cyber-card border border-ops-border rounded-xl p-4">
        <h3 className="text-ops-text font-semibold text-sm mb-3">Severity Distribution</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  style={{ filter: `drop-shadow(0 0 4px ${entry.color}50)` }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "#94a3b8", fontSize: "11px", fontFamily: "JetBrains Mono" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="cyber-card border border-ops-border rounded-xl p-4">
        <h3 className="text-ops-text font-semibold text-sm mb-3">Top Threat Categories</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d40" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#475569", fontSize: 9, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e2d40", borderRadius: "8px", fontSize: "11px" }}
              labelStyle={{ color: "#e2e8f0", fontFamily: "JetBrains Mono" }}
              itemStyle={{ color: "#00d4ff" }}
            />
            <Bar dataKey="count" fill="#00d4ff" radius={[3, 3, 0, 0]} name="Occurrences">
              {barData.map((_, index) => (
                <Cell key={`bar-${index}`} fill={`rgba(0,212,255,${0.9 - index * 0.1})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
