import { effect, signal } from '@preact/signals-react'

/**
 * 是否折叠侧边栏。
 */
export const folded = signal<boolean>(undefined as unknown as boolean)

/**
 * 设置是否折叠侧边栏。
 *
 * @param newFolded 是否折叠侧边栏
 */
export function setFolded(newFolded: boolean) {
  folded.value = newFolded
}

/**
 * 创建侧边栏折叠状态数据 Signal。
 */
export function createPanelFoldState() {
  if (folded.value !== undefined) return

  const largeScreen = window.matchMedia('(max-width: 1024px)')
  folded.value = largeScreen.matches

  effect(() => {
    function handleScreenChange(largeScreenMatchEvent: MediaQueryListEvent) {
      folded.value = largeScreenMatchEvent.matches
    }

    largeScreen.addEventListener('change', handleScreenChange)

    return () => largeScreen.removeEventListener('change', handleScreenChange)
  })
}
