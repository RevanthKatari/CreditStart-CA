"use client";

type Props = { percent: number; label?: string };

export default function ProgressBar({ percent, label }: Props) {
  const value = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-slate-600">{label}</span>
          <span className="font-medium text-slate-800">{Math.round(value)}%</span>
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-600 transition-progress"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
