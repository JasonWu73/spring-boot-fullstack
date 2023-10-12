import React, { Suspense, lazy, useState, useEffect } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { FriendList } from '@/components/eat-n-split/FriendList'
import { useKeypress } from '@/lib/use-keypress'
import { useTitle } from '@/lib/use-title'
import { wait } from '@/lib/utils'

// ----- Start: 测试懒加载 (React Split Code 技术) -----
const FormAddFriend = lazy(() =>
  wait(3).then(() =>
    import('@/components/eat-n-split/FormAddFriend').then((module) => ({
      default: module.FormAddFriend
    }))
  )
)
// ----- End: 测试懒加载 (React Split Code 技术) -----

function EatAndSplit() {
  useTitle('Eat & Split')

  const [showAddFriend, setShowAddFriend] = useState(false)

  const navigate = useNavigate()

  useKeypress({ key: 'Escape' }, () => {
    setShowAddFriend(false)
    navigate('/eat-split')
  })

  useAutoCloseForm(setShowAddFriend)

  function handleToggleAddFriend() {
    setShowAddFriend((prev) => !prev)
  }

  return (
    <div className="grid grid-flow-row items-center justify-center gap-6 p-4 md:mt-6 md:grid-cols-2">
      <div className="md:col-span-1 md:row-span-1 md:justify-self-end">
        <FriendList />
      </div>

      <div className="flex flex-col gap-6 self-start md:col-span-1 md:row-start-2 md:row-end-3 md:justify-self-end">
        <Suspense fallback={<Loading />}>
          {showAddFriend && <FormAddFriend />}
        </Suspense>

        <div className="self-end">
          <Button onClick={handleToggleAddFriend}>
            {showAddFriend ? 'Close' : 'Add friend'}
          </Button>
        </div>
      </div>

      <div className="md:col-start-2 md:col-end-3 md:row-span-1">
        <Outlet />
      </div>
    </div>
  )
}

function useAutoCloseForm(
  setShowAddFriend: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const closeAddFriend = searchParams.get('c') === '1'

    if (closeAddFriend) {
      setShowAddFriend(false)

      searchParams.delete('c')
      setSearchParams(searchParams)
    }
  }, [setShowAddFriend, searchParams, setSearchParams])
}

export { EatAndSplit }
