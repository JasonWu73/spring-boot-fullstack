import { effect, signal, type Signal } from '@preact/signals-react'

import type { Theme } from '@/shared/components/ui/ModeToggle'

let theme: Signal<Theme>
let STORAGE_KEY: string

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
  if (theme !== undefined) return

  theme = signal(getTheme(defaultTheme))
  STORAGE_KEY = storageKey

  effect(() => {
    resetTheme()

    if (theme.value !== 'system') return applyTheme(theme.value)

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
