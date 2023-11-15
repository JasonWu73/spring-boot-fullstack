import { ExclamationTriangleIcon, ReloadIcon, RocketIcon } from '@radix-ui/react-icons'
import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/Alert'
import { Card } from '@/shared/components/ui/Card'
import { ScrollArea } from '@/shared/components/ui/ScrollArea'
import { Separator } from '@/shared/components/ui/Separator'
import { useToast } from '@/shared/components/ui/use-toast'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { type Friend } from '@/shared/services/fake/friend-api'
import { URL_QUERY_KEY_QUERY } from '@/shared/utils/constants'
import { FriendItem } from '@/split-bill/FriendItem'
import { useFriends } from '@/split-bill/FriendProvider'
import { FriendSearch } from '@/split-bill/FriendSearch'

function FriendList() {
  // 因为是假 API，所以会导致 loading 时还是显示上次的数据，为了避免页面闪烁，所以这里需要重置一下
  const ctx = useFriends()
  const { loadingFriends: loading, getFriends, deleteFriend, setShowAddFriend } = ctx
  let { friends, errorFriends: error } = ctx

  if (loading) {
    error = ''
    friends = []
  }

  const [searchParams] = useSearchParams()

  const nameQuery = searchParams.get(URL_QUERY_KEY_QUERY) || ''
  const filteredFriends = nameQuery
    ? friends.filter((friend) =>
        friend.name.toLowerCase().includes(nameQuery.toLowerCase())
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
    const abort = getFriends()

    return () => abort()
  })

  const { toast } = useToast()
  const navigate = useNavigate()

  function handleDeleteFriend(friend: Friend) {
    deleteFriend(friend.id)

    toast({
      title: '删除好友',
      description: `成功删除好友：${friend.name}`
    })

    navigate(`/split-bill${window.location.search}`, {
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
                <AlertDescription>还没有好友，添加好友即可分摊账单</AlertDescription>
              </Alert>
            )}

            {filteredFriends.length > 0 && (
              <ul>
                {filteredFriends.map((item, index, array) => (
                  <React.Fragment key={item.id}>
                    <FriendItem friend={item} onDeleteFriend={handleDeleteFriend} />

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

export { FriendList }
