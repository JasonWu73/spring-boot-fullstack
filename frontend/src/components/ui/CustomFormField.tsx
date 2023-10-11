import React, { HTMLInputTypeAttribute } from 'react'
import { type Control, type FieldValues, type Path } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select'

type FormInputProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  labelWidth: number
  type?: HTMLInputTypeAttribute
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
  isError,
  inputRef
}: FormInputProps<T>) {
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

          <FormControl className="bg-slate-100 text-slate-700">
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              isError={isError}
              ref={(ref) => {
                field.ref(ref)
                inputRef && (inputRef.current = ref)
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

type FormSelectProps<T extends FieldValues> = Omit<
  FormInputProps<T>,
  'type'
> & {
  options: SelectOption[]
}

/**
 * 下拉组件不需要考虑 `placeholder`, 而应该拥有默认值.
 */
function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  options,
  placeholder,
  disabled,
  isError
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

export { FormInput, FormSelect }
