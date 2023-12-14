import { ExclamationTriangleIcon, ReloadIcon, RocketIcon } from '@radix-ui/react-icons'
import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { getLocalFriends } from '@/shared/apis/local/friend'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/Alert'
import { Card } from '@/shared/components/ui/Card'
import { Code } from '@/shared/components/ui/Code'
import { ScrollArea } from '@/shared/components/ui/ScrollArea'
import { Separator } from '@/shared/components/ui/Separator'
import { useToast } from '@/shared/components/ui/use-toast'
import { URL_QUERY_KEY_QUERY } from '@/shared/constants'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import {
  deleteFriend,
  getFriends,
  setFriends,
  setShowAddFriend,
  type Friend
} from '@/shared/signals/split-bill'
import { FriendItem } from '@/split-bill/FriendItem'
import { FriendSearch } from '@/split-bill/FriendSearch'

export function FriendList() {
  useTitle('好友列表')

  const [searchParams, setSearchParams] = useSearchParams()
  const nameQuery = searchParams.get(URL_QUERY_KEY_QUERY) || ''

  const friends = getFriends()
  const filteredFriends = nameQuery
    ? friends.filter((friend) =>
        friend.name.toLowerCase().includes(nameQuery.toLowerCase())
      )
    : friends

  const { loading, error, fetchData: getFriendsFromApi } = useFetch(getLocalFriends)

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

    getFriendsFromApi(null).then(({ data }) => {
      if (data) {
        setFriends(data)
      }
    })
  })

  const { toast } = useToast()
  const navigate = useNavigate()

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

  function handleFocus() {
    setShowAddFriend(false)

    navigate(`/split-bill${window.location.search}`, {
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
        onFocus={handleFocus}
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
