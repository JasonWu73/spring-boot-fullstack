import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = resetTheme()

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

    if (theme === 'system') {
      const systemTheme = darkQuery.matches ? 'dark' : 'light'

      root.classList.add(systemTheme)

      // 监听暗色主题变化
      darkQuery.addEventListener('change', handleAutoToggleTheme)

      return () => {
        // 取消监听暗色主题变化
        darkQuery.removeEventListener('change', handleAutoToggleTheme)
      }
    }

    root.classList.add(theme)
  }, [theme])

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

function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

function resetTheme() {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  return root
}

function handleAutoToggleTheme(event: MediaQueryListEvent) {
  const root = resetTheme()

  if (event.matches) {
    // 暗色主题
    root.classList.add('dark')
    return
  }

  // 亮色主题
  root.classList.add('light')
}

export { ThemeProvider, useTheme }
