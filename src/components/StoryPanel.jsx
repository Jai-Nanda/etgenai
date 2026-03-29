import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import GlassCard from './GlassCard'

export default function StoryPanel({ title, body, className = '' }) {
  return (
    <GlassCard className={`relative overflow-hidden p-6 sm:p-8 ${className}`.trim()} hoverLift>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" aria-hidden />
          <span className="font-label text-xs font-semibold uppercase tracking-[0.18em]">
            AI storyboard
          </span>
        </div>
        <motion.h3
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-headline text-xl sm:text-2xl font-bold text-on-surface tracking-tight"
        >
          {title}
        </motion.h3>
        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-3xl">
          {body}
        </p>
      </div>
    </GlassCard>
  )
}
