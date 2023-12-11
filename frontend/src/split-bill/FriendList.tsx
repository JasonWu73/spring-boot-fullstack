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
import { URL_QUERY_KEY_QUERY } from '@/shared/constants'
import { useApi } from '@/shared/hooks/use-api'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import {
  deleteFriend,
  friends,
  setFriends,
  showAddFriend,
  type Friend
} from '@/shared/signal/split-bill'
import { FriendItem } from '@/split-bill/FriendItem'
import { FriendSearch } from '@/split-bill/FriendSearch'

export function FriendList() {
  useTitle('好友列表')

  const location = useLocation()

  useRefresh(() => {
    if (location.state?.noRefresh === true) {
      // 重置为可刷新，解决 F5 刷新时，无法刷新的问题
      if (location.state) {
        location.state.noRefresh = false
      }
      return
    }

    showAddFriend.value = false

    getFriends().then(({ data }) => {
      if (data) {
        setFriends(data)
      }
    })
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const nameQuery = searchParams.get(URL_QUERY_KEY_QUERY) || ''
  const filteredFriends = nameQuery
    ? friends.value.filter((friend) =>
        friend.name.toLowerCase().includes(nameQuery.toLowerCase())
      )
    : friends.value

  const { apiState, requestData } = useApi(requestApi<Friend[]>)
  const { loading, error } = apiState.value

  const { toast } = useToast()
  const navigate = useNavigate()

  async function getFriends() {
    return await requestData({ url: '/data/friends.json' })
  }

  function handleDeleteFriend(friend: Friend) {
    deleteFriend(friend.id)

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

  function handleSearch(name: string) {
    searchParams.delete(URL_QUERY_KEY_QUERY)

    if (name) searchParams.set(URL_QUERY_KEY_QUERY, name)

    setSearchParams(searchParams, {
      replace: true,
      state: { noRefresh: true }
    })
  }

  function handleEscape() {
    searchParams.delete(URL_QUERY_KEY_QUERY)

    setSearchParams(searchParams, {
      replace: true,
      state: { noRefresh: true }
    })
  }

  return (
    <>
      <FriendSearch
        nameQuery={nameQuery}
        onSearch={handleSearch}
        onEscape={handleEscape}
      />

      <Card>
        <ScrollArea className="h-80">
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
