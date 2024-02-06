import { effect, signal } from '@preact/signals-react'

export type Theme = 'dark' | 'light' | 'system'

let STORAGE_KEY: string

// ----- Signals（不要直接导出 Signal，而是应该导出方法来使用 Signal）-----
const theme = signal(undefined as unknown as Theme)

/**
 * 创建主题数据 Signal。
 *
 * @param defaultTheme 默认主题
 * @param storageKey Local Storage 中的 key，默认为 `app-ui-theme`
 */
export function createThemeState(
  defaultTheme: Theme,
  storageKey = 'app-ui-theme'
) {
  if (theme.value !== undefined) return

  STORAGE_KEY = storageKey
  theme.value = (localStorage.getItem(STORAGE_KEY) as Theme) || defaultTheme

  effect(() => {
    localStorage.setItem(STORAGE_KEY, theme.value)

    resetTheme()

    if (theme.value !== 'system') {
      applyTheme(theme.value)
      return
    }

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const selectedTheme = darkQuery.matches ? 'dark' : 'light'

    applyTheme(selectedTheme)

    darkQuery.addEventListener('change', handleToggleTheme)

    function handleToggleTheme() {
      resetTheme()

      if (darkQuery.matches) {
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

    return () => darkQuery.removeEventListener('change', handleToggleTheme)
  })
}

/**
 * 获取主题。
 *
 * @returns {Theme} 当前主题
 */
export function getTheme(): Theme {
  return theme.value
}

/**
 * 设置主题。
 *
 * @param newTheme 新主题
 */
export function setTheme(newTheme: Theme) {
  theme.value = newTheme
}
