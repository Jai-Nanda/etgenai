import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import GlassCard from './GlassCard'

const footerLinks = [
  { to: '/upload', label: 'Upload' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/insights', label: 'Insights' },
  { to: '/about', label: 'About' },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-outline-variant/25 bg-surface-container-low/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <GlassCard hoverLift={false} className="p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md space-y-2">
              <p className="font-headline text-lg font-bold text-on-surface">
                Spending Storyboard
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Turn a bank-style CSV into a clear, story-driven read on where your money went — built
                for demos, portfolios, and privacy-minded early adopters.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Product
                </p>
                <ul className="mt-3 space-y-2">
                  {footerLinks.map(({ to, label }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="text-sm text-on-surface hover:text-primary transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Contact
                </p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <a
                      href="mailto:hello@spendingstoryboard.app"
                      className="inline-flex items-center gap-2 text-sm text-on-surface hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4 opacity-80" aria-hidden />
                      Email us
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-on-surface hover:text-primary transition-colors"
                    >
                      GitHub (placeholder)
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Legal
                </p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-on-surface hover:text-primary transition-colors"
                    >
                      Privacy-first overview
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-8 text-xs text-on-surface-variant/90">
            © {new Date().getFullYear()} Spending Storyboard. Demo frontend — no ledger data is sent to
            a server in this MVP.
          </p>
        </GlassCard>
      </div>
    </footer>
  )
}
