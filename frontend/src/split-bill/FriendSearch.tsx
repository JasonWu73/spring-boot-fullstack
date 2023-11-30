import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Input } from '@/shared/components/ui/Input'
import { URL_QUERY_KEY_QUERY } from '@/shared/constants'
import { useKeypress } from '@/shared/hooks/use-keypress'
import ShortcutTip from '@/split-bill/ShortcutTip'

function FriendSearch() {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = React.useState(searchParams.get(URL_QUERY_KEY_QUERY) || '')
  const navigate = useNavigate()

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === inputRef.current) return

    inputRef.current?.focus()
  })

  useKeypress({ key: 'Escape' }, () => {
    setQuery('')
  })

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    searchParams.delete(URL_QUERY_KEY_QUERY)

    const value = event.target.value

    setQuery(value)

    const nameQuery = value.trim()

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
    <>
      <ShortcutTip />

      <Input
        value={query}
        onChange={handleSearch}
        onFocus={handleFocus}
        ref={inputRef}
        placeholder="搜索好友..."
        className="my-4 dark:border-amber-500"
      />
    </>
  )
}

export { FriendSearch }
