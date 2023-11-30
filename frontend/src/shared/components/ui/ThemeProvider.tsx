import React from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext(null as unknown as ThemeProviderState)

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

/**
 * {@link https://ui.shadcn.com/docs/dark-mode/vite | Vite - shadcn/ui}
 */
function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'app-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useResetTheme(theme)

  const value: ThemeProviderState = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    }
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/**
 * {@link https://ui.shadcn.com/docs/dark-mode/vite | Vite - shadcn/ui}
 */
function useTheme() {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error('useTheme 必须在 ThemeProvider 中使用')
  }

  return context
}

function useResetTheme(theme: Theme) {
  React.useEffect(() => {
    resetTheme()

    if (theme !== 'system') return applyTheme(theme)

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const selectedTheme = darkQuery.matches ? 'dark' : 'light'

    applyTheme(selectedTheme)

    darkQuery.addEventListener('change', handleToggleTheme)

    return () => darkQuery.removeEventListener('change', handleToggleTheme)
  }, [theme])
}

function handleToggleTheme(darkMatchEvent: MediaQueryListEvent) {
  resetTheme()

  if (darkMatchEvent.matches) return applyTheme('dark')

  applyTheme('light')
}

function resetTheme() {
  document.documentElement.classList.remove('light', 'dark')
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.add(theme)
}

export { ThemeProvider, useTheme }
