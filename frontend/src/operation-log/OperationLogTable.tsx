import type { Signal } from '@preact/signals-react'
import type { ColumnDef, ColumnSort, SortingState } from '@tanstack/react-table'

import type { OperationLog } from '@/operation-log/OperationLogListPage'
import type { PaginationData } from '@/shared/apis/types'
import { DataTable, type Paging } from '@/shared/components/ui/DataTable'
import { DataTableColumnHeader } from '@/shared/components/ui/DataTableColumnHeader'
import type { ApiState } from '@/shared/hooks/use-api'

type OperationLogTableProps = {
  paging: Paging
  pagingState: Signal<ApiState<PaginationData<OperationLog>>>
  onPaginate: (paging: Paging) => void
  sortColumn: ColumnSort
  onSorting: (sorting: SortingState) => void
}

const columns: ColumnDef<OperationLog>[] = [
  {
    id: 'ID',
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />
  },
  {
    id: '请求时间',
    accessorKey: 'requestedAt',
    header: ({ column }) => (
      <DataTableColumnHeader sortable column={column} title="请求时间" />
    )
  },
  {
    id: '客户端 IP',
    accessorKey: 'clientIp',
    header: ({ column }) => <DataTableColumnHeader column={column} title="客户端 IP" />
  },
  {
    id: '用户名',
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader column={column} title="用户名" />
  },
  {
    id: '操作描述',
    accessorKey: 'message',
    header: ({ column }) => <DataTableColumnHeader column={column} title="操作描述" />
  }
]

export function OperationLogTable({
  paging,
  pagingState,
  onPaginate,
  sortColumn,
  onSorting
}: OperationLogTableProps) {
  const { loading, data, error } = pagingState.value

  return (
    <DataTable
      columns={columns}
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
    />
  )
}
