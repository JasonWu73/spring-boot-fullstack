import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon
} from '@radix-ui/react-icons'
import { type Column } from '@tanstack/react-table'
import React from 'react'

import { Button } from '@/shared/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/DropdownMenu'
import { cn } from '@/shared/utils/helpers'

type DataTableColumnHeaderProps<TData, TValue> = React.HTMLAttributes<HTMLDivElement> & {
  column: Column<TData, TValue>
  title?: string
  needsSort?: boolean
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title = '',
  className,
  children,
  needsSort = false
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            {children ? children : title}

            {!needsSort && <CaretSortIcon className="ml-2 h-4 w-4" />}

            {needsSort &&
              (column.getIsSorted() === 'desc' ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'asc' ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              ))}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {needsSort && column.getCanSort() && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUpIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                升序
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDownIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                降序
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            隐藏
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { DataTableColumnHeader }