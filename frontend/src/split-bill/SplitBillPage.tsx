import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/shared/components/ui/Button'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useKeypress } from '@/shared/hooks/use-keypress'
import { useTitle } from '@/shared/hooks/use-title'
import { wait } from '@/shared/utils/helpers'
import { FriendList } from '@/split-bill/FriendList'
import { useFriends } from '@/split-bill/FriendProvider'

// ----- 测试懒加载（React Split Code）-----
const AddFriend = React.lazy(() =>
  wait(2).then(() =>
    import('@/split-bill/AddFriend').then((module) => ({
      default: module.AddFriend
    }))
  )
)

export default function SplitBillPage() {
  useTitle('分摊账单')

  const { showAddFriend, setShowAddFriend } = useFriends()

  const navigate = useNavigate()

  useKeypress({ key: 'Escape' }, () => {
    setShowAddFriend(false)
    navigate('/split-bill', { state: { noRefresh: true } })
  })

  function handleToggleAddFriend() {
    setShowAddFriend(!showAddFriend)
  }

  return (
    <div className="grid grid-flow-row items-center justify-center gap-6 p-4 md:mt-6 md:grid-cols-2">
      <div className="md:col-span-1 md:row-span-1 md:justify-self-end">
        <FriendList />
      </div>

      <div className="flex flex-col gap-6 self-start md:col-span-1 md:row-start-2 md:row-end-3 md:justify-self-end">
        <React.Suspense fallback={<Spinner />}>
          {showAddFriend && <AddFriend />}
        </React.Suspense>

        <div className="self-end">
          <Button onClick={handleToggleAddFriend}>
            {showAddFriend ? '关闭' : '添加好友'}
          </Button>
        </div>
      </div>

      <div className="md:col-start-2 md:col-end-3 md:row-span-1">
        <Outlet />
      </div>
    </div>
  )
}
