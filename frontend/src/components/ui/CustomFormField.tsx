import { type Control, type FieldValues, type Path } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form.tsx'
import { Input } from '@/components/ui/Input.tsx'
import { HTMLInputTypeAttribute } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select.tsx'

type FormInputProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  labelWidth: number
  type?: HTMLInputTypeAttribute
  placeholder?: string
  disabled?: boolean
  isError?: boolean
}

function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  labelWidth,
  type = 'text',
  placeholder,
  disabled,
  isError
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid grid-flow-row lg:grid-cols-[auto_1fr] items-center gap-1">
          <FormLabel
            style={{ width: labelWidth }}
            className="whitespace-nowrap text-ellipsis overflow-hidden"
          >
            {label}
          </FormLabel>

          <FormControl className="bg-slate-100">
            <Input
              type={type}
              placeholder={placeholder} {...field}
              disabled={disabled}
              isError={isError}
            />
          </FormControl>

          <FormMessage className="lg:row-span-1 lg:col-start-2 lg:col-end-3" />
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
        <FormItem className="grid grid-flow-row lg:grid-cols-[auto_1fr] items-center gap-1">
          <FormLabel
            style={{ width: labelWidth }}
            className="whitespace-nowrap text-ellipsis overflow-hidden"
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
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage className="lg:row-span-1 lg:col-start-2 lg:col-end-3" />
        </FormItem>
      )}
    />
  )
}

export { FormInput, FormSelect }
