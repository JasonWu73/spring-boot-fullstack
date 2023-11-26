import { type ColumnDef, type SortingState } from '@tanstack/react-table'
import { useSearchParams } from 'react-router-dom'

import type { OperationLog } from '@/operation-log/OperationLogListPage'
import { DataTable, type Paging } from '@/shared/components/ui/DataTable'
import { DataTableColumnHeader } from '@/shared/components/ui/DataTableColumnHeader'
import {
  URL_QUERY_KEY_ORDER,
  URL_QUERY_KEY_ORDER_BY,
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE
} from '@/shared/utils/constants'

type OperationLogTableProps = {
  logs: OperationLog[]
  error?: string
  loading: boolean
  pageNum: number
  pageSize: number
  total: number
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

function OperationLogTable({
  logs,
  error,
  loading,
  pageNum,
  pageSize,
  total
}: OperationLogTableProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  function handlePaginate(paging: Paging) {
    searchParams.set(URL_QUERY_KEY_PAGE_NUM, String(paging.pageNum))
    searchParams.set(URL_QUERY_KEY_PAGE_SIZE, String(paging.pageSize))

    setSearchParams(searchParams, { replace: true })
  }

  const handleSorting = (sorting: SortingState) => {
    searchParams.delete('requestedAt')

    const orderBy = sorting[0]?.id === '请求时间' ? 'requestedAt' : ''
    const order = sorting[0]?.desc === true ? 'desc' : 'asc'

    if (!orderBy) return

    searchParams.set(URL_QUERY_KEY_ORDER_BY, orderBy)
    searchParams.set(URL_QUERY_KEY_ORDER, order)

    setSearchParams(searchParams)
  }

  return (
    <DataTable
      columns={columns}
      data={logs}
      error={error}
      loading={loading}
      pagination={{
        pageNum,
        pageSize,
        total
      }}
      onPaginate={handlePaginate}
      orderBy={{
        id: searchParams.get(URL_QUERY_KEY_ORDER_BY) === 'requestedAt' ? '请求时间' : '',
        desc: searchParams.get(URL_QUERY_KEY_ORDER) !== 'asc'
      }}
      onSorting={handleSorting}
    />
  )
}

export { OperationLogTable }
