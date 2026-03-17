# Newcomer Credit Navigator

A single-page React app that helps international students in Canada understand and build their credit history using real Canadian banking options.

## Tech Stack

- **Next.js** (App Router)
- **React** (useState, useEffect for interactivity)
- **Tailwind CSS**
- **Recharts** (data visualization)
- **Lucide React** (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Dashboard** — Welcome message, interactive credit score dial with “Simulate First 3 Months” toggle, 12‑month projected score chart, actionable widgets.
- **Credit 101** — Equifax vs TransUnion comparison (with hover details), explanation of why scores differ, clickable pie chart for Canadian credit score factors.
- **Student Packages** — List of international student banking packages; toggle to show only student credit cards.
- **90-Day Roadmap** — Month 1–3 checklist with progress bar and completion messages; progress persisted in `localStorage`.

## Project Layout

- `app/` — Routes and pages
- `components/` — Reusable UI (Sidebar, CreditDial, charts, cards, roadmap)
- `lib/` — Constants (packages, cards, roadmap tasks, score factors) and types

The full plan and data definitions are in the parent directory: `../PLAN.md`.
