import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void

  folded: boolean
  setFolded: React.Dispatch<React.SetStateAction<boolean>>
}

const ThemeProviderContext = createContext({} as ThemeProviderState)

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

  const [folded, setFolded] = useState(false)

  useSmallScreenFold(setFolded)

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },

    folded,
    setFolded
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error('useTheme 必须在 ThemeProvider 中使用')
  }

  return context
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

function useSmallScreenFold(
  setFolded: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    const smallScreen = window.matchMedia('(max-width: 640px)')

    if (smallScreen.matches) {
      setFolded(true)
    }

    function handleScreenChange(event: MediaQueryListEvent) {
      setFolded(event.matches)
    }

    smallScreen.addEventListener('change', handleScreenChange)

    return () => {
      smallScreen.removeEventListener('change', handleScreenChange)
    }
  }, [])
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

export { ThemeProvider, useTheme }
