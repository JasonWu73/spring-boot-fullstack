import React from 'react'
import { useLocation } from 'react-router-dom'

import { useSavedRef } from '@/shared/hooks/use-saved'

type Cleanup = () => void
type ReturnCleanup = void | Cleanup
type RefreshCallback = () => ReturnCleanup

/**
 * 为了模拟传统的 Web 应用，即只要点击页面链接就会刷新页面，而不是像 SPA 应用，若点击相同 URL 并不会刷新组件。
 * <p>
 * 因为是根据 URL 状态来执行刷新，故哪怕只是 URL 参数发生了改变，同样也会触发刷新逻辑。
 * <p>
 * 为了避免高频率的重复点击相同的 URL，导致重复刷新组件，故这里加了一个 1 秒的防抖。
 *
 * @param callback 刷新组件状态的回调函数，该回调函数可再返回清理函数
 */
export function useRefresh(callback: RefreshCallback) {
  const location = useLocation()
  const prevTimestamp = React.useRef<number>()
  const callbackRef = useSavedRef(callback)

  React.useEffect(() => {
    // 为了避免高频率的重复点击相同的 URL，导致重复刷新组件，故这里加了一个 1 秒的防抖
    if (prevTimestamp.current && Date.now() - prevTimestamp.current < 1_000) return

    prevTimestamp.current = Date.now()

    const cleanup = callbackRef.current()

    return () => cleanup && cleanup()
  }, [location.key, callbackRef])
}

/**
 * 仅首次加载时执行。
 * <p>
 * 为避免 React Strict Mode 下的重复渲染，故这里加了一个 1 秒的防抖。
 *
 * @param callback 刷新组件状态的回调函数，该回调函数可再返回清理函数
 */
export function useInitial(callback: RefreshCallback) {
  const prevTimestamp = React.useRef<number>()
  const callbackRef = useSavedRef(callback)

  React.useEffect(() => {
    // 为避免 React Strict Mode 下的重复渲染，故这里加了一个 1 秒的防抖
    if (prevTimestamp.current && Date.now() - prevTimestamp.current < 1_000) return

    prevTimestamp.current = Date.now()

    const cleanup = callbackRef.current()

    return () => cleanup && cleanup()
  }, [callbackRef])
}
