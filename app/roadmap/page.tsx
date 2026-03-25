"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import RoadmapPhase from "@/components/RoadmapPhase";
import { ROADMAP_TASKS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PartyPopper, Sparkles, ArrowRight, Download, User } from "lucide-react";
import type { RecommendationResult, RoadmapTask } from "@/lib/types";
import { generatePlanPDF } from "@/lib/pdf";

const STORAGE_KEY = "newcomer-credit-roadmap-checked";

export default function RoadmapPage() {
  const [checked, setChecked] = useState<Set<string>>(() => new Set());
  const [savedResult, setSavedResult] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setChecked(new Set(arr));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
    } catch { /* ignore */ }
  }, [checked]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ncn-recommendation");
      if (raw) setSavedResult(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const personalizedTasks = useMemo((): RoadmapTask[] => {
    if (!savedResult) return ROADMAP_TASKS;

    const bankName = savedResult.topBank.bankName;
    const cardName = savedResult.topCards[0]?.cardName ?? "your recommended card";
    const goal = savedResult.profile.primaryGoal;

    return ROADMAP_TASKS.map((task) => {
      if (task.id === "m1-bank") {
        return {
          ...task,
          label: `Open a ${bankName} Student Banking Package`,
          description: `Based on your profile, ${bankName} is your best match (${savedResult.topBank.score}% score). Apply for their student chequing account and the ${cardName}.`,
        };
      }
      if (task.id === "m1-activate") {
        return {
          ...task,
          description: `Activate your ${cardName} and download the ${bankName} mobile app. Enable push notifications for payment due dates.`,
        };
      }
      if (task.id === "m2-onebill") {
        const billSuggestion = goal === "cashback"
          ? "Choose a bill that maximizes your cash back category (groceries or streaming)."
          : goal === "travel_rewards"
            ? "Pick a recurring bill that earns travel points (like a streaming subscription)."
            : "Pick any fixed monthly bill — consistency matters more than the amount.";
        return {
          ...task,
          description: `Route exactly one fixed monthly bill to your ${cardName}. ${billSuggestion}`,
        };
      }
      return task;
    });
  }, [savedResult]);

  const totalTasks = personalizedTasks.length;
  const completedCount = checked.size;
  const percent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const tasksByMonth = useMemo(() => {
    const m1 = personalizedTasks.filter((t) => t.month === 1);
    const m2 = personalizedTasks.filter((t) => t.month === 2);
    const m3 = personalizedTasks.filter((t) => t.month === 3);
    return { 1: m1, 2: m2, 3: m3 };
  }, [personalizedTasks]);

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
          {savedResult
            ? "Personalized for your profile — tasks adapted to your recommended setup."
            : "A step-by-step plan: foundation, system, and discipline."}
        </p>
      </header>

      {/* Personalized banner or CTA to take quiz */}
      {savedResult ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-card to-accent/5">
            <CardContent className="flex flex-col items-center gap-3 p-4 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Personalized Roadmap</p>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-[10px]">
                      {savedResult.topBank.bankName}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tasks adapted for {savedResult.topBank.bankName} + {savedResult.topCards[0]?.cardName}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => generatePlanPDF(savedResult)}
              >
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-3 p-5 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Want a personalized roadmap?</p>
                <p className="text-xs text-muted-foreground">Take the quiz to get tasks tailored to your recommended bank & card</p>
              </div>
            </div>
            <Link href="/recommend">
              <Button size="sm" className="gap-2">
                Find My Setup <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
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
