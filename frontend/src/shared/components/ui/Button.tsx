import React from 'react'

import { Tooltip } from '@/shared/components/ui/Tooltip'
import { cn } from '@/shared/utils/helpers'

/**
 * 按钮类型：
 * 1. `primary` - 主要用于突出显示主要操作，如提交表单、保存更改等。通常在页面上主要的行动按钮。通常具有鲜明的颜色，以引起用户的注意
 * 2. `secondary` - 用于次要操作，或作为次要行动按钮。可以用于取消、返回或执行辅助操作。通常具有较为柔和的颜色，以不引起用户的注意
 * 3. `danger` - 用于危险操作，如删除数据或执行可能导致问题的操作等。通常采用红色或与危险相关的颜色
 * 4. `link` - 超链接样式
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link'

/**
 * 获取按钮样式类名。
 *
 * @param variant 按钮类型
 * @returns {string} Tailwind CSS 类名字符串
 */
export function buttonVariantClasses(variant?: ButtonVariant): string {
  const defaultStyle = 'relative flex items-center justify-center h-9 py-2 px-4 text-sm font-medium text-slate-50 rounded shadow-sm transition-colors hover:shadow-md focus:outline-none focus:ring-1 focus:shadow-md disabled:pointer-events-none disabled:opacity-50 dark:text-slate-200'

  if (!variant) return defaultStyle

  switch (variant) {
    case 'primary': {
      return cn(defaultStyle, 'bg-sky-500 hover:bg-sky-600 hover:shadow-sky-500 focus:bg-sky-600 focus:ring-sky-400 focus:shadow-sky-500')
    }
    case 'secondary': {
      return cn(defaultStyle, 'text-sky-900 bg-slate-100 hover:bg-slate-200 hover:shadow-slate-300 focus:bg-slate-200 focus:ring-slate-200 focus:shadow-slate-300 dark:text-sky-900')
    }
    case 'danger': {
      return cn(defaultStyle, 'bg-rose-500 hover:bg-rose-600 hover:shadow-rose-500 focus:bg-rose-600 focus:ring-rose-400 focus:shadow-rose-500')
    }
    case 'link': {
      return cn(defaultStyle, 'text-sky-500 underline underline-offset-4 shadow-none hover:text-sky-600 hover:shadow-none focus:text-sky-600 focus:ring-sky-500 focus:shadow-none dark:text-sky-500 dark:hover:text-sky-600')
    }
  }
}

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { children, className, title, type = 'button', variant = 'primary', ...props },
    ref
  ) {
    return (
      <Tooltip title={title}>
        <button
          {...props}
          ref={ref}
          type={type}
          className={cn(buttonVariantClasses(variant), className)}
        >
          {children}
        </button>
      </Tooltip>
    )
  }
)
