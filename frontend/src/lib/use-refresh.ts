import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { debounce } from '@/lib/utils'

let initialLoadPage = true

const initialFinish = debounce(() => {
  initialLoadPage = false
}, 200)

let needsReload = true

const resetNeedsReload = debounce(() => {
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
      initialFinish()
      return
    }

    if (needsReload) {
      needsReload = false

      callback()

      resetNeedsReload()
    }
  }, [location.key])
}

export { useRefresh }
