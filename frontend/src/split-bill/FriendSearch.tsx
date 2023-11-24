import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Input } from '@/shared/components/ui/Input'
import { useKeypress } from '@/shared/hooks/use-keypress'
import { URL_QUERY_KEY_QUERY } from '@/shared/utils/constants'

function FriendSearch() {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const name = searchParams.get(URL_QUERY_KEY_QUERY) || ''

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === inputRef.current) return

    inputRef.current?.focus()
  })

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    searchParams.delete(URL_QUERY_KEY_QUERY)

    const nameQuery = event.target.value

    if (nameQuery) {
      searchParams.set(URL_QUERY_KEY_QUERY, nameQuery)
    }

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
