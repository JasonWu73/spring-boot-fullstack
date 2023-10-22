import { Link, useSearchParams } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/Button'
import { MoreHorizontal } from 'lucide-react'

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
import {
  DataTable,
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  type Paging
} from '@/components/ui/DataTable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import { DataTableColumnHeader } from '@/components/ui/DataTableColumnHeader'
import { useTitle } from '@/hooks/use-title'
import { UserSearch } from '@/components/user/UserSearch'

const KEY_PAGE_NUM = 'p'
const KEY_PAGE_SIZE = 's'
const KEY_QUERY = 'q'

const columns: ColumnDef<User>[] = [
  {
    id: 'ID',
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />
  },
  {
    id: '姓名',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="姓名" />
    ),
    cell: ({ row }) => {
      const user = row.original
      return user.firstName + ' ' + user.lastName
    }
  },
  {
    id: '用户名',
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>
        用户名
        <span className="ml-1 text-xs text-slate-500">（可用作登录）</span>
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => {
      const user = row.original

      return (
        <span className="text-emerald-500 dark:text-amber-500">
          {user.username}
        </span>
      )
    }
  },
  {
    id: '密码',
    accessorKey: 'password',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>
        密码
        <span className="ml-1 text-xs text-slate-500">（可用作登录）</span>
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => {
      const user = row.original

      return (
        <span className="text-emerald-500 dark:text-amber-500">
          {user.password}
        </span>
      )
    }
  },
  {
    id: '操作',
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only"></span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.username)}
            >
              复制用户名
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.password)}
            >
              复制密码
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/users/${user.id}`} className="inline-block w-full">
                编辑
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                to={`/users/${user.id}/delete`}
                className="inline-block w-full"
              >
                删除
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function UserList() {
  useTitle('用户列表')

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

  useRefresh(() => {
    resetFetchUsers()

    const controller = fetchUsers({ pageNum, pageSize, query })

    return () => {
      controller.abort()
    }
  })

  function handlePaging(paging: Paging) {
    searchParams.set(KEY_PAGE_NUM, String(paging.pageNum))
    searchParams.set(KEY_PAGE_SIZE, String(paging.pageSize))

    setSearchParams(searchParams, { replace: true })
  }

  function handleSearch(query: string) {
    setSearchParams({ [KEY_QUERY]: query }, { replace: true })
  }

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>用户列表</CardTitle>

        <CardDescription>来自 dummyJSON 的用户数据</CardDescription>
      </CardHeader>

      <CardContent>
        <UserSearch onSearch={handleSearch} loading={loading} />

        <DataTable
          columns={columns}
          data={fetchedUsers?.users || []}
          error={error}
          loading={loading}
          pagination={{
            pageNum,
            pageSize,
            pageCount: Math.ceil((fetchedUsers?.total || 0) / pageSize)
          }}
          onPaging={handlePaging}
        />
      </CardContent>
    </Card>
  )
}

export { UserList }
