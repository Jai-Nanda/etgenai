# Expense Genie AI

A GenAI fintech tool that turns bank transactions into personal money stories, helping users change spending habits through narratives and small nudges instead of charts.

## Features

- Upload bank-style CSV files or enter expenses manually
- Analyze spending personality (persona)
- Generate personalized money stories
- Show future scenarios (no change vs. small change)
- Provide tiny, actionable nudges

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. **Input Expenses**: Upload a CSV or manually add expenses with description, amount, and time.
2. **Persona Analysis**: The app identifies your spending personality based on patterns.
3. **Story Generation**: Creates a narrative of your monthly spending habits.
4. **Future Scenarios**: Shows what happens if you continue vs. make small changes.
5. **Actionable Nudges**: Provides concrete, small steps to improve habits.

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- PapaParse for CSV handling

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
