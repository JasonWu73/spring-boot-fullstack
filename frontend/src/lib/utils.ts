import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并类名, 由 `npx shadcn-ui@latest init` 自动生成.
 *
 * {@link https://ui.shadcn.com/docs/installation/vite|Vite - shadcn/ui}
 *
 * @param inputs - 类名
 * @returns - 合并后的类名
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 截断字符串.
 *
 * @param str - 需要截断的字符串
 * @param maxlength - 字符串最大长度
 * @returns - 将 `str` 的末尾替换为省略号 `…` (实际上省略号是单个 Unicode 字符, 不是 `...` 这样的三个点), 使其长度等于 `maxlength`
 */
function truncate(str: string, maxlength: number) {
  if (str.length <= maxlength) {
    return str
  }

  return str.slice(0, maxlength - 1) + '…'
}

export { cn, truncate }
