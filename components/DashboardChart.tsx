"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PROJECTED_SCORES } from "@/lib/constants";

const data = PROJECTED_SCORES.map((score, i) => ({
  month: `Month ${i + 1}`,
  score,
  full: `Score: ${score}`,
}));

export default function DashboardChart() {
  return (
    <div className="h-64 min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#0d9488" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#64748b" />
          <YAxis
            domain={[620, 760]}
            tick={{ fontSize: 11 }}
            stroke="#64748b"
            tickFormatter={(v) => v}
          />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.[0] ? (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow">
                  <p className="text-sm font-medium text-slate-800">{payload[0].payload.full}</p>
                </div>
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#1e3a5f"
            strokeWidth={2}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-1 text-center text-xs text-slate-500">
        Projected credit score over 12 months if you follow the roadmap
      </p>
    </div>
  );
}
