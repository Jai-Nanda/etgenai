import { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [storySourceName, setStorySourceName] = useState(null)
  const [calmTheme, setCalmTheme] = useState(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.dataset.theme === 'calm'
  })

  const setCalm = (value) => {
    setCalmTheme(value)
    if (typeof document !== 'undefined') {
      if (value) document.documentElement.dataset.theme = 'calm'
      else delete document.documentElement.dataset.theme
    }
  }

  const value = useMemo(
    () => ({
      storySourceName,
      setStorySourceName,
      calmTheme,
      setCalm,
    }),
    [storySourceName, calmTheme]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
