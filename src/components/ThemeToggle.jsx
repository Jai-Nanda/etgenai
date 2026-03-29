import { Moon, Sparkle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Button from './Button'

export default function ThemeToggle() {
  const { calmTheme, setCalm } = useApp()

  return (
    <Button
      type="button"
      variant="ghost"
      className="!px-3 !py-2"
      onClick={() => setCalm(!calmTheme)}
      aria-pressed={calmTheme}
      title={calmTheme ? 'Vivid glow' : 'Calmer glow'}
    >
      {calmTheme ? (
        <>
          <Sparkle className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline text-xs font-semibold">Vivid</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline text-xs font-semibold">Calm</span>
        </>
      )}
    </Button>
  )
}
