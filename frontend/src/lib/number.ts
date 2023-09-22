/**
 * 检查字符串是否为数字.
 *
 * @param value 要检查的字符串
 * @returns {boolean} 如果字符串是数字，则为true，否则为false
 */
export function isNumber(value: string): boolean {
  if (value.trim() === "") {
    return false;
  }

  return Number.isFinite(Number(value));
}