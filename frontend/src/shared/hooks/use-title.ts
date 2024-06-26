import React from 'react'

/**
 * 用于修改页面标题的 Hook。
 *
 * 该 Hook 会在组件卸载时，将页面标题恢复为之前的值。
 *
 * @param title 页面标题
 */
export function useTitle(title: string) {
  React.useEffect(() => {
    const prevTitle = document.title

    if (title) document.title = title

    return () => {
      document.title = prevTitle
    }
  }, [title])
}
