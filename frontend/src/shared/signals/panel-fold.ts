import { effect, signal } from '@preact/signals-react'

/**
 * 是否折叠侧边栏 Signal。
 * <p>
 * 不要直接导出 Signal，而且应该导出方法来使用 Signal。
 */
const folded = signal(undefined as unknown as boolean)

/**
 * 创建侧边栏折叠状态数据 Signal。
 * <p>
 * 仅可在应用启动时初始化一次。
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

/**
 * 获取是否折叠侧边栏。
 *
 * @returns boolean 是否折叠侧边栏
 */
export function getFolded() {
  return folded.value
}

/**
 * 设置是否折叠侧边栏。
 *
 * @param newFolded 是否折叠侧边栏
 */
export function setFolded(newFolded: boolean) {
  folded.value = newFolded
}
