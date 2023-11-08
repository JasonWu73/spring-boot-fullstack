import { cva } from 'class-variance-authority'

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10

/**
 * 自定义的错误边框样式.
 *
 * @param isError - 是否为错误状态
 * @returns {Record<string, boolean>} - 错误边框样式类对象, 用于 `cn` 函数
 */
function inputErrorClasses(isError: boolean): Record<string, boolean> {
  return {
    'border-slate-200 dark:border-slate-800 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300':
      !isError,
    'border-red-500 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-700':
      isError
  }
}

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 data-[state=open]:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:data-[active]:bg-slate-800/50 dark:data-[state=open]:bg-slate-800/50'
)

export {
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  inputErrorClasses,
  navigationMenuTriggerStyle
}
