"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BankSelector from "@/components/BankSelector";
import StudentCardDetail from "@/components/StudentCardDetail";
import { BANKING_PACKAGES } from "@/lib/constants";
import { BANKS_WITH_STUDENT_CARDS } from "@/lib/studentCards";
import type { BankWithStudentCards } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { CreditCard, LayoutGrid, ArrowLeft } from "lucide-react";
import { Building2 } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

function BankLogo({ name }: { name: string }) {
  const src =
    name === "TD"
      ? "/logo/td.png"
      : name === "BMO"
        ? "/logo/bmo.jpg"
        : name === "CIBC"
          ? "/logo/cibc.png"
          : name === "Scotiabank"
            ? "/logo/scotiabank.png"
            : name === "RBC"
              ? "/logo/rbc.png"
              : null;
  return (
    <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-card">
      {src ? (
        <Image src={src} alt={`${name} logo`} width={48} height={48} className="h-12 w-12 object-contain" />
      ) : (
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
          {name.charAt(0)}
        </div>
      )}
    </div>
  );
}

export default function StudentPackagesPage() {
  const [selectedBankPackages, setSelectedBankPackages] = useState<BankWithStudentCards | null>(null);
  const [selectedBankCards, setSelectedBankCards] = useState<BankWithStudentCards | null>(null);

  const pkgForBank = selectedBankPackages
    ? BANKING_PACKAGES.find((p) => p.bank.toLowerCase() === selectedBankPackages.name.toLowerCase())
    : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          International Student Banking Packages
        </h1>
        <p className="mt-2 text-muted-foreground">
          Compare accounts and cards designed for students in Canada. Student cards are available to
          newcomers with no credit history.
        </p>
      </header>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <LayoutGrid className="size-4" />
            Bank Packages
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="size-4" />
            Student Credit Cards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Choose your bank</CardTitle>
              <CardDescription>
                Click a bank in the radial orbit to see its student banking package.
              </CardDescription>
            </CardHeader>
          <CardContent className="pt-0">
            <div className="flex h-[70vh] min-h-[560px] items-center justify-center">
                <RadialOrbitalTimeline
                  timelineData={BANKING_PACKAGES.map((pkg, i) => ({
                    id: i + 1,
                    title: pkg.name,
                    date: "",
                    content: pkg.features.join("\n"),
                    category: "Chequing & benefits",
                    icon: Building2,
                    relatedIds: [],
                    status: "pending" as const,
                    energy: 70,
                  }))}
                  onSelect={(item) => {
                    const pkg = BANKING_PACKAGES.find((p) => p.name === item.title);
                    if (!pkg) return;
                    const bank = BANKS_WITH_STUDENT_CARDS.find((b) => b.name === pkg.bank);
                    if (bank) setSelectedBankPackages(bank);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {selectedBankPackages ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedBankPackages.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBankPackages(null)}
                  className="gap-2 text-muted-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Back to banks
                </Button>
                <div className="flex items-center gap-3">
                  <BankLogo name={selectedBankPackages.name} />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{selectedBankPackages.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Student banking package & credit cards
                    </p>
                  </div>
                </div>
                {pkgForBank && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{pkgForBank.name}</CardTitle>
                      <CardDescription>Chequing & benefits</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pkgForBank.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <span className="size-1.5 rounded-full bg-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          ) : null}
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          {!selectedBankCards ? (
            <>
              <p className="text-sm text-muted-foreground">
                Choose a bank to see its student credit cards.
              </p>
              <BankSelector banks={BANKS_WITH_STUDENT_CARDS} onSelect={setSelectedBankCards} />
            </>
          ) : (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedBankCards(null)} className="gap-2">
                <ArrowLeft className="size-4" />
                Back to banks
              </Button>
              <h3 className="text-lg font-semibold">
                {selectedBankCards.name} — {selectedBankCards.cardCount} card{selectedBankCards.cardCount !== 1 ? "s" : ""}
              </h3>
              {selectedBankCards.cards.map((card) => (
                <StudentCardDetail key={card.id} card={card} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

    </div>
  );
}
