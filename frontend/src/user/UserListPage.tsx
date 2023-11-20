import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { useAuth } from '@/auth/AuthProvider'
import type { Pagination } from '@/shared/apis/backend/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import {
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  type Paging
} from '@/shared/components/ui/DataTable'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import { URL_QUERY_KEY_PAGE_NUM, URL_QUERY_KEY_PAGE_SIZE } from '@/shared/utils/constants'
import { UserSearch } from '@/user/UserSearch'
import { UserTable } from '@/user/UserTable'
import type { GetUserParams, User } from '@/user/types'

type GetUsersParams = GetUserParams & {
  pageNum: number
  pageSize: number
}

export default function UserListPage() {
  useTitle('用户列表')

  const [searchParams, setSearchParams] = useSearchParams()

  const pageNum = Number(searchParams.get(URL_QUERY_KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(URL_QUERY_KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
  const username = searchParams.get('username')
  const nickname = searchParams.get('nickname')
  const status = searchParams.get('status')
  const authority = searchParams.get('authority')

  const { requestApi } = useAuth()

  const {
    data,
    error,
    loading,
    fetchData: getUsers
  } = useFetch(async () => {
    const params: GetUsersParams = { pageNum, pageSize }
    if (username) params['username'] = username
    if (nickname) params['nickname'] = nickname
    if (status) params['status'] = status
    if (authority) params['authority'] = authority

    return await requestApi<Pagination<User>>({
      url: '/api/v1/users',
      urlParams: params
    })
  })

  useRefresh(() => {
    const ignore = getUsers()

    return () => ignore()
  })

  function handlePaginate(paging: Paging) {
    searchParams.set(URL_QUERY_KEY_PAGE_NUM, String(paging.pageNum))
    searchParams.set(URL_QUERY_KEY_PAGE_SIZE, String(paging.pageSize))

    setSearchParams(searchParams, { replace: true })
  }

  // 选中的行的索引
  const [indexes, setIndexes] = React.useState<number[]>([])

  function handleSelect(rowIndexes: number[]) {
    setIndexes(rowIndexes)
  }

  function handleShowSelection() {
    const ids = (data?.list || [])
      .filter((_, index) => indexes.includes(index))
      .map((user) => user.id)

    if (ids.length === 0) return alert('没有选中任何一行')

    alert(`被选中的行 ID(s)：${ids.join(', ')}`)
  }

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>用户列表</CardTitle>
        <CardDescription>可登录系统的所有账号信息</CardDescription>
      </CardHeader>

      <CardContent>
        <UserSearch loading={loading} />

        <UserTable
          users={data?.list || []}
          error={error}
          loading={loading}
          pageNum={pageNum}
          pageSize={pageSize}
          total={data?.total || 0}
          onPaginate={handlePaginate}
          onSelect={handleSelect}
          onShowSelection={handleShowSelection}
        />
      </CardContent>
    </Card>
  )
}
