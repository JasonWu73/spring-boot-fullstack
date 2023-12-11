import React from 'react'

import { Input } from '@/shared/components/ui/Input'
import { useKeypress } from '@/shared/hooks/use-keypress'
import { showAddFriend } from '@/shared/signal/split-bill'
import { ShortcutTip } from '@/split-bill/ShortcutTip'
import { useSignal } from '@preact/signals-react'
import { useNavigate } from 'react-router-dom'

type FriendSearchProps = {
  nameQuery: string
  onSearch: (name: string) => void
  onEscape: () => void
}

export function FriendSearch({ nameQuery, onSearch, onEscape }: FriendSearchProps) {
  const input = React.useRef<HTMLInputElement | null>(null)

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === input.current) return

    input.current?.focus()
  })

  const query = useSignal(nameQuery)

  useKeypress({ key: 'Escape' }, () => {
    query.value = ''
    onEscape()
  })

  const navigate = useNavigate()

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.value
    query.value = name

    onSearch(name.trim())
  }

  function handleFocus() {
    showAddFriend(false)

    navigate(`/split-bill${window.location.search}`, {
      replace: true,
      state: { noRefresh: true }
    })
  }

  return (
    <>
      <ShortcutTip />

      <Input
        value={query.value}
        onChange={handleSearch}
        onFocus={handleFocus}
        ref={input}
        placeholder="搜索好友..."
        className="my-4 dark:border-amber-500"
      />
    </>
  )
}
