import React, { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Input } from '@/components/ui/Input'
import { useKeypress } from '@/lib/use-keypress'

function FriendSearch() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get('s') || ''

  const navigate = useNavigate()

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === inputRef.current) {
      return
    }

    inputRef.current?.focus()
    navigate('/eat-split?c=1')
  })

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    return setSearchParams({ s: event.target.value.trim() })
  }

  return (
    <Input
      value={name}
      onChange={handleSearch}
      ref={inputRef}
      placeholder="Search friend..."
      className="mb-4 dark:border-amber-500"
    />
  )
}

export { FriendSearch }
