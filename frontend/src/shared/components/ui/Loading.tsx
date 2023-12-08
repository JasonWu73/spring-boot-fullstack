import React from 'react'

import { endNProgress, startNProgress } from '@/shared/utils/nprogress'

export function Loading() {
  useNProgress()

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="h-4 w-4 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s] dark:bg-red-600"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.15s] dark:bg-amber-600"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-lime-500 dark:bg-lime-600"></div>
      <span className="sr-only">加载中...</span>
    </div>
  )
}

function useNProgress() {
  React.useEffect(() => {
    startNProgress()

    return () => endNProgress()
  }, [])
}
