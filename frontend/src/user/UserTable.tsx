import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { useAuth, type PaginationData } from '@/auth/AuthProvider'
import { Button } from '@/shared/components/ui/Button'
import { Checkbox } from '@/shared/components/ui/Checkbox'
import { Code } from '@/shared/components/ui/Code'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { DataTable, type Paging } from '@/shared/components/ui/DataTable'
import { DataTableColumnHeader } from '@/shared/components/ui/DataTableColumnHeader'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/Dialog'
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
import type { Action } from '@/shared/hooks/use-fetch'
import { URL_QUERY_KEY_ORDER, URL_QUERY_KEY_ORDER_BY } from '@/shared/utils/constants'
import { ResetPassword } from '@/user/ResetPassword'
import type { User } from '@/user/UserListPage'

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
  dispatch: React.Dispatch<Action<PaginationData<User> | null>>
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
  onShowSelection,
  dispatch
}: UserTableProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [updating, setUpdating] = React.useState(false)

  const { isRoot, requestApi } = useAuth()
  const { toast } = useToast()

  const columns = getColumns(isRoot)

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
        id: 'ID',
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />
      },
      {
        id: '昵称',
        header: ({ column }) => <DataTableColumnHeader column={column} title="昵称" />,
        cell: ({ row }) => {
          const user = row.original

          return user.nickname
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
        id: '是否启用',
        header: ({ column }) => (
          <DataTableColumnHeader column={column}>
            是否启用
            <span className="ml-1 text-xs text-slate-500">（禁用后不可登录）</span>
          </DataTableColumnHeader>
        ),
        cell: ({ row }) => {
          const user = row.original
          const enabled = user.status === 1
          const loadingType = `userOperation${user.id}`

          return (
            <Switch
              checked={enabled}
              disabled={updating}
              onCheckedChange={() => handleChangeStatus(user.id, enabled, loadingType)}
            />
          )
        }
      },
      {
        id: '权限',
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
        id: '创建时间',
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader sortable column={column} title="创建时间" />
        )
      },
      {
        id: '修改时间',
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <DataTableColumnHeader sortable column={column} title="修改时间" />
        )
      },
      {
        id: '备注',
        accessorKey: 'remark',
        header: ({ column }) => <DataTableColumnHeader column={column} title="备注" />
      },
      {
        id: '操作',
        header: ({ column }) => <DataTableColumnHeader column={column} title="操作" />,
        cell: ({ row }) => {
          const user = row.original
          const loadingType = `userOperation${user.id}`

          return (
            /* `model=false`（启用与外部元素的交互）很重要，否则内部对话框焦点不可用 */
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild disabled={updating}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>操作</DropdownMenuLabel>

                <DropdownMenuItem>
                  <Link to={`/users/${user.id}`} className="inline-block w-full">
                    编辑
                  </Link>
                </DropdownMenuItem>

                {isRoot && (
                  <>
                    <DropdownMenuSeparator />

                    <ConfirmDialog
                      trigger={
                        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                          <button className="w-full cursor-pointer text-left text-red-500 dark:text-red-600">
                            删除
                          </button>
                        </DropdownMenuItem>
                      }
                      title={
                        <>
                          您确定要删除用户 <Code>{user.username}</Code> 吗？
                        </>
                      }
                      onConfirm={() => handleDeleteUser(user.id, loadingType)}
                    />

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                          <button className="w-full cursor-pointer text-left text-red-500 dark:text-red-600">
                            重置密码
                          </button>
                        </DropdownMenuItem>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            重置用户 <Code>{user.username}</Code> 密码
                          </DialogTitle>
                          <DialogDescription>
                            重置后，用户将使用新密码登录系统
                          </DialogDescription>
                        </DialogHeader>

                        <ResetPassword userId={user.id} />
                      </DialogContent>
                    </Dialog>
                  </>
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

  async function handleChangeStatus(
    userId: number,
    enabled: boolean,
    loadingType: string
  ) {
    const newStatus = enabled ? 0 : 1

    setUpdating(true)

    const response = await requestApi(
      {
        url: `/api/v1/users/${userId}/status`,
        method: 'PUT',
        bodyData: { status: newStatus }
      },
      loadingType
    )

    setUpdating(false)

    if (response.status === 204) {
      const newUsers = users.map((prevUser) => {
        if (prevUser.id === userId) prevUser.status = newStatus

        return prevUser
      })

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          status: 200,
          data: {
            list: newUsers,
            pageNum,
            pageSize,
            total
          }
        }
      })

      toast({ title: '修改用户状态成功' })
      return
    }

    toast({
      title: '修改用户状态失败',
      description: response.error,
      variant: 'destructive'
    })
  }

  async function handleDeleteUser(userId: number, loadingType: string) {
    setUpdating(true)

    const response = await requestApi(
      {
        url: `/api/v1/users/${userId}`,
        method: 'DELETE'
      },
      loadingType
    )

    setUpdating(false)

    if (response.status === 204) {
      const newUsers = users.filter((prevUser) => prevUser.id !== userId)

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          status: 200,
          data: {
            list: newUsers,
            pageNum,
            pageSize,
            total: total - 1
          }
        }
      })

      toast({ title: '删除用户成功' })
      return
    }

    toast({
      title: '删除用户失败',
      description: response.error,
      variant: 'destructive'
    })
  }

  return (
    <>
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
          id:
            searchParams.get(URL_QUERY_KEY_ORDER_BY) === 'updatedAt'
              ? '修改时间'
              : '创建时间',
          desc: searchParams.get(URL_QUERY_KEY_ORDER) !== 'asc'
        }}
        onSorting={(sorting) => {
          searchParams.delete('createdAt')
          searchParams.delete('updatedAt')

          const orderBy = sorting[0]?.id === '修改时间' ? 'updatedAt' : 'createdAt'
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
    </>
  )
}

export { UserTable }
