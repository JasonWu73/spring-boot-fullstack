import { useSearchParams } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { useFetch } from '@/hooks/use-fetch'
import { getUsersApi, type User } from '@/api/dummyjson/user'
import { useRefresh } from '@/hooks/use-refresh'
import { DataTable } from '@/components/ui/DataTable'

const KEY_PAGE_NUM = 'p'
const KEY_PAGE_SIZE = 's'
const KEY_QUERY = 'q'

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10

function UserList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = Number(searchParams.get(KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
  const query = searchParams.get(KEY_QUERY) || ''

  const {
    data: fetchedUsers,
    error,
    loading,
    fetchData: fetchUsers,
    reset: resetFetchUsers
  } = useFetch(getUsersApi)

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'fullName',
      header: '全名'
    },
    {
      accessorKey: 'username',
      header: '用户名'
    },
    {
      accessorKey: 'password',
      header: '密码'
    }
  ]

  useRefresh(() => {
    resetFetchUsers()

    const controller = fetchUsers({ pageNum, pageSize, query })

    return () => {
      controller.abort()
    }
  })

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>用户列表</CardTitle>

        <CardDescription>来自 dummyJSON 的用户数据</CardDescription>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={columns}
          data={fetchedUsers?.users || []}
          error={error}
          loading={loading}
        />
      </CardContent>
    </Card>
  )
}

export { UserList }
