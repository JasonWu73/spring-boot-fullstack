import { type ColumnDef, type ColumnSort, type SortingState } from '@tanstack/react-table'

import type { OperationLog } from '@/operation-log/OperationLogListPage'
import { DataTable, type Pagination, type Paging } from '@/shared/components/ui/DataTable'
import { DataTableColumnHeader } from '@/shared/components/ui/DataTableColumnHeader'

type OperationLogTableProps = {
  data: OperationLog[]
  error?: string
  loading: boolean
  pagination: Pagination
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
  data,
  error,
  loading,
  pagination,
  onPaginate,
  sortColumn,
  onSorting
}: OperationLogTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      error={error}
      loading={loading}
      pagination={pagination}
      onPaginate={onPaginate}
      sortColumn={sortColumn}
      onSorting={onSorting}
    />
  )
}
