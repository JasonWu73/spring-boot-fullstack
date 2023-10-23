import { useEffect } from 'react'

type ModifierKey = 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey'

type Keypress = {
  key: string
  modifiers?: ModifierKey[]
}

/**
 * 用于监听按键的 Hook.
 *
 * @param key - 按键
 * @param modifiers - 修饰键
 * @param callback - 回调函数
 */
function useKeypress({ key, modifiers = [] }: Keypress, callback: () => void) {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (
        event.key?.toLowerCase() === key.toLowerCase() &&
        modifiers.every((modifier) => event[modifier])
      ) {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])
}

export { useKeypress }