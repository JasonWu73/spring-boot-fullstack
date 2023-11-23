import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { useAuth, type PaginationData, type PaginationParams } from '@/auth/AuthProvider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { Code } from '@/shared/components/ui/Code'
import {
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  type Paging
} from '@/shared/components/ui/DataTable'
import { useToast } from '@/shared/components/ui/use-toast'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import {
  URL_QUERY_KEY_ORDER,
  URL_QUERY_KEY_ORDER_BY,
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE
} from '@/shared/utils/constants'
import { UserSearch } from '@/user/UserSearch'
import { UserTable } from '@/user/UserTable'

type User = {
  id: number
  createdAt: string
  updatedAt: string
  remark: string
  username: string
  nickname: string
  status: number
  authorities: string[]
}

type GetUsersParams = PaginationParams & {
  username?: string
  nickname?: string
  status?: string
  authority?: string
}

function UserListPage() {
  useTitle('用户管理')

  const [searchParams, setSearchParams] = useSearchParams()

  const { requestApi } = useAuth()
  const { toast } = useToast()

  const pageNum = Number(searchParams.get(URL_QUERY_KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(URL_QUERY_KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
  const orderBy = searchParams.get(URL_QUERY_KEY_ORDER_BY) || 'createdAt'
  const order = searchParams.get(URL_QUERY_KEY_ORDER) || 'desc'
  const username = searchParams.get('username')
  const nickname = searchParams.get('nickname')
  const status = searchParams.get('status')
  const authority = searchParams.get('authority')

  const url = '/api/v1/users'

  const {
    data: users,
    error,
    loading,
    fetchData,
    discardFetch,
    updateData: updateUsers
  } = useFetch(requestApi<PaginationData<User>>)

  useRefresh(() => {
    const timestamp = Date.now()

    getUsers().then()

    return () => discardFetch({ url }, timestamp)
  })

  async function getUsers() {
    const urlParams: GetUsersParams = { pageNum, pageSize }

    if (orderBy) urlParams['orderBy'] = orderBy
    if (order) urlParams['order'] = order === 'asc' ? 'asc' : 'desc'
    if (username) urlParams['username'] = username
    if (nickname) urlParams['nickname'] = nickname
    if (status) urlParams['status'] = status
    if (authority) urlParams['authority'] = authority

    return await fetchData({ url, urlParams })
  }

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
    const ids = (users?.list || [])
      .filter((_, index) => indexes.includes(index))
      .map((user) => user.id)

    if (ids.length === 0) {
      toast({
        title: '未选中任何行',
        description: '请先选中要操作的行',
        variant: 'destructive'
      })
      return
    }

    toast({
      title: '选中的行',
      description: (
        <span>
          被选中的行 ID(s)：<Code>{ids.join(', ')}</Code>
        </span>
      )
    })
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
          users={users?.list || []}
          error={error}
          loading={loading}
          pageNum={pageNum}
          pageSize={pageSize}
          total={users?.total || 0}
          onPaginate={handlePaginate}
          onSelect={handleSelect}
          onShowSelection={handleShowSelection}
          updateUsers={updateUsers}
        />
      </CardContent>
    </Card>
  )
}

export default UserListPage

export { type User }
