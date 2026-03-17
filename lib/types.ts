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

/** Detailed student card for bank drill-down (no Apply/Learn more). */
export type DetailedStudentCard = {
  id: string;
  name: string;
  tag?: string; // e.g. "Most popular"
  headline: string; // Main offer line
  bullets: string[];
  annualFee: string;
  purchaseRate: string;
  cashRate: string;
  cashRateQuebec?: string; // When different for Quebec
};

/** Bank with its student cards (for newcomers / no credit history). */
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
  core: boolean; // true = [Core], false = [Optional]
  description?: string; // Optional longer explanation
};

export type CreditScoreFactor = {
  name: string;
  value: number;
  color: string;
  subtitle?: string; // e.g. "The Dealbreaker"
  description: string;
};
