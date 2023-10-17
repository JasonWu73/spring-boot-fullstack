import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { debounce } from '@/lib/utils'

let initialLoadPage = true

const setNotInitialLoadPage = debounce(() => {
  initialLoadPage = false
}, 200)

let needsReload = true

const setNeedsReload = debounce(() => {
  needsReload = true
}, 1000)

/**
 * 当 URL 状态改变时刷新页面。
 *
 * @param callback - 刷新组件状态的回调函数
 */
function useRefresh(callback: () => void) {
  const location = useLocation()

  useEffect(() => {
    if (initialLoadPage) {
      setNotInitialLoadPage()
      return
    }

    if (needsReload) {
      needsReload = false

      callback()

      setNeedsReload()
    }
  }, [location.key])
}

export { useRefresh }
