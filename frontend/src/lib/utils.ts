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
