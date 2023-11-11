import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { buttonVariants } from '@/ui/shadcn-ui/Button'
import { cn, tw } from '@/utils/helpers'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: tw`flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0`,
        month: tw`space-y-4`,
        caption: tw`relative flex items-center justify-center pt-1`,
        caption_label: tw`text-sm font-medium`,
        nav: tw`flex items-center space-x-1`,
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          tw`h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100`
        ),
        nav_button_previous: tw`absolute left-1`,
        nav_button_next: tw`absolute right-1`,
        table: tw`w-full border-collapse space-y-1`,
        head_row: tw`flex`,
        head_cell: tw`w-8 rounded-md text-[0.8rem] font-normal text-slate-500 dark:text-slate-400`,
        row: tw`mt-2 flex w-full`,
        cell: cn(
          tw`relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 dark:[&:has([aria-selected])]:bg-slate-800`,
          props.mode === 'range'
            ? tw`[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md`
            : tw`[&:has([aria-selected])]:rounded-md`
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          tw`h-8 w-8 p-0 font-normal aria-selected:opacity-100`
        ),
        day_range_start: tw`day-range-start`,
        day_range_end: tw`day-range-end`,
        day_selected: tw`bg-sky-500 text-slate-50 hover:bg-sky-500 hover:text-slate-50 focus:bg-sky-500 focus:text-slate-50 dark:bg-sky-600 dark:text-slate-900 dark:hover:bg-sky-600 dark:hover:text-slate-900 dark:focus:bg-sky-600 dark:focus:text-slate-900`,
        day_today: tw`bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50`,
        day_outside: tw`text-slate-500 opacity-50 dark:text-slate-400`,
        day_disabled: tw`text-slate-500 opacity-50 dark:text-slate-400`,
        day_range_middle: tw`aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50`,
        day_hidden: tw`invisible`,
        ...classNames
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: () => <ChevronRightIcon className="h-4 w-4" />
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
