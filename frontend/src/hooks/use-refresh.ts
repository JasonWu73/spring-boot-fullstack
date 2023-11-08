import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useCallbackRef} from '@/hooks/use-saved'

type Cleanup = () => void
type ReturnCleanup = void | Cleanup

type RefreshCallback = () => ReturnCleanup

/**
 * 当 URL 状态改变时（即哪怕点击了相同的 React Router Link）也会触发的刷新回调。
 *
 * @param callback - 刷新组件状态的回调函数，可以返回清理函数
 */
function useRefresh(callback: RefreshCallback) {
  const location = useLocation()

  const callbackRef = useCallbackRef(callback)

  useEffect(() => {
    const cleanup = callbackRef.current()

    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [location.key, callbackRef])
}

export {useRefresh}
