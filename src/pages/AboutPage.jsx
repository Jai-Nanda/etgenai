import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileUp, Fingerprint, LineChart, Shield } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import SectionHeader from '../components/SectionHeader'
import GlassCard from '../components/GlassCard'
import Button from '../components/Button'

const points = [
  {
    title: 'What it is',
    body: 'Spending Storyboard transforms dry transactions into a story you can scan, share, and iterate on — the same dark, glassy fintech feel, upgraded into a real multi-page React flow.',
    icon: LineChart,
  },
  {
    title: 'Why it exists',
    body: 'Most budgeting tools show tables. This prototype shows narrative hierarchy: summaries, arcs, and coach marks that feel worthy of a seed-stage deck.',
    icon: FileUp,
  },
  {
    title: 'How it works',
    body: 'Upload a CSV, let the client validate it, then explore dashboard and insights. This build uses mock analytics; your parser can replace the data layer without touching the UI shell.',
    icon: Shield,
  },
  {
    title: 'Privacy-first',
    body: 'No server round-trip in this MVP: filenames and validation stay in the browser. Ship end-to-end encryption or on-device models later — the product story already matches that posture.',
    icon: Fingerprint,
  },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-10"
      >
        <SectionHeader
          eyebrow="About"
          title="The same vibe. A more engineered surface."
          description="We preserved background tone, glow language, and glass cards — then tightened spacing, navigation, and motion so it feels like a funded MVP."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {points.map(({ title, body, icon: Icon }) => (
            <GlassCard key={title} className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container/60 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 space-y-2">
                  <h3 className="font-headline text-lg font-bold text-on-surface">{title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{body}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-headline text-lg font-bold text-on-surface">Ready to try the flow?</p>
            <p className="mt-1 text-sm text-on-surface-variant max-w-xl">
              Jump back to upload with a CSV, or open the dashboard to see the mock storyboard in context.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => navigate('/upload')}>
              Go to upload
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
              View dashboard
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </PageContainer>
  )
}
