import React from 'react'

import { Tooltip } from '@/shared/components/ui/Tooltip'
import { cn } from '@/shared/utils/helpers'

type ButtonProps = React.ComponentPropsWithoutRef<'button'>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ children, className, title, ...props }, ref) {
    return (
      <Tooltip title={title}>
        <button
          {...props}
          ref={ref}
          className={cn(
            'flex items-center justify-center h-9 py-2 px-4 text-sm font-medium text-slate-50 bg-sky-500 rounded transition-colors hover:bg-sky-500/90 focus:bg-sky-500/90 focus:outline-none focus:ring-1 focus:ring-sky-200 disabled:pointer-events-none disabled:opacity-50 dark:text-slate-200',
            className
          )}
        >
          {children}
        </button>
      </Tooltip>
    )
  }
)
