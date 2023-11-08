import {type Table} from '@tanstack/react-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/ui/shadcn-ui/Select'
import {Button} from '@/ui/shadcn-ui/Button'

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  needsSelection?: boolean
}

function DataTablePagination<TData>({
  table,
  needsSelection = false
}: DataTablePaginationProps<TData>) {
  return (
    <div className="mt-4 flex items-center justify-between px-2">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {needsSelection && (
          <>
            已选择 {table.getFilteredRowModel().rows.length} 行中的{' '}
            {table.getFilteredSelectedRowModel().rows.length} 行
          </>
        )}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">每页行数</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize}/>
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center text-sm font-medium">
          第 {table.getState().pagination.pageIndex + 1} 页，共{' '}
          {table.getPageCount()} 页
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">转到第一页</span>
            <DoubleArrowLeftIcon className="h-4 w-4"/>
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">转到上一页</span>
            <ChevronLeftIcon className="h-4 w-4"/>
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">转到下一页</span>
            <ChevronRightIcon className="h-4 w-4"/>
          </Button>

          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">转到最后一页</span>
            <DoubleArrowRightIcon className="h-4 w-4"/>
          </Button>
        </div>
      </div>
    </div>
  )
}

export {DataTablePagination}
