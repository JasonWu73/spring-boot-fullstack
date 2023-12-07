import { type SortingState } from '@tanstack/react-table'
import { format } from 'date-fns'
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import type { PaginationData } from '@/shared/apis/types'
import { Button, buttonVariants } from '@/shared/components/ui/Button'
import { Code } from '@/shared/components/ui/Code'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { DataTable, type Paging } from '@/shared/components/ui/DataTable'
import { useToast } from '@/shared/components/ui/use-toast'
import {
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE,
  URL_QUERY_KEY_SORT_COLUMN,
  URL_QUERY_KEY_SORT_ORDER
} from '@/shared/constants'
import type { SetStateAction } from '@/shared/hooks/use-api'
import { useApi } from '@/shared/hooks/use-api'
import { isRoot, requestApi } from '@/shared/store/auth-state'
import { cn } from '@/shared/utils/helpers'
import { ResetPasswordDialog } from '@/user/ResetPasswordDialog'
import type { User } from '@/user/UserListPage'
import { getUserTableColumns } from '@/user/UserTableColumns'

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

export function UserTable({
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
  const currentUserRef = React.useRef<User | null>(null)

  const { loading: submitting, requestData } = useApi(requestApi<void>)
  const { toast } = useToast()

  async function changeStatus(userId: number, status: number) {
    return await requestData({
      url: `/api/v1/users/${userId}/status`,
      method: 'PUT',
      bodyData: { status }
    })
  }

  async function deleteUser(userId: number) {
    return await requestData({
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
          prevUser.updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
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

    const sortColumn = sorting[0]?.id === '更新时间' ? 'updatedAt' : 'createdAt'
    const sortOrder = sorting[0]?.desc === true ? 'desc' : 'asc'

    if (!sortColumn) return

    searchParams.set(URL_QUERY_KEY_SORT_COLUMN, sortColumn)
    searchParams.set(URL_QUERY_KEY_SORT_ORDER, sortOrder)

    setSearchParams(searchParams)
  }

  return (
    <>
      <DataTable
        columns={getUserTableColumns({
          submitting,
          currentUserRef,
          handleChangeStatus,
          setOpenDeleteDialog,
          setOpenResetPasswordDialog
        })}
        data={users}
        error={error}
        loading={loading}
        pagination={{
          pageNum,
          pageSize,
          total
        }}
        onPaginate={handlePaginate}
        sortColumn={{
          id:
            searchParams.get(URL_QUERY_KEY_SORT_COLUMN) === 'updatedAt'
              ? '更新时间'
              : '创建时间',
          desc: searchParams.get(URL_QUERY_KEY_SORT_ORDER) !== 'asc'
        }}
        onSorting={handleSorting}
        enableRowSelection
        onSelect={onSelect}
      >
        {isRoot && (
          <div>
            <Button onClick={onShowSelection} size="sm" variant="secondary">
              查看被选中的行
            </Button>

            <Link
              to="/users/add"
              className={cn(
                'ml-2',
                buttonVariants({
                  variant: 'default',
                  size: 'sm'
                })
              )}
            >
              新增用户
            </Link>
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
