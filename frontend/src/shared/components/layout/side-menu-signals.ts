import { effect, signal } from '@preact/signals-react'

// ----- Signals（不要直接导出 Signal，而是应该导出方法来使用 Signal）-----
const collapsed = signal(undefined as unknown as boolean)

/**
 * 创建是否显示侧边栏菜单 Signal。
 */
export function createPanelFoldState() {
  if (collapsed.value !== undefined) return

  const largeScreen = window.matchMedia('(max-width: 1024px)')
  collapsed.value = largeScreen.matches

  effect(() => {
    largeScreen.addEventListener('change', handleChangeScreen)

    function handleChangeScreen(event: MediaQueryListEvent) {
      collapsed.value = event.matches
    }

    return () => largeScreen.removeEventListener('change', handleChangeScreen)
  })
}

/**
 * 是否折叠侧边栏菜单。
 *
 * @returns {boolean} 是否折叠侧边栏
 */
export function isCollapsed(): boolean {
  return collapsed.value
}

/**
 * 设置是否折叠侧边栏。
 *
 * @param collapse 是否折叠侧边栏
 */
export function setCollapsed(collapse: boolean) {
  collapsed.value = collapse
}
