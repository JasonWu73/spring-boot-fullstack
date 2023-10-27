import React, { useEffect, useState } from 'react'

/**
 * 设置或读取 LocalStorage 值的自定义 Hook.
 *
 * @template T - 值类型
 *
 * @param storageKey - LocalStorage 的键
 * @param defaultValue - LocalStorage 键的默认值
 * @param isJsonParse - 是否 JSON 解析 LocalStorage 的值，默认为 true
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]}
 */
function useLocalStorageState<T>(
  storageKey: string,
  defaultValue: T,
  isJsonParse: boolean = true
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const storageValue = localStorage.getItem(storageKey)

    if (isJsonParse && storageValue) {
      return JSON.parse(storageValue)
    }

    return storageValue || defaultValue
  })

  useEffect(() => {
    if (value === '' || value === null || value === undefined) {
      localStorage.removeItem(storageKey)
      return
    }

    if (isJsonParse) {
      localStorage.setItem(storageKey, JSON.stringify(value))
      return
    }

    localStorage.setItem(storageKey, String(value))
  }, [storageKey, value, isJsonParse])

  return [value, setValue]
}

export { useLocalStorageState }
