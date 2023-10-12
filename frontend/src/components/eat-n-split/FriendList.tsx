import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ExclamationTriangleIcon,
  ReloadIcon,
  RocketIcon
} from '@radix-ui/react-icons'

import { Separator } from '@/components/ui/Separator'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Card } from '@/components/ui/Card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/use-toast'
import { FriendItem } from '@/components/eat-n-split/FriendItem'
import { useLocalStorageState } from '@/lib/use-storage'
import { useFetch } from '@/lib/use-fetch'
import { type Friend, getFriendsApi } from '@/api/fake/friend-api'
import { InputSearchFriend } from '@/components/eat-n-split/InputSearchFriend'

function FriendList() {
  const [friends, setFriends] = useLocalStorageState<Friend[]>('friends', [])

  const {
    error,
    loading,
    fetchData: getFriends
  } = useFetch(async (_, signal) => {
    const { data, error } = await getFriendsApi(signal)

    const storedFriends = localStorage.getItem('friends')

    if (storedFriends) {
      setFriends(JSON.parse(storedFriends))
    }

    if (!storedFriends && data) {
      setFriends(data)
    }

    return { data, error }
  }, friends.length === 0)

  useRefreshFriends(getFriends)

  const [searchParams] = useSearchParams()
  const name = searchParams.get('s') || ''

  const filteredFriends = name
    ? friends.filter((friend) =>
        friend.name.toLowerCase().includes(name.toLowerCase())
      )
    : friends

  const { toast } = useToast()

  function handleDeleteFriend(friend: Friend) {
    setFriends((prev) => prev.filter((prev) => prev.id !== friend.id))

    toast({
      title: 'Friend deleted',
      description: `${friend.name} was deleted`
    })
  }

  return (
    <>
      <InputSearchFriend />

      <Card>
        <ScrollArea className="h-96 w-96 md:h-[30rem] md:w-[22rem] lg:h-[24rem] lg:w-[30rem]">
          <div className="space-y-4 p-4">
            {loading && (
              <Alert>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                <AlertTitle>Loading...</AlertTitle>
                <AlertDescription>
                  Fetching friends from server.
                </AlertDescription>
              </Alert>
            )}

            {!loading && error && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && filteredFriends.length === 0 && (
              <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  No friends yet. Add a friend to split a bill.
                </AlertDescription>
              </Alert>
            )}

            {!loading && filteredFriends.length > 0 && (
              <ul>
                {filteredFriends.map((value, index, array) => (
                  <React.Fragment key={value.id}>
                    <FriendItem
                      friend={value}
                      onDeleteFriend={handleDeleteFriend}
                    />

                    {index < array.length - 1 && <Separator className="my-2" />}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>
        </ScrollArea>
      </Card>
    </>
  )
}

function useRefreshFriends(
  getFriends: (
    values?: unknown,
    controller?: AbortController | undefined
  ) => Promise<void>
) {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const closeAddFriend = searchParams.get('c') === '1'

    if (closeAddFriend) {
      getFriends().then()
    }
  }, [searchParams, getFriends])
}

export { FriendList }
