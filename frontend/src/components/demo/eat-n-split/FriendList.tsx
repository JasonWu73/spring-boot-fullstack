import { Separator } from '@/components/ui/Separator.tsx'
import { ScrollArea } from '@/components/ui/ScrollArea.tsx'
import React from 'react'
import { Card } from '@/components/ui/Card.tsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert.tsx'
import { RocketIcon } from '@radix-ui/react-icons'
import { Friend } from '@/components/demo/eat-n-split/friend-data.ts'
import { FriendItem } from '@/components/demo/eat-n-split/FriendItem.tsx'

type FriendListProps = {
  friends: Friend[]
  selectedFriend: Friend | null
  onSelectFriend: (friend: Friend) => void
  onDeleteFriend: (friend: Friend) => void
}

function FriendList({
  friends,
  selectedFriend,
  onSelectFriend,
  onDeleteFriend
}: FriendListProps) {
  return (
    <Card>
      <ScrollArea className="h-96 md:h-[30rem] lg:h-[24rem] md:w-[22rem] lg:w-[30rem]">
        <div className="p-4">
          {friends.length === 0 && (
            <Alert>
              <RocketIcon className="w-4 h-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                No friends yet. Add a friend to split a bill.
              </AlertDescription>
            </Alert>
          )}

          {friends.length > 0 && (
            <ul>
              {friends.map((value, index, array) => (
                <React.Fragment key={value.id}>
                  <FriendItem
                    friend={value}
                    isSelected={value.id === selectedFriend?.id}
                    onSelectFriend={onSelectFriend}
                    onDeleteFriend={onDeleteFriend}
                  />

                  {index < array.length - 1 && <Separator className="my-2" />}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

export { FriendList }
