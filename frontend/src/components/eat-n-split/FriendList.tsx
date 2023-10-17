import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
import { FriendSearch, SEARCH_KEY } from '@/components/eat-n-split/FriendSearch'
import { useFetch } from '@/lib/use-fetch'
import { type Friend, getFriendsApi } from '@/api/fake/friend'
import { useFriends } from '@/components/eat-n-split/FriendProvider'
import { useRefresh } from '@/lib/use-refresh'

type FriendListProps = {
  onLoadData: () => void
}

function FriendList({ onLoadData }: FriendListProps) {
  const { friends, setFriends } = useFriends()

  const { error, loading, getFriends } = useFriendsApi(friends, setFriends)

  const [searchParams] = useSearchParams()
  const name = searchParams.get(SEARCH_KEY) || ''

  const filteredFriends = name
    ? friends.filter((f) => f.name.toLowerCase().includes(name.toLowerCase()))
    : friends

  const navigate = useNavigate()

  const { toast } = useToast()

  useRefresh(() => {
    onLoadData()
    getFriends({ friends }).then()
  })

  function handleDeleteFriend(friend: Friend) {
    setFriends(friends.filter((f) => f.id !== friend.id))

    toast({
      title: '删除好友',
      description: `成功删除好友：${friend.name}`
    })

    navigate('/eat-split')
  }

  return (
    <>
      <FriendSearch />

      <Card>
        <ScrollArea className="h-96 w-96 md:h-[30rem] md:w-[22rem] lg:h-[24rem] lg:w-[30rem]">
          <div className="space-y-4 p-4">
            {loading && (
              <Alert>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                <AlertTitle>加载中...</AlertTitle>
                <AlertDescription>好友列表加载中</AlertDescription>
              </Alert>
            )}

            {!loading && error && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && filteredFriends.length === 0 && (
              <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>温馨提示！</AlertTitle>
                <AlertDescription>
                  还没有好友，添加好友即可分摊账单
                </AlertDescription>
              </Alert>
            )}

            {!loading && filteredFriends.length > 0 && (
              <ul>
                {filteredFriends.map((f, i, arr) => (
                  <React.Fragment key={f.id}>
                    <FriendItem
                      friend={f}
                      onDeleteFriend={handleDeleteFriend}
                    />

                    {i < arr.length - 1 && <Separator className="my-2" />}
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

type GetFriendsParams = {
  friends?: Friend[]
}

function useFriendsApi(
  initialFriends: Friend[],
  setFriends: (friends: Friend[]) => void
) {
  const {
    error,
    loading,
    fetchData: getFriends
  } = useFetch<Friend[], GetFriendsParams>(async (params, signal) => {
    const { data, error } = await getFriendsApi(signal)

    if (error) {
      return { data: null, error }
    }

    const friends = params?.friends ?? initialFriends

    if (friends.length === 0 && data) {
      setFriends(data)
    }

    return { data, error }
  })

  return { error, loading, getFriends }
}

export { FriendList }
