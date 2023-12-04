import React from 'react'
import { useSearchParams } from 'react-router-dom'

import type { PaginationData, PaginationParams } from '@/shared/apis/types'
import { useAuth } from '@/shared/auth/AuthProvider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { Code } from '@/shared/components/ui/Code'
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE } from '@/shared/components/ui/DataTable'
import { useToast } from '@/shared/components/ui/use-toast'
import {
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE,
  URL_QUERY_KEY_SORT_COLUMN,
  URL_QUERY_KEY_SORT_ORDER
} from '@/shared/constants'
import { useApi } from '@/shared/hooks/use-api'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import { UserSearch } from '@/user/UserSearch'
import { UserTable } from '@/user/UserTable'

export type User = {
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

export default function UserListPage() {
  useTitle('用户管理')

  const [searchParams] = useSearchParams()
  const [indexes, setIndexes] = React.useState<number[]>([]) // 选中的行的索引

  const { requestApi } = useAuth()
  const {
    data: userPaging,
    error,
    loading,
    requestData,
    discardRequest,
    updateState
  } = useApi(requestApi<PaginationData<User>>)
  const { toast } = useToast()

  const url = '/api/v1/users'

  useRefresh(() => {
    const timestamp = Date.now()

    getUsers().then()

    return () => discardRequest({ url }, timestamp)
  })

  const pageNum = Number(searchParams.get(URL_QUERY_KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(URL_QUERY_KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE

  async function getUsers() {
    const urlParams: GetUsersParams = { pageNum, pageSize }

    const sortColumn = searchParams.get(URL_QUERY_KEY_SORT_COLUMN) || 'createdAt'
    const sortOrder = searchParams.get(URL_QUERY_KEY_SORT_ORDER) || 'desc'
    const username = searchParams.get('username')
    const nickname = searchParams.get('nickname')
    const status = searchParams.get('status')
    const authority = searchParams.get('authority')

    if (sortColumn) urlParams.sortColumn = sortColumn
    if (sortOrder) urlParams.sortOrder = sortOrder === 'asc' ? 'asc' : 'desc'
    if (username) urlParams.username = username
    if (nickname) urlParams.nickname = nickname
    if (status) urlParams.status = status
    if (authority) urlParams.authority = authority

    return await requestData({ url, urlParams })
  }

  function handleShowSelection() {
    const ids = (userPaging?.list || [])
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
        <CardTitle>用户管理</CardTitle>
        <CardDescription>可登录系统的所有账号信息</CardDescription>
      </CardHeader>

      <CardContent>
        <UserSearch loading={loading} />

        <UserTable
          users={userPaging?.list || []}
          error={error}
          loading={loading}
          pageNum={pageNum}
          pageSize={pageSize}
          total={userPaging?.total || 0}
          onSelect={setIndexes}
          onShowSelection={handleShowSelection}
          updateState={updateState}
        />
      </CardContent>
    </Card>
  )
}
