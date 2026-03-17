"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Building2 } from "lucide-react";
import type { BankingPackage, StudentCreditCard } from "@/lib/types";

type Props = { item: BankingPackage | StudentCreditCard };

export default function PackageCard({ item }: Props) {
  const isCard = item.type === "credit_card";

  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-start gap-3 p-5">
        <div className="rounded-lg bg-muted p-2">
          {isCard ? (
            <CreditCard className="size-5 text-muted-foreground" />
          ) : (
            <Building2 className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {item.bank}
          </p>
          <h3 className="mt-0.5 font-semibold text-foreground">{item.name}</h3>
          <ul className="mt-3 space-y-1.5">
            {item.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
