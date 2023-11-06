import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并类名，由 `npx shadcn-ui@latest init` 自动生成。
 *
 * {@link https://ui.shadcn.com/docs/installation/vite|Vite - shadcn/ui}
 *
 * @param inputs - 类名
 * @returns {string} - 合并后的类名
 */
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * 带标签的模板字符串，用于在模板字符串中使用 prettier-plugin-tailwindcss 插件。
 *
 * {@link https://github.com/tailwindlabs/prettier-plugin-tailwindcss#sorting-classes-in-template-literals|Sorting classes in template literals - prettier-plugin-tailwindcss}
 *
 * @param strings - 字符串数组
 * @param values - 模板字符串中的变量
 * @returns {string} - 模板字符串
 */
function tw(strings: TemplateStringsArray, ...values: unknown[]): string {
  return String.raw({ raw: strings }, ...values)
}

/**
 * 截断字符串。
 *
 * @param str - 需要截断的字符串
 * @param maxlength - 字符串最大长度
 * @returns {string} - 将 `str` 的末尾替换为省略号 `…`（实际上省略号是单个 Unicode 字符，不是 `...` 这样的三个点），使其长度等于 `maxlength`
 */
function truncate(str: string, maxlength: number): string {
  if (str.length <= maxlength) {
    return str
  }

  return str.slice(0, maxlength - 1) + '…'
}

/**
 * 等待指定秒数。
 *
 * @param secs - 等待的秒数
 * @returns {Promise<void>} - 等待指定秒数后执行的 `Promise`
 */
function wait(secs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, secs * 1000))
}

type Debounce = () => void

/**
 * 防抖动函数，通过添加防抖机制，确保在一定时间内只执行一次相关函数，而不是在每次事件触发时都执行。
 *
 * @param callback - 需要防抖动的回调函数
 * @param delay - 防抖动的时间间隔，单位为：毫秒
 * @returns {Debounce} - 防抖动函数
 */
function debounce(callback: () => void, delay: number): Debounce {
  let timer: number | null

  return function () {
    if (timer) {
      window.clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      callback()
    }, delay)
  }
}

export { cn, tw, truncate, wait, debounce }
