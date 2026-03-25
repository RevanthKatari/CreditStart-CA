"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard, Check, ChevronDown, ChevronUp, Sparkles,
  DollarSign, Plane, Star, TrendingDown, Gift, Filter,
  ArrowRight, Percent, ShieldCheck, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BANKING_PACKAGES } from "@/lib/constants";
import { BANKS_WITH_STUDENT_CARDS } from "@/lib/studentCards";
import type { BankWithStudentCards, DetailedStudentCard, RecommendationResult } from "@/lib/types";

// ─── Card Type Classification ────────────────────────────────────

type CardType = "cashback" | "travel" | "rewards" | "low_rate" | "basic";

function classifyCard(card: DetailedStudentCard): CardType {
  const name = card.name.toLowerCase();
  const headline = card.headline.toLowerCase();
  if (name.includes("low rate") || name.includes("value") || parseFloat(card.purchaseRate) < 15)
    return "low_rate";
  if (name.includes("cash back") || name.includes("cashback") || name.includes("dividend") || name.includes("momentum"))
    return "cashback";
  if (name.includes("aeroplan") || name.includes("aventura") || name.includes("westjet") || name.includes("avion") || (headline.includes("travel") && name.includes("travel")))
    return "travel";
  if (name.includes("scene") || name.includes("rewards") || name.includes("adapta") || name.includes("ion") || name.includes("amex"))
    return "rewards";
  return "basic";
}

const TYPE_CONFIG: Record<CardType, { label: string; icon: typeof DollarSign; gradient: string; badge: string }> = {
  cashback:  { label: "Cash Back",  icon: DollarSign,    gradient: "from-emerald-500/10 to-emerald-600/5", badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  travel:    { label: "Travel",     icon: Plane,         gradient: "from-blue-500/10 to-indigo-600/5",     badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  rewards:   { label: "Rewards",    icon: Gift,          gradient: "from-violet-500/10 to-purple-600/5",   badge: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
  low_rate:  { label: "Low Rate",   icon: TrendingDown,  gradient: "from-amber-500/10 to-orange-600/5",    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  basic:     { label: "Starter",    icon: CreditCard,    gradient: "from-slate-500/10 to-slate-600/5",     badge: "bg-slate-500/10 text-slate-700 dark:text-slate-400" },
};

const FILTER_OPTIONS: { value: CardType | "all"; label: string; icon: typeof Filter }[] = [
  { value: "all",      label: "All Cards",  icon: Filter },
  { value: "cashback", label: "Cash Back",  icon: DollarSign },
  { value: "travel",   label: "Travel",     icon: Plane },
  { value: "rewards",  label: "Rewards",    icon: Gift },
  { value: "low_rate", label: "Low Rate",   icon: TrendingDown },
];

// ─── Bank Logo ───────────────────────────────────────────────────

const LOGO_MAP: Record<string, string> = {
  TD: "/logo/td.png",
  BMO: "/logo/bmo.jpg",
  CIBC: "/logo/cibc.png",
  Scotiabank: "/logo/scotiabank.png",
  RBC: "/logo/rbc.png",
};

function BankLogo({ name, size = 40 }: { name: string; size?: number }) {
  const src = LOGO_MAP[name];
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={name} width={size} height={size} className="object-contain" style={{ width: size, height: size }} />
      ) : (
        <span className="text-sm font-bold text-primary">{name.charAt(0)}</span>
      )}
    </div>
  );
}

// ─── Bank Color Accents ──────────────────────────────────────────

const BANK_ACCENTS: Record<string, { bg: string; border: string; ring: string }> = {
  CIBC:       { bg: "bg-red-500/5",    border: "border-red-500/20",    ring: "ring-red-500/30" },
  Scotiabank: { bg: "bg-red-500/5",    border: "border-red-500/20",    ring: "ring-red-500/30" },
  BMO:        { bg: "bg-sky-500/5",    border: "border-sky-500/20",    ring: "ring-sky-500/30" },
  TD:         { bg: "bg-green-500/5",  border: "border-green-500/20",  ring: "ring-green-500/30" },
  RBC:        { bg: "bg-blue-500/5",   border: "border-blue-500/20",   ring: "ring-blue-500/30" },
};

// ─── Single Credit Card Component ────────────────────────────────

function CreditCardDisplay({ card, bankName, isRecommended }: {
  card: DetailedStudentCard;
  bankName: string;
  isRecommended: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardType = classifyCard(card);
  const config = TYPE_CONFIG[cardType];
  const TypeIcon = config.icon;

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className={cn(
          "group relative cursor-pointer overflow-hidden transition-all hover:shadow-lg",
          isRecommended && "ring-2 ring-accent/50",
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Gradient top bar based on card type */}
        <div className={cn("h-1.5 w-full bg-gradient-to-r", config.gradient.replace("/10", "/60").replace("/5", "/40"))} />

        <CardContent className="p-5">
          {/* Top row: badges */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold", config.badge)}>
              <TypeIcon className="h-3 w-3" />
              {config.label}
            </span>
            {card.tag && (
              <Badge variant="outline" className="border-primary/30 text-[10px] font-medium text-primary">
                <Star className="mr-0.5 h-2.5 w-2.5" /> {card.tag}
              </Badge>
            )}
            {card.annualFee === "$0" && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400">
                <Check className="h-2.5 w-2.5" /> No fee
              </span>
            )}
            {isRecommended && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                <Sparkles className="h-2.5 w-2.5" /> Your match
              </span>
            )}
          </div>

          {/* Card name */}
          <h3 className="text-base font-semibold leading-tight text-foreground">{card.name}</h3>

          {/* Headline */}
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.headline}</p>

          {/* Key stats bar */}
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{card.annualFee}</span>
              <span className="text-muted-foreground">/yr</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{card.purchaseRate}</span>
              <span className="text-muted-foreground">purchase</span>
            </div>
            <div className="ml-auto">
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
              )}
            </div>
          </div>

          {/* Expanded details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <Separator className="my-4" />

                {card.bullets.length > 0 && (
                  <ul className="space-y-2.5">
                    {card.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check className="h-2.5 w-2.5 text-primary" />
                        </div>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Annual Fee</p>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{card.annualFee}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Purchase Rate</p>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{card.purchaseRate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Cash Advance</p>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{card.cashRate}</p>
                    {card.cashRateQuebec != null && (
                      <p className="text-[10px] text-muted-foreground">QC: {card.cashRateQuebec}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────

export default function StudentPackagesPage() {
  const [selectedBankId, setSelectedBankId] = useState<string>("cibc");
  const [filter, setFilter] = useState<CardType | "all">("all");
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ncn-recommendation");
      if (raw) setRecommendation(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const selectedBank = BANKS_WITH_STUDENT_CARDS.find((b) => b.id === selectedBankId)!;
  const bankPkg = BANKING_PACKAGES.find((p) => p.bank.toLowerCase() === selectedBank.name.toLowerCase());
  const accent = BANK_ACCENTS[selectedBank.name] ?? BANK_ACCENTS.CIBC;

  const recommendedCardIds = useMemo(() => {
    if (!recommendation) return new Set<string>();
    return new Set(recommendation.topCards.map((c) => c.cardId));
  }, [recommendation]);

  const filteredCards = useMemo(() => {
    if (filter === "all") return selectedBank.cards;
    return selectedBank.cards.filter((c) => classifyCard(c) === filter);
  }, [selectedBank, filter]);

  const totalCards = BANKS_WITH_STUDENT_CARDS.reduce((sum, b) => sum + b.cardCount, 0);
  const noFeeCount = BANKS_WITH_STUDENT_CARDS.flatMap((b) => b.cards).filter((c) => c.annualFee === "$0").length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Header */}
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Student Banking Packages</h1>
        <p className="mt-2 text-muted-foreground">
          Compare accounts and credit cards designed for international students in Canada.
        </p>
        {/* Quick stats */}
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { icon: CreditCard, label: `${totalCards} Student Cards`, accent: "text-primary" },
            { icon: ShieldCheck, label: "5 Major Banks", accent: "text-accent" },
            { icon: DollarSign, label: `${noFeeCount} with $0 Fee`, accent: "text-emerald-600" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <stat.icon className={cn("h-3.5 w-3.5", stat.accent)} />
              {stat.label}
            </div>
          ))}
        </div>
      </motion.header>

      {/* Recommendation banner */}
      {recommendation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-2 border-accent/20 bg-gradient-to-r from-accent/5 via-card to-primary/5">
            <CardContent className="flex flex-col items-center gap-3 p-4 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Your top card: {recommendation.topCards[0]?.cardName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {recommendation.topCards[0]?.score}% match &middot; Cards marked below with &quot;Your match&quot;
                  </p>
                </div>
              </div>
              <Link href="/recommend">
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  Retake Quiz <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bank Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {BANKS_WITH_STUDENT_CARDS.map((bank) => {
            const isSelected = bank.id === selectedBankId;
            const isRecommendedBank = recommendation?.topBank.bankId === bank.id;
            const bankAccent = BANK_ACCENTS[bank.name] ?? BANK_ACCENTS.CIBC;
            return (
              <button
                key={bank.id}
                onClick={() => { setSelectedBankId(bank.id); setFilter("all"); }}
                className={cn(
                  "group relative flex shrink-0 items-center gap-3 rounded-2xl border-2 px-4 py-3 transition-all",
                  isSelected
                    ? cn("shadow-lg", bankAccent.bg, bankAccent.border, bankAccent.ring, "ring-1")
                    : "border-border bg-card hover:border-muted-foreground/30 hover:shadow-sm"
                )}
              >
                <BankLogo name={bank.name} size={36} />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground">{bank.name}</p>
                    {isRecommendedBank && (
                      <Sparkles className="h-3 w-3 text-accent" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {bank.cardCount} card{bank.cardCount !== 1 ? "s" : ""}
                  </p>
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="bankIndicator"
                    className={cn("absolute -bottom-px left-4 right-4 h-0.5 rounded-full bg-foreground")}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Bank Package Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedBankId + "-pkg"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {bankPkg && (
            <Card className={cn("border-2 overflow-hidden", accent.border, accent.bg)}>
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                  <div className="flex items-center gap-3 md:min-w-[200px]">
                    <BankLogo name={selectedBank.name} size={48} />
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{selectedBank.name}</h2>
                      <p className="text-xs text-muted-foreground">Student Banking Package</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="mb-3 text-sm font-semibold text-foreground">{bankPkg.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {bankPkg.features.map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground"
                        >
                          <Check className="h-3 w-3 text-green-500" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = filter === opt.value;
            const count = opt.value === "all"
              ? selectedBank.cards.length
              : selectedBank.cards.filter((c) => classifyCard(c) === opt.value).length;
            if (count === 0 && opt.value !== "all") return null;
            return (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
                )}
              >
                <Icon className="h-3 w-3" />
                {opt.label}
                <span className={cn("rounded-full px-1.5 text-[10px]", isActive ? "bg-primary-foreground/20" : "bg-muted")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Click any card to expand details
        </p>
      </div>

      {/* Credit Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedBankId + "-" + filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <CreditCardDisplay
                key={card.id}
                card={card}
                bankName={selectedBank.name}
                isRecommended={recommendedCardIds.has(card.id)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <CreditCard className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">
                No {FILTER_OPTIONS.find((f) => f.value === filter)?.label?.toLowerCase()} cards for {selectedBank.name}.
              </p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setFilter("all")}>
                Show all cards
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CTA to recommendation engine */}
      {!recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground">Not sure which card is right for you?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Take a 60-second quiz and our engine will score all {totalCards} cards against your spending habits, budget, and goals.
                </p>
              </div>
              <Link href="/recommend">
                <Button size="lg" className="gap-2">
                  Find My Setup <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
