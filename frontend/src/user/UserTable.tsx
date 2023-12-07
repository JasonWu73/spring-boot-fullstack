import type { ColumnSort, SortingState } from '@tanstack/react-table'
import React from 'react'
import { Link } from 'react-router-dom'

import type { PaginationData } from '@/shared/apis/types'
import { Button, buttonVariants } from '@/shared/components/ui/Button'
import { Code } from '@/shared/components/ui/Code'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { DataTable, type Pagination, type Paging } from '@/shared/components/ui/DataTable'
import type { SetStateAction } from '@/shared/hooks/use-api'
import { isRoot } from '@/shared/store/auth-state'
import { cn } from '@/shared/utils/helpers'
import { ResetPasswordDialog } from '@/user/ResetPasswordDialog'
import type { User } from '@/user/UserListPage'
import { getUserTableColumns } from '@/user/UserTableColumns'

type UserTableProps = {
  data: User[]
  error?: string
  loading: boolean
  submitting: boolean
  pagination: Pagination
  onPaginate: (paging: Paging) => void
  sortColumn: ColumnSort
  onSorting: (sorting: SortingState) => void
  onSelect: (rowIndexes: number[]) => void
  onShowSelection: () => void
  onChangeStatus: (user: User, enabled: boolean) => void
  onDeleteUser: (user: User) => void
  updatePaging: (state: SetStateAction<PaginationData<User>>) => void
}

export function UserTable({
  data,
  error,
  loading,
  submitting,
  pagination,
  onPaginate,
  sortColumn,
  onSorting,
  onSelect,
  onShowSelection,
  onChangeStatus,
  onDeleteUser,
  updatePaging
}: UserTableProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = React.useState(false)
  const currentUserRef = React.useRef<User | null>(null)

  function handleDeleteUser() {
    if (currentUserRef.current) {
      onDeleteUser(currentUserRef.current)
    }
  }

  return (
    <>
      <DataTable
        columns={getUserTableColumns({
          submitting,
          currentUserRef,
          onChangeStatus,
          setOpenDeleteDialog,
          setOpenResetPasswordDialog
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
          updateState={updatePaging}
        />
      )}
    </>
  )
}
