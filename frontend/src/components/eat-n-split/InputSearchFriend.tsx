import { useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Input } from '@/components/ui/Input'
import { useKeypress } from '@/lib/use-keypress'

function InputSearchFriend() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get('s') || ''

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === inputRef.current) {
      return
    }

    inputRef.current?.focus()
    setSearchParams({ s: '' })
  })

  return (
    <Input
      value={name}
      onChange={(e) => setSearchParams({ s: e.target.value.trim() })}
      ref={inputRef}
      placeholder="Search friend"
      className="mb-4 dark:border-amber-500"
    />
  )
}

export { InputSearchFriend }
