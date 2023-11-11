import React, { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Input } from '@/ui/shadcn-ui/Input'
import { useKeypress } from '@/hooks/use-keypress'
import { KEY_QUERY } from '@/utils/constants'

function FriendSearch() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get(KEY_QUERY) || ''

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === inputRef.current) {
      return
    }

    inputRef.current?.focus()
  })

  const navigate = useNavigate()

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    searchParams.set(KEY_QUERY, event.target.value)

    return setSearchParams(searchParams, {
      replace: true,
      state: { noRefresh: true }
    })
  }

  function handleFocus() {
    navigate(`/split-bill${window.location.search}`, {
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
      placeholder="搜索好友..."
      className="mb-4 dark:border-amber-500"
    />
  )
}

export { FriendSearch }
