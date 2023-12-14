import { zodResolver } from '@hookform/resolvers/zod'
import { addDays } from 'date-fns'
import React from 'react'
import { useForm, type UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/shared/components/ui/Button'
import { FormCalendar, FormInput } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import LoadingButton from '@/shared/components/ui/LoadingButton'

const formSchema = z.object({
  startAt: z
    .date({ required_error: '必须选择开始日期' })
    .max(addDays(new Date(), +1), '开始日期不能是未来的日期'),
  endAt: z
    .date({ required_error: '必须选择结束日期' })
    .max(addDays(new Date(), +1), '结束日期不能是未来的日期'),
  clientIp: z.string().trim(),
  username: z.string().trim(),
  message: z.string().trim()
})

type FormSchema = z.infer<typeof formSchema>

export type QueryParams = {
  startAt: Date
  endAt: Date
  clientIp: string
  username: string
  message: string
}

type OperationLogSearchProps = {
  queryParams: QueryParams
  loading: boolean
  onSearch: (params: QueryParams) => void
}

const defaultValues: FormSchema = {
  startAt: addDays(new Date(), -6),
  endAt: new Date(),
  clientIp: '',
  username: '',
  message: ''
}

export function LogSearch({ queryParams, loading, onSearch }: OperationLogSearchProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  useQueryParams(queryParams, form.setValue)

  function onSubmit(values: FormSchema) {
    onSearch(values)
  }

  function handleReset() {
    form.reset()
    onSubmit(defaultValues)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-8 flex flex-wrap items-center gap-4"
      >
        <FormCalendar
          control={form.control}
          name="startAt"
          label="开始日期"
          labelWidth={60}
          placeholder="开始日期"
          disabledWhen={(date) => date > new Date() || date < new Date('1900-01-01')}
          isError={form.getFieldState('startAt')?.invalid}
        />

        <FormCalendar
          control={form.control}
          name="endAt"
          label="结束日期"
          labelWidth={60}
          placeholder="结束日期"
          disabledWhen={(date) => date > new Date() || date < new Date('1900-01-01')}
          isError={form.getFieldState('endAt')?.invalid}
        />

        <FormInput
          control={form.control}
          name="clientIp"
          type="text"
          label="客户端 IP"
          labelWidth={60}
          placeholder="客户端 IP"
          isError={form.getFieldState('clientIp')?.invalid}
        />

        <FormInput
          control={form.control}
          name="username"
          type="text"
          label="用户名"
          labelWidth={60}
          placeholder="用户名"
          isError={form.getFieldState('username')?.invalid}
        />

        <FormInput
          control={form.control}
          name="message"
          type="text"
          label="操作描述"
          labelWidth={60}
          placeholder="操作描述"
          isError={form.getFieldState('message')?.invalid}
        />

        <LoadingButton type="submit" loading={loading} className="self-end">
          查询
        </LoadingButton>

        <Button
          type="reset"
          variant="outline"
          disabled={loading}
          onClick={handleReset}
          className="self-end"
        >
          重置
        </Button>
      </form>
    </Form>
  )
}

function useQueryParams(queryParams: QueryParams, setValue: UseFormSetValue<FormSchema>) {
  React.useEffect(() => {
    setValue('startAt', queryParams.startAt)
    setValue('endAt', queryParams.endAt)
    setValue('clientIp', queryParams.clientIp)
    setValue('username', queryParams.username)
    setValue('message', queryParams.message)
  }, [queryParams, setValue])
}
