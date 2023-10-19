import React, { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Input } from '@/components/ui/Input'
import { useKeypress } from '@/hooks/use-keypress'

const SEARCH_KEY = 's'

function FriendSearch() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get(SEARCH_KEY) || ''

  const navigate = useNavigate()

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === inputRef.current) {
      return
    }

    inputRef.current?.focus()
  })

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    return setSearchParams({ s: event.target.value }, { replace: true })
  }

  function handleFocus() {
    if (window.location.pathname !== '/eat-split') {
      navigate('/eat-split', { replace: true })
    }
  }

  return (
    <Input
      value={name}
      onChange={handleSearch}
      onFocus={handleFocus}
      ref={inputRef}
      placeholder="Search friend..."
      className="mb-4 dark:border-amber-500"
    />
  )
}

export { FriendSearch, SEARCH_KEY }
