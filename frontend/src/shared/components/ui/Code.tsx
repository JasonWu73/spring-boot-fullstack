import React from 'react'

import { cn } from '@/shared/utils/helpers'

type CodeProps = {
  children: React.ReactNode
  className?: string
}

/**
 * 行内代码组件。
 */
export function Code({ children, className }: CodeProps) {
  return (
    <code
      className={cn(
        'rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-predawn dark:bg-[#282828]',
        className
      )}
    >
      {children}
    </code>
  )
}
