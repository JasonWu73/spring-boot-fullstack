import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { addUserApi } from '@/shared/apis/backend/user'
import { Button } from '@/shared/components/ui/Button'
import { Code } from '@/shared/components/ui/Code'
import {
  FormInput,
  FormMultiSelect,
  FormTextarea
} from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import LoadingButton from '@/shared/components/ui/LoadingButton'
import { useToast } from '@/shared/components/ui/use-toast'
import { useFetch } from '@/shared/hooks/use-fetch'
import { ADMIN, USER } from '@/shared/signals/auth'

const AUTHORITY_OPTIONS = [ADMIN, USER]

const formSchema = z
  .object({
    username: z.string().min(1, '必须输入用户名').trim(),
    nickname: z.string().min(1, '必须输入昵称').trim(),
    password: z.string().min(1, '必须输入密码'),
    confirmPassword: z.string().min(1, '必须输入确认密码'),
    authorities: z.array(z.record(z.string().trim())),
    remark: z.string().trim()
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: '密码和确认密码必须相同',
    path: ['confirmPassword']
  })

type FormSchema = z.infer<typeof formSchema>

const defaultValues: FormSchema = {
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  authorities: [],
  remark: ''
}

export function AddUser() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const { loading: submitting, fetchData: addUser } = useFetch(addUserApi)

  const { toast } = useToast()
  const navigate = useNavigate()

  async function onSubmit(values: FormSchema) {
    const { status, error } = await addUser({
      username: values.username,
      nickname: values.nickname,
      password: values.password,
      authorities: values.authorities.map((authority) => authority.value),
      remark: values.remark
    })

    if (status !== 204) {
      toast({
        title: '新增用户失败',
        description: error,
        variant: 'destructive'
      })

      return
    }

    toast({
      title: '新增用户成功',
      description: (
        <span>
          成功新增用户 <Code>{values.username}</Code>
        </span>
      )
    })

    goBackToUserListPage()
  }

  function goBackToUserListPage() {
    return navigate('/users')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          name="nickname"
          type="text"
          label="昵称"
          labelWidth={60}
          placeholder="昵称"
          isError={form.getFieldState('nickname')?.invalid}
        />

        <FormInput
          control={form.control}
          name="password"
          type="password"
          label="密码"
          labelWidth={60}
          placeholder="密码"
          isError={form.getFieldState('password')?.invalid}
        />

        <FormInput
          control={form.control}
          name="confirmPassword"
          type="password"
          label="确认密码"
          labelWidth={60}
          placeholder="确认密码"
          isError={form.getFieldState('confirmPassword')?.invalid}
        />

        <FormMultiSelect
          control={form.control}
          name="authorities"
          label="功能权限"
          labelWidth={60}
          placeholder="请选择功能权限"
          options={AUTHORITY_OPTIONS}
          isError={form.getFieldState('authorities')?.invalid}
        />

        <FormTextarea
          control={form.control}
          name="remark"
          label="备注"
          labelWidth={60}
          placeholder="备注"
          isError={form.getFieldState('remark')?.invalid}
        />

        <div className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={goBackToUserListPage}
          >
            返回
          </Button>

          <LoadingButton type="submit" loading={submitting} className="self-end">
            提交
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
