import type { SortingState } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useSearchParams } from 'react-router-dom'

import type { PaginationData, PaginationParams } from '@/shared/apis/types'
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
import {
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE,
  URL_QUERY_KEY_SORT_COLUMN,
  URL_QUERY_KEY_SORT_ORDER
} from '@/shared/constants'
import { useApi } from '@/shared/hooks/use-api'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import { requestApi } from '@/shared/signal/auth'
import { UserSearch, type QueryParams } from '@/user/UserSearch'
import { UserTable } from '@/user/UserTable'
import { useSignal } from '@preact/signals-react'

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

  useRefresh(() => {
    getUsers().then()
  })

  const { apiState: pagingState, requestData: requestPaging } = useApi(
    requestApi<PaginationData<User>>
  )
  const { loading, data: userPaging } = pagingState.value

  const { apiState: submitState, requestData: requestSubmit } = useApi(requestApi<void>)
  const { loading: submitting } = submitState.value

  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = Number(searchParams.get(URL_QUERY_KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(URL_QUERY_KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
  const sortColumn = searchParams.get(URL_QUERY_KEY_SORT_COLUMN) || 'createdAt'
  const sortOrder = searchParams.get(URL_QUERY_KEY_SORT_ORDER) || 'desc'
  const username = searchParams.get('username') || ''
  const nickname = searchParams.get('nickname') || ''
  const status = searchParams.get('status') || ''
  const authority = searchParams.get('authority') || ''

  const { toast } = useToast()

  const indexes = useSignal<number[]>([]) // 选中的行的索引

  async function getUsers() {
    const urlParams: GetUsersParams = { pageNum, pageSize }

    if (sortColumn) urlParams.sortColumn = sortColumn
    if (sortOrder) urlParams.sortOrder = sortOrder === 'asc' ? 'asc' : 'desc'
    if (username) urlParams.username = username
    if (nickname) urlParams.nickname = nickname
    if (status) urlParams.status = status
    if (authority) urlParams.authority = authority

    return await requestPaging({ url: '/api/v1/users', urlParams })
  }

  function handleShowSelection() {
    const ids = (userPaging?.list || [])
      .filter((_, index) => indexes.value.includes(index))
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

  async function changeStatus(userId: number, status: number) {
    return await requestSubmit({
      url: `/api/v1/users/${userId}/status`,
      method: 'PUT',
      bodyData: { status }
    })
  }

  async function deleteUser(userId: number) {
    return await requestSubmit({
      url: `/api/v1/users/${userId}`,
      method: 'DELETE'
    })
  }

  async function handleChangeStatus(user: User, enabled: boolean) {
    const newStatus = enabled ? 0 : 1
    const { status, error } = await changeStatus(user.id, newStatus)

    if (status !== 204) {
      toast({
        title: '更新账号状态失败',
        description: error,
        variant: 'destructive'
      })
      return
    }

    pagingState.value = {
      ...pagingState.value,
      data: {
        ...pagingState.value.data!,
        list: pagingState.value.data!.list.map((prevUser) => {
          if (prevUser.id === user.id) {
            prevUser.status = newStatus
            prevUser.updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          }

          return prevUser
        })
      }
    }

    toast({
      title: '更新账号状态成功',
      description: (
        <span>
          {!enabled ? '启用' : '禁用'} <Code>{user.username}</Code> 账号
        </span>
      )
    })
  }

  async function handleDeleteUser(user: User) {
    const { id, username } = user
    const { status, error } = await deleteUser(id)

    if (status !== 204) {
      toast({
        title: '删除用户失败',
        description: error,
        variant: 'destructive'
      })
      return
    }

    pagingState.value = {
      ...pagingState.value,
      data: {
        ...pagingState.value.data!,
        total: pagingState.value.data!.total - 1,
        list: pagingState.value.data!.list.filter((prevUser) => prevUser.id !== id)
      }
    }

    toast({
      title: '删除用户成功',
      description: (
        <span>
          成功删除用户 <Code>{username}</Code>
        </span>
      )
    })
    return
  }

  function handlePaginate(paging: Paging) {
    searchParams.set(URL_QUERY_KEY_PAGE_NUM, String(paging.pageNum))
    searchParams.set(URL_QUERY_KEY_PAGE_SIZE, String(paging.pageSize))

    setSearchParams(searchParams, { replace: true })
  }

  const handleSorting = (sorting: SortingState) => {
    searchParams.delete('createdAt')
    searchParams.delete('updatedAt')

    const sortColumn = sorting[0]?.id === '更新时间' ? 'updatedAt' : 'createdAt'
    const sortOrder = sorting[0]?.desc === true ? 'desc' : 'asc'

    if (!sortColumn) return

    searchParams.set(URL_QUERY_KEY_SORT_COLUMN, sortColumn)
    searchParams.set(URL_QUERY_KEY_SORT_ORDER, sortOrder)

    setSearchParams(searchParams)
  }

  function handleSearch(params: QueryParams) {
    searchParams.delete(URL_QUERY_KEY_PAGE_NUM)
    searchParams.delete(URL_QUERY_KEY_PAGE_SIZE)
    searchParams.delete('username')
    searchParams.delete('nickname')
    searchParams.delete('status')
    searchParams.delete('authority')

    const { username, nickname, status, authority } = params

    if (username) searchParams.set('username', username)
    if (nickname) searchParams.set('nickname', nickname)
    if (status) searchParams.set('status', status)
    if (authority) searchParams.set('authority', authority)

    setSearchParams(searchParams, { replace: true })
  }

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>用户管理</CardTitle>
        <CardDescription>可登录系统的所有账号信息</CardDescription>
      </CardHeader>

      <CardContent>
        <UserSearch
          queryParams={{
            username,
            nickname,
            status,
            authority
          }}
          loading={loading}
          onSearch={handleSearch}
        />

        <UserTable
          paging={{ pageNum, pageSize }}
          pagingState={pagingState}
          submitting={submitting}
          onPaginate={handlePaginate}
          sortColumn={{
            id:
              searchParams.get(URL_QUERY_KEY_SORT_COLUMN) === 'updatedAt'
                ? '更新时间'
                : '创建时间',
            desc: searchParams.get(URL_QUERY_KEY_SORT_ORDER) !== 'asc'
          }}
          onSorting={handleSorting}
          onSelect={(rowIndexes) => (indexes.value = rowIndexes)}
          onShowSelection={handleShowSelection}
          onChangeStatus={handleChangeStatus}
          onDeleteUser={handleDeleteUser}
        />
      </CardContent>
    </Card>
  )
}
