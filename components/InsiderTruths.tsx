"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ITEMS: { myth: string; fact: string }[] = [
  {
    myth: "Checking my own score hurts my credit.",
    fact:
      "False. Using apps like Borrowell or your bank's built-in checker is a soft pull and has zero impact on your score. Check it weekly.",
  },
  {
    myth: "I need to carry a balance and pay interest to build credit.",
    fact:
      "100% false. This is the biggest trap newcomers fall into. Pay your statement balance in full every month. You can build a 750+ score without ever paying a single cent in interest.",
  },
  {
    myth: "My credit history from my home country transfers over.",
    fact:
      "Unfortunately, no. With very rare exceptions (e.g. specific cross-border services like Nova Credit for certain US/UK profiles), you start as a blank slate in Canada.",
  },
];

export default function InsiderTruths() {
  return (
    <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
      {ITEMS.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            <span className="text-sm font-medium">
              <span className="text-muted-foreground">Myth:</span> {item.myth}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-sm text-foreground">
                <span className="font-semibold text-primary">Fact:</span> {item.fact}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
