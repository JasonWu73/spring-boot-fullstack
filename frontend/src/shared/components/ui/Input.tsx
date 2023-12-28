import * as React from 'react'

import { cn, tw } from '@/shared/utils/helpers'

/**
 * 当参数验证不通过时的文本框样式。
 *
 * @param isError 是否验证不通过
 * @returns Tailwind CSS 类名字符串
 */
export function inputErrorClasses(isError: boolean) {
  return isError
    ? tw`border-red-500 focus-visible:ring-red-500 dark:border-red-600 dark:focus-visible:ring-red-600`
    : tw`border-slate-200 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300`
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ isError = false, className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400',
          inputErrorClasses(isError),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
