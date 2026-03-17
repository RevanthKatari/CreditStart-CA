"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DetailedStudentCard } from "@/lib/types";

type Props = { card: DetailedStudentCard };

export default function StudentCardDetail({ card }: Props) {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-foreground">{card.name}</h3>
        <p className="mt-2 text-sm font-medium text-muted-foreground">{card.headline}</p>
        {card.bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {card.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
        )}
        <Separator className="my-4" />
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <span className="text-muted-foreground">Annual fee</span>
            <p className="font-medium text-foreground">{card.annualFee}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Purchase rate</span>
            <p className="font-medium text-foreground">{card.purchaseRate}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Cash rate</span>
            <p className="font-medium text-foreground">{card.cashRate}</p>
            {card.cashRateQuebec != null && (
              <p className="text-xs text-muted-foreground">Quebec: {card.cashRateQuebec}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
