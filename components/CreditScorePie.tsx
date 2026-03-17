"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CREDIT_SCORE_FACTORS } from "@/lib/constants";

const data = CREDIT_SCORE_FACTORS.map((f) => ({
  name: f.name,
  value: f.value,
  color: f.color,
  subtitle: f.subtitle,
  description: f.description,
}));

export default function CreditScorePie() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-72 min-h-[280px] w-full max-w-sm">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  stroke={activeIndex === index ? "#0f172a" : "transparent"}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active: a, payload }) => {
                if (!a || !payload?.[0]) return null;
                const p = payload[0].payload;
                return (
                  <div className="max-w-xs rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                    <p className="font-semibold text-slate-800">
                      {p.name} — {p.value}%{p.subtitle ? ` (${p.subtitle})` : ""}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{p.description}</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {active && (
        <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm md:max-w-md">
          <p className="font-medium text-slate-800">
            {active.name} — {active.value}%
            {active.subtitle && (
              <span className="font-normal text-slate-500"> ({active.subtitle})</span>
            )}
          </p>
          <p className="mt-1 text-slate-600">{active.description}</p>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {data.map((entry, index) => (
          <button
            key={entry.name}
            type="button"
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            className="rounded-full px-3 py-1 text-xs font-medium text-white transition-opacity"
            style={{ backgroundColor: entry.color }}
          >
            {entry.name}
          </button>
        ))}
      </div>
    </div>
  );
}
