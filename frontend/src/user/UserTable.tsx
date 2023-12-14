import { useSignal } from '@preact/signals-react'
import type { ColumnSort, SortingState } from '@tanstack/react-table'
import { Link } from 'react-router-dom'

import type { User } from '@/shared/apis/backend/user'
import type { PaginationData } from '@/shared/apis/types'
import { Button, buttonVariants } from '@/shared/components/ui/Button'
import { Code } from '@/shared/components/ui/Code'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { DataTable, type Pagination } from '@/shared/components/ui/DataTable'
import type { ApiResponse } from '@/shared/hooks/use-fetch'
import { hasRoot } from '@/shared/signals/auth'
import { cn } from '@/shared/utils/helpers'
import { ResetPasswordDialog } from '@/user/ResetPasswordDialog'
import { getUserTableColumns } from '@/user/UserTableColumns'

type UserTableProps = {
  data: User[]
  error?: string
  loading?: boolean
  pagination: Pagination
  submitting: boolean
  onPaginate: (paging: Pagination) => void
  sortColumn: ColumnSort
  onSorting: (sorting: SortingState) => void
  onSelect: (rowIndexes: number[]) => void
  onShowSelection: () => void
  onChangeStatus: (user: User, enabled: boolean) => void
  onDeleteUser: (user: User) => void
  invalidateUsers: () => Promise<ApiResponse<PaginationData<User>>>
}

export function UserTable({
  data,
  error,
  loading,
  pagination,
  submitting,
  onPaginate,
  sortColumn,
  onSorting,
  onSelect,
  onShowSelection,
  onChangeStatus,
  onDeleteUser,
  invalidateUsers
}: UserTableProps) {
  const openDeleteDialog = useSignal(false)
  const openResetPasswordDialog = useSignal(false)
  const currentUser = useSignal<User | null>(null)

  function handleDeleteUser() {
    if (currentUser.value) {
      onDeleteUser(currentUser.value)
    }
  }

  return (
    <>
      <DataTable
        columns={getUserTableColumns({
          submitting,
          currentUser,
          onChangeStatus,
          openDeleteDialog,
          openResetPasswordDialog
        })}
        data={data}
        error={error}
        loading={loading}
        pagination={pagination}
        onPaginate={onPaginate}
        sortColumn={sortColumn}
        onSorting={onSorting}
        enableRowSelection
        onSelect={onSelect}
      >
        {hasRoot() && (
          <div>
            <Button variant="secondary" size="sm" onClick={onShowSelection}>
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

      {currentUser.value && (
        <ConfirmDialog
          open={openDeleteDialog.value}
          onOpenChange={(open) => (openDeleteDialog.value = open)}
          title={
            <span>
              您确定要删除用户 <Code>{currentUser.value.username}</Code> 吗？
            </span>
          }
          onConfirm={handleDeleteUser}
        />
      )}

      {currentUser.value && (
        <ResetPasswordDialog
          open={openResetPasswordDialog.value}
          onOpenChange={(open) => (openResetPasswordDialog.value = open)}
          user={currentUser.value}
          invalidateUsers={invalidateUsers}
        />
      )}
    </>
  )
}
