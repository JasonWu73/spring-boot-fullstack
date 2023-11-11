import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState
} from '@tanstack/react-table'
import React from 'react'

import { DataTablePagination } from '@/ui/shadcn-ui/DataTablePagination'
import { DataTableViewOptions } from '@/ui/shadcn-ui/DataTableViewOptions'
import { Skeleton } from '@/ui/shadcn-ui/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/shadcn-ui/Table'

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10

type Pagination = { pageNum: number; pageSize: number; pageCount: number }

type Paging = Omit<Pagination, 'pageCount'>

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  error?: string
  loading?: boolean

  manualPagination?: boolean
  pagination?: Pagination
  onPaginate?: (paging: Paging) => void

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

  enableRowSelection = false,
  onSelect,

  children
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    state: {
      pagination: {
        pageIndex: (pagination?.pageNum || DEFAULT_PAGE_NUM) - 1,
        pageSize: pagination?.pageSize || DEFAULT_PAGE_SIZE
      },

      columnVisibility,

      rowSelection
    },

    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
    manualPagination, // 是否手动分页
    pageCount: pagination?.pageCount || -1, // 手动分页需要设置的总页数
    onPaginationChange: (updater) => {
      const prev = table.getState().pagination

      if (typeof updater === 'function') {
        const next = updater({ ...prev })
        onPaginate?.({
          pageNum: next.pageIndex + 1,
          pageSize: next.pageSize
        })
      }

      // 为了提升用户体验，分页后应该重置行选中状态
      setRowSelection({})
      onSelect?.([])
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

        // 判断若是从全选状态再取消全选，则应该重置所有行的选中状态，而非只是当前页
        const prevSelectedAll = table.getIsAllPageRowsSelected()

        const currentPageUpdatedAll = rowIndexes.length === 0
        const searchedPageUpdatedAll = rowIndexes.length === data.length
        const isDeselectedAll = currentPageUpdatedAll || searchedPageUpdatedAll

        if (prevSelectedAll && isDeselectedAll) {
          setRowSelection({})
          onSelect?.([])
          return
        }

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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {error && <ErrorRow columnLen={columns.length} error={error} />}

            {!loading && !error && table.getRowModel().rows?.length === 0 && (
              <ErrorRow columnLen={columns.length} />
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && !error && (
        <DataTablePagination
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
          <span className="font-bold text-red-500 dark:text-red-600">
            {error}
          </span>
        )}

        {!error && '暂无数据'}
      </TableCell>
    </TableRow>
  )
}

export { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, DataTable, type Paging }
