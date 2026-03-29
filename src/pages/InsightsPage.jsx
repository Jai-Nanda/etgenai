import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Compass,
  Lightbulb,
  LineChart,
  Sparkles,
  ThumbsUp,
} from 'lucide-react'
import PageContainer from '../components/PageContainer'
import SectionHeader from '../components/SectionHeader'
import InsightCard from '../components/InsightCard'
import StoryPanel from '../components/StoryPanel'
import GlassCard from '../components/GlassCard'
import Button from '../components/Button'
import { mockInsightsNarrative, mockMeta } from '../data/mockSpendingData'

export default function InsightsPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
        className="space-y-12"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            eyebrow={`${mockMeta.periodLabel} · narrative mode`}
            title="Insights that read like a financial editor"
            description="Editorial panels, premium glass, restrained motion. The same dark fintech DNA as the rest of the app — dialed toward story."
            className="sm:mb-0"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            leftIcon={ArrowLeft}
            className="shrink-0"
          >
            Back to dashboard
          </Button>
        </div>

        <InsightCard title="Spending personality" icon={Compass}>
          {mockInsightsNarrative.personality}
        </InsightCard>

        <StoryPanel title="Where your money went" body={mockInsightsNarrative.whereMoneyWent} />

        <div className="space-y-4">
          <SectionHeader
            eyebrow="Signals"
            title="Patterns we noticed"
            description="Concrete behaviors inferred from the mock ledger — swap in real rules later without touching this layout."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {mockInsightsNarrative.patterns.map((text) => (
              <GlassCard key={text} className="p-5">
                <div className="flex items-start gap-3">
                  <LineChart className="mt-0.5 h-5 w-5 text-secondary" aria-hidden />
                  <p className="text-sm text-on-surface-variant leading-relaxed">{text}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            eyebrow="Coach"
            title="Smart recommendations"
            description="Actionable, not robotic — each line is a product decision, not a bullet factory."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {mockInsightsNarrative.smartRecommendations.map((item) => (
              <InsightCard key={item.title} title={item.title} icon={Lightbulb} accent="secondary">
                {item.body}
              </InsightCard>
            ))}
          </div>
        </div>

        <GlassCard className="p-6 sm:p-8 border-primary/15">
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" aria-hidden />
            <span className="font-label text-xs font-semibold uppercase tracking-[0.18em]">
              Monthly financial story
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {mockInsightsNarrative.monthlyStory.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm sm:text-[15px] text-on-surface-variant leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="p-6 sm:p-7 border-error/20">
            <div className="flex items-center gap-2 text-error">
              <AlertTriangle className="h-5 w-5" aria-hidden />
              <h3 className="font-headline text-lg font-bold text-on-surface">Watchouts</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {mockInsightsNarrative.watchouts.map((w) => (
                <li key={w.label} className="rounded-xl border border-outline-variant/40 bg-surface-container-low/40 p-4">
                  <p className="font-medium text-on-surface">{w.label}</p>
                  <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">{w.detail}</p>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6 sm:p-7 border-secondary/20">
            <div className="flex items-center gap-2 text-secondary">
              <ThumbsUp className="h-5 w-5" aria-hidden />
              <h3 className="font-headline text-lg font-bold text-on-surface">Good habits</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {mockInsightsNarrative.goodHabits.map((text) => (
                <li
                  key={text}
                  className="flex gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-low/40 p-4"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <p className="text-sm text-on-surface-variant leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </motion.div>
    </PageContainer>
  )
}
