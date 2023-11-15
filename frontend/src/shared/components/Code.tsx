import React from 'react'

import { cn } from '@/shared/utils/helpers'

type CodeProps = {
  children: React.ReactNode
  className?: string
}

function Code({ children, className }: CodeProps) {
  return (
    <code
      className={cn(
        'rounded border bg-slate-50 px-1 py-0.5 font-mono text-sm text-slate-700 dark:bg-slate-200',
        className
      )}
    >
      {children}
    </code>
  )
}

export { Code }
