import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isError?: boolean
}

/**
 * {@link https://ui.shadcn.com/docs/components/input|Input - shadcn/ui}
 *
 * @param props - 组件属性
 * @param props.isError - 自定义的属性, 若为 `true`, 则边框会变为红色
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isError = false, className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400',
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

/**
 * 自定义的错误边框样式.
 *
 * @param isError - 是否为错误状态
 * @returns - 错误边框样式类对象, 用于 `cn` 函数
 */
function inputErrorClasses(isError: boolean) {
  return {
    'border-slate-200 dark:border-slate-800 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300':
      !isError,
    'border-red-500 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-700':
      isError
  }
}

export { Input, inputErrorClasses }
