/** Realistic mock data for dashboard + narrative insights */

export const mockMeta = {
  periodLabel: 'Last 90 days',
  currency: 'USD',
}

export const mockSummary = {
  totalSpent: 12847,
  topCategory: 'Food',
  topCategoryAmount: 3820,
  biggestTransaction: {
    label: 'Airline — quarterly trip',
    amount: 842,
    category: 'Travel',
    date: 'Feb 14',
  },
  monthlyAverage: 4282,
}

export const mockCategories = [
  { id: 'food', name: 'Food', amount: 3820, pct: 30, color: 'from-emerald-400/80 to-emerald-600/40' },
  { id: 'travel', name: 'Travel', amount: 2610, pct: 20, color: 'from-sky-400/80 to-sky-600/40' },
  { id: 'shopping', name: 'Shopping', amount: 1927, pct: 15, color: 'from-fuchsia-400/80 to-fuchsia-600/40' },
  { id: 'bills', name: 'Bills', amount: 1799, pct: 14, color: 'from-amber-400/80 to-amber-600/40' },
  { id: 'entertainment', name: 'Entertainment', amount: 1285, pct: 10, color: 'from-violet-400/80 to-violet-600/40' },
  { id: 'health', name: 'Health', amount: 771, pct: 6, color: 'from-rose-400/80 to-rose-600/40' },
  { id: 'education', name: 'Education', amount: 635, pct: 5, color: 'from-cyan-400/80 to-cyan-600/40' },
]

export const mockMonthlyTrend = [
  { month: 'Dec', amount: 3950 },
  { month: 'Jan', amount: 4420 },
  { month: 'Feb', amount: 4477 },
]

export const mockStoryPreview = {
  title: 'Your spending arc',
  body: 'Food anchored your month, but travel punctuated it with two clear peaks. You stayed predictable on bills while entertainment traced a calmer line — the rhythm of someone balancing discipline with planned treats.',
}

export const mockHighlights = [
  {
    title: 'Steady subscription stack',
    body: 'Recurring charges stayed within a narrow band — a sign your fixed costs are under control.',
  },
  {
    title: 'Travel is intentional',
    body: 'Large travel hits clustered around two dates rather than leaking across the month.',
  },
  {
    title: 'Room in discretionary',
    body: 'Shopping and entertainment combined stayed under 25% of outflows.',
  },
]

export const mockInsightsNarrative = {
  personality:
    'You spend like a planner who still buys meaningful experiences. Fixed costs are boring-in-a-good-way; your splashes show up where they matter.',
  whereMoneyWent:
    'Most outflows landed in Food and Travel — everyday fuel plus two memorable trips. Bills held steady, and smaller categories stayed supportive rather than noisy.',
  patterns: [
    'Weekday food spend clusters before noon — likely coffee + lunch rhythm.',
    'Entertainment rises modestly on Fridays; no runaway weekend drift.',
    'Shopping spikes are rare but larger — fewer impulse buys, more considered picks.',
    'Health stays consistent — a quiet signal you are not deferring care.',
  ],
  smartRecommendations: [
    {
      title: 'Unify subscriptions',
      body: 'Route one recurring subscription through a single card to simplify tracking.',
    },
    {
      title: 'Early drift signal',
      body: 'Set a soft cap alert at 85% of your Food budget to catch drift early.',
    },
    {
      title: 'Travel normalization',
      body: 'Park travel savings in a labeled bucket the week after a trip to normalize cash flow.',
    },
  ],
  monthlyStory: [
    'December closed with heavier social time; January tightened as routines returned.',
    'February introduced a travel beat that lifted the average without breaking structure.',
    'Across the quarter, the story is consistency with two confident excursions.',
  ],
  watchouts: [
    { label: 'Food drift', detail: 'Three consecutive weeks above your trailing average.' },
    { label: 'Forgotten trial', detail: 'A small software charge repeated after a promo ended.' },
  ],
  goodHabits: [
    'Your bill payments landed on time with even cadence.',
    'You kept education spending focused — one course, completed.',
    'Entertainment stayed bounded even when travel was elevated.',
  ],
}
