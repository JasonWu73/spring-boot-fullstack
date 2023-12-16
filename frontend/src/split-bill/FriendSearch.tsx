import { useSignal } from '@preact/signals-react'
import React from 'react'

import { Input } from '@/shared/components/ui/Input'
import { useKeypress } from '@/shared/hooks/use-keypress'
import { ShortcutTip } from '@/split-bill/ShortcutTip'

type FriendSearchProps = {
  nameQuery: string
  onSearch: (name: string) => void
  onEscape: () => void
  onFocus: () => void
}

export function FriendSearch({
  nameQuery,
  onSearch,
  onEscape,
  onFocus
}: FriendSearchProps) {
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

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.value
    query.value = name

    onSearch(name.trim())
  }

  return (
    <>
      <ShortcutTip />

      <Input
        value={query.value}
        onChange={handleSearch}
        onFocus={onFocus}
        ref={input}
        placeholder="搜索好友..."
        className="my-4 bg-white dark:border-amber-500 dark:bg-transparent"
      />
    </>
  )
}
