import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/shared/components/ui/Button'
import { Loading } from '@/shared/components/ui/Loading'
import { useKeypress } from '@/shared/hooks/use-keypress'
import { useTitle } from '@/shared/hooks/use-title'
import { createSplitBillState, showAddFriend } from '@/shared/signal/split-bill'
import { wait } from '@/shared/utils/helpers'
import { FriendList } from '@/split-bill/FriendList'

// ----- 测试懒加载（React Split Code）-----
const AddFriend = React.lazy(() =>
  wait(2).then(() =>
    import('@/split-bill/AddFriend').then((module) => ({
      default: module.AddFriend
    }))
  )
)

export default function SplitBillPage() {
  useTitle('分账 App')

  createSplitBillState()

  const navigate = useNavigate()

  useKeypress({ key: 'Escape' }, () => {
    showAddFriend.value = false

    navigate('/split-bill', { state: { noRefresh: true } })
  })

  function handleToggleAddFriend() {
    showAddFriend.value = !showAddFriend.value
  }

  return (
    <div className="grid grid-flow-row items-center justify-center gap-6 md:grid-cols-2">
      <div className="w-full max-w-md md:col-span-1 md:row-span-1 md:justify-self-end">
        <FriendList />
      </div>

      <div className="flex w-full flex-col gap-6 self-start md:col-span-1 md:row-start-2 md:row-end-3 md:justify-self-end">
        <div className="w-full max-w-md self-end">
          <React.Suspense fallback={<Loading />}>
            {showAddFriend.value && <AddFriend />}
          </React.Suspense>
        </div>

        <div className="self-end">
          <Button onClick={handleToggleAddFriend}>
            {showAddFriend.value ? '关闭' : '添加好友'}
          </Button>
        </div>
      </div>

      <div className="max-w-md md:col-start-2 md:col-end-3 md:row-span-1">
        <Outlet />
      </div>
    </div>
  )
}
