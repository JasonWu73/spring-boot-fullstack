import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并类名, 由 `npx shadcn-ui@latest init` 自动生成.
 *
 * {@link https://ui.shadcn.com/docs/installation/vite|Vite - shadcn/ui}
 *
 * @param inputs - 类名
 * @returns {string} - 合并后的类名
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 检查字符串是否为数字.
 *
 * @param value - 要检查的字符串
 * @returns {boolean} - 如果字符串是数字，则为true，否则为false
 */
export function isNumeric(value: string | null | undefined): boolean {
  if (value === null || value === undefined || value.trim() === "") {
    return false;
  }

  return Number.isFinite(Number(value));
}

/**
 * 截断字符串.
 *
 * @param str - 需要截断的字符串
 * @param maxlength - 字符串最大长度
 * @returns {string} - 将 `str` 的末尾替换为省略号 `…` (实际上省略号是单个 Unicode 字符, 不是 `...` 这样的三个点), 使其长度等于 `maxlength`
 */
export function truncate(str: string, maxlength: number): string {
  if (str.length <= maxlength) {
    return str;
  }

  return str.slice(0, maxlength - 1) + "…";
}