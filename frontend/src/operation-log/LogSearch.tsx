import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format, parse } from 'date-fns'
import React from 'react'
import { useForm, type UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/shared/components/ui/Button'
import { FormCalendar, FormInput } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import { URL_QUERY_KEY_PAGE_NUM, URL_QUERY_KEY_PAGE_SIZE } from '@/shared/constants'
import { useSearchParams } from 'react-router-dom'

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

const defaultValues: FormSchema = {
  startAt: addDays(new Date(), -6),
  endAt: new Date(),
  clientIp: '',
  username: '',
  message: ''
}

export function LogSearch() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const [searchParams, setSearchParams] = useSearchParams()

  useQueryParams(searchParams, form.setValue)

  function onSubmit(values: FormSchema) {
    searchParams.delete(URL_QUERY_KEY_PAGE_NUM)
    searchParams.delete(URL_QUERY_KEY_PAGE_SIZE)
    searchParams.delete('startAt')
    searchParams.delete('endAt')
    searchParams.delete('clientIp')
    searchParams.delete('username')
    searchParams.delete('message')

    const { startAt, endAt, clientIp, username, message } = values

    if (startAt) searchParams.set('startAt', format(startAt, 'yyyy-MM-dd'))
    if (endAt) searchParams.set('endAt', format(endAt, 'yyyy-MM-dd'))
    if (clientIp) searchParams.set('clientIp', clientIp)
    if (username) searchParams.set('username', username)
    if (message) searchParams.set('message', message)

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

        <Button type="submit" className="self-end">
          查询
        </Button>

        <Button type="reset" variant="outline" onClick={handleReset} className="self-end">
          重置
        </Button>
      </form>
    </Form>
  )
}

function useQueryParams(
  searchParams: URLSearchParams,
  setValue: UseFormSetValue<FormSchema>
) {
  React.useEffect(() => {
    const startAtStr = searchParams.get('startAt')
    const startAt = startAtStr
      ? parse(startAtStr, 'yyyy-MM-dd', new Date())
      : addDays(new Date(), -6)

    const endAtStr = searchParams.get('endAt')
    const endAt = endAtStr ? parse(endAtStr, 'yyyy-MM-dd', new Date()) : new Date()

    const clientIp = searchParams.get('clientIp') || ''
    const username = searchParams.get('username') || ''
    const message = searchParams.get('message') || ''

    setValue('startAt', startAt)
    setValue('endAt', endAt)
    setValue('clientIp', clientIp)
    setValue('username', username)
    setValue('message', message)
  }, [searchParams, setValue])
}
