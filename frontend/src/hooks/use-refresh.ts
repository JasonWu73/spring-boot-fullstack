import React from 'react'
import { useLocation } from 'react-router-dom'

import { useCallbackRef } from '@/hooks/use-saved'

type Cleanup = () => void
type ReturnCleanup = void | Cleanup

type RefreshCallback = () => ReturnCleanup

/**
 * 为了模拟传统的 Web 应用，只要点击页面链接就会刷新页面，而不是像普通的 SPA，只要点击不同的 URL 才会刷新组件。
 *
 * <p>因为是根据 URL 状态来执行刷新，故哪怕只是 URL 参数发生了改变，同样也会触发刷新。
 *
 * @param callback - 刷新组件状态的回调函数，可返回清理函数
 */
function useUrlRefresh(callback: RefreshCallback) {
  const location = useLocation()

  const callbackRef = useCallbackRef(callback)

  React.useEffect(() => {
    const cleanup = callbackRef.current()

    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [location.key, callbackRef])
}

export { useUrlRefresh }
