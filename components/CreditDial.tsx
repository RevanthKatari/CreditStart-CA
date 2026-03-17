"use client";

import { useEffect, useState } from "react";

const RADIUS = 70;
const STROKE = 10;
const circumference = 2 * Math.PI * RADIUS;

type Props = {
  simulate: boolean;
};

export default function CreditDial({ simulate }: Props) {
  const [displayScore, setDisplayScore] = useState<number | null>(null);

  useEffect(() => {
    if (!simulate) {
      setDisplayScore(null);
      return;
    }
    const timer = setTimeout(() => setDisplayScore(650), 100);
    return () => clearTimeout(timer);
  }, [simulate]);

  const score = displayScore ?? 0;
  const minScore = 300;
  const maxScore = 900;
  const normalized = Math.min(Math.max(score, minScore), maxScore);
  const fraction = (normalized - minScore) / (maxScore - minScore);
  const dashOffset = circumference * (1 - fraction);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-44 w-44">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={STROKE}
          />
          {simulate && (
            <circle
              cx="90"
              cy="90"
              r={RADIUS}
              fill="none"
              stroke="#1e3a5f"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-score"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {displayScore !== null ? (
            <>
              <span className="text-3xl font-bold text-slate-800">{displayScore}</span>
              <span className="text-xs text-slate-500">credit score</span>
            </>
          ) : (
            <span className="max-w-[100px] text-center text-sm font-medium text-slate-600">
              Pending History
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
