import { Loader2 } from 'lucide-react'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]'

const variants = {
  primary:
    'bg-gradient-to-r from-primary-container/35 via-primary/20 to-primary-container/25 text-primary border border-primary/45 shadow-[0_0_28px_-10px_rgba(173,198,255,0.55)] hover:border-primary/70 hover:shadow-[0_0_36px_-8px_rgba(173,198,255,0.65)]',
  secondary:
    'bg-surface-container-high/90 text-on-surface border border-outline-variant/80 hover:border-primary/35 hover:bg-surface-container-high',
  ghost:
    'bg-transparent text-on-surface-variant border border-transparent hover:text-primary hover:bg-surface-container-high/60',
  dangerGhost:
    'bg-transparent text-error border border-transparent hover:bg-error/10',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  type = 'button',
  leftIcon: Left,
  rightIcon: Right,
  ...rest
}) {
  const v = variants[variant] ?? variants.primary
  return (
    <button
      type={type}
      className={`${base} ${v} ${className}`.trim()}
      disabled={rest.disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden /> : null}
      {Left && !loading ? <Left className="h-4 w-4 shrink-0" aria-hidden /> : null}
      {children}
      {Right && !loading ? <Right className="h-4 w-4 shrink-0" aria-hidden /> : null}
    </button>
  )
}
