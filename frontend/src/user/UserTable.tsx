import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { useAuth } from '@/auth/AuthProvider'
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
import { Switch } from '@/shared/components/ui/Switch'
import { useToast } from '@/shared/components/ui/use-toast'
import { useFetch } from '@/shared/hooks/use-fetch'
import { URL_QUERY_KEY_ORDER, URL_QUERY_KEY_ORDER_BY } from '@/shared/utils/constants'
import { CUSTOM_HTTP_STATUS_ERROR_CODE } from '@/shared/utils/http'
import type { User } from '@/user/types'

type UserTableProps = {
  users: User[]
  error: string
  loading: boolean
  pageNum: number
  pageSize: number
  total: number
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
  total,
  onPaginate,
  onSelect,
  onShowSelection
}: UserTableProps) {
  const { isRoot, requestApi } = useAuth()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const columns = getColumns(isRoot)

  const {
    status: changeStatusHttpStatus,
    error: changeStatusError,
    fetchData: changeStatus
  } = useFetch(async (params?: { userId: number; status: number }) => {
    if (!params) return { status: CUSTOM_HTTP_STATUS_ERROR_CODE, error: '参数缺失' }

    const { userId, status } = params

    return await requestApi({
      url: `/api/v1/users/${userId}/status`,
      method: 'PUT',
      bodyData: { status }
    })
  })

  React.useEffect(() => {
    if (changeStatusHttpStatus === 204) {
      toast({
        title: '修改用户状态成功'
      })

      setSearchParams(searchParams)
      return
    }

    if (!changeStatusError) return

    toast({
      title: '修改用户状态失败',
      description: changeStatusError,
      variant: 'destructive'
    })
  }, [changeStatusHttpStatus, changeStatusError, toast, searchParams, setSearchParams])

  function getColumns(isRoot: boolean) {
    const columns: ColumnDef<User>[] = [
      {
        id: '选择',
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
        id: 'id',
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />
      },
      {
        id: 'nickname',
        header: ({ column }) => <DataTableColumnHeader column={column} title="昵称" />,
        cell: ({ row }) => {
          const user = row.original

          return user.nickname
        }
      },
      {
        id: 'username',
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
        id: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column}>
            是否启用
            <span className="ml-1 text-xs text-slate-500">（禁用后不可登录）</span>
          </DataTableColumnHeader>
        ),
        cell: ({ row }) => {
          const user = row.original
          const enabled = user.status === 1

          return (
            <Switch
              checked={enabled}
              onCheckedChange={() =>
                changeStatus({
                  userId: user.id,
                  status: enabled ? 0 : 1
                })
              }
            />
          )
        }
      },
      {
        id: 'authorities',
        header: ({ column }) => <DataTableColumnHeader column={column} title="权限" />,
        cell: ({ row }) => {
          const user = row.original

          return (
            <div className="space-x-1">
              {user.authorities.map((authority) => {
                if (authority === 'root') {
                  return (
                    <Code key={authority} className="font-semibold text-red-500">
                      超级管理员
                    </Code>
                  )
                }

                if (authority === 'admin') {
                  return (
                    <Code key={authority} className="text-red-500">
                      管理员
                    </Code>
                  )
                }

                if (authority === 'user') {
                  return (
                    <Code key={authority} className="text-green-500">
                      用户
                    </Code>
                  )
                }

                return (
                  <Code key={authority} className="text-slate-500">
                    未知
                  </Code>
                )
              })}
            </div>
          )
        }
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader sortable column={column} title="创建时间" />
        )
      },
      {
        id: 'updatedAt',
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <DataTableColumnHeader sortable column={column} title="修改时间" />
        )
      },
      {
        id: 'remark',
        accessorKey: 'remark',
        header: ({ column }) => <DataTableColumnHeader column={column} title="备注" />
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

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link to={`/users/${user.id}`} className="inline-block w-full">
                    编辑
                  </Link>
                </DropdownMenuItem>

                {isRoot && (
                  <DropdownMenuItem>
                    <Link to={`/users/${user.id}/delete`} className="inline-block w-full">
                      删除
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      }
    ]

    if (isRoot) return columns

    return columns.filter((column) => column.id !== '选择')
  }

  return (
    <DataTable
      columns={columns}
      data={users}
      error={error}
      loading={loading}
      pagination={{
        pageNum,
        pageSize,
        total
      }}
      onPaginate={onPaginate}
      orderBy={{
        id: searchParams.get(URL_QUERY_KEY_ORDER_BY) || 'createdAt',
        desc: searchParams.get(URL_QUERY_KEY_ORDER) !== 'asc'
      }}
      onSorting={(sorting) => {
        searchParams.delete('createdAt')
        searchParams.delete('updatedAt')

        const orderBy = sorting[0]?.id
        const order = sorting[0]?.desc === true ? 'desc' : 'asc'

        if (!orderBy) return

        searchParams.set(URL_QUERY_KEY_ORDER_BY, orderBy)
        searchParams.set(URL_QUERY_KEY_ORDER, order)

        setSearchParams(searchParams)
      }}
      enableRowSelection
      onSelect={onSelect}
    >
      {isRoot && (
        <div>
          <Button onClick={onShowSelection} variant="destructive" size="sm">
            查看被选中的行
          </Button>
        </div>
      )}
    </DataTable>
  )
}

export { UserTable }
