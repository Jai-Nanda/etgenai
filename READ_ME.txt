# Expense Genie AI

A GenAI fintech tool that turns bank transactions into personal money stories, helping users change spending habits through narrative + tiny nudges instead of raw charts.

## What this project is about

Expense Genie AI ingests your bank CSV or manual expenses and builds a “money personality” profile.  
It then generates a friendly story of your habits, and compares:

- no change future
- small change future

It finishes with micro-actions you can actually do (a “tiny nudge” to save, cut, or shift behavior).

### Core user flow

1. Upload CSV or add transactions
2. Parse with PapaParse → normalize rows
3. Compute categories, totals, trends
4. Derive persona profile
5. Build scenario narratives via AI-style generator
6. UI renders persona + story + scenarios + nudges

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- PapaParse (CSV parsing)
- (Optional) Vercel for hosting

## Screenshots (example)

- Place images in `public/screenshots`
- Reference them in README as below

![Upload screen](/screenshots/upload.png)
![Persona analysis](/screenshots/persona.png)
![Story + scenarios](/screenshots/story.png)

## Features

- CSV upload (bank style)
- Manual add/edit expenses
- Persona analysis
- Story generation
- No-change vs small-change comparison
- Actionable tiny nudges
- Tailwind UI components with responsive designs

## Installation

From project root:

1. Clone or copy repo:
   - `git clone <repo-url>`
   - `cd etgenai`
2. Install:
   - `npm install`
3. Run development server:
   - `npm run dev`
4. Open in browser:
   - `http://localhost:3000`

(Optional) run lint/type-check:
- `npm run lint`
- `npm run typecheck`

## CSV format

Expected columns (case-insensitive, w/ fallback mapping):

- date
- description
- amount
- category

Example:

```csv
date,description,amount,category
2026-03-01,Coffee Shop,4.20,Food
2026-03-02,Uber,18.50,Transport