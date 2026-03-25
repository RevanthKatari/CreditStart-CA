import { NextResponse } from "next/server";

const CACHE_DURATION = 3600_000; // 1 hour
let cachedData: { rates: Record<string, number>; timestamp: number } | null = null;

export async function GET() {
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return NextResponse.json(cachedData.rates);
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/CAD", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Exchange API returned ${res.status}`);
    }

    const data = await res.json();
    const cadRates: Record<string, number> = {};

    const currencies = ["USD", "EUR", "GBP", "INR", "CNY", "NGN", "PHP", "BRL", "MXN", "JPY", "KRW", "AUD", "PKR", "BDT", "VND", "EGP", "LKR", "NPR"];
    for (const code of currencies) {
      if (data.rates?.[code]) {
        cadRates[code] = data.rates[code];
      }
    }

    cachedData = { rates: cadRates, timestamp: Date.now() };
    return NextResponse.json(cadRates);
  } catch {
    const fallbackRates: Record<string, number> = {
      USD: 0.72, EUR: 0.66, GBP: 0.57, INR: 60.5, CNY: 5.2,
      NGN: 1120, PHP: 40.2, BRL: 3.7, MXN: 12.4, JPY: 108,
      KRW: 980, AUD: 1.1, PKR: 200, BDT: 79, VND: 17800,
      EGP: 35, LKR: 215, NPR: 96,
    };
    return NextResponse.json(fallbackRates);
  }
}
