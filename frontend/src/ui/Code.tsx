import React from 'react'

import {cn} from '@/utils/helpers'

type CodeProps = {
  children: React.ReactNode
  className?: string
}

function Code({children, className}: CodeProps) {
  return (
    <code
      className={cn(
        'px-1 py-0.5 rounded border font-mono text-sm bg-slate-50 dark:bg-slate-200 text-slate-700',
        className
      )}
    >
      {children}
    </code>
  )
}

export {Code}
