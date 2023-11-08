import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/ui/shadcn-ui/Button'
import { MoreHorizontal } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/shadcn-ui/Card'
import { useFetch } from '@/hooks/use-fetch'
import { getUsersApi, type User } from '@/services/dummyjson/user-api'
import { useRefresh } from '@/hooks/use-refresh'
import { DataTable, type Paging } from '@/ui/shadcn-ui/DataTable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/shadcn-ui/DropdownMenu'
import { DataTableColumnHeader } from '@/ui/shadcn-ui/DataTableColumnHeader'
import { useTitle } from '@/hooks/use-title'
import { UserSearch } from '@/features/user/UserSearch'
import { Checkbox } from '@/ui/shadcn-ui/Checkbox'
import { Code } from '@/ui/Code'
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE } from '@/ui/shadcn-ui/ui-config'
import { KEY_QUERY } from '@/utils/constants'

const KEY_PAGE_NUM = 'p'
const KEY_PAGE_SIZE = 's'

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="全选"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="选择行"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
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

      return <Code>{user.username}</Code>
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

      return <Code>{user.password}</Code>
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

export default function UserList() {
  useTitle('用户列表')

  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = Number(searchParams.get(KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
  const query = searchParams.get(KEY_QUERY) || ''

  const {
    data: users,
    error,
    loading,
    fetchData: getUsers
  } = useFetch(getUsersApi)

  useRefresh(() => {
    const abort = getUsers({ pageNum, pageSize, query })

    return () => {
      abort()
    }
  })

  const [selectedRowIndexes, setSelectedRowIndexes] = useState<number[]>([])

  function handlePaginate(paging: Paging) {
    searchParams.set(KEY_PAGE_NUM, String(paging.pageNum))
    searchParams.set(KEY_PAGE_SIZE, String(paging.pageSize))

    setSearchParams(searchParams, { replace: true })
  }

  function handleSearch(query: string) {
    setSearchParams({ [KEY_QUERY]: query }, { replace: true })
  }

  function handleSelect(rowIndexes: number[]) {
    setSelectedRowIndexes(rowIndexes)
  }

  function handleShowSelection() {
    const ids = (users?.users || [])
      .filter((_, index) => selectedRowIndexes.includes(index))
      .map((user) => user.id)

    if (ids.length === 0) {
      alert('没有选中任何一行')
      return
    }

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

        <DataTable
          columns={columns}
          data={users?.users || []}
          error={error}
          loading={loading}
          pagination={{
            pageNum,
            pageSize,
            pageCount: Math.ceil((users?.total || 0) / pageSize)
          }}
          onPaginate={handlePaginate}
          enableRowSelection
          onSelect={handleSelect}
        >
          <div>
            <Button
              onClick={handleShowSelection}
              variant="destructive"
              size="sm"
            >
              查看被选中的行
            </Button>
          </div>
        </DataTable>
      </CardContent>
    </Card>
  )
}
