import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Button from '../Button'

export default function GuestAccessButton({
  onClick,
  loading = false,
  disabled = false,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`w-full ${className}`}
    >
      <Button
        variant="ghost"
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        className="w-full border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 text-on-surface-variant hover:text-primary"
      >
        <Sparkles className="w-4 h-4" />
        Try Demo
      </Button>
      <p className="text-xs text-on-surface-variant/70 text-center mt-2">
        Explore features without creating an account
      </p>
    </motion.div>
  )
}
