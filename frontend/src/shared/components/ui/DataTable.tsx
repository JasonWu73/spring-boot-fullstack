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

export const DEFAULT_PAGE_NUM = 1
export const DEFAULT_PAGE_SIZE = 10

export type Pagination = { pageNum: number; pageSize: number; total: number }

export type Paging = Omit<Pagination, 'total'>

type DataTableProps<T> = {
  columns: ColumnDef<T>[]
  data: T[]
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
 * 数据表格组件。
 *
 * @param props 组件属性
 * @param props.columns 列定义
 * @param props.data 列表数据
 * @param props.error 数据获取失败时的错误信息
 * @param props.loading 是否正在加载数据，默认为 `false`
 * @param props.manualPagination 是否手动分页，默认为 `true`
 * @param props.pagination 分页信息
 * @param props.onPaginate 点击分页按钮时的回调函数
 * @param props.manualSorting 是否手动排序，默认为 `true`
 * @param props.sortColumn 排序信息
 * @param props.onSorting 点击排序按钮时的回调函数
 * @param props.enableRowSelection 是否启用行选择，默认为 `false`
 * @param props.onSelect 选择行时的回调函数
 * @param props.children 放置在表格上方的内容，常用于放置新增、导出等操作按钮
 * @see <a href="https://ui.shadcn.com/docs/components/data-table">DataTable - shadcn/ui</a>
 */
export function DataTable<T>({
  columns,
  data,
  error,
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
}: DataTableProps<T>) {
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
