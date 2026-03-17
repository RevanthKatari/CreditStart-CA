"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import type { BankWithStudentCards } from "@/lib/types";

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
    <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-card">
      {src ? (
        <Image src={src} alt={`${name} logo`} width={40} height={40} className="h-10 w-10 object-contain" />
      ) : (
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-base font-bold text-primary">
          {name.charAt(0)}
        </div>
      )}
    </div>
  );
}

type Props = {
  banks: BankWithStudentCards[];
  onSelect: (bank: BankWithStudentCards) => void;
};

export default function BankSelector({ banks, onSelect }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {banks.map((bank) => (
        <Card
          key={bank.id}
          className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
          onClick={() => onSelect(bank)}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <BankLogo name={bank.name} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{bank.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CreditCard className="size-3.5" />
                {bank.cardCount} student card{bank.cardCount !== 1 ? "s" : ""}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
