import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { ADMIN, USER } from '@/auth/AuthProvider'
import { Button } from '@/shared/components/ui/Button'
import { FormInput, FormSelect } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import { URL_QUERY_KEY_PAGE_NUM, URL_QUERY_KEY_PAGE_SIZE } from '@/shared/utils/constants'

const statusOptions = [
  { value: '', label: '全部' },
  { value: '0', label: '禁用' },
  { value: '1', label: '启用' }
]

const authorityOptions = [{ value: '', label: '全部' }, ADMIN, USER]

const formSchema = z.object({
  username: z.string().trim(),
  nickname: z.string().trim(),
  status: z.string().trim(),
  authority: z.string().trim()
})

type FormSchema = z.infer<typeof formSchema>

type UserSearchProps = {
  loading: boolean
}

const defaultValues = {
  username: '',
  nickname: '',
  status: '',
  authority: ''
}

function UserSearch({ loading }: UserSearchProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })
  const [searchParams, setSearchParams] = useSearchParams()

  React.useEffect(() => {
    const username = searchParams.get('username') || ''
    const nickname = searchParams.get('nickname') || ''
    const status = searchParams.get('status') || ''
    const authority = searchParams.get('authority') || ''

    form.setValue('username', username)
    form.setValue('nickname', nickname)
    form.setValue('status', status)
    form.setValue('authority', authority)
  }, [searchParams, form])

  function onSubmit(values: FormSchema) {
    searchParams.delete(URL_QUERY_KEY_PAGE_NUM)
    searchParams.delete(URL_QUERY_KEY_PAGE_SIZE)
    searchParams.delete('username')
    searchParams.delete('username')
    searchParams.delete('nickname')
    searchParams.delete('status')
    searchParams.delete('authority')

    if (values.username) searchParams.set('username', values.username)
    if (values.nickname) searchParams.set('nickname', values.nickname)
    if (values.status) searchParams.set('status', values.status)
    if (values.authority) searchParams.set('authority', values.authority)

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

export { UserSearch }
