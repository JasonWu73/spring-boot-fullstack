import { useSignal } from '@preact/signals-react'
import type { ColumnSort, SortingState } from '@tanstack/react-table'
import { Link } from 'react-router-dom'

import type { PaginationData } from '@/shared/apis/types'
import { Button, buttonVariants } from '@/shared/components/ui/Button'
import { Code } from '@/shared/components/ui/Code'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { DataTable, type Paging } from '@/shared/components/ui/DataTable'
import type { ApiState, SetApiStateAction } from '@/shared/hooks/use-api'
import { hasRoot } from '@/shared/signals/auth'
import { cn } from '@/shared/utils/helpers'
import { ResetPasswordDialog } from '@/user/ResetPasswordDialog'
import type { User } from '@/user/UserListPage'
import { getUserTableColumns } from '@/user/UserTableColumns'

type UserTableProps = {
  paging: Paging
  pagingState: ApiState<PaginationData<User>>
  setPagingState: (newState: SetApiStateAction<PaginationData<User>>) => void
  submitting: boolean
  onPaginate: (paging: Paging) => void
  sortColumn: ColumnSort
  onSorting: (sorting: SortingState) => void
  onSelect: (rowIndexes: number[]) => void
  onShowSelection: () => void
  onChangeStatus: (user: User, enabled: boolean) => void
  onDeleteUser: (user: User) => void
}

export function UserTable({
  paging,
  pagingState,
  setPagingState,
  submitting,
  onPaginate,
  sortColumn,
  onSorting,
  onSelect,
  onShowSelection,
  onChangeStatus,
  onDeleteUser
}: UserTableProps) {
  const openDeleteDialog = useSignal(false)
  const openResetPasswordDialog = useSignal(false)
  const currentUser = useSignal<User | null>(null)

  const { loading, data, error } = pagingState

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
        data={data?.list || []}
        error={error}
        loading={loading}
        pagination={{
          ...paging,
          total: data?.total || 0
        }}
        onPaginate={onPaginate}
        sortColumn={sortColumn}
        onSorting={onSorting}
        enableRowSelection
        onSelect={onSelect}
      >
        {hasRoot() && (
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
          setPagingState={setPagingState}
        />
      )}
    </>
  )
}
