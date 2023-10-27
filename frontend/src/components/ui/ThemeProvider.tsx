import React, { useEffect, useState } from 'react'

import { ThemeProviderContext, type Theme } from '@/components/ui/ThemeContext'

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

export { ThemeProvider }
