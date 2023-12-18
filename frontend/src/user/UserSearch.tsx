import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm, type UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/shared/components/ui/Button'
import { FormInput, FormSelect } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import { URL_QUERY_KEY_PAGE_NUM, URL_QUERY_KEY_PAGE_SIZE } from '@/shared/constants'
import { ADMIN, ROOT, USER } from '@/shared/signals/auth'
import { useSearchParams } from 'react-router-dom'

const statusOptions = [
  { value: '', label: '全部' },
  { value: '0', label: '禁用' },
  { value: '1', label: '启用' }
]

const authorityOptions = [{ value: '', label: '全部' }, ROOT, ADMIN, USER]

const formSchema = z.object({
  username: z.string().trim(),
  nickname: z.string().trim(),
  status: z.string().trim(),
  authority: z.string().trim()
})

type FormSchema = z.infer<typeof formSchema>

const defaultValues: FormSchema = {
  username: '',
  nickname: '',
  status: '',
  authority: ''
}

export function UserSearch() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const [searchParams, setSearchParams] = useSearchParams()

  useQueryParams(searchParams, form.setValue)

  function onSubmit(values: FormSchema) {
    searchParams.delete(URL_QUERY_KEY_PAGE_NUM)
    searchParams.delete(URL_QUERY_KEY_PAGE_SIZE)
    searchParams.delete('username')
    searchParams.delete('nickname')
    searchParams.delete('status')
    searchParams.delete('authority')

    const { username, nickname, status, authority } = values

    if (username) searchParams.set('username', username)
    if (nickname) searchParams.set('nickname', nickname)
    if (status) searchParams.set('status', status)
    if (authority) searchParams.set('authority', authority)

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
        <FormInput
          control={form.control}
          name="username"
          type="text"
          label="用户名"
          labelWidth={45}
          placeholder="用户名"
          isError={form.getFieldState('username')?.invalid}
        />

        <FormInput
          control={form.control}
          name="nickname"
          type="text"
          label="昵称"
          labelWidth={45}
          placeholder="昵称"
          isError={form.getFieldState('nickname')?.invalid}
        />

        <FormSelect
          control={form.control}
          name="status"
          label="状态"
          labelWidth={45}
          options={statusOptions}
          isError={form.getFieldState('status')?.invalid}
        />

        <FormSelect
          control={form.control}
          name="authority"
          label="权限"
          labelWidth={45}
          options={authorityOptions}
          isError={form.getFieldState('authority')?.invalid}
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
    const username = searchParams.get('username') || ''
    const nickname = searchParams.get('nickname') || ''
    const status = searchParams.get('status') || ''
    const authority = searchParams.get('authority') || ''

    setValue('username', username)
    setValue('nickname', nickname)
    setValue('status', status)
    setValue('authority', authority)
  }, [searchParams, setValue])
}
