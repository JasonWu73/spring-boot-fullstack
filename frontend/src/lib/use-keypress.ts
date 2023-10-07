import { useEffect } from 'react'

type ModifierKey = 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey'

type Keypress = {
  key: string
  modifiers?: ModifierKey[]
}

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
