import React from 'react'

import { cn } from '@/shared/utils/helpers'

/**
 * 当参数验证不通过时的文本框样式。
 *
 * @param invalid 是否验证不通过
 * @returns Tailwind CSS 类名字符串
 */
export function getInvalidClasses(invalid: boolean) {
  return invalid
    ? 'text-rose-600 bg-rose-100 border-rose-300 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-200 dark:text-rose-500 dark:bg-rose-200 dark:focus:border-rose-600 dark:focus:ring-rose-900'
    : 'text-slate-900 bg-white border-slate-300 focus:border-sky-500 focus:ring-sky-200 dark:border-slate-500 dark:text-slate-200 dark:bg-slate-900 dark:focus:border-sky-600 dark:focus:ring-sky-900'
}

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  type?: 'text' | 'password' | 'search' | 'email' | 'url' | 'tel' | 'number' | 'radio' | 'checkbox' | 'datetime-local' | 'date' | 'time' | 'month' | 'week' | 'file' | 'color' | 'range'
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = 'text', invalid = false, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        type={type}
        className={cn(
          'font-sans inline-block w-full p-2 text-sm leading-5 border placeholder-slate-400 rounded shadow-sm transition-colors focus:outline-none focus:ring-1 disabled:border-slate-200 disabled:text-slate-500 disabled:bg-slate-50 disabled:pointer-events-none dark:disabled:border-slate-600 dark:disabled:text-slate-300 dark:disabled:bg-slate-800',
          type === 'file' && 'file:h-9 file:py-2 file:px-4 file:border-0 file:rounded file:text-sm file:font-medium file:text-slate-50 file:bg-sky-500 hover:file:bg-sky-500/90 hover:file:cursor-pointer dark:file:text-slate-200',
          getInvalidClasses(invalid),
          className
        )}
      />
    )
  }
)
