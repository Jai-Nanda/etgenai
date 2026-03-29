import GlassCard from './GlassCard'

export default function SummaryCard({
  label,
  value,
  hint,
  icon: Icon,
  className = '',
}) {
  return (
    <GlassCard className={`p-5 sm:p-6 ${className}`.trim()}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            {label}
          </p>
          <p className="font-headline text-2xl sm:text-3xl font-bold text-on-surface tracking-tight break-words">
            {value}
          </p>
          {hint ? (
            <p className="text-sm text-on-surface-variant leading-snug">{hint}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container/60 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        ) : null}
      </div>
    </GlassCard>
  )
}
