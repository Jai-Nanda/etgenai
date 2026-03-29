import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  PieChart,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import PageContainer from '../components/PageContainer'
import SectionHeader from '../components/SectionHeader'
import GlassCard from '../components/GlassCard'
import SummaryCard from '../components/SummaryCard'
import StoryPanel from '../components/StoryPanel'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'
import {
  mockCategories,
  mockHighlights,
  mockMeta,
  mockMonthlyTrend,
  mockStoryPreview,
  mockSummary,
} from '../data/mockSpendingData'
import { formatCurrency } from '../utils/formatCurrency'

const maxTrend = Math.max(...mockMonthlyTrend.map((m) => m.amount), 1)

export default function DashboardPage() {
  const navigate = useNavigate()
  const { storySourceName } = useApp()
  const welcomeName = storySourceName ? storySourceName.replace(/\.csv$/i, '') : null

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-12"
      >
        <SectionHeader
          eyebrow={mockMeta.periodLabel}
          title={welcomeName ? `Welcome back — ${welcomeName}` : 'Your spending command center'}
          description="Glass surfaces, soft glow, and story-first hierarchy. Numbers stay honest; the layout stays premium."
          action={
            <Button
              type="button"
              variant="secondary"
              rightIcon={ArrowRight}
              onClick={() => navigate('/insights')}
            >
              Open insights
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total spent"
            value={formatCurrency(mockSummary.totalSpent)}
            hint="Across linked accounts in this demo window."
            icon={Wallet}
          />
          <SummaryCard
            label="Top category"
            value={mockSummary.topCategory}
            hint={`About ${formatCurrency(mockSummary.topCategoryAmount)} in outflows.`}
            icon={PieChart}
          />
          <SummaryCard
            label="Largest transaction"
            value={formatCurrency(mockSummary.biggestTransaction.amount)}
            hint={`${mockSummary.biggestTransaction.label} · ${mockSummary.biggestTransaction.date}`}
            icon={CreditCard}
          />
          <SummaryCard
            label="Monthly average"
            value={formatCurrency(mockSummary.monthlyAverage)}
            hint="Smoothed across the last three months."
            icon={TrendingUp}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-label text-xs font-semibold uppercase tracking-[0.18em] text-primary/90">
                  Category breakdown
                </p>
                <h3 className="mt-2 font-headline text-xl font-bold text-on-surface">
                  Where dollars cluster
                </h3>
              </div>
              <BarChart3 className="h-6 w-6 text-primary/80" aria-hidden />
            </div>
            <div className="mt-6 space-y-4">
              {mockCategories.map((c) => (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-on-surface">{c.name}</span>
                    <span className="text-on-surface-variant">
                      {formatCurrency(c.amount)}{' '}
                      <span className="text-on-surface-variant/70">({c.pct}%)</span>
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-container-highest/80">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-label text-xs font-semibold uppercase tracking-[0.18em] text-primary/90">
                  Spending trends
                </p>
                <h3 className="mt-2 font-headline text-xl font-bold text-on-surface">
                  Month-over-month rhythm
                </h3>
              </div>
              <TrendingUp className="h-6 w-6 text-secondary/90" aria-hidden />
            </div>
            <div className="mt-8 flex h-44 items-end justify-between gap-3">
              {mockMonthlyTrend.map((m) => {
                const pct = Math.round((m.amount / maxTrend) * 100)
                const barHeight = `${Math.max(pct, 22)}%`
                return (
                  <div key={m.month} className="flex h-full flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end justify-center rounded-xl border border-outline-variant/40 bg-surface-container-low/50 px-1 pb-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: barHeight }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="w-full max-w-[52px] rounded-lg bg-gradient-to-t from-primary-container/30 to-primary/55 shadow-[0_0_24px_-10px_rgba(173,198,255,0.45)]"
                      />
                    </div>
                    <p className="text-xs font-semibold text-on-surface-variant">{m.month}</p>
                    <p className="text-[11px] text-on-surface-variant/80">
                      {formatCurrency(m.amount)}
                    </p>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        <StoryPanel title={mockStoryPreview.title} body={mockStoryPreview.body} />

        <div className="space-y-5">
          <SectionHeader
            eyebrow="Highlights"
            title="Recommendations that sound human"
            description="Short, confident callouts you can read in five seconds — tuned for demos, not clutter."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {mockHighlights.map((h) => (
              <GlassCard key={h.title} className="p-6">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  <span className="text-xs font-semibold uppercase tracking-wider">Signal</span>
                </div>
                <p className="mt-3 font-headline text-base font-bold text-on-surface">{h.title}</p>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{h.body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </motion.div>
    </PageContainer>
  )
}
