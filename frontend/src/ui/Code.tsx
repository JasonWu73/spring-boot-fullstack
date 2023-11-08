import React from 'react'

import {cn} from '@/utils/helpers'

type CodeProps = {
  children: React.ReactNode
  className?: string
}

function Code({children, className}: CodeProps) {
  return (
    <code className={cn('text-rose-500 dark:text-amber-500', className)}>
      {children}
    </code>
  )
}

export {Code}
