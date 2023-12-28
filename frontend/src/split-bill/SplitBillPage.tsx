import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/shared/components/ui/Button'
import { Loading } from '@/shared/components/ui/Loading'
import { useKeypress } from '@/shared/hooks/use-keypress'
import { useTitle } from '@/shared/hooks/use-title'
import {
  createSplitBillState,
  getShowAddFriend,
  setShowAddFriend
} from '@/split-bill/split-bill'
import { wait } from '@/shared/utils/helpers'
import { FriendList } from '@/split-bill/FriendList'

// 测试 React 懒加载非 `default` 导出的组件
const AddFriend = React.lazy(() =>
  wait(2).then(() =>
    import('@/split-bill/AddFriend').then((module) => ({
      default: module.AddFriend
    }))
  )
)

// 创建组件外 Signal
createSplitBillState()

export default function SplitBillPage() {
  useTitle('分账 App')

  const navigate = useNavigate()

  useKeypress({ key: 'Escape' }, () => {
    setShowAddFriend(false)

    navigate('/split-bill', { state: { noRefresh: true } })
  })

  const showAddFriend = getShowAddFriend()

  function handleToggleAddFriend() {
    setShowAddFriend(!showAddFriend)
  }

  return (
    <div className="grid grid-flow-row items-center justify-center gap-6 md:grid-cols-2">
      <div className="w-full max-w-md md:col-span-1 md:row-span-1 md:justify-self-end">
        <FriendList />
      </div>

      <div className="flex w-full flex-col gap-6 self-start md:col-span-1 md:row-start-2 md:row-end-3 md:justify-self-end">
        <div className="w-full max-w-md self-end">
          <React.Suspense fallback={<Loading />}>
            {showAddFriend && <AddFriend />}
          </React.Suspense>
        </div>

        <div className="self-end">
          <Button onClick={handleToggleAddFriend}>
            {showAddFriend ? '关闭' : '添加好友'}
          </Button>
        </div>
      </div>

      <div className="max-w-md md:col-start-2 md:col-end-3 md:row-span-1">
        <Outlet />
      </div>
    </div>
  )
}
