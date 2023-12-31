import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Input } from '@/shared/components/ui/Input'
import { URL_QUERY_KEY_QUERY } from '@/shared/constants'
import { useKeypress } from '@/shared/hooks/use-keypress'
import { setShowAddFriend } from '@/split-bill/split-bill-signals'
import { ShortcutTip } from '@/split-bill/ShortcutTip'

export function FriendSearch() {
  const input = React.useRef<HTMLInputElement | null>(null)

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === input.current) return

    input.current?.focus()
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = React.useState(searchParams.get(URL_QUERY_KEY_QUERY) || '')

  const navigate = useNavigate()

  useKeypress({ key: 'Escape' }, () => {
    setQuery('')

    searchParams.delete(URL_QUERY_KEY_QUERY)

    setSearchParams(searchParams, {
      replace: true,
      state: { noRefresh: true }
    })
  })

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.value
    setQuery(name)

    searchParams.delete(URL_QUERY_KEY_QUERY)

    const nameQuery = name.trim()

    if (nameQuery) {
      searchParams.set(URL_QUERY_KEY_QUERY, nameQuery)
    }

    setSearchParams(searchParams, {
      replace: true,
      state: { noRefresh: true }
    })
  }

  function handleFocus() {
    setShowAddFriend(false)

    navigate(`/split-bill${location.search}`, {
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
        ref={input}
        placeholder="搜索好友..."
        className="my-4 bg-white dark:border-amber-500 dark:bg-transparent"
      />
    </>
  )
}
