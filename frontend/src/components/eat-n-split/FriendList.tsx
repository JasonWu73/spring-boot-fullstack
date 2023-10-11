import React from 'react'
import {
  ExclamationTriangleIcon,
  ReloadIcon,
  RocketIcon
} from '@radix-ui/react-icons'

import { Separator } from '@/components/ui/Separator'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Card } from '@/components/ui/Card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { FriendItem } from '@/components/eat-n-split/FriendItem'
import { type Friend } from '@/api/fake/friend-api'

type FriendListProps = {
  error: string
  loading: boolean
  friends: Friend[]
  selectedFriend: Friend | null
  onSelectFriend: (friend: Friend) => void
  onDeleteFriend: (friend: Friend) => void
}

function FriendList({
  error,
  loading,
  friends,
  selectedFriend,
  onSelectFriend,
  onDeleteFriend
}: FriendListProps) {
  return (
    <Card>
      <ScrollArea className="h-96 w-96 md:h-[30rem] md:w-[22rem] lg:h-[24rem] lg:w-[30rem]">
        <div className="space-y-4 p-4">
          {loading && (
            <Alert>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              <AlertTitle>Loading...</AlertTitle>
              <AlertDescription>Fetching friends from server.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && friends.length === 0 && (
            <Alert>
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                No friends yet. Add a friend to split a bill.
              </AlertDescription>
            </Alert>
          )}

          {!loading && friends.length > 0 && (
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
