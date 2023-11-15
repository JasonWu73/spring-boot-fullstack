import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { User } from '@/shared/apis/dummyjson/types'
import { Code } from '@/shared/components/Code'
import { Button } from '@/shared/components/ui/Button'
import { Checkbox } from '@/shared/components/ui/Checkbox'
import { DataTable, type Paging } from '@/shared/components/ui/DataTable'
import { DataTableColumnHeader } from '@/shared/components/ui/DataTableColumnHeader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/DropdownMenu'

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
    header: ({ column }) => <DataTableColumnHeader column={column} title="姓名" />,
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
              <Link to={`/users/${user.id}/delete`} className="inline-block w-full">
                删除
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

type UserTableProps = {
  users: User[]
  error: string
  loading: boolean
  pageNum: number
  pageSize: number
  pageCount: number
  onPaginate: (paging: Paging) => void
  onSelect: (rowIndexes: number[]) => void
  onShowSelection: () => void
}

function UserTable({
  users,
  error,
  loading,
  pageNum,
  pageSize,
  pageCount,
  onPaginate,
  onSelect,
  onShowSelection
}: UserTableProps) {
  return (
    <DataTable
      columns={columns}
      data={users}
      error={error}
      loading={loading}
      pagination={{
        pageNum,
        pageSize,
        pageCount
      }}
      onPaginate={onPaginate}
      enableRowSelection
      onSelect={onSelect}
    >
      <div>
        <Button onClick={onShowSelection} variant="destructive" size="sm">
          查看被选中的行
        </Button>
      </div>
    </DataTable>
  )
}

export { UserTable }
