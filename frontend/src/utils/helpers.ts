import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { ELLIPSIS } from '@/utils/constants'

/**
 * 合并 Tailwind CSS 类名（可覆盖之前的类），由 `npx shadcn-ui@latest init` 自动生成。
 *
 * {@link https://ui.shadcn.com/docs/installation/vite|Vite - shadcn/ui}
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 带标签的模板字符串，用于在模板字符串中使用 `prettier-plugin-tailwindcss` 插件。
 *
 * {@link https://github.com/tailwindlabs/prettier-plugin-tailwindcss#sorting-classes-in-template-literals|Sorting classes in template literals - prettier-plugin-tailwindcss}
 */
function tw(strings: TemplateStringsArray, ...values: unknown[]) {
  return String.raw({ raw: strings }, ...values)
}

/**
 * 截断字符串，使其长度等于指定的最大长度。
 *
 * <p>将长字符串的末尾替换为省略号 `…`（实际上省略号是单个 Unicode 字符，不是 `...` 这样的三个点）。
 */
function truncate(str: string, maxlength: number) {
  if (str.length <= maxlength) return str

  return str.slice(0, maxlength - 1) + ELLIPSIS
}

/**
 * 等待指定秒数。
 */
function wait(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export { cn, truncate, tw, wait }
