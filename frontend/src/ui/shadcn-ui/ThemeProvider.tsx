import React, {createContext, useContext, useEffect, useState} from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
}

const ThemeProviderContext = createContext(initialState)

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
  const [theme, setTheme] = useState(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useApplyTheme(theme)

  const value = {
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
  return useContext(ThemeProviderContext)
}

function useApplyTheme(theme: Theme) {
  useEffect(() => {
    resetTheme()

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

    if (theme === 'system') {
      const selectedTheme = darkQuery.matches ? 'dark' : 'light'

      applyTheme(selectedTheme)

      darkQuery.addEventListener('change', handleToggleTheme)

      return () => {
        darkQuery.removeEventListener('change', handleToggleTheme)
      }
    }

    applyTheme(theme)
  }, [theme])
}

function resetTheme() {
  document.documentElement.classList.remove('light', 'dark')
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.add(theme)
}

function handleToggleTheme(event: MediaQueryListEvent) {
  resetTheme()

  if (event.matches) {
    applyTheme('dark')
    return
  }

  applyTheme('light')
}

export {ThemeProvider, useTheme}
