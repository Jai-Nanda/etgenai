export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`.trim()}
    >
      <div className="max-w-2xl space-y-2">
        {eyebrow ? (
          <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 pt-1 sm:pt-0">{action}</div> : null}
    </div>
  )
}
