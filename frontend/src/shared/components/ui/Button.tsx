import React from 'react'

import { cn } from '@/shared/utils/helpers'

type ButtonProps = React.ComponentPropsWithoutRef<'button'>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ children, className, ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          'flex items-center justify-center h-9 py-2 px-4 rounded text-sm font-medium transition-colors text-slate-50 bg-sky-500 hover:bg-sky-500/90 focus:outline-none focus:ring-1 focus:ring-sky-200 focus:bg-sky-500/90 disabled:pointer-events-none disabled:opacity-50',
          className
        )}
      >
        {children}
      </button>
    )
  }
)
