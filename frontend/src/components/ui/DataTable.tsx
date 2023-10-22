import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
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

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  error: string
  loading: boolean
}

/**
 * {@link https://ui.shadcn.com/docs/components/data-table|DataTable - shadcn/ui}
 */
function DataTable<TData, TValue>({
  columns,
  data,
  error = '',
  loading = false
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

export { DataTable }
