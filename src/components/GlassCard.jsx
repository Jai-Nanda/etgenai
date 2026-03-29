import { motion } from 'framer-motion'

export default function GlassCard({
  children,
  className = '',
  hoverLift = true,
  as: Component = motion.div,
  ...motionProps
}) {
  const lift = hoverLift
    ? { whileHover: { y: -4 }, transition: { type: 'spring', stiffness: 380, damping: 28 } }
    : {}

  return (
    <Component
      className={`glass-card rounded-2xl border border-outline-variant/35 shadow-[0_8px_40px_-24px_rgba(0,0,0,0.75)] ${className}`.trim()}
      {...lift}
      {...motionProps}
    >
      {children}
    </Component>
  )
}
