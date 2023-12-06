import { effect, signal } from '@preact/signals-react'

import type { Theme } from '@/shared/components/ui/ModeToggle'

let STORAGE_KEY: string

const theme = signal<Theme>(undefined as unknown as Theme)

/**
 * 设置主题。
 *
 * @param newTheme 新主题
 */
export function setTheme(newTheme: Theme) {
  localStorage.setItem(STORAGE_KEY, newTheme)
  theme.value = newTheme
}

/**
 * 创建本地缓存的主题数据。
 *
 * @param defaultTheme 默认主题
 * @param storageKey 本地存储中的键，默认为 `app-ui-theme`
 */
export function createThemeState(defaultTheme: Theme, storageKey = 'app-ui-theme') {
  if (theme.value !== undefined) return

  STORAGE_KEY = storageKey
  theme.value = getTheme(defaultTheme)

  effect(() => {
    resetTheme()

    if (theme.value !== 'system') {
      applyTheme(theme.value)
      return
    }

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const selectedTheme = darkQuery.matches ? 'dark' : 'light'

    applyTheme(selectedTheme)

    darkQuery.addEventListener('change', handleToggleTheme)

    return () => darkQuery.removeEventListener('change', handleToggleTheme)
  })
}

function getTheme(defaultTheme: string) {
  return (localStorage.getItem(STORAGE_KEY) as Theme) || defaultTheme
}

function handleToggleTheme(darkMatchEvent: MediaQueryListEvent) {
  resetTheme()

  if (darkMatchEvent.matches) {
    applyTheme('dark')
    return
  }

  applyTheme('light')
}

function resetTheme() {
  document.documentElement.classList.remove('light', 'dark')
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.add(theme)
}
