import { BANKING_PACKAGES } from "./constants";
import { BANKS_WITH_STUDENT_CARDS } from "./studentCards";
import type {
  UserProfile,
  CardScore,
  BankScore,
  RecommendationResult,
  SpendingCategory,
} from "./types";

// ─── Card Profile Ratings ────────────────────────────────────────
// Each card rated 0-10 on goal alignment and spending categories.
// These ratings power the weighted scoring algorithm.

interface CardProfile {
  bankId: string;
  cashback: number;
  travel: number;
  rewards: number;
  lowRate: number;
  categories: Record<SpendingCategory, number>;
  annualFeeValue: number;
  welcomeValue: number;
}

const CARD_PROFILES: Record<string, CardProfile> = {
  "cibc-adapta": {
    bankId: "cibc", cashback: 3, travel: 5, rewards: 8, lowRate: 3,
    categories: { groceries: 5, dining: 7, gas: 3, travel: 5, entertainment: 9, shopping: 7 },
    annualFeeValue: 0, welcomeValue: 150,
  },
  "cibc-dividend": {
    bankId: "cibc", cashback: 9, travel: 3, rewards: 5, lowRate: 3,
    categories: { groceries: 10, dining: 4, gas: 7, travel: 5, entertainment: 3, shopping: 4 },
    annualFeeValue: 0, welcomeValue: 125,
  },
  "cibc-aventura": {
    bankId: "cibc", cashback: 2, travel: 8, rewards: 7, lowRate: 3,
    categories: { groceries: 6, dining: 3, gas: 6, travel: 8, entertainment: 3, shopping: 3 },
    annualFeeValue: 0, welcomeValue: 100,
  },
  "cibc-aeroplan": {
    bankId: "cibc", cashback: 2, travel: 9, rewards: 7, lowRate: 3,
    categories: { groceries: 6, dining: 3, gas: 6, travel: 9, entertainment: 3, shopping: 3 },
    annualFeeValue: 0, welcomeValue: 150,
  },
  "cibc-classic": {
    bankId: "cibc", cashback: 2, travel: 3, rewards: 2, lowRate: 4,
    categories: { groceries: 3, dining: 3, gas: 5, travel: 3, entertainment: 3, shopping: 3 },
    annualFeeValue: 0, welcomeValue: 30,
  },
  "scotia-scene": {
    bankId: "scotiabank", cashback: 4, travel: 3, rewards: 8, lowRate: 3,
    categories: { groceries: 9, dining: 4, gas: 3, travel: 3, entertainment: 7, shopping: 3 },
    annualFeeValue: 0, welcomeValue: 80,
  },
  "scotia-momentum-nofee": {
    bankId: "scotiabank", cashback: 9, travel: 2, rewards: 5, lowRate: 3,
    categories: { groceries: 6, dining: 5, gas: 4, travel: 2, entertainment: 5, shopping: 6 },
    annualFeeValue: 0, welcomeValue: 200,
  },
  "scotia-momentum": {
    bankId: "scotiabank", cashback: 8, travel: 2, rewards: 5, lowRate: 4,
    categories: { groceries: 6, dining: 5, gas: 4, travel: 2, entertainment: 5, shopping: 5 },
    annualFeeValue: 49, welcomeValue: 50,
  },
  "scotia-amex": {
    bankId: "scotiabank", cashback: 3, travel: 3, rewards: 7, lowRate: 3,
    categories: { groceries: 9, dining: 3, gas: 3, travel: 3, entertainment: 4, shopping: 3 },
    annualFeeValue: 0, welcomeValue: 50,
  },
  "scotia-value": {
    bankId: "scotiabank", cashback: 2, travel: 1, rewards: 1, lowRate: 10,
    categories: { groceries: 3, dining: 2, gas: 2, travel: 1, entertainment: 2, shopping: 2 },
    annualFeeValue: 29, welcomeValue: 30,
  },
  "bmo-cashback-student": {
    bankId: "bmo", cashback: 8, travel: 2, rewards: 4, lowRate: 3,
    categories: { groceries: 6, dining: 5, gas: 5, travel: 2, entertainment: 5, shopping: 6 },
    annualFeeValue: 0, welcomeValue: 100,
  },
  "td-cashback": {
    bankId: "td", cashback: 8, travel: 2, rewards: 4, lowRate: 3,
    categories: { groceries: 5, dining: 5, gas: 5, travel: 2, entertainment: 4, shopping: 5 },
    annualFeeValue: 0, welcomeValue: 100,
  },
  "td-rewards": {
    bankId: "td", cashback: 3, travel: 3, rewards: 7, lowRate: 3,
    categories: { groceries: 4, dining: 4, gas: 3, travel: 3, entertainment: 4, shopping: 7 },
    annualFeeValue: 0, welcomeValue: 50,
  },
  "td-lowrate": {
    bankId: "td", cashback: 2, travel: 1, rewards: 1, lowRate: 10,
    categories: { groceries: 3, dining: 2, gas: 2, travel: 1, entertainment: 2, shopping: 2 },
    annualFeeValue: 25, welcomeValue: 50,
  },
  "rbc-ion-plus": {
    bankId: "rbc", cashback: 5, travel: 6, rewards: 9, lowRate: 3,
    categories: { groceries: 8, dining: 8, gas: 8, travel: 6, entertainment: 7, shopping: 5 },
    annualFeeValue: 48, welcomeValue: 150,
  },
  "rbc-cashback": {
    bankId: "rbc", cashback: 9, travel: 2, rewards: 4, lowRate: 3,
    categories: { groceries: 8, dining: 4, gas: 7, travel: 2, entertainment: 4, shopping: 4 },
    annualFeeValue: 0, welcomeValue: 70,
  },
  "rbc-ion": {
    bankId: "rbc", cashback: 3, travel: 4, rewards: 7, lowRate: 3,
    categories: { groceries: 6, dining: 4, gas: 6, travel: 4, entertainment: 6, shopping: 4 },
    annualFeeValue: 0, welcomeValue: 75,
  },
  "rbc-westjet": {
    bankId: "rbc", cashback: 2, travel: 8, rewards: 6, lowRate: 3,
    categories: { groceries: 3, dining: 3, gas: 3, travel: 9, entertainment: 3, shopping: 3 },
    annualFeeValue: 39, welcomeValue: 100,
  },
  "rbc-avion-platinum": {
    bankId: "rbc", cashback: 2, travel: 10, rewards: 8, lowRate: 3,
    categories: { groceries: 4, dining: 3, gas: 3, travel: 10, entertainment: 3, shopping: 3 },
    annualFeeValue: 120, welcomeValue: 300,
  },
};

// ─── Bank Profile Ratings ────────────────────────────────────────

interface BankProfile {
  studentProgramScore: number;
  newcomerSupport: number;
  cardVariety: number;
}

const BANK_PROFILES: Record<string, BankProfile> = {
  td:         { studentProgramScore: 8, newcomerSupport: 8, cardVariety: 3 },
  scotiabank: { studentProgramScore: 8, newcomerSupport: 9, cardVariety: 5 },
  bmo:        { studentProgramScore: 7, newcomerSupport: 9, cardVariety: 1 },
  cibc:       { studentProgramScore: 7, newcomerSupport: 7, cardVariety: 5 },
  rbc:        { studentProgramScore: 7, newcomerSupport: 7, cardVariety: 5 },
};

// ─── Scoring Functions ───────────────────────────────────────────

function scoreCard(cardId: string, profile: UserProfile): number {
  const cp = CARD_PROFILES[cardId];
  if (!cp) return 0;

  // Factor 1: Goal alignment (weight 0.30)
  const goalMap: Record<string, number> = {
    cashback: cp.cashback,
    travel_rewards: cp.travel,
    build_credit: cp.annualFeeValue === 0 ? 8 : 5,
    low_rates: cp.lowRate,
  };
  const goalMatch = (goalMap[profile.primaryGoal] ?? 5) / 10;

  // Factor 2: Spending category alignment (weight 0.25)
  let spendTotal = 0;
  const cats = profile.topSpending.length > 0 ? profile.topSpending : (["groceries"] as SpendingCategory[]);
  for (const cat of cats) {
    spendTotal += (cp.categories[cat] ?? 5) / 10;
  }
  const spendMatch = spendTotal / cats.length;

  // Factor 3: Fee friendliness (weight 0.15)
  const feeScore =
    cp.annualFeeValue === 0 ? 1.0 :
    cp.annualFeeValue < 30 ? 0.7 :
    cp.annualFeeValue < 50 ? 0.5 :
    cp.annualFeeValue < 100 ? 0.3 : 0.1;

  // Factor 4: Welcome offer value (weight 0.10)
  const welcomeScore = Math.min(cp.welcomeValue / 200, 1);

  // Factor 5: GIC bank alignment (weight 0.10)
  const gicMatch = (profile.hasGIC && profile.gicBank?.toLowerCase() === cp.bankId.toLowerCase()) ? 1 : 0;

  // Factor 6: Budget alignment (weight 0.10)
  const budgetTier = { under_500: 1, "500_1000": 2, "1000_2000": 3, over_2000: 4 }[profile.monthlyBudget] ?? 2;
  const budgetScore =
    cp.annualFeeValue === 0 ? 1 :
    budgetTier >= 3 ? 0.8 :
    budgetTier >= 2 ? 0.5 : 0.3;

  const weighted =
    goalMatch    * 0.30 +
    spendMatch   * 0.25 +
    feeScore     * 0.15 +
    welcomeScore * 0.10 +
    gicMatch     * 0.10 +
    budgetScore  * 0.10;

  return Math.round(weighted * 100);
}

function generateCardReasons(cardId: string, profile: UserProfile): string[] {
  const cp = CARD_PROFILES[cardId];
  if (!cp) return [];
  const reasons: string[] = [];

  if (cp.annualFeeValue === 0) {
    reasons.push("No annual fee — ideal for students");
  }
  if (cp.welcomeValue >= 100) {
    reasons.push(`Welcome offer worth up to $${cp.welcomeValue}`);
  }
  if (profile.hasGIC && profile.gicBank?.toLowerCase() === cp.bankId.toLowerCase()) {
    reasons.push("Matches your GIC bank — easier approval");
  }

  const goalLabels: Record<string, string> = {
    cashback: "cash back", travel_rewards: "travel rewards",
    build_credit: "credit building", low_rates: "low interest",
  };
  const goalRating: Record<string, number> = {
    cashback: cp.cashback, travel_rewards: cp.travel,
    build_credit: cp.annualFeeValue === 0 ? 8 : 5, low_rates: cp.lowRate,
  };
  if ((goalRating[profile.primaryGoal] ?? 0) >= 7) {
    reasons.push(`Strong ${goalLabels[profile.primaryGoal]} benefits`);
  }

  const catLabels: Record<SpendingCategory, string> = {
    groceries: "grocery", dining: "dining & food delivery",
    gas: "gas & transportation", travel: "travel",
    entertainment: "entertainment & streaming", shopping: "online shopping",
  };
  for (const cat of profile.topSpending) {
    if ((cp.categories[cat] ?? 0) >= 7) {
      reasons.push(`Great rewards on ${catLabels[cat]} spending`);
      break;
    }
  }

  return reasons.slice(0, 4);
}

function scoreBank(bankId: string, profile: UserProfile): number {
  const bp = BANK_PROFILES[bankId];
  if (!bp) return 0;

  let score = 0;

  // GIC alignment (weight 0.35)
  if (profile.hasGIC && profile.gicBank?.toLowerCase() === bankId.toLowerCase()) {
    score += 0.35;
  } else {
    score += 0.10;
  }

  // Student program quality (weight 0.25)
  score += (bp.studentProgramScore / 10) * 0.25;

  // Newcomer support (weight 0.25)
  score += (bp.newcomerSupport / 10) * 0.25;

  // Card variety bonus (weight 0.15)
  score += Math.min(bp.cardVariety / 5, 1) * 0.15;

  return Math.round(score * 100);
}

function generateBankReasons(bankId: string, profile: UserProfile): string[] {
  const bp = BANK_PROFILES[bankId];
  if (!bp) return [];
  const reasons: string[] = [];

  if (profile.hasGIC && profile.gicBank?.toLowerCase() === bankId.toLowerCase()) {
    reasons.push("Your GIC is here — you look like a low-risk, fully funded client");
  }
  if (bp.newcomerSupport >= 9) {
    reasons.push("Excellent dedicated newcomer program");
  }
  if (bp.studentProgramScore >= 8) {
    reasons.push("Top-tier student banking package");
  }
  if (bp.cardVariety >= 4) {
    reasons.push(`${bp.cardVariety} student credit card options to choose from`);
  }
  reasons.push("$0 monthly fee for students");

  return reasons.slice(0, 4);
}

// ─── Personalized Tips ───────────────────────────────────────────

function generateTips(profile: UserProfile): string[] {
  const tips: string[] = [];

  if (profile.studentType === "international") {
    tips.push("As an international student, apply within your first month — banks are most flexible during your initial arrival window.");
  }
  if (profile.hasGIC) {
    tips.push(`Since your GIC is with ${profile.gicBank}, open your chequing account there first. Internal applicants get smoother credit card approvals.`);
  }
  if (profile.primaryGoal === "cashback") {
    tips.push("To maximize cash back, use your credit card for ALL purchases (not debit), then pay the statement balance in full each month.");
  }
  if (profile.primaryGoal === "travel_rewards") {
    tips.push("Stack your travel card with loyalty programs (Scene+, Aeroplan, Avion) — the compound effect on points is significant after 6 months.");
  }
  if (profile.primaryGoal === "build_credit") {
    tips.push("Set one recurring bill (phone or streaming) to auto-charge on your credit card. This creates a consistent monthly payment history with zero effort.");
  }
  if (profile.primaryGoal === "low_rates") {
    tips.push("Even with a low-rate card, always aim to pay the full statement balance. The low rate is a safety net, not a strategy.");
  }
  if (profile.topSpending.includes("groceries")) {
    tips.push("Grocery spending builds credit fast because it's consistent and frequent. Aim to keep each trip under 15% of your card limit.");
  }
  tips.push("Check your credit score for free with Borrowell (Equifax) or Credit Karma (TransUnion) after your 3rd month.");

  return tips.slice(0, 5);
}

// ─── Main Recommendation Generator ──────────────────────────────

export function generateRecommendation(profile: UserProfile): RecommendationResult {
  const allCards = BANKS_WITH_STUDENT_CARDS.flatMap((bank) =>
    bank.cards.map((card) => ({
      cardId: card.id,
      cardName: card.name,
      bankName: bank.name,
      bankId: bank.id,
      annualFee: card.annualFee,
      headline: card.headline,
      score: scoreCard(card.id, profile),
      reasons: generateCardReasons(card.id, profile),
    }))
  );

  allCards.sort((a, b) => b.score - a.score);
  const topCards: CardScore[] = allCards.slice(0, 3);

  const allBanks: BankScore[] = BANKING_PACKAGES.map((pkg) => ({
    bankId: pkg.bank.toLowerCase(),
    bankName: pkg.bank,
    packageName: pkg.name,
    score: scoreBank(pkg.bank.toLowerCase(), profile),
    reasons: generateBankReasons(pkg.bank.toLowerCase(), profile),
    features: pkg.features,
  }));

  allBanks.sort((a, b) => b.score - a.score);
  const topBank = allBanks[0];

  return {
    topBank,
    topCards,
    allBanks,
    personalizedTips: generateTips(profile),
    profile,
  };
}
