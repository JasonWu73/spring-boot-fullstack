import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import React from 'react'
import { type Control, type FieldValues, type Path } from 'react-hook-form'

import { Button } from '@/shared/components/ui/Button'
import { Calendar } from '@/shared/components/ui/Calendar'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/Form'
import { Input } from '@/shared/components/ui/Input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/Popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/Select'
import { cn, tw } from '@/shared/utils/helpers'
import { zhCN } from 'date-fns/locale'

/**
 * 当参数校验不通过时的输入框样式。
 */
function inputErrorClasses(isError: boolean) {
  return isError
    ? tw`border-red-500 focus-visible:ring-red-500 dark:border-red-600 dark:focus-visible:ring-red-700`
    : tw`border-slate-200 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300`
}

type FormInputProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  labelWidth: number
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  disabled?: boolean
  isError?: boolean
  inputRef?: React.MutableRefObject<HTMLInputElement | null>
}

function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  type = 'text',
  placeholder,
  disabled,
  isError = false,
  inputRef
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid grid-flow-row items-center gap-2 lg:grid-cols-[auto_1fr]">
          <FormLabel
            style={{ width: labelWidth }}
            className="overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {label}
          </FormLabel>

          <FormControl className="bg-slate-100 text-slate-700">
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              isError={isError}
              ref={(ref) => {
                field.ref(ref)

                if (inputRef) {
                  inputRef.current = ref
                }
              }}
            />
          </FormControl>

          <FormMessage className="lg:col-start-2 lg:col-end-3 lg:row-span-1" />
        </FormItem>
      )}
    />
  )
}

type SelectOption = {
  value: string
  label: string
}

type FormSelectProps<T extends FieldValues> = Omit<FormInputProps<T>, 'type'> & {
  options: SelectOption[]
}

/**
 * 下拉组件不需要考虑 `placeholder`，因为应该给它默认值。
 */
function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  options,
  placeholder,
  disabled,
  isError = false
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid grid-flow-row items-center gap-1 lg:grid-cols-[auto_1fr]">
          <FormLabel
            style={{ width: labelWidth }}
            className="overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {label}
          </FormLabel>

          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl className="bg-slate-100">
              <SelectTrigger disabled={disabled} isError={isError}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage className="lg:col-start-2 lg:col-end-3 lg:row-span-1" />
        </FormItem>
      )}
    />
  )
}

type FormCalendarProps<T extends FieldValues> = Omit<FormInputProps<T>, 'type'> & {
  disabledWhen: (date: Date) => boolean
}

function FormCalendar<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  placeholder,
  isError = false,
  disabledWhen
}: FormCalendarProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid grid-flow-row items-center gap-2 lg:grid-cols-[auto_1fr]">
          <FormLabel
            style={{ width: labelWidth }}
            className="overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {label}
          </FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl className="bg-slate-100">
                <Button
                  variant="outline"
                  className={cn(
                    'pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                    inputErrorClasses(isError)
                  )}
                >
                  {field.value ? (
                    format(field.value, 'yyyy-MM-dd')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                locale={zhCN}
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={disabledWhen}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <FormMessage className="lg:col-start-2 lg:col-end-3 lg:row-span-1" />
        </FormItem>
      )}
    />
  )
}

export { FormCalendar, FormInput, FormSelect, inputErrorClasses }
