import React, { useEffect, useState } from 'react'

/**
 * 设置或读取 LocalStorage 值的自定义 Hook.
 *
 * @template T - 值的类型
 *
 * @param key - LocalStorage 的键
 * @param initialValue - 初始值
 * @returns {[value, setValue]} - 值和设置值的函数
 */
function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = localStorage.getItem(key)
    return stickyValue !== null ? JSON.parse(stickyValue) : initialValue
  })

  useEffect(() => {
    if (!value) {
      localStorage.removeItem(key)
      return
    }

    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export { useLocalStorageState }
