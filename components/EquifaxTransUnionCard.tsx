"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Bureau = "equifax" | "transunion";

const data: Record<
  Bureau,
  { name: string; vibe: string; whatYouNeed: string; quirks: string; howToCheck: string }
> = {
  equifax: {
    name: "Equifax Canada",
    vibe: "The strict older sibling.",
    whatYouNeed:
      "Equifax is one of the two major credit bureaus in Canada. They are heavily used by major telecom companies (like Bell and Rogers) and auto lenders.",
    quirks:
      "Equifax scores tend to fluctuate a bit more wildly when you have a young credit profile. They heavily penalize high utilization (spending too much of your limit).",
    howToCheck: "Borrowell (App)",
  },
  transunion: {
    name: "TransUnion Canada",
    vibe: "The modern metric.",
    whatYouNeed:
      "The other major player. Many of the Big 5 Canadian banks (like Scotiabank and RBC) pull your TransUnion file when you apply for your first unsecured credit card.",
    quirks:
      "TransUnion places a massive emphasis on payment history. A single missed phone bill can tank a TransUnion score for months.",
    howToCheck: "Credit Karma (App) or directly through your banking app (e.g. Scotiabank or CIBC).",
  },
};

export default function EquifaxTransUnionCard() {
  const [hovered, setHovered] = useState<Bureau | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(Object.keys(data) as Bureau[]).map((bureau) => {
        const d = data[bureau];
        const isHovered = hovered === bureau;
        return (
          <Card
            key={bureau}
            onMouseEnter={() => setHovered(bureau)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "cursor-default transition-all",
              "bg-card",
              isHovered && "shadow-md ring-2 ring-ring",
              !isHovered && "hover:bg-muted/40"
            )}
          >
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-foreground">{d.name}</h3>
              <p className="mt-2 text-sm font-medium italic text-muted-foreground">{d.vibe}</p>
              <p className="mt-2 text-sm text-foreground">
                <span className="font-medium">What you need to know:</span> {d.whatYouNeed}
              </p>
              <p className="mt-2 text-sm text-foreground">
                <span className="font-medium">The quirks:</span> {d.quirks}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium">How to check it free:</span> {d.howToCheck}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
