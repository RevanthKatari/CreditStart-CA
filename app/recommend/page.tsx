"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap, Briefcase, Globe, ShieldCheck,
  Landmark, DollarSign, ShoppingCart, UtensilsCrossed,
  Fuel, Plane, Tv, ShoppingBag, Coins, MapPin,
  CreditCard, TrendingDown, ArrowRight, ArrowLeft,
  RotateCcw, Download, Sparkles, Check, ChevronRight,
  Trophy, Star, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { generateRecommendation } from "@/lib/recommendation";
import { generatePlanPDF } from "@/lib/pdf";
import type {
  UserProfile, RecommendationResult, StudentType, BudgetRange,
  SpendingCategory, CreditGoal,
} from "@/lib/types";

// ─── Option Data ─────────────────────────────────────────────────

const STATUS_OPTIONS: { value: StudentType; label: string; desc: string; icon: typeof GraduationCap }[] = [
  { value: "international", label: "International Student", desc: "Study permit holder", icon: Globe },
  { value: "domestic", label: "Domestic Student", desc: "Canadian citizen student", icon: GraduationCap },
  { value: "pr", label: "Permanent Resident", desc: "PR card holder", icon: ShieldCheck },
  { value: "work_permit", label: "Work Permit", desc: "Open or closed work permit", icon: Briefcase },
];

const BANK_OPTIONS = [
  { value: "TD", label: "TD" },
  { value: "Scotiabank", label: "Scotiabank" },
  { value: "BMO", label: "BMO" },
  { value: "CIBC", label: "CIBC" },
  { value: "RBC", label: "RBC" },
];

const BUDGET_OPTIONS: { value: BudgetRange; label: string; desc: string }[] = [
  { value: "under_500", label: "Under $500", desc: "Tight budget" },
  { value: "500_1000", label: "$500 – $1,000", desc: "Moderate budget" },
  { value: "1000_2000", label: "$1,000 – $2,000", desc: "Comfortable budget" },
  { value: "over_2000", label: "$2,000+", desc: "Flexible spending" },
];

const SPENDING_OPTIONS: { value: SpendingCategory; label: string; icon: typeof ShoppingCart }[] = [
  { value: "groceries", label: "Groceries", icon: ShoppingCart },
  { value: "dining", label: "Dining & Delivery", icon: UtensilsCrossed },
  { value: "gas", label: "Gas & Transit", icon: Fuel },
  { value: "travel", label: "Travel & Flights", icon: Plane },
  { value: "entertainment", label: "Entertainment", icon: Tv },
  { value: "shopping", label: "Online Shopping", icon: ShoppingBag },
];

const GOAL_OPTIONS: { value: CreditGoal; label: string; desc: string; icon: typeof Coins }[] = [
  { value: "cashback", label: "Cash Back", desc: "Money back on every purchase", icon: Coins },
  { value: "travel_rewards", label: "Travel Rewards", desc: "Points for flights & hotels", icon: Plane },
  { value: "build_credit", label: "Build Credit Fast", desc: "Establish history ASAP", icon: TrendingDown },
  { value: "low_rates", label: "Low Interest", desc: "Minimize interest charges", icon: DollarSign },
];

// ─── Animation Variants ──────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

// ─── Animated Counter ────────────────────────────────────────────

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <>{display}</>;
}

// ─── Score Ring ──────────────────────────────────────────────────

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 80 ? "#059669" : score >= 60 ? "#2563eb" : "#f97316";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={8} className="text-muted/30" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          <AnimatedNumber value={score} />
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">% match</span>
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────

const TOTAL_STEPS = 5;

export default function RecommendPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [phase, setPhase] = useState<"quiz" | "processing" | "results">("quiz");
  const [processingStep, setProcessingStep] = useState(0);

  const [studentType, setStudentType] = useState<StudentType | null>(null);
  const [hasGIC, setHasGIC] = useState<boolean | null>(null);
  const [gicBank, setGicBank] = useState<string | null>(null);
  const [budget, setBudget] = useState<BudgetRange | null>(null);
  const [spending, setSpending] = useState<SpendingCategory[]>([]);
  const [goal, setGoal] = useState<CreditGoal | null>(null);

  const [result, setResult] = useState<RecommendationResult | null>(null);

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 0: return studentType !== null;
      case 1: return hasGIC !== null;
      case 2: return budget !== null;
      case 3: return spending.length > 0;
      case 4: return goal !== null;
      default: return false;
    }
  }, [step, studentType, hasGIC, budget, spending, goal]);

  const goNext = () => {
    if (!canProceed()) return;
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      runRecommendation();
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const runRecommendation = () => {
    setPhase("processing");
    setProcessingStep(0);

    const timers = [
      setTimeout(() => setProcessingStep(1), 800),
      setTimeout(() => setProcessingStep(2), 1800),
      setTimeout(() => {
        const profile: UserProfile = {
          studentType: studentType!,
          hasGIC: hasGIC!,
          gicBank: hasGIC ? gicBank : null,
          monthlyBudget: budget!,
          topSpending: spending,
          primaryGoal: goal!,
        };
        const rec = generateRecommendation(profile);
        setResult(rec);
        try {
          localStorage.setItem("ncn-user-profile", JSON.stringify(profile));
          localStorage.setItem("ncn-recommendation", JSON.stringify(rec));
        } catch { /* ignore */ }
        setPhase("results");
      }, 2800),
    ];

    return () => timers.forEach(clearTimeout);
  };

  const reset = () => {
    setPhase("quiz");
    setStep(0);
    setDirection(1);
    setStudentType(null);
    setHasGIC(null);
    setGicBank(null);
    setBudget(null);
    setSpending([]);
    setGoal(null);
    setResult(null);
  };

  const toggleSpending = (cat: SpendingCategory) => {
    setSpending((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : prev.length < 3
          ? [...prev, cat]
          : prev
    );
  };

  // ─── Processing Phase ────────────────────────────────────────

  if (phase === "processing") {
    const steps = [
      "Analyzing your profile...",
      "Scoring 19 student cards across 5 banks...",
      "Finding your best matches...",
    ];
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent"
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>
          <div className="flex flex-col items-center gap-3">
            {steps.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={processingStep >= i ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4 }}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  processingStep >= i ? "text-foreground" : "text-transparent"
                )}
              >
                {processingStep > i ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : processingStep === i ? (
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} className="h-4 w-4 rounded-full bg-primary" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                {text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Results Phase ───────────────────────────────────────────

  if (phase === "results" && result) {
    return (
      <div className="mx-auto max-w-4xl space-y-8 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-600">
            <Check className="h-4 w-4" />
            Analysis Complete
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Your Personalized Recommendation</h1>
          <p className="mt-2 text-muted-foreground">Based on your profile, here are the best options for you</p>
        </motion.div>

        {/* Top Bank */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <ScoreRing score={result.topBank.score} size={140} />
                <div className="flex-1 text-center md:text-left">
                  <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/10">
                    <Trophy className="mr-1 h-3 w-3" /> Best Bank Match
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground">{result.topBank.bankName}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{result.topBank.packageName}</p>
                  <ul className="mt-4 space-y-2">
                    {result.topBank.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span className="text-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.topBank.features.map((f, i) => (
                      <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* All Banks Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="mb-4 text-lg font-semibold text-foreground">All Banks Ranked</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.allBanks.slice(1).map((bank, i) => (
              <Card key={bank.bankId} className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <ScoreRing score={bank.score} size={64} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">#{i + 2} {bank.bankName}</p>
                    <p className="text-xs text-muted-foreground">{bank.packageName}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Top Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Top Credit Card Picks</h3>
          <div className="space-y-4">
            {result.topCards.map((card, i) => (
              <motion.div
                key={card.cardId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <Card className={cn(
                  "transition-all hover:shadow-md",
                  i === 0 && "border-2 border-accent/30 bg-gradient-to-r from-accent/5 to-card"
                )}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <ScoreRing score={card.score} size={80} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {i === 0 && (
                            <Badge className="bg-accent/10 text-accent hover:bg-accent/10">
                              <Star className="mr-1 h-3 w-3" /> Top Pick
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">{card.bankName}</Badge>
                          <Badge variant="outline" className="text-xs">{card.annualFee}/yr</Badge>
                        </div>
                        <h4 className="mt-2 text-base font-semibold text-foreground">{card.cardName}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{card.headline}</p>
                        {card.reasons.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                            {card.reasons.map((reason, j) => (
                              <span key={j} className="flex items-center gap-1 text-xs text-green-600">
                                <Zap className="h-3 w-3" /> {reason}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Personalized Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="bg-gradient-to-br from-muted/50 to-card">
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Action Plan
              </h3>
              <ol className="space-y-3">
                {result.personalizedTips.map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex gap-3 text-sm"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{tip}</span>
                  </motion.li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button size="lg" className="gap-2 bg-primary" onClick={() => generatePlanPDF(result)}>
            <Download className="h-4 w-4" />
            Download Your Plan (PDF)
          </Button>
          <Link href="/roadmap">
            <Button size="lg" variant="outline" className="gap-2">
              Start Your 90-Day Roadmap
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="ghost" className="gap-2 text-muted-foreground" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── Quiz Phase ──────────────────────────────────────────────

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center py-8">
      {/* Progress bar */}
      <div className="mb-8 flex w-full max-w-md gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ))}
      </div>

      <p className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Step {step + 1} of {TOTAL_STEPS}
      </p>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full"
        >
          {/* Step 0: Status */}
          {step === 0 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">What&apos;s your status in Canada?</h2>
                <p className="mt-2 text-sm text-muted-foreground">This affects which banking packages you qualify for</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {STATUS_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = studentType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setStudentType(opt.value)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                      {selected && <Check className="ml-auto h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: GIC */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">Do you have a GIC in Canada?</h2>
                <p className="mt-2 text-sm text-muted-foreground">A GIC with a bank gives you a huge approval advantage there</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => { setHasGIC(false); setGicBank(null); }}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all",
                    hasGIC === false ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", hasGIC === false ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">No GIC</p>
                    <p className="text-xs text-muted-foreground">I don&apos;t have one</p>
                  </div>
                </button>
                <button
                  onClick={() => setHasGIC(true)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all",
                    hasGIC === true ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", hasGIC === true ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <Landmark className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Yes, I have a GIC</p>
                    <p className="text-xs text-muted-foreground">SDS or other GIC</p>
                  </div>
                </button>
              </div>
              {hasGIC && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Which bank holds your GIC?</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {BANK_OPTIONS.map((b) => (
                      <button
                        key={b.value}
                        onClick={() => setGicBank(b.value)}
                        className={cn(
                          "rounded-full border-2 px-5 py-2 text-sm font-medium transition-all",
                          gicBank === b.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-muted-foreground/50"
                        )}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">What&apos;s your monthly budget?</h2>
                <p className="mt-2 text-sm text-muted-foreground">Helps us recommend cards with the right fee structure</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {BUDGET_OPTIONS.map((opt) => {
                  const selected = budget === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setBudget(opt.value)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all",
                        selected ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border bg-card hover:border-muted-foreground/30"
                      )}
                    >
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                      {selected && <Check className="ml-auto h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Spending Categories */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">Where do you spend the most?</h2>
                <p className="mt-2 text-sm text-muted-foreground">Pick up to 3 categories to match you with the best rewards</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {SPENDING_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = spending.includes(opt.value);
                  const disabled = !selected && spending.length >= 3;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => !disabled && toggleSpending(opt.value)}
                      disabled={disabled}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                        selected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : disabled
                            ? "cursor-not-allowed border-border bg-muted/30 opacity-50"
                            : "border-border bg-card hover:border-muted-foreground/30"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{opt.label}</p>
                      {selected && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">{spending.length}/3 selected</p>
            </div>
          )}

          {/* Step 4: Goal */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">What matters most to you?</h2>
                <p className="mt-2 text-sm text-muted-foreground">Your primary goal shapes which card is the best fit</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {GOAL_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = goal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setGoal(opt.value)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all",
                        selected ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border bg-card hover:border-muted-foreground/30"
                      )}
                    >
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                      {selected && <Check className="ml-auto h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-10 flex w-full max-w-md items-center justify-between">
        <Button
          variant="ghost"
          onClick={goBack}
          disabled={step === 0}
          className="gap-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={goNext}
          disabled={!canProceed()}
          className="gap-2 bg-primary px-8"
        >
          {step === TOTAL_STEPS - 1 ? (
            <>
              Get My Recommendations
              <Sparkles className="h-4 w-4" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
