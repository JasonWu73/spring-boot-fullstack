import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { addDays, format, parse } from 'date-fns'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/shared/components/ui/Button'
import { FormCalendar, FormInput } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import { URL_QUERY_KEY_PAGE_NUM, URL_QUERY_KEY_PAGE_SIZE } from '@/shared/constants'

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

type OperationLogSearchProps = {
  loading: boolean
}

const defaultValues: FormSchema = {
  startAt: addDays(new Date(), -6),
  endAt: new Date(),
  clientIp: '',
  username: '',
  message: ''
}

function OperationLogSearch({ loading }: OperationLogSearchProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })
  const [searchParams, setSearchParams] = useSearchParams()

  React.useEffect(() => {
    const startAt = searchParams.get('startAt')
    const endAt = searchParams.get('endAt')
    const clientIp = searchParams.get('clientIp') || ''
    const username = searchParams.get('username') || ''
    const message = searchParams.get('message') || ''

    form.setValue(
      'startAt',
      startAt ? parse(startAt, 'yyyy-MM-dd', new Date()) : addDays(new Date(), -6)
    )
    form.setValue('endAt', endAt ? parse(endAt, 'yyyy-MM-dd', new Date()) : new Date())
    form.setValue('clientIp', clientIp)
    form.setValue('username', username)
    form.setValue('message', message)
  }, [searchParams, form])

  function onSubmit(values: FormSchema) {
    searchParams.delete(URL_QUERY_KEY_PAGE_NUM)
    searchParams.delete(URL_QUERY_KEY_PAGE_SIZE)
    searchParams.delete('startAt')
    searchParams.delete('endAt')
    searchParams.delete('clientIp')
    searchParams.delete('username')
    searchParams.delete('message')

    if (values.startAt) searchParams.set('startAt', format(values.startAt, 'yyyy-MM-dd'))
    if (values.endAt) searchParams.set('endAt', format(values.endAt, 'yyyy-MM-dd'))
    if (values.clientIp) searchParams.set('clientIp', values.clientIp)
    if (values.username) searchParams.set('username', values.username)
    if (values.message) searchParams.set('message', values.message)

    setSearchParams(searchParams, { replace: true })
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

        <Button type="submit" className="self-end" disabled={loading}>
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          查询
        </Button>

        <Button
          onClick={handleReset}
          type="reset"
          variant="outline"
          className="self-end"
          disabled={loading}
        >
          重置
        </Button>
      </form>
    </Form>
  )
}

export { OperationLogSearch }
