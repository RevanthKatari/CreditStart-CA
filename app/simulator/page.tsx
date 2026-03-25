"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Clock, CreditCard, AlertTriangle, PieChart, Search,
  TrendingUp, TrendingDown, Minus, RotateCcw, Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { calculateCreditScore, SCENARIOS } from "@/lib/simulator";
import type { SimulatorInputs, SimulatorResult, ScoreRating } from "@/lib/types";

// ─── Animated Number ─────────────────────────────────────────────

function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = performance.now();
    const from = display;
    const step = (now: number) => {
      const progress = Math.min((now - start) / 600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{display}</>;
}

// ─── Score Gauge ─────────────────────────────────────────────────

function ScoreGauge({ result }: { result: SimulatorResult }) {
  const { score, color, rating } = result;
  const minScore = 300;
  const maxScore = 900;
  const fraction = (score - minScore) / (maxScore - minScore);

  const RADIUS = 110;
  const STROKE = 14;
  const startAngle = 135;
  const endAngle = 405;
  const totalArc = endAngle - startAngle;
  const circumference = 2 * Math.PI * RADIUS;
  const arcLength = (totalArc / 360) * circumference;
  const dashOffset = arcLength * (1 - fraction);

  const ratingLabels: Record<ScoreRating, string> = {
    poor: "Poor", fair: "Fair", good: "Good",
    very_good: "Very Good", excellent: "Excellent",
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: 280, height: 200 }}>
        <svg width={280} height={200} viewBox="0 0 280 240">
          {/* Background arc */}
          <circle
            cx={140} cy={140} r={RADIUS}
            fill="none" stroke="currentColor" strokeWidth={STROKE}
            className="text-muted/20"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(${startAngle} 140 140)`}
          />
          {/* Colored arc */}
          <circle
            cx={140} cy={140} r={RADIUS}
            fill="none" stroke={color} strokeWidth={STROKE}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(${startAngle} 140 140)`}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className="text-5xl font-bold" style={{ color }}>
            <AnimatedScore value={score} />
          </span>
          <span className="mt-1 text-sm font-semibold uppercase tracking-wide" style={{ color }}>
            {ratingLabels[rating]}
          </span>
          <span className="mt-0.5 text-xs text-muted-foreground">out of 900</span>
        </div>
      </div>
      {/* Scale labels */}
      <div className="flex w-full max-w-[260px] justify-between px-2 text-[10px] font-medium text-muted-foreground -mt-2">
        <span>300</span>
        <span>500</span>
        <span>700</span>
        <span>900</span>
      </div>
    </div>
  );
}

// ─── Custom Slider ───────────────────────────────────────────────

function SimSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  icon: Icon,
  onChange,
  impact,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  icon: typeof Clock;
  onChange: (v: number) => void;
  impact: "positive" | "neutral" | "negative";
}) {
  const impactColor = impact === "positive" ? "text-green-500" : impact === "negative" ? "text-red-500" : "text-yellow-500";
  const ImpactIcon = impact === "positive" ? TrendingUp : impact === "negative" ? TrendingDown : Minus;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <ImpactIcon className={cn("h-3.5 w-3.5", impactColor)} />
          <span className="min-w-[60px] text-right text-sm font-bold text-foreground">
            {value}{unit}
          </span>
        </div>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
          style={{
            width: `${pct}%`,
            backgroundColor:
              impact === "positive" ? "#22c55e" :
              impact === "negative" ? "#ef4444" : "#eab308",
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="sim-slider w-full"
      />
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────

const DEFAULT_INPUTS: SimulatorInputs = {
  paymentHistory: 100,
  utilization: 25,
  creditAge: 3,
  numAccounts: 1,
  recentInquiries: 1,
};

export default function SimulatorPage() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_INPUTS);
  const result = useMemo(() => calculateCreditScore(inputs), [inputs]);

  const update = <K extends keyof SimulatorInputs>(key: K, val: SimulatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const loadScenario = (scenario: typeof SCENARIOS[number]) => {
    setInputs(scenario.inputs);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Credit Score Simulator</h1>
        <p className="mt-2 text-muted-foreground">
          Drag the sliders to see how different financial behaviors affect your credit score in real time.
        </p>
      </motion.header>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left: Sliders + Factor Breakdown */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Adjust Your Credit Factors</CardTitle>
                <CardDescription>Each slider represents a factor in the Canadian credit scoring model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <SimSlider
                  label="Payment History" value={inputs.paymentHistory}
                  min={50} max={100} unit="%" icon={Clock}
                  onChange={(v) => update("paymentHistory", v)}
                  impact={result.breakdown[0].impact}
                />
                <SimSlider
                  label="Credit Utilization" value={inputs.utilization}
                  min={0} max={100} unit="%" icon={CreditCard}
                  onChange={(v) => update("utilization", v)}
                  impact={result.breakdown[1].impact}
                />
                <SimSlider
                  label="Credit Age" value={inputs.creditAge}
                  min={0} max={120} step={1} unit=" mo" icon={Clock}
                  onChange={(v) => update("creditAge", v)}
                  impact={result.breakdown[2].impact}
                />
                <SimSlider
                  label="Number of Accounts" value={inputs.numAccounts}
                  min={0} max={10} unit="" icon={PieChart}
                  onChange={(v) => update("numAccounts", v)}
                  impact={result.breakdown[3].impact}
                />
                <SimSlider
                  label="Recent Hard Inquiries" value={inputs.recentInquiries}
                  min={0} max={10} unit="" icon={Search}
                  onChange={(v) => update("recentInquiries", v)}
                  impact={result.breakdown[4].impact}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Factor Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Factor Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.breakdown.map((factor) => {
                  const barColor =
                    factor.impact === "positive" ? "bg-green-500" :
                    factor.impact === "negative" ? "bg-red-500" : "bg-yellow-500";
                  return (
                    <div key={factor.factor} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{factor.factor}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{factor.weight}%</Badge>
                          <span className={cn(
                            "text-xs font-medium",
                            factor.impact === "positive" ? "text-green-500" :
                            factor.impact === "negative" ? "text-red-500" : "text-yellow-500"
                          )}>
                            {Math.round(factor.rawScore * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className={cn("h-full rounded-full", barColor)}
                          initial={{ width: 0 }}
                          animate={{ width: `${factor.rawScore * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{factor.tip}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right: Score Gauge + Scenarios */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="sticky top-20">
              <CardContent className="flex flex-col items-center p-6">
                <ScoreGauge result={result} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 gap-2 text-muted-foreground"
                  onClick={() => setInputs(DEFAULT_INPUTS)}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Scenario Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h3 className="mb-3 text-sm font-semibold text-foreground">What-If Scenarios</h3>
            <div className="grid gap-2">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.name}
                  onClick={() => loadScenario(scenario)}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{scenario.name}</p>
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score Ranges</h4>
              <div className="space-y-1.5">
                {[
                  { range: "800–900", label: "Excellent", color: "#059669" },
                  { range: "740–799", label: "Very Good", color: "#22c55e" },
                  { range: "670–739", label: "Good", color: "#eab308" },
                  { range: "580–669", label: "Fair", color: "#f97316" },
                  { range: "300–579", label: "Poor", color: "#ef4444" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-foreground">{item.range}</span>
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
