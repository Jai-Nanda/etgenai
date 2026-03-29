import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  LineChart, 
  Menu, 
  Upload, 
  XCircle, 
  LogOut, 
  User, 
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

const authenticatedLinks = [
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/insights', label: 'Insights', icon: LineChart },
  { to: '/about', label: 'About', icon: null },
]

const unauthenticatedLinks = [
  { to: '/login', label: 'Login', icon: LogIn },
  { to: '/signup', label: 'Sign Up', icon: UserPlus },
  { to: '/about', label: 'About', icon: null },
]

const linkClass = ({ isActive }) =>
  [
    'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'text-primary bg-primary/10 border border-primary/25'
      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/70 border border-transparent',
  ].join(' ')

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isGuest, logout } = useAuth()
  const navigate = useNavigate()

  const isAuthenticated = !!user || isGuest
  const links = isAuthenticated ? authenticatedLinks : unauthenticatedLinks

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getUserDisplay = () => {
    if (isGuest) {
      return {
        name: 'Guest',
        icon: Sparkles,
        badge: 'Demo'
      }
    }
    
    if (user) {
      return {
        name: user.name || user.email?.split('@')[0] || 'User',
        icon: User,
        badge: null
      }
    }
    
    return null
  }

  const userDisplay = getUserDisplay()

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/25 bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="group flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-sm font-extrabold font-headline text-primary shadow-[0_0_24px_-12px_rgba(173,198,255,0.55)] group-hover:border-primary/50 transition-colors">
            EG
          </span>
          <div className="leading-tight">
            <span className="block font-headline text-sm font-bold tracking-tight text-on-surface">
              Expense Genie AI
            </span>
            <span className="hidden text-[11px] text-on-surface-variant sm:block">
              Turn your expenses into intelligent insights
            </span>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {Icon ? <Icon className="h-4 w-4 opacity-80" aria-hidden /> : null}
              {label}
            </NavLink>
          ))}
          
          {isAuthenticated && (
            <>
              {userDisplay && (
                <div className="ml-2 flex items-center gap-2 pl-2 border-l border-outline-variant/40">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/50">
                    <userDisplay.icon className="h-4 w-4 text-on-surface-variant" />
                    <span className="text-sm font-medium text-on-surface">
                      {userDisplay.name}
                    </span>
                    {userDisplay.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                        {userDisplay.badge}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-surface-container-high/50 transition-colors text-on-surface-variant hover:text-error"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
              <ThemeToggle />
            </>
          )}
          
          {!isAuthenticated && (
            <div className="ml-2 pl-2 border-l border-outline-variant/40 flex items-center gap-1">
              <ThemeToggle />
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/60 bg-surface-container-high/70 text-on-surface hover:border-primary/35 transition-colors"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XCircle className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden border-t border-outline-variant/25 bg-surface/95 backdrop-blur-xl overflow-x-hidden"
            aria-label="Mobile main"
          >
            <div className="flex flex-col gap-1 px-4 py-3 sm:px-6">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {Icon ? <Icon className="h-4 w-4 opacity-80" aria-hidden /> : null}
                  {label}
                </NavLink>
              ))}
              
              {isAuthenticated && userDisplay && (
                <div className="pt-2 mt-2 border-t border-outline-variant/30">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <userDisplay.icon className="h-4 w-4 text-on-surface-variant" />
                      <span className="text-sm font-medium text-on-surface">
                        {userDisplay.name}
                      </span>
                      {userDisplay.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                          {userDisplay.badge}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg hover:bg-surface-container-high/50 transition-colors text-on-surface-variant hover:text-error"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
