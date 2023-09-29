import { useEffect } from 'react'

/**
 * 设置页面标题.
 *
 * @param title - 页面标题
 */
function useTitle(title: string | undefined | null) {
  useEffect(() => {
    const prevTitle = document.title

    if (!title) {
      return
    }

    document.title = title

    return () => {
      document.title = prevTitle
    }
  }, [title])
}

export { useTitle }
