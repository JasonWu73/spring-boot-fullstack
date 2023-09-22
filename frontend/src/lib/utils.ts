import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并类名, 由 `npx shadcn-ui@latest init` 自动生成.
 *
 * @param inputs - 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
