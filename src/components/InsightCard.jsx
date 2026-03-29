import GlassCard from './GlassCard'

export default function InsightCard({
  title,
  children,
  icon: Icon,
  accent = 'primary',
  className = '',
}) {
  const ring =
    accent === 'secondary'
      ? 'border-secondary/25 shadow-[0_0_40px_-20px_rgba(79,219,200,0.35)]'
      : accent === 'warn'
        ? 'border-error/25 shadow-[0_0_40px_-20px_rgba(255,180,171,0.2)]'
        : 'border-primary/20'

  return (
    <GlassCard className={`p-6 sm:p-7 ${ring} ${className}`.trim()}>
      <div className="flex gap-4">
        {Icon ? (
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low/80 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        ) : null}
        <div className="min-w-0 space-y-2">
          <h3 className="font-headline text-lg font-bold text-on-surface tracking-tight">
            {title}
          </h3>
          <div className="text-sm sm:text-[15px] text-on-surface-variant leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
