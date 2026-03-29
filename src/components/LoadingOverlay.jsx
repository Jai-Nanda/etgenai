import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function LoadingOverlay({ open, message = 'Building your story…' }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/75 backdrop-blur-md px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="glass-card w-full max-w-sm rounded-2xl border border-outline-variant/40 p-8 text-center shadow-[0_0_60px_-20px_rgba(173,198,255,0.35)]"
          >
            <Loader2
              className="mx-auto h-10 w-10 animate-spin text-primary"
              aria-hidden
            />
            <p className="mt-5 font-headline text-lg font-semibold text-on-surface">
              {message}
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Parsing categories, smoothing trends, drafting your narrative…
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
