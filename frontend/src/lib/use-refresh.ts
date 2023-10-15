import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

/**
 * 当 URL 状态改变时刷新页面.
 *
 * @param callback - 刷新组件状态的回调函数
 */
function useRefresh(callback: () => void) {
  const location = useLocation()

  useEffect(() => {
    callback()
  }, [location.key])
}

export { useRefresh }
