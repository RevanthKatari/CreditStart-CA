"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CreditDial from "@/components/CreditDial";
import DashboardChart from "@/components/DashboardChart";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Wallet, Map } from "lucide-react";

export default function Dashboard() {
  const [simulate, setSimulate] = useState(false);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Full-bleed, full-viewport hero (only thing visible on load) */}
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
              Learn how Canadian credit works, pick a student banking setup, and follow a 90-day
              plan that builds real history — fast.
            </p>
            <div className="pt-2">
              <Link href="/roadmap" className="inline-block">
                <MagneticButton>
                  <button className="rounded-full bg-indigo-500 px-10 py-3 text-base text-white transition-colors hover:bg-indigo-600">
                    Start 90-Day Roadmap
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

      {/* Content appears after scroll */}
      <div className="mt-10 space-y-8">
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

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Getting started</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/credit-101">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-lg bg-muted p-2">
                    <BookOpen className="size-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">Credit 101</span>
                    <p className="text-xs text-muted-foreground">Learn how Canadian credit works</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/student-packages">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-lg bg-muted p-2">
                    <Wallet className="size-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">Student Packages</span>
                    <p className="text-xs text-muted-foreground">Compare bank accounts & cards</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/roadmap">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-lg bg-muted p-2">
                    <Map className="size-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">90-Day Roadmap</span>
                    <p className="text-xs text-muted-foreground">Month-by-month checklist</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
