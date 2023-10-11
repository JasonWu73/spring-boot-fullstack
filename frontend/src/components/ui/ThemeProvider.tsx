import React, { useEffect, useState } from 'react'

import { type Theme, ThemeProviderContext } from '@/components/ui/use-theme'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

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

export { ThemeProvider }
