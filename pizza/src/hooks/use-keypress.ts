import { useEffect } from 'react'
import { useObjectRef } from '@/hooks/use-saved'

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
  const keypressRef = useObjectRef({ key, modifiers, callback })

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const { key, modifiers, callback } = keypressRef.current

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
  }, [keypressRef])
}

export { useKeypress }
