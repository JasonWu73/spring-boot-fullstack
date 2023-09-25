import { type Bill, FormSplitBill } from '@/components/demo/eat-n-split/FormSplitBill.tsx'
import { useState } from 'react'
import { Button } from '@/components/ui/Button.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { type Friend, initialFriends } from '@/components/demo/eat-n-split/friend-data.ts'
import { FriendList } from '@/components/demo/eat-n-split/FriendList.tsx'
import { FormAddFriend } from '@/components/demo/eat-n-split/FormAddFriend.tsx'

function EatAndSplit() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const { toast } = useToast()

  document.title = 'Eat & Split'

  function handleAddFriend(friend: Friend) {
    setFriends((prev) => [...prev, friend])
  }

  function handleToggleForm() {
    setShowAddFriend((prev) => !prev)
  }

  function handleSelectFriend(friend: Friend) {
    setShowAddFriend(false)
    setSelectedFriend(prev => prev?.id === friend.id ? null : friend)
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

  function handleSplitBill(bill: Bill) {
    setFriends((prev) => prev.map((prev) => {
      if (prev.id === bill.friendId) {
        return {
          ...prev,
          balance: Number((prev.balance - bill.expense).toFixed(2))
        }
      }

      return prev
    }))

    setSelectedFriend(null)
  }

  return (
    <div className="grid grid-flow-row md:grid-rows-2 md:grid-cols-2 gap-6 justify-center items-center md:mt-16 p-6">
      <div className="md:row-span-1 md:col-span-1 md:justify-self-end">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectFriend}
          onDeleteFriend={handleDeleteFriend}
        />
      </div>

      <div className="md:row-start-2 md:row-end-3 md:col-span-1 md:justify-self-end self-start flex flex-col gap-6">
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <div className="self-end">
          <Button onClick={handleToggleForm}>
            {showAddFriend ? 'Close' : 'Add friend'}
          </Button>
        </div>
      </div>

      <div className="md:row-span-1 md:col-start-2 md:col-end-3">
        {selectedFriend && <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />}
      </div>
    </div>
  )
}

export { EatAndSplit }
