import {
  type Bill,
  FormSplitBill
} from '@/components/eat-n-split/FormSplitBill'
import React, { lazy, Suspense, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/use-toast'
import { FriendList } from '@/components/eat-n-split/FriendList'
import { Loading } from '@/components/ui/Loading'
import { useTitle } from '@/lib/use-title'
import { Input } from '@/components/ui/Input'
import { wait } from '@/lib/utils'
import { useLocalStorageState } from '@/lib/use-storage'
import { useKeypress } from '@/lib/use-keypress'
import { Friend, getFriends } from '@/api/fake/friend-api'
import { useFetch } from '@/lib/use-fetch'

// ----- Start: 测试懒加载 (React Split Code 技术) -----
const FormAddFriend = lazy(() =>
  wait(3).then(() =>
    import('@/components/eat-n-split/FormAddFriend').then((module) => ({
      default: module.FormAddFriend
    }))
  )
)
// ----- End: 测试懒加载 (React Split Code 技术) -----

function EatAndSplit() {
  useTitle('Eat & Split')

  const [friends, setFriends] = useLocalStorageState<Friend[]>('friends', [])

  const { error, loading } = useFetch(async () => {
    const { data, error } = await getFriends()

    if (data) {
      setFriends((prev) => (!prev ? data.friends : prev))
    }

    return { data, error }
  })

  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  useKeypress({ key: 'Escape' }, () => {
    setShowAddFriend(false)
    setSelectedFriend(null)
  })

  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useKeypress({ key: '\\', modifiers: ['ctrlKey'] }, () => {
    if (document.activeElement === searchInputRef.current) {
      return
    }

    searchInputRef.current?.focus()
    setSearch('')
    setShowAddFriend(false)
    setSelectedFriend(null)
  })

  function handleAddFriend(friend: Friend) {
    setFriends((prev) => [...prev, friend])
  }

  function handleToggleForm() {
    setShowAddFriend((prev) => !prev)
  }

  function handleSelectFriend(friend: Friend) {
    setShowAddFriend(false)
    setSelectedFriend((prev) => (prev?.id === friend.id ? null : friend))
  }

  function handleDeleteFriend(friend: Friend) {
    setFriends((prev) => prev.filter((prev) => prev.id !== friend.id))

    if (selectedFriend?.id === friend.id) {
      setSelectedFriend(null)
    }

    toast({
      title: 'Friend deleted',
      description: `${friend.name} was deleted`
    })
  }

  function handleCreditRating(creditRating: number) {
    setFriends((prev) => {
      if (selectedFriend) {
        return prev.map((prev) => {
          if (prev.id === selectedFriend.id) {
            return {
              ...prev,
              creditRating
            }
          }

          return prev
        })
      }

      return prev
    })
  }

  function handleSplitBill(bill: Bill) {
    setFriends((prev) =>
      prev.map((prev) => {
        if (prev.id === bill.friendId) {
          return {
            ...prev,
            balance: Number((prev.balance - bill.expense).toFixed(2))
          }
        }

        return prev
      })
    )

    setSelectedFriend(null)
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  return (
    <div className="grid grid-flow-row items-center justify-center gap-6 p-4 md:mt-6 md:grid-cols-2">
      <div className="md:col-span-1 md:row-span-1 md:justify-self-end">
        <Input
          value={search}
          onChange={handleSearch}
          ref={searchInputRef}
          placeholder="Search friend"
          className="mb-4 dark:border-amber-500"
        />

        <FriendList
          loading={loading}
          error={error}
          friends={friends.filter((friend) =>
            friend.name.toLowerCase().includes(search.toLowerCase())
          )}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectFriend}
          onDeleteFriend={handleDeleteFriend}
        />
      </div>

      <div className="flex flex-col gap-6 self-start md:col-span-1 md:row-start-2 md:row-end-3 md:justify-self-end">
        <Suspense fallback={<Loading />}>
          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        </Suspense>

        <div className="self-end">
          <Button onClick={handleToggleForm}>
            {showAddFriend ? 'Close' : 'Add friend'}
          </Button>
        </div>
      </div>

      <div className="md:col-start-2 md:col-end-3 md:row-span-1">
        {selectedFriend && (
          <FormSplitBill
            key={selectedFriend.id}
            friend={selectedFriend}
            onSplitBill={handleSplitBill}
            onCreditRating={handleCreditRating}
          />
        )}
      </div>
    </div>
  )
}

export { EatAndSplit }
