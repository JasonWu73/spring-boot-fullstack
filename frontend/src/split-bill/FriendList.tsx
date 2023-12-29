import { ExclamationTriangleIcon, ReloadIcon, RocketIcon } from '@radix-ui/react-icons'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { getFriendsApi } from '@/shared/apis/local/friend'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/Alert'
import { Card } from '@/shared/components/ui/Card'
import { Code } from '@/shared/components/ui/Code'
import { ScrollArea } from '@/shared/components/ui/ScrollArea'
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
} from '@/split-bill/split-bill-signals'
import { FriendItem } from '@/split-bill/FriendItem'
import { FriendSearch } from '@/split-bill/FriendSearch'

export function FriendList() {
  useTitle('好友列表')

  const [searchParams] = useSearchParams()
  const nameQuery = searchParams.get(URL_QUERY_KEY_QUERY) || ''

  const friends = getFriends()
  const filteredFriends = nameQuery
    ? friends.filter((friend) =>
        friend.name.toLowerCase().includes(nameQuery.toLowerCase())
      )
    : friends

  const { loading, error, fetchData: getFriendsLocalApi } = useFetch(getFriendsApi)

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

    getFriendsLocalApi(null).then(({ data }) => {
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

    navigate(`/split-bill${location.search}`, {
      replace: true,
      state: { noRefresh: true }
    })
  }

  return (
    <>
      <FriendSearch />

      <Card>
        <ScrollArea className="h-80">
          <div className="space-y-4 p-4">
            {loading && (
              <Alert>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                <AlertTitle>加载中...</AlertTitle>
                <AlertDescription>数据加载中</AlertDescription>
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
              <ul className="divide-y divide-solid divide-slate-200 dark:divide-slate-700">
                {filteredFriends.map((friend) => (
                  <FriendItem
                    key={friend.id}
                    friend={friend}
                    onDeleteFriend={handleDeleteFriend}
                  />
                ))}
              </ul>
            )}
          </div>
        </ScrollArea>
      </Card>
    </>
  )
}
