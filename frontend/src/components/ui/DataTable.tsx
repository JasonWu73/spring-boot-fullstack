import React, { useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type VisibilityState
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table'
import { Skeleton } from '@/components/ui/Skeleton'
import { DataTablePagination } from '@/components/ui/DataTablePagination'
import { DataTableViewOptions } from '@/components/ui/DataTableViewOptions'

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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = useState({})

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

      // 为了提升用户体验，分页后刷新行选中状态
      setRowSelection({})
      onSelect?.([])
    },

    onColumnVisibilityChange: setColumnVisibility,

    enableRowSelection,
    onRowSelectionChange: (updater) => {
      const prev = table.getState().rowSelection

      if (typeof updater === 'function') {
        const next = updater({ ...prev })

        setRowSelection(next)

        // 提取选中数据以供外部组件使用
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
              Array.from({ length: 10 }).map((_, i) => (
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

            {!loading && !error && table.getRowModel().rows?.length === 0 && (
              <ErrorRow columnLen={columns.length} />
            )}

            {!loading && error && (
              <ErrorRow columnLen={columns.length} error={error} />
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

export { DataTable, DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, type Paging }