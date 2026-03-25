import type { SimulatorInputs, SimulatorResult, ScoreRating, FactorBreakdown } from "./types";

const MIN_SCORE = 300;
const MAX_SCORE = 900;
const RANGE = MAX_SCORE - MIN_SCORE;

function paymentHistoryScore(onTimePercent: number): number {
  if (onTimePercent >= 100) return 1.0;
  if (onTimePercent >= 99) return 0.93;
  if (onTimePercent >= 97) return 0.85;
  if (onTimePercent >= 95) return 0.75;
  if (onTimePercent >= 90) return 0.6;
  if (onTimePercent >= 80) return 0.4;
  return 0.15;
}

function utilizationScore(percent: number): number {
  if (percent <= 1) return 0.95;
  if (percent <= 10) return 1.0;
  if (percent <= 20) return 0.9;
  if (percent <= 30) return 0.75;
  if (percent <= 50) return 0.5;
  if (percent <= 75) return 0.3;
  return 0.1;
}

function creditAgeScore(months: number): number {
  if (months <= 0) return 0.0;
  if (months <= 3) return 0.2;
  if (months <= 6) return 0.35;
  if (months <= 12) return 0.5;
  if (months <= 24) return 0.65;
  if (months <= 48) return 0.8;
  if (months <= 84) return 0.9;
  return 1.0;
}

function creditMixScore(numAccounts: number): number {
  if (numAccounts <= 0) return 0.0;
  if (numAccounts === 1) return 0.4;
  if (numAccounts === 2) return 0.65;
  if (numAccounts === 3) return 0.8;
  if (numAccounts <= 5) return 0.9;
  return 1.0;
}

function inquiryScore(count: number): number {
  if (count <= 0) return 1.0;
  if (count === 1) return 0.9;
  if (count === 2) return 0.75;
  if (count === 3) return 0.55;
  if (count === 4) return 0.4;
  return 0.2;
}

function getRating(score: number): ScoreRating {
  if (score < 580) return "poor";
  if (score < 670) return "fair";
  if (score < 740) return "good";
  if (score < 800) return "very_good";
  return "excellent";
}

function getRatingColor(rating: ScoreRating): string {
  switch (rating) {
    case "poor": return "#ef4444";
    case "fair": return "#f97316";
    case "good": return "#eab308";
    case "very_good": return "#22c55e";
    case "excellent": return "#059669";
  }
}

function getPaymentTip(percent: number): string {
  if (percent >= 100) return "Perfect — keep every payment on time.";
  if (percent >= 95) return "Nearly perfect. One missed payment drops your score significantly.";
  return "Missed payments are the #1 score killer. Set up auto-pay immediately.";
}

function getUtilizationTip(percent: number): string {
  if (percent <= 10) return "Excellent. Low utilization signals you're not credit-dependent.";
  if (percent <= 30) return "Good range. Try to stay under 10% for maximum score impact.";
  return "Too high. Pay your balance mid-cycle to keep the reported utilization low.";
}

function getAgeTip(months: number): string {
  if (months <= 6) return "Your file is brand new. Time is the only fix — never close your oldest account.";
  if (months <= 12) return "Growing steadily. After 12 months you'll unlock better card options.";
  return "Your credit history length is working in your favor. Keep older accounts open.";
}

function getMixTip(count: number): string {
  if (count <= 1) return "One account is a start. A phone plan or line of credit adds diversity.";
  if (count <= 2) return "Good mix. Adding a different credit type (installment vs revolving) helps.";
  return "Solid credit mix. Multiple account types show lenders you can manage diverse debt.";
}

function getInquiryTip(count: number): string {
  if (count <= 1) return "Minimal inquiries. Apply for new credit only when you truly need it.";
  if (count <= 3) return "A few inquiries are fine. Avoid applying for multiple cards in a short window.";
  return "Too many inquiries signal credit-hungry behavior. Wait 6 months before your next application.";
}

export function calculateCreditScore(inputs: SimulatorInputs): SimulatorResult {
  const ph = paymentHistoryScore(inputs.paymentHistory);
  const ut = utilizationScore(inputs.utilization);
  const ca = creditAgeScore(inputs.creditAge);
  const cm = creditMixScore(inputs.numAccounts);
  const iq = inquiryScore(inputs.recentInquiries);

  const weightedSum =
    ph * 0.35 +
    ut * 0.30 +
    ca * 0.15 +
    cm * 0.10 +
    iq * 0.10;

  const score = Math.round(MIN_SCORE + RANGE * weightedSum);
  const clampedScore = Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
  const rating = getRating(clampedScore);

  const impactThreshold = (raw: number): "positive" | "neutral" | "negative" =>
    raw >= 0.7 ? "positive" : raw >= 0.4 ? "neutral" : "negative";

  const breakdown: FactorBreakdown[] = [
    { factor: "Payment History", weight: 35, rawScore: ph, impact: impactThreshold(ph), tip: getPaymentTip(inputs.paymentHistory) },
    { factor: "Credit Utilization", weight: 30, rawScore: ut, impact: impactThreshold(ut), tip: getUtilizationTip(inputs.utilization) },
    { factor: "Credit Age", weight: 15, rawScore: ca, impact: impactThreshold(ca), tip: getAgeTip(inputs.creditAge) },
    { factor: "Credit Mix", weight: 10, rawScore: cm, impact: impactThreshold(cm), tip: getMixTip(inputs.numAccounts) },
    { factor: "New Inquiries", weight: 10, rawScore: iq, impact: impactThreshold(iq), tip: getInquiryTip(inputs.recentInquiries) },
  ];

  return {
    score: clampedScore,
    rating,
    color: getRatingColor(rating),
    breakdown,
  };
}

export const SCENARIOS: { name: string; description: string; inputs: SimulatorInputs }[] = [
  {
    name: "Fresh Newcomer",
    description: "Just arrived, opened first card",
    inputs: { paymentHistory: 100, utilization: 30, creditAge: 1, numAccounts: 1, recentInquiries: 1 },
  },
  {
    name: "3 Months In",
    description: "Perfect payments, low usage",
    inputs: { paymentHistory: 100, utilization: 15, creditAge: 3, numAccounts: 1, recentInquiries: 1 },
  },
  {
    name: "Missed a Payment",
    description: "One late payment in month 2",
    inputs: { paymentHistory: 90, utilization: 30, creditAge: 3, numAccounts: 1, recentInquiries: 1 },
  },
  {
    name: "Maxed Out Card",
    description: "Good payments but high utilization",
    inputs: { paymentHistory: 100, utilization: 90, creditAge: 6, numAccounts: 1, recentInquiries: 1 },
  },
  {
    name: "6-Month Discipline",
    description: "Half year of responsible use",
    inputs: { paymentHistory: 100, utilization: 10, creditAge: 6, numAccounts: 2, recentInquiries: 1 },
  },
  {
    name: "1-Year Graduate",
    description: "Full year of excellent habits",
    inputs: { paymentHistory: 100, utilization: 8, creditAge: 12, numAccounts: 2, recentInquiries: 2 },
  },
];
