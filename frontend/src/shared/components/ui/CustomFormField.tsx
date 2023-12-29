import React from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { Button } from '@/shared/components/ui/Button'
import { Calendar } from '@/shared/components/ui/Calendar'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/Form'
import { Input, inputErrorClasses } from '@/shared/components/ui/Input'
import { MultiSelect } from '@/shared/components/ui/MultiSelect'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/Popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/Select'
import { Textarea } from '@/shared/components/ui/Textarea'
import { cn } from '@/shared/utils/helpers'

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
  className?: string
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  type = 'text',
  placeholder,
  disabled,
  isError = false,
  inputRef,
  className
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

          <FormControl className={cn(className)}>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
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

type FormTextareaProps<T extends FieldValues> = Omit<FormInputProps<T>, 'inputRef'> & {
  textareaRef?: React.MutableRefObject<HTMLTextAreaElement | null>
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  placeholder,
  disabled,
  isError = false,
  textareaRef,
  className
}: FormTextareaProps<T>) {
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

          <FormControl className={cn(className)}>
            <Textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              isError={isError}
              ref={(ref) => {
                field.ref(ref)

                if (textareaRef) {
                  textareaRef.current = ref
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
export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  options,
  placeholder,
  disabled,
  isError = false,
  className
}: FormSelectProps<T>) {
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

          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl className={cn('py-0', className)}>
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

export function FormMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  options,
  placeholder,
  disabled,
  isError = false,
  className
}: FormSelectProps<T>) {
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

          <FormControl className={cn(className)}>
            <MultiSelect
              {...field}
              placeholder={placeholder}
              selected={field.value}
              options={options}
              isError={isError}
              disabled={disabled}
            />
          </FormControl>

          <FormMessage className="lg:col-start-2 lg:col-end-3 lg:row-span-1" />
        </FormItem>
      )}
    />
  )
}

type FormCalendarProps<T extends FieldValues> = Omit<FormInputProps<T>, 'type'> & {
  disabledWhen: (date: Date) => boolean
}

export function FormCalendar<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  placeholder,
  isError = false,
  disabledWhen,
  className
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
              <FormControl className={cn(className)}>
                <Button
                  variant="outline"
                  className={cn('pl-3 text-left font-normal', inputErrorClasses(isError))}
                >
                  <span className="pr-2">
                    {field.value ? format(field.value, 'yyyy-MM-dd') : placeholder}
                  </span>
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
