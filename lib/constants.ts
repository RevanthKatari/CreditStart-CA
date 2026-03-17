import type { BankingPackage, RoadmapTask, CreditScoreFactor } from "./types";

export const BANKING_PACKAGES: BankingPackage[] = [
  {
    id: "td-pkg",
    bank: "TD",
    name: "TD International Student Banking Package",
    type: "package",
    features: [
      "TD Student Chequing: $0 monthly fee",
      "Unlimited transactions",
      "No Interac e-Transfer fees",
      "Up to $560 in value",
      "Branch support nationwide",
    ],
  },
  {
    id: "scotia-pkg",
    bank: "Scotiabank",
    name: "Preferred Package for Students and Youth",
    type: "package",
    features: [
      "No monthly fee while in school",
      "Scene+ rewards",
      "Student GIC option",
      "StartRight Program for newcomers",
    ],
  },
  {
    id: "bmo-pkg",
    bank: "BMO",
    name: "NewStart Program for International Students",
    type: "package",
    features: [
      "No monthly fee first 12 months",
      "Student Plan (no fee while in school + 1 year after)",
      "GIC setup for study permit",
      "Credit card option to build history",
    ],
  },
  {
    id: "cibc-pkg",
    bank: "CIBC",
    name: "CIBC Student Banking",
    type: "package",
    features: [
      "No monthly fee for students",
      "Free Interac e-Transfers",
      "Optional CIBC student credit card",
    ],
  },
  {
    id: "rbc-pkg",
    bank: "RBC",
    name: "RBC Student Banking",
    type: "package",
    features: [
      "No monthly fee",
      "Multi-product rebates",
      "Optional RBC student credit card",
    ],
  },
];

export const ROADMAP_TASKS: RoadmapTask[] = [
  {
    id: "m1-sin",
    label: "Obtain your Social Insurance Number (SIN)",
    month: 1,
    core: true,
    description: "Visit Service Canada. You cannot get a credit file without this.",
  },
  {
    id: "m1-bank",
    label: "Open a Student Banking Package",
    month: 1,
    core: true,
    description:
      "Secure a chequing account and apply for the included starter credit card. Unsecured (e.g. $500–$1,000 limit) or secured is fine — if you're willing to put down a deposit, a secured card still builds credit.",
  },
  {
    id: "m1-activate",
    label: "Activate & App Setup",
    month: 1,
    core: true,
    description:
      "Activate the physical card and download the bank's mobile app. Enable push notifications for payment due dates.",
  },
  {
    id: "m1-transfer",
    label: "International Transfer Setup",
    month: 1,
    core: false,
    description:
      "Register for a low-fee service like Wise or Remitly to move initial funds from your home country without massive bank wire fees.",
  },
  {
    id: "m2-onebill",
    label: "The \"One Bill\" Strategy",
    month: 2,
    core: true,
    description:
      "Route exactly one fixed monthly bill (e.g. Canadian phone plan or Spotify) to charge automatically to the credit card.",
  },
  {
    id: "m2-safetynet",
    label: "Set up the Safety Net",
    month: 2,
    core: true,
    description:
      "In your banking app, set up an automatic monthly transfer to pay at least the minimum credit card balance. This ensures you never get a missed-payment strike if you forget.",
  },
  {
    id: "m2-wallet",
    label: "Digital Wallet",
    month: 2,
    core: false,
    description:
      "Add the card to Apple Pay or Google Wallet for small daily purchases (coffee, transit). Treat it like a debit card — only spend what you have in chequing.",
  },
  {
    id: "m3-util",
    label: "Master Utilization",
    month: 3,
    core: true,
    description:
      "Keep your balance under 30% of your limit before your statement prints (e.g. never let the balance go above $150 on a $500 limit).",
  },
  {
    id: "m3-statement",
    label: "Pay the Statement Balance",
    month: 3,
    core: true,
    description:
      "Learn the difference between Current Balance and Statement Balance. Pay the Statement Balance in full, 3 to 5 days before the actual due date.",
  },
  {
    id: "m3-monitoring",
    label: "Score Monitoring Setup",
    month: 3,
    core: false,
    description:
      "Create a free account with Borrowell (Equifax) or ClearScore (TransUnion), or use your bank's built-in credit report/score (many use TransUnion) so you're notified when your first credit score is generated.",
  },
];

export const CREDIT_SCORE_FACTORS: CreditScoreFactor[] = [
  {
    name: "Payment History",
    value: 35,
    color: "#1e3a5f",
    subtitle: "The Dealbreaker",
    description:
      "This is the biggest slice of the pie. Paying your statement balance on time, every single time, is non-negotiable. One payment that is 30 days late can ruin your score.",
  },
  {
    name: "Credit Utilization",
    value: 30,
    color: "#2563eb",
    subtitle: "The Leverage",
    description:
      "How much of your available credit are you using? If you have a $1,000 limit, never let your statement print with a balance higher than $300. Lower is always better.",
  },
  {
    name: "Credit History Length",
    value: 15,
    color: "#0d9488",
    subtitle: "The Waiting Game",
    description:
      "How long have your accounts been open? This is why opening a student chequing account and starter credit card in Month 1 is crucial. Never close your oldest credit card, even after you graduate.",
  },
  {
    name: "Credit Mix",
    value: 10,
    color: "#059669",
    subtitle: "The Portfolio",
    description:
      "Bureaus like to see that you can handle different types of debt (e.g. a credit card plus a phone plan on a post-paid contract).",
  },
  {
    name: "New Inquiries",
    value: 10,
    color: "#047857",
    subtitle: "The Hard Checks",
    description:
      "Every time you apply for new credit, lenders do a hard pull on your file, temporarily dropping your score by 5 to 10 points. Do not apply for multiple credit cards in your first six months.",
  },
];

export const PROJECTED_SCORE_MONTHS = 12;
export const STARTING_SCORE = 650;
export const PROJECTED_SCORES = [650, 662, 674, 686, 698, 705, 712, 718, 724, 730, 735, 740];
