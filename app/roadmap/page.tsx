"use client";

import { useState, useEffect, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import RoadmapPhase from "@/components/RoadmapPhase";
import { ROADMAP_TASKS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { PartyPopper } from "lucide-react";

const STORAGE_KEY = "newcomer-credit-roadmap-checked";

export default function RoadmapPage() {
  const [checked, setChecked] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setChecked(new Set(arr));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
    } catch {
      // ignore
    }
  }, [checked]);

  const totalTasks = ROADMAP_TASKS.length;
  const completedCount = checked.size;
  const percent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const tasksByMonth = useMemo(() => {
    const m1 = ROADMAP_TASKS.filter((t) => t.month === 1);
    const m2 = ROADMAP_TASKS.filter((t) => t.month === 2);
    const m3 = ROADMAP_TASKS.filter((t) => t.month === 3);
    return { 1: m1, 2: m2, 3: m3 };
  }, []);

  const monthCompleted = (month: 1 | 2 | 3) => {
    const tasks = tasksByMonth[month];
    return tasks.length > 0 && tasks.every((t) => checked.has(t.id));
  };

  const completedMonths = [1, 2, 3].filter((m) => monthCompleted(m as 1 | 2 | 3));
  const showSuccess = completedMonths.length > 0;

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">90-Day Roadmap</h1>
        <p className="mt-2 text-muted-foreground">
          A step-by-step plan: foundation, system, and discipline. Core steps are essential;
          optional steps give you an edge.
        </p>
      </header>

      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Overall progress</span>
            <span className="font-medium text-foreground">{Math.round(percent)}%</span>
          </div>
          <Progress value={percent} className="h-3 transition-all duration-400" />
          {showSuccess && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-primary">
              <PartyPopper className="size-5 shrink-0" />
              <p className="text-sm font-medium">
                {completedMonths.length === 3
                  ? "You've completed all three months. Great work!"
                  : `Month ${completedMonths.join(", ")} completed. Keep going!`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <RoadmapPhase
          month={1}
          tasks={tasksByMonth[1]}
          checked={checked}
          onToggle={toggle}
          completed={monthCompleted(1)}
        />
        <RoadmapPhase
          month={2}
          tasks={tasksByMonth[2]}
          checked={checked}
          onToggle={toggle}
          completed={monthCompleted(2)}
        />
        <RoadmapPhase
          month={3}
          tasks={tasksByMonth[3]}
          checked={checked}
          onToggle={toggle}
          completed={monthCompleted(3)}
        />
      </div>
    </div>
  );
}
