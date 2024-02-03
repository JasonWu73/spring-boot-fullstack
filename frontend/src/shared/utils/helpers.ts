import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名。
 *
 * 1. `npm install clsx`
 * 2. `npm install tailwind-merge`
 *
 * @param inputs CSS 类名
 * @returns {string} 合并后的 CSS 类名
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * 带标签的模板字符串，用于在模板字符串中使用 `prettier-plugin-tailwindcss` 插件。
 *
 * @param strings 模板字符串
 * @param values 模板字符串中的变量
 * @returns string 模板字符串
 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss#sorting-classes-in-template-literals
 */
export function tw(strings: TemplateStringsArray, ...values: unknown[]) {
  return String.raw({ raw: strings }, ...values)
}

/**
 * 截断字符串值，使其长度等于指定的最大长度。
 *
 * 将长字符串的末尾替换为省略号 `…`（实际上省略号是单个 Unicode 字符，不是 `...` 这样的三个点）。
 *
 * @param value 要截断的字符串值
 * @param maxlength 最大长度
 * @returns string 截断后的字符串值
 */
export function truncate(value: string, maxlength: number) {
  if (value.length <= maxlength) return value

  return value.slice(0, maxlength - 1) + '…'
}

/**
 * 等待指定秒数。
 *
 * @param seconds 等待的秒数
 * @returns Promise<void> 等待指定秒数后，返回一个空的 Promise 对象
 */
export function wait(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

/**
 * 判断当前操作系统是否为 macOS。
 */
export function isMac() {
  return window.navigator.userAgent.toLowerCase().search('mac') !== -1
}

/**
 * 判断当前操作系统是否为 Windows。
 */
export function isWindows() {
  return window.navigator.userAgent.toLowerCase().search('windows') !== -1
}

/**
 * 判断当前操作系统是否为 Linux。
 */
export function isLinux() {
  return window.navigator.userAgent.toLowerCase().search('linux') !== -1
}
