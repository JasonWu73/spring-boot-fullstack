import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
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
import { FriendSearch, KEY_SEARCH } from '@/components/eat-n-split/FriendSearch'
import { type Friend } from '@/api/fake/friend'
import { useFriends } from '@/components/eat-n-split/FriendProvider'
import { useRefresh } from '@/hooks/use-refresh'

function FriendList() {
  const {
    friends,
    errorFriends: error,
    loadingFriends: loading,
    fetchFriends,
    deleteFriend
  } = useFriends()

  const [searchParams] = useSearchParams()
  const nameQuery = searchParams.get(KEY_SEARCH)

  const filteredFriends = nameQuery
    ? friends.filter((f) =>
        f.name.toLowerCase().includes(nameQuery.toLowerCase())
      )
    : friends

  const location = useLocation()

  useRefresh(() => {
    if (nameQuery !== null || location.state?.noRefresh === true) {
      return
    }

    const controller = fetchFriends()

    return () => {
      controller.abort()
    }
  })

  const { toast } = useToast()

  const navigate = useNavigate()

  function handleDeleteFriend(friend: Friend) {
    deleteFriend(friend.id)

    toast({
      title: '删除好友',
      description: `成功删除好友：${friend.name}`
    })

    navigate(`/eat-split${window.location.search}`, {
      replace: true,
      state: { noRefresh: true }
    })
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

export { FriendList }
