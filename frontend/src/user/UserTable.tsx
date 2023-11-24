import { type ColumnDef, type SortingState } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import { ADMIN, ROOT, USER, useAuth, type PaginationData } from '@/auth/AuthProvider'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Checkbox } from '@/shared/components/ui/Checkbox'
import { Code } from '@/shared/components/ui/Code'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
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
import type { SetStateAction } from '@/shared/hooks/use-fetch'
import { useFetch } from '@/shared/hooks/use-fetch'
import {
  URL_QUERY_KEY_ORDER,
  URL_QUERY_KEY_ORDER_BY,
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE
} from '@/shared/utils/constants'
import { ResetPasswordDialog } from '@/user/ResetPasswordDialog'
import type { User } from '@/user/UserListPage'
import { format } from 'date-fns'
import React from 'react'

type UpdateState = (state: SetStateAction<PaginationData<User>>) => void

type UserTableProps = {
  users: User[]
  error?: string
  loading: boolean
  pageNum: number
  pageSize: number
  total: number
  onSelect: (rowIndexes: number[]) => void
  onShowSelection: () => void
  updateState: UpdateState
}

function UserTable({
  users,
  error,
  loading,
  pageNum,
  pageSize,
  total,
  onSelect,
  onShowSelection,
  updateState
}: UserTableProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = React.useState(false)

  const { isRoot, requestApi } = useAuth()
  const { loading: submitting, fetchData } = useFetch(requestApi<void>)
  const { toast } = useToast()
  const currentUserRef = React.useRef<User | null>(null)

  // 对话框不应该放在表格内部，否则会导致在表格刷新时（当刷新身份验证信息时）,对话框就会被关闭
  function getColumns() {
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
          return row.original.nickname
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
          return <Code>{row.original.username}</Code>
        }
      },
      {
        id: '账号状态',
        header: ({ column }) => (
          <DataTableColumnHeader column={column}>
            账号状态
            <span className="ml-1 text-xs text-slate-500">（禁用后不可登录）</span>
          </DataTableColumnHeader>
        ),
        cell: ({ row }) => {
          const user = row.original
          const enabled = user.status === 1

          return (
            <Switch
              checked={enabled}
              disabled={submitting}
              onCheckedChange={() => handleChangeStatus(user, enabled)}
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
                if (authority === ROOT.value) {
                  return (
                    <Badge key={authority} variant="destructive">
                      超级管理员
                    </Badge>
                  )
                }

                if (authority === ADMIN.value) {
                  return <Badge key={authority}>管理员</Badge>
                }

                if (authority === USER.value) {
                  return (
                    <Badge key={authority} variant="outline">
                      用户
                    </Badge>
                  )
                }

                return null
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
        id: '更新时间',
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <DataTableColumnHeader sortable column={column} title="更新时间" />
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

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={submitting}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>操作</DropdownMenuLabel>

                <DropdownMenuItem className="p-0">
                  <Link
                    to={`/users/${user.id}`}
                    className="inline-block w-full px-2 py-1.5"
                  >
                    查看详情
                  </Link>
                </DropdownMenuItem>

                {isRoot && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="p-0">
                      <button
                        onClick={() => {
                          setOpenDeleteDialog(true)
                          currentUserRef.current = user
                        }}
                        className="inline-block w-full px-2 py-1.5 text-left text-red-500 dark:text-red-600"
                      >
                        删除用户
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0">
                      <button
                        onClick={() => {
                          setOpenResetPasswordDialog(true)
                          currentUserRef.current = user
                        }}
                        className="inline-block w-full px-2 py-1.5 text-left text-red-500 dark:text-red-600"
                      >
                        重置密码
                      </button>
                    </DropdownMenuItem>
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

  async function changeStatus(userId: number, status: number) {
    return await fetchData({
      url: `/api/v1/users/${userId}/status`,
      method: 'PUT',
      bodyData: { status }
    })
  }

  async function deleteUser(userId: number) {
    return await fetchData({
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

    updateState((prevState) => {
      if (!prevState.data) return prevState

      const newUsers = prevState.data.list.map((prevUser) => {
        if (prevUser.id === user.id) {
          prevUser.status = newStatus
          prevUser.updatedAt = format(Date.now(), 'yyyy-MM-dd HH:mm:ss')
        }

        return prevUser
      })

      return {
        ...prevState,
        data: {
          ...prevState.data,
          list: newUsers
        }
      }
    })

    toast({
      title: '更新账号状态成功',
      description: (
        <span>
          {!enabled ? '启用' : '禁用'} <Code>{user.username}</Code> 账号
        </span>
      )
    })
  }

  async function handleDeleteUser() {
    if (!currentUserRef.current) return

    const { id, username } = currentUserRef.current
    const { status, error } = await deleteUser(id)

    if (status !== 204) {
      toast({
        title: '删除用户失败',
        description: error,
        variant: 'destructive'
      })

      return
    }

    updateState((prevState) => {
      if (!prevState.data) return prevState

      const newUsers = prevState.data.list.filter((prevUser) => prevUser.id !== id)

      return {
        ...prevState,
        data: {
          ...prevState.data,
          total: prevState.data.total - 1,
          list: newUsers
        }
      }
    })

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

    const orderBy = sorting[0]?.id === '更新时间' ? 'updatedAt' : 'createdAt'
    const order = sorting[0]?.desc === true ? 'desc' : 'asc'

    if (!orderBy) return

    searchParams.set(URL_QUERY_KEY_ORDER_BY, orderBy)
    searchParams.set(URL_QUERY_KEY_ORDER, order)

    setSearchParams(searchParams)
  }

  return (
    <>
      <DataTable
        columns={getColumns()}
        data={users}
        error={error}
        loading={loading}
        pagination={{
          pageNum,
          pageSize,
          total
        }}
        onPaginate={handlePaginate}
        orderBy={{
          id:
            searchParams.get(URL_QUERY_KEY_ORDER_BY) === 'updatedAt'
              ? '更新时间'
              : '创建时间',
          desc: searchParams.get(URL_QUERY_KEY_ORDER) !== 'asc'
        }}
        onSorting={handleSorting}
        enableRowSelection
        onSelect={onSelect}
      >
        {isRoot && (
          <div>
            <Button onClick={onShowSelection} size="sm">
              查看被选中的行
            </Button>
          </div>
        )}
      </DataTable>

      {currentUserRef.current && (
        <ConfirmDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          title={
            <span>
              您确定要删除用户 <Code>{currentUserRef.current.username}</Code> 吗？
            </span>
          }
          onConfirm={handleDeleteUser}
        />
      )}

      {currentUserRef.current && (
        <ResetPasswordDialog
          open={openResetPasswordDialog}
          onOpenChange={setOpenResetPasswordDialog}
          user={currentUserRef.current}
          updateState={updateState}
        />
      )}
    </>
  )
}

export { UserTable }
