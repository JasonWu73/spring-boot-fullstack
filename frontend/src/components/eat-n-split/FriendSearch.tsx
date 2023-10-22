import React, { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Input } from '@/components/ui/Input'
import { useKeypress } from '@/hooks/use-keypress'

const KEY_SEARCH = 's'

function FriendSearch() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get(KEY_SEARCH) || ''

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === inputRef.current) {
      return
    }

    inputRef.current?.focus()
  })

  const navigate = useNavigate()

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    return setSearchParams(
      { [KEY_SEARCH]: event.target.value },
      { replace: true, state: { noRefresh: true } }
    )
  }

  function handleFocus() {
    navigate(`/eat-split${window.location.search}`, {
      replace: true,
      state: { noRefresh: true }
    })
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

export { FriendSearch, KEY_SEARCH }
