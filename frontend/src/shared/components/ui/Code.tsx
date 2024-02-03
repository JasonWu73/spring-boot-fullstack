import React from 'react'

import { cn } from '@/shared/utils/helpers'

type CodeProps = {
  children: React.ReactNode
  className?: string
}

export function Code({ children, className }: CodeProps) {
  return (
    <code
      className={cn(
        'font-mono py-0.5 px-1 text-rose-500 bg-slate-100 rounded dark:bg-[#282828]',
        className
      )}
    >
      {children}
    </code>
  )
}
