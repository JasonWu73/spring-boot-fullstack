import { useEffect } from 'react'

/**
 * 设置页面标题的自定义 hook.
 *
 * @param title - 页面标题
 */
function useTitle(title: string | undefined | null) {
  useEffect(() => {
    const prevTitle = document.title

    if (title) {
      document.title = title
    }

    return () => {
      document.title = prevTitle
    }
  }, [title])
}

export { useTitle }
