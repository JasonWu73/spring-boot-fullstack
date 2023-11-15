import React from 'react'
import { useSearchParams } from 'react-router-dom'

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
import { getUsersApi } from '@/shared/services/dummyjson/user-api'
import {
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE,
  URL_QUERY_KEY_QUERY
} from '@/shared/utils/constants'
import { UserSearch } from '@/user/UserSearch'
import { UserTable } from '@/user/UserTable'

export default function UserListPage() {
  useTitle('用户列表')

  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = Number(searchParams.get(URL_QUERY_KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(URL_QUERY_KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
  const query = searchParams.get(URL_QUERY_KEY_QUERY) || ''

  const { data: users, error, loading, fetchData: getUsers } = useFetch(getUsersApi)

  useRefresh(() => {
    const abort = getUsers({ pageNum, pageSize, query })

    return () => abort()
  })

  function handlePaginate(paging: Paging) {
    searchParams.set(URL_QUERY_KEY_PAGE_NUM, String(paging.pageNum))
    searchParams.set(URL_QUERY_KEY_PAGE_SIZE, String(paging.pageSize))

    setSearchParams(searchParams, { replace: true })
  }

  function handleSearch(query: string) {
    setSearchParams({ [URL_QUERY_KEY_QUERY]: query }, { replace: true })
  }

  // 选中的行的索引
  const [indexes, setIndexes] = React.useState<number[]>([])

  function handleSelect(rowIndexes: number[]) {
    setIndexes(rowIndexes)
  }

  function handleShowSelection() {
    const ids = (users?.users || [])
      .filter((_, index) => indexes.includes(index))
      .map((user) => user.id)
    if (ids.length === 0) return alert('没有选中任何一行')

    alert(`被选中的行 ID(s)：${ids.join(', ')}`)
  }

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>用户列表</CardTitle>
        <CardDescription>来自 dummyJSON 的用户数据</CardDescription>
      </CardHeader>

      <CardContent>
        <UserSearch onSearch={handleSearch} loading={loading} />

        <UserTable
          users={users?.users || []}
          error={error}
          loading={loading}
          pageNum={pageNum}
          pageSize={pageSize}
          pageCount={Math.ceil((users?.total || 0) / pageSize)}
          onPaginate={handlePaginate}
          onSelect={handleSelect}
          onShowSelection={handleShowSelection}
        />
      </CardContent>
    </Card>
  )
}
