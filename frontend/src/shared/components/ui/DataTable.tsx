import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnSort,
  type SortingState,
  type VisibilityState
} from '@tanstack/react-table'
import React from 'react'

import { DataTablePagination } from '@/shared/components/ui/DataTablePagination'
import { DataTableViewOptions } from '@/shared/components/ui/DataTableViewOptions'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/Table'

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10

type Pagination = { pageNum: number; pageSize: number; total: number }

type Paging = Omit<Pagination, 'pageCount' | 'total'>

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  error?: string
  loading?: boolean

  manualPagination?: boolean
  pagination?: Pagination
  onPaginate?: (paging: Paging) => void

  manualSorting?: boolean
  sortColumn?: ColumnSort
  onSorting?: (sorting: SortingState) => void

  enableRowSelection?: boolean
  onSelect?: (rowIndexes: number[]) => void

  children?: React.ReactNode
}

/**
 * {@link https://ui.shadcn.com/docs/components/data-table|DataTable - shadcn/ui}
 */
function DataTable<TData, TValue>({
  columns,
  data,
  error = '',
  loading = false,

  manualPagination = true,
  pagination,
  onPaginate,

  manualSorting = true,
  sortColumn,
  onSorting,

  enableRowSelection = false,
  onSelect,

  children
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    state: {
      pagination: {
        pageIndex: (pagination?.pageNum || DEFAULT_PAGE_NUM) - 1,
        pageSize: pagination?.pageSize || DEFAULT_PAGE_SIZE
      },

      sorting: sortColumn ? [sortColumn] : sorting,

      columnVisibility,

      rowSelection
    },

    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
    manualPagination, // 是否手动分页
    pageCount: Math.ceil((pagination?.total || 0) / (pagination?.pageSize || 1)), // 手动分页需要设置的总页数
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const prev = table.getState().pagination
        const next = updater({ ...prev })

        onPaginate?.({
          pageNum: next.pageIndex + 1,
          pageSize: next.pageSize
        })
      }
    },

    getSortedRowModel: getSortedRowModel(),
    manualSorting,
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        const prev = table.getState().sorting
        const next = updater([...prev])

        setSorting(next)
        onSorting?.(next)
      }
    },

    onColumnVisibilityChange: setColumnVisibility,

    enableRowSelection,
    onRowSelectionChange: (updater) => {
      if (typeof updater === 'function') {
        const prev = table.getState().rowSelection
        const next = updater({ ...prev })

        setRowSelection(next)

        // 提取选中数据的索引以供外部组件使用
        const rowIndexes = Object.keys(next).map((key) => Number(key))

        onSelect?.(rowIndexes)
      }
    }
  })

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        {children}
        <DataTableViewOptions table={table} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading &&
              Array.from({ length: 10 }, (_, i) => (
                <TableRow key={i}>
                  {columns.map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading &&
              table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && error && <ErrorRow columnLen={columns.length} error={error} />}

            {!loading && !error && table.getRowModel().rows?.length === 0 && (
              <ErrorRow columnLen={columns.length} />
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && !error && (
        <DataTablePagination
          total={pagination?.total || 0}
          table={table}
          needsSelection={enableRowSelection}
        />
      )}
    </>
  )
}

type ErrorRowProps = { columnLen: number; error?: string }

function ErrorRow({ columnLen, error }: ErrorRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={columnLen} className="h-24 text-center">
        {error && (
          <span className="font-bold text-red-500 dark:text-red-600">{error}</span>
        )}

        {!error && '暂无数据'}
      </TableCell>
    </TableRow>
  )
}

export { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, DataTable, type Paging }
