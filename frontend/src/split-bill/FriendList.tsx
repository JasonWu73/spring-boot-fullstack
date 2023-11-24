import { ExclamationTriangleIcon, ReloadIcon, RocketIcon } from '@radix-ui/react-icons'
import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { requestApi } from '@/shared/apis/local-api'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/Alert'
import { Card } from '@/shared/components/ui/Card'
import { Code } from '@/shared/components/ui/Code'
import { ScrollArea } from '@/shared/components/ui/ScrollArea'
import { Separator } from '@/shared/components/ui/Separator'
import { useToast } from '@/shared/components/ui/use-toast'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import { URL_QUERY_KEY_QUERY } from '@/shared/utils/constants'
import { FriendItem } from '@/split-bill/FriendItem'
import { useFriends, type Friend } from '@/split-bill/FriendProvider'
import { FriendSearch } from '@/split-bill/FriendSearch'

function FriendList() {
  useTitle('好友列表')

  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const { friends, dispatch } = useFriends()
  const { error, loading, fetchData, discardFetch } = useFetch(requestApi<Friend[]>)
  const { toast } = useToast()

  const nameQuery = searchParams.get(URL_QUERY_KEY_QUERY) || ''
  const filteredFriends = nameQuery
    ? friends.filter((friend) =>
        friend.name.toLowerCase().includes(nameQuery.toLowerCase())
      )
    : friends
  const url = '/data/friends.json'

  useRefresh(() => {
    if (location.state?.noRefresh === true) {
      // 重置为可刷新，解决 F5 刷新时，无法刷新的问题
      if (location.state) {
        location.state.noRefresh = false
      }

      return
    }

    dispatch({ type: 'SHOW_ADD_FRIEND_FORM', payload: false })

    const timestamp = Date.now()

    getFriends().then(({ data, error }) => {
      if (error) {
        dispatch({ type: 'SET_FRIENDS', payload: [] })

        return
      }

      if (data) {
        dispatch({ type: 'SET_FRIENDS', payload: data })
      }
    })

    return () => discardFetch({ url }, timestamp)
  })

  async function getFriends() {
    return await fetchData({ url })
  }

  function handleDeleteFriend(friend: Friend) {
    dispatch({ type: 'DELETE_FRIEND', payload: friend.id })

    toast({
      title: '删除好友',
      description: (
        <span>
          成功删除好友 <Code>{friend.name}</Code>
        </span>
      )
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

            {!loading && error && (
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

            {!loading && !error && filteredFriends.length > 0 && (
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
