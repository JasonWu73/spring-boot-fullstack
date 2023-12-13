import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm, type UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/shared/components/ui/Button'
import { FormInput, FormSelect } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import LoadingButton from '@/shared/components/ui/LoadingButton'
import { ADMIN, ROOT, USER } from '@/shared/signals/auth'

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

export type QueryParams = {
  username: string
  nickname: string
  status: string
  authority: string
}

type UserSearchProps = {
  queryParams: QueryParams
  loading: boolean
  onSearch: (params: QueryParams) => void
}

const defaultValues: FormSchema = {
  username: '',
  nickname: '',
  status: '',
  authority: ''
}

export function UserSearch({ queryParams, loading, onSearch }: UserSearchProps) {
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
    setValue('username', queryParams.username)
    setValue('nickname', queryParams.nickname)
    setValue('status', queryParams.status)
    setValue('authority', queryParams.authority)
  }, [queryParams, setValue])
}
