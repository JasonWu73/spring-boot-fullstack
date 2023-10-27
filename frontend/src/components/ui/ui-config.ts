import { cva } from 'class-variance-authority'

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300',
  {
    variants: {
      variant: {
        default:
          'bg-sky-500 text-sky-50 shadow-sm hover:bg-sky-500/90 dark:bg-sky-600 dark:text-slate-50 dark:hover:bg-sky-600/90',
        destructive:
          'bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-600 dark:text-slate-50 dark:hover:bg-red-600/90',
        outline:
          'border border-slate-200 bg-transparent shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-50',
        secondary:
          'bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        link: 'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

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

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 data-[state=open]:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:data-[active]:bg-slate-800/50 dark:data-[state=open]:bg-slate-800/50'
)

export {
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  buttonVariants,
  inputErrorClasses,
  navigationMenuTriggerStyle
}
