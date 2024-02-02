import React from 'react'

import { cn } from '@/shared/utils/helpers'

/**
 * 当参数验证不通过时的文本框样式。
 *
 * @param invalid 是否验证不通过
 * @returns Tailwind CSS 类名字符串
 */
export function invalidClasses(invalid: boolean) {
  return invalid
    ? 'border-rose-600 text-rose-600 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-500 dark:text-rose-500 dark:focus:border-rose-600 dark:focus:ring-rose-900'
    : ''
}

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  type?: 'text' | 'password' | 'search' | 'email' | 'url' | 'tel' | 'number' | 'radio' | 'checkbox' | 'datetime-local' | 'date' | 'time' | 'month' | 'week' | 'file' | 'color' | 'range'
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ invalid = false, type = 'text', className, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        type={type}
        className={cn(
          'font-sans inline-block h-9 w-full py-2 px-4 text-sm leading-5 border border-slate-300 text-slate-900 bg-white placeholder-slate-400 rounded shadow-sm transition-colors focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 disabled:border-slate-200 disabled:text-slate-500 disabled:bg-slate-50 disabled:pointer-events-none dark:border-slate-500 dark:text-slate-200 dark:bg-slate-900 dark:disabled:border-slate-600 dark:disabled:text-slate-300 dark:disabled:bg-slate-800 dark:focus:border-sky-600 dark:focus:ring-sky-900',
          type === 'file' && 'text-slate-100 file:h-9 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:text-slate-100 file:bg-sky-500 hover:file:bg-sky-500/90 hover:file:cursor-pointer',
          invalidClasses(invalid),
          className
        )}
      />
    )
  }
)
