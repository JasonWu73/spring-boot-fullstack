import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { ShadButton } from "@/shared/components/ui/ShadButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

type DataTablePaginationProps<TData> = {
  total: number;
  table: Table<TData>;
  needsSelection?: boolean;
};

function DataTablePagination<TData>({
  total,
  table,
  needsSelection = false,
}: DataTablePaginationProps<TData>) {
  function getPageSizeSelectItems() {
    const pageSizeOptions = [...PAGE_SIZE_OPTIONS];
    const currentPageSize = table.getState().pagination.pageSize;

    if (!PAGE_SIZE_OPTIONS.includes(currentPageSize)) {
      pageSizeOptions.unshift(currentPageSize);
    }

    return pageSizeOptions.map((predefinedPageSize) => (
      <SelectItem key={predefinedPageSize} value={`${predefinedPageSize}`}>
        {predefinedPageSize}
      </SelectItem>
    ));
  }

  return (
    <div className="mt-4 flex items-center justify-between px-2">
      <div className="hidden flex-1 text-sm lg:flex">
        {needsSelection && (
          <>
            已选中 {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length} 行
          </>
        )}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">每页行数</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">{getPageSizeSelectItems()}</SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center text-sm font-medium">
          第 {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()} 页 共 {total} 条
        </div>

        <div className="flex items-center space-x-2">
          <ShadButton
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            className="hidden h-8 w-8 p-0 lg:flex"
          >
            <span className="sr-only">转到第一页</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </ShadButton>

          <ShadButton
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">转到上一页</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </ShadButton>

          <ShadButton
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">转到下一页</span>
            <ChevronRightIcon className="h-4 w-4" />
          </ShadButton>

          <ShadButton
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            className="hidden h-8 w-8 p-0 lg:flex"
          >
            <span className="sr-only">转到最后一页</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </ShadButton>
        </div>
      </div>
    </div>
  );
}

export { DataTablePagination };
