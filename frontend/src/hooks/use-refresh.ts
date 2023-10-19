import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

let prevKey = ''

/**
 * 当 URL 状态改变时（即哪怕点击了相同的 React Router Link）触发的刷新回调。
 *
 * @param callback - 刷新组件状态的回调函数
 */
function useRefresh(callback: () => void) {
  const location = useLocation()
  const canReload = useRef(false)

  useEffect(() => {
    const curKey = location.key
    const keyChanged = !!prevKey && prevKey !== curKey

    if (keyChanged && canReload.current) {
      callback()
    }

    return () => {
      prevKey = curKey
      canReload.current = true
    }
  }, [location.key])
}

export { useRefresh }
