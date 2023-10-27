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
import { FriendItem } from '@/components/eat-split/FriendItem'
import { FriendSearch } from '@/components/eat-split/FriendSearch'
import { type Friend } from '@/api/fake/friend'
import { useFriends } from '@/components/eat-split/FriendContext'
import { useRefresh } from '@/hooks/use-refresh'
import { KEY_QUERY } from '@/lib/constants'

function FriendList() {
  // 因为是 API，所以会导致 loading 时还是显示上次的数据，为了避免页面闪烁，所以这里需要重置一下
  const friendsContext = useFriends()

  const {
    loadingFriends: loading,
    fetchFriends,
    deleteFriend,
    setShowAddFriend
  } = friendsContext

  let { friends, errorFriends: error } = friendsContext

  if (loading) {
    error = ''
    friends = []
  }

  const [searchParams] = useSearchParams()
  const nameQuery = searchParams.get(KEY_QUERY) || ''

  const filteredFriends = nameQuery
    ? friends.filter((f) =>
        f.name.toLowerCase().includes(nameQuery.toLowerCase())
      )
    : friends

  const location = useLocation()

  useRefresh(() => {
    if (location.state?.noRefresh === true) {
      // 重置为可刷新，解决 F5 刷新时，无法刷新的问题
      if (location.state) {
        location.state.noRefresh = false
      }

      return
    }

    setShowAddFriend(false)

    const abort = fetchFriends()

    return () => {
      abort()
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

            {error && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && filteredFriends.length === 0 && (
              <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>温馨提示！</AlertTitle>
                <AlertDescription>
                  还没有好友，添加好友即可分摊账单
                </AlertDescription>
              </Alert>
            )}

            {filteredFriends.length > 0 && (
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
