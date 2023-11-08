import { Suspense, lazy } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/ui/shadcn-ui/Button'
import { Spinner } from '@/ui/Spinner'
import { FriendList } from '@/features/eat-split/FriendList'
import { useKeypress } from '@/hooks/use-keypress'
import { useTitle } from '@/hooks/use-title'
import { wait } from '@/utils/helpers'
import { useFriends } from '@/features/eat-split/FriendContext'

// ----- 开始：测试懒加载（React Split Code 技术）-----
const FormAddFriend = lazy(() =>
  wait(2).then(() =>
    import('@/features/eat-split/FormAddFriend').then((module) => ({
      default: module.FormAddFriend
    }))
  )
)
// ----- 结束：测试懒加载（React Split Code 技术）-----

export default function EatAndSplit() {
  useTitle('Eat & Split')

  const { showAddFriend, setShowAddFriend } = useFriends()

  const navigate = useNavigate()

  useKeypress({ key: 'Escape' }, () => {
    setShowAddFriend(false)

    navigate('/eat-split', { state: { noRefresh: true } })
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
        <Suspense fallback={<Spinner />}>
          {showAddFriend && <FormAddFriend />}
        </Suspense>

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
