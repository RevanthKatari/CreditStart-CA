"use client";

import EquifaxTransUnionCard from "@/components/EquifaxTransUnionCard";
import CreditScorePie from "@/components/CreditScorePie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Credit101Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <header>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Credit 101</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          A complete playbook for how Canada scores you, which bureaus matter, and how to avoid the
          traps that quietly tax international students.
        </p>
      </header>

      {/* 1. The 900-point model */}
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>The 900-Point Formula</CardTitle>
          <CardDescription>
            Canadian credit scores range from 300 to 900. When your first unsecured student card
            reports, you don&apos;t start at 0 — most newcomers debut around 630–660.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreditScorePie />
          <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm dark:border-sky-800 dark:bg-sky-950/30">
            <h3 className="font-semibold text-sky-900 dark:text-sky-200">
              Hard inquiries and student cards
            </h3>
            <p className="mt-1 text-sky-900/80 dark:text-sky-100/80">
              Applying for a student credit card (or any new credit) creates a{" "}
              <strong>hard inquiry</strong>. One or two pulls are normal. Problems start when you
              apply for several cards in a short window — the system flags &quot;credit-hungry&quot;
              behaviour. Pick one student package and wait a few months before your next move.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. How your first year actually unfolds */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Your first 12 months in Canada, explained
        </h2>
        <Timeline
          items={[
            {
              title: "Month 1: Initialization",
              content: (
                <p>
                  You open a chequing account and get your first unsecured student card. Your file is
                  effectively blank; the bureaus are just waiting for data.
                </p>
              ),
            },
            {
              title: "Months 2–3: First data points",
              content: (
                <p>
                  Your first statements generate and you pay them in full. A &quot;ghost&quot; score
                  appears on Equifax or TransUnion, usually around 630–660.
                </p>
              ),
            },
            {
              title: "Months 4–6: Stabilization",
              content: (
                <p>
                  You keep utilization under 30% and never miss a payment. Your score climbs slowly
                  and may wiggle 5–10 points depending on when apps like Borrowell pull your data.
                </p>
              ),
            },
            {
              title: "Months 7–11: The plateau",
              content: (
                <p>
                  You sit in the low 700s. Behaviour is perfect, but the &quot;length of history&quot;
                  variable is still weak because your file is under a year old.
                </p>
              ),
            },
            {
              title: "Month 12+: The upgrade window",
              content: (
                <p>
                  With one year of flawless history and low utilization, scores of 720+ are common.
                  This is when you can safely apply for a second, better card (travel or higher
                  cashback) without auto-rejection.
                </p>
              ),
            },
          ]}
        />
      </section>

      {/* 3. The two bureaus */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Equifax vs. TransUnion</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Canada runs on a dual-bureau system. These are private companies, not government
          agencies, and they don&apos;t share data — so you have two different scores.
        </p>
        <EquifaxTransUnionCard />
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-foreground">
              Why are my Equifax and TransUnion scores different?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Each bureau has its own scoring model and its own data feed. A bank or phone provider
              might only report to one of them, or on slightly different days. A 10–30 point gap is
              completely normal. Focus on the habits that move both in the right direction: pay on
              time, keep utilization low, avoid spammy applications.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 4. Where to start: the Big 5 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          The Big 5 bank showdown (where to actually start)
        </h2>
        <Timeline
          items={[
            {
              title: "Scotiabank StartRight",
              content: (
                <p>
                  Often bundles an unsecured Scene+ Visa with student chequing. Great if you shop at
                  FreshCo, Sobeys, or Cineplex — points convert into free groceries and entertainment.
                </p>
              ),
            },
            {
              title: "CIBC Smart for Students",
              content: (
                <p>
                  Very aggressive with international students. The Dividend Visa for Students pays
                  real cash back on groceries, gas, and recurring bills, with limits often in the
                  $500–$1,000 range.
                </p>
              ),
            },
            {
              title: "RBC International Student Banking",
              content: (
                <p>
                  Known for relationship banking. The Cash Back Mastercard is a solid starter, and
                  staying with RBC can make it easier to qualify for auto loans or a future mortgage.
                </p>
              ),
            },
            {
              title: "BMO NewStart",
              content: (
                <p>
                  If BMO holds your SDS GIC, they see you as ultra low risk. Their CashBack
                  Mastercard pairs well with that, especially when your tuition money is already
                  parked with them.
                </p>
              ),
            },
            {
              title: "The GIC leverage rule",
              content: (
                <p>
                  If your $20,635 SDS GIC is with a bank, open your account and first card there.
                  Internally, you look like a fully funded, low-risk client — approvals get much
                  easier.
                </p>
              ),
            },
          ]}
        />
      </section>

      {/* 5. Insider FAQs (myths + questions in one place) */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Insider FAQs for international students
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="myth-1">
            <AccordionTrigger>
              Myth: Checking my own credit score will hurt my file.
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              False. Apps like Borrowell, Credit Karma, or your bank&apos;s built-in checker use{" "}
              <strong>soft pulls</strong>. These never affect your score. You should feel comfortable
              checking weekly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="myth-2">
            <AccordionTrigger>
              Myth: I need to carry a balance and pay interest to build credit.
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              100% false. The algorithm rewards on-time payments and low utilization, not interest
              paid. Pay your{" "}
              <strong>statement balance in full</strong> every month and you can reach 750+ without
              ever paying a cent of interest.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q1">
            <AccordionTrigger>
              Does my credit history from my home country matter in Canada?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              In 99% of cases, no. Canada&apos;s system is closed. Even if you had premium cards back
              home, you&apos;re treated as a blank slate here. There are niche exceptions via Nova
              Credit and similar services, but for normal student banking, expect to start fresh.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Can I just use my debit card and still build credit?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              No. Debit (Interac) uses your own money and never reports to Equifax or TransUnion. To
              build a score, you must use a credit product (card, line of credit, post-paid phone
              plan) and pay it reliably.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Does paying rent on time help my score?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Usually not. Most landlords and student housing providers don&apos;t report rent. Only
              if they use a dedicated rent-reporting service (like FrontLobby or Chexy) will your
              payments show up — and that&apos;s still rare.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>
              Should I accept store credit card offers at Walmart, Canadian Tire, etc.?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Avoid them in your first year. Each application is a hard pull that dings your score,
              and these cards often come with low limits and high rates. Stick to your main bank&apos;s
              student card until your file is at least 12 months old.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger>
              Is it bad to pay off my credit card multiple times a month?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              It&apos;s actually an advanced strategy. With a $500 limit, one grocery trip and a phone
              bill can push you over 30% utilization. Paying the card weekly keeps the reported
              balance low.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q6">
            <AccordionTrigger>
              If I leave Canada after my Master&apos;s, what happens to my credit file?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Your file goes dormant but doesn&apos;t vanish. Any unpaid debts will remain as
              delinquencies and can hurt future attempts at PR, work permits, or re-entry as
              financial background checks become stricter.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}

