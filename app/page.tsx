"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CreditDial from "@/components/CreditDial";
import DashboardChart from "@/components/DashboardChart";
import CurrencyWidget from "@/components/CurrencyWidget";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight, BookOpen, Wallet, Map, Sparkles,
  SlidersHorizontal, TrendingUp, CheckCircle2, CreditCard,
} from "lucide-react";
import type { RecommendationResult } from "@/lib/types";

export default function Dashboard() {
  const [simulate, setSimulate] = useState(false);
  const [savedResult, setSavedResult] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ncn-recommendation");
      if (raw) setSavedResult(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero */}
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
        <AuroraBackground className="min-h-[calc(100vh-3.5rem)] w-full">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.85, ease: "easeInOut" }}
            className="relative flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center"
          >
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to Canada.
              <span className="block">Let&apos;s build your financial future.</span>
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              Find the best bank, credit card, and action plan for your situation &mdash; powered by a recommendation engine that scores 19 student cards across 5 banks.
            </p>
            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
              <Link href="/recommend" className="inline-block">
                <MagneticButton>
                  <button className="flex items-center gap-2 rounded-full bg-primary px-10 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    <Sparkles className="h-4 w-4" />
                    Find My Setup
                  </button>
                </MagneticButton>
              </Link>
              <Link href="/simulator" className="inline-block">
                <MagneticButton>
                  <button className="flex items-center gap-2 rounded-full border-2 border-border bg-card/80 px-8 py-3 text-base font-medium text-foreground backdrop-blur transition-colors hover:bg-muted">
                    <SlidersHorizontal className="h-4 w-4" />
                    Score Simulator
                  </button>
                </MagneticButton>
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Scroll to explore your dashboard
            </p>
          </motion.div>
        </AuroraBackground>
      </div>

      {/* Content */}
      <div className="mt-10 space-y-8">
        {/* Saved recommendation banner */}
        {savedResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-2 border-green-500/20 bg-gradient-to-r from-green-500/5 via-card to-primary/5">
              <CardContent className="flex flex-col items-center gap-4 p-5 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Your recommendation is ready</p>
                    <p className="text-sm text-muted-foreground">
                      Top pick: <span className="font-medium text-foreground">{savedResult.topBank.bankName}</span> ({savedResult.topBank.score}% match)
                      &middot; Best card: <span className="font-medium text-foreground">{savedResult.topCards[0]?.cardName}</span>
                    </p>
                  </div>
                </div>
                <Link href="/recommend">
                  <Button variant="outline" size="sm" className="gap-2">View Details <ArrowRight className="h-3.5 w-3.5" /></Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Feature Cards */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Tools & Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/recommend">
              <Card className="group h-full border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-base font-semibold text-foreground">Find My Setup</span>
                  <p className="text-xs text-muted-foreground">5-question quiz, 19 cards scored, personalized recommendations</p>
                  <span className="mt-auto flex items-center gap-1 text-xs font-medium text-primary">
                    Take the quiz <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/simulator">
              <Card className="group h-full border-2 border-accent/10 bg-gradient-to-br from-accent/5 to-card transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="rounded-xl bg-accent/10 p-3 transition-colors group-hover:bg-accent/20">
                    <SlidersHorizontal className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-base font-semibold text-foreground">Score Simulator</span>
                  <p className="text-xs text-muted-foreground">Drag sliders, see real-time score changes, try what-if scenarios</p>
                  <span className="mt-auto flex items-center gap-1 text-xs font-medium text-accent">
                    Try it <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/roadmap">
              <Card className="group h-full transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="rounded-xl bg-muted p-3 transition-colors group-hover:bg-muted/70">
                    <Map className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="text-base font-semibold text-foreground">90-Day Roadmap</span>
                  <p className="text-xs text-muted-foreground">
                    {savedResult ? "Personalized to your profile" : "Step-by-step action plan"}
                  </p>
                  <span className="mt-auto flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    View plan <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Credit at a glance + Currency side by side on large screens */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Your credit at a glance</CardTitle>
                <CardDescription>
                  Toggle to see a typical starting score after 3 months of responsible use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
                  <CreditDial simulate={simulate} />
                  <div className="flex flex-col items-center gap-4 md:items-end">
                    <Button
                      variant={simulate ? "secondary" : "default"}
                      onClick={() => setSimulate(!simulate)}
                    >
                      {simulate ? "Simulating" : "Simulate First 3 Months"}
                    </Button>
                    <p className="max-w-xs text-center text-xs text-muted-foreground md:text-right">
                      After opening an account and using credit responsibly for 3 months.
                    </p>
                    <Link href="/simulator">
                      <Button variant="link" size="sm" className="gap-1 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        Try the full simulator
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Projected credit score growth (12 months)</CardTitle>
                <CardDescription>
                  If you follow the 90-day roadmap and keep good habits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart />
              </CardContent>
            </Card>
          </div>

          {/* Currency widget sidebar */}
          <div className="space-y-4">
            <CurrencyWidget compact />
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { href: "/credit-101", icon: BookOpen, label: "Credit 101", desc: "How Canadian credit works" },
                    { href: "/student-packages", icon: Wallet, label: "Student Packages", desc: "Compare bank accounts & cards" },
                    { href: "/recommend", icon: CreditCard, label: "Card Comparison", desc: "Find your best credit card" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
