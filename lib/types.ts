export type BankingPackage = {
  id: string;
  bank: string;
  name: string;
  type: "package";
  features: string[];
};

export type StudentCreditCard = {
  id: string;
  bank: string;
  name: string;
  type: "credit_card";
  features: string[];
};

export type DetailedStudentCard = {
  id: string;
  name: string;
  tag?: string;
  headline: string;
  bullets: string[];
  annualFee: string;
  purchaseRate: string;
  cashRate: string;
  cashRateQuebec?: string;
};

export type BankWithStudentCards = {
  id: string;
  name: string;
  cardCount: number;
  cards: DetailedStudentCard[];
};

export type RoadmapTask = {
  id: string;
  label: string;
  month: 1 | 2 | 3;
  core: boolean;
  description?: string;
};

export type CreditScoreFactor = {
  name: string;
  value: number;
  color: string;
  subtitle?: string;
  description: string;
};

// ─── Recommendation Engine Types ─────────────────────────────────

export type StudentType = "international" | "domestic" | "pr" | "work_permit";
export type BudgetRange = "under_500" | "500_1000" | "1000_2000" | "over_2000";
export type SpendingCategory = "groceries" | "dining" | "gas" | "travel" | "entertainment" | "shopping";
export type CreditGoal = "cashback" | "travel_rewards" | "build_credit" | "low_rates";

export interface UserProfile {
  studentType: StudentType;
  hasGIC: boolean;
  gicBank: string | null;
  monthlyBudget: BudgetRange;
  topSpending: SpendingCategory[];
  primaryGoal: CreditGoal;
}

export interface CardScore {
  cardId: string;
  cardName: string;
  bankName: string;
  bankId: string;
  score: number;
  reasons: string[];
  annualFee: string;
  headline: string;
}

export interface BankScore {
  bankId: string;
  bankName: string;
  packageName: string;
  score: number;
  reasons: string[];
  features: string[];
}

export interface RecommendationResult {
  topBank: BankScore;
  topCards: CardScore[];
  allBanks: BankScore[];
  personalizedTips: string[];
  profile: UserProfile;
}

// ─── Credit Score Simulator Types ────────────────────────────────

export interface SimulatorInputs {
  paymentHistory: number;
  utilization: number;
  creditAge: number;
  numAccounts: number;
  recentInquiries: number;
}

export type ScoreRating = "poor" | "fair" | "good" | "very_good" | "excellent";

export interface FactorBreakdown {
  factor: string;
  weight: number;
  rawScore: number;
  impact: "positive" | "neutral" | "negative";
  tip: string;
}

export interface SimulatorResult {
  score: number;
  rating: ScoreRating;
  color: string;
  breakdown: FactorBreakdown[];
}
