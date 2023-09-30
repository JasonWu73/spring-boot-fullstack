import {
  type Bill,
  FormSplitBill
} from '@/components/demo/eat-n-split/FormSplitBill'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/use-toast'
import {
  type Friend,
  initialFriends
} from '@/components/demo/eat-n-split/friend-data'
import { FriendList } from '@/components/demo/eat-n-split/FriendList'
import { Loading } from '@/components/ui/Loading'
import { useTitle } from '@/lib/hooks'

// ----- Start: 测试懒加载 (React Split Code 技术) -----
const FormAddFriend = lazy(() =>
  wait(5).then(() =>
    import('@/components/demo/eat-n-split/FormAddFriend').then((module) => ({
      default: module.FormAddFriend
    }))
  )
)

function wait(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

// ----- End: 测试懒加载 (React Split Code 技术) -----

function EatAndSplit() {
  useTitle('Eat & Split')

  const [friends, setFriends] = useState<Friend[]>(initFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const { toast } = useToast()

  useExit(setShowAddFriend, setSelectedFriend)

  useStorage(friends)

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

  return (
    <div className="grid grid-flow-row items-center justify-center gap-6 p-4 md:mt-6 md:grid-cols-2 md:grid-rows-2">
      <div className="md:col-span-1 md:row-span-1 md:justify-self-end">
        <FriendList
          friends={friends}
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

function useExit(
  setShowAddFriend: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedFriend: React.Dispatch<React.SetStateAction<Friend | null>>
) {
  useEffect(() => {
    function handleExit(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowAddFriend(false)
        setSelectedFriend(null)
      }
    }

    document.addEventListener('keydown', handleExit)

    return () => {
      document.removeEventListener('keydown', handleExit)
    }
  }, [setShowAddFriend, setSelectedFriend])
}

function initFriends() {
  const val = localStorage.getItem('friends')

  if (!val) {
    localStorage.setItem('friends', JSON.stringify(initialFriends))
    return initialFriends
  }

  return JSON.parse(val)
}

function useStorage(friends: Friend[]) {
  useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends))
  }, [friends])
}

export { EatAndSplit }
