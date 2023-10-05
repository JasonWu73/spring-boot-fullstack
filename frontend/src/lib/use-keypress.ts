import { useEffect } from 'react'

type ModifierKey = 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey'

type Keypress = {
  key: string
  modifiers?: ModifierKey[]
}

function useKeypress({ key, modifiers = [] }: Keypress, callback: () => void) {
  useEffect(
    () => {
      function handleKeydown(event: KeyboardEvent) {
        console.log(event.key)
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, JSON.stringify(modifiers), callback]
  )
}

export { useKeypress }
