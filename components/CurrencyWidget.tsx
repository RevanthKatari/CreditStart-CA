"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CURRENCIES: { code: string; name: string; flag: string }[] = [
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
  { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰" },
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵" },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
];

export default function CurrencyWidget({ compact = false }: { compact?: boolean }) {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [cadAmount, setCadAmount] = useState("100");

  useEffect(() => {
    setLoading(true);
    fetch("/api/exchange")
      .then((res) => res.json())
      .then((data) => setRates(data))
      .catch(() => setRates(null))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    fetch("/api/exchange")
      .then((res) => res.json())
      .then((data) => setRates(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const rate = rates?.[currency];
  const cadNum = parseFloat(cadAmount) || 0;
  const converted = rate ? cadNum * rate : 0;
  const selectedCurrency = CURRENCIES.find((c) => c.code === currency);

  if (compact) {
    return (
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Currency Exchange</span>
            </div>
            {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1">
              <input
                type="number"
                value={cadAmount}
                onChange={(e) => setCadAmount(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
                min="0"
              />
              <p className="mt-0.5 text-[10px] text-muted-foreground">CAD 🇨🇦</p>
            </div>
            <ArrowRightLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="flex-1">
              <p className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm font-bold text-foreground">
                {converted.toLocaleString("en-CA", { maximumFractionDigits: 2 })}
              </p>
              <div className="mt-0.5 flex items-center gap-1">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-transparent text-[10px] text-muted-foreground"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowRightLeft className="h-4 w-4" />
            Currency Exchange
          </CardTitle>
          <button
            onClick={refresh}
            disabled={loading}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Live rates via API — compare home currency to CAD</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Currency selector */}
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
          {CURRENCIES.slice(0, 12).map((c) => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg border p-2 text-center transition-all",
                currency === c.code
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              <span className="text-lg">{c.flag}</span>
              <span className="text-[10px] font-medium text-foreground">{c.code}</span>
            </button>
          ))}
        </div>

        {/* More currencies dropdown */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
          ))}
        </select>

        {/* Converter */}
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">CAD 🇨🇦</label>
            <input
              type="number"
              value={cadAmount}
              onChange={(e) => setCadAmount(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-lg font-bold text-foreground"
              min="0"
            />
          </div>
          <ArrowRightLeft className="mt-5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {selectedCurrency?.flag} {currency}
            </label>
            <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-lg font-bold text-foreground">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                converted.toLocaleString("en-CA", { maximumFractionDigits: 2 })
              )}
            </div>
          </div>
        </div>

        {rate && (
          <p className="text-center text-xs text-muted-foreground">
            1 CAD = {rate.toLocaleString("en-CA", { maximumFractionDigits: 4 })} {currency}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
