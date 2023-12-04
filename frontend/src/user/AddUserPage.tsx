import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { PUBLIC_KEY, useAuth } from '@/shared/auth/AuthProvider'
import { ADMIN, USER } from '@/shared/auth/constants'
import { Button } from '@/shared/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { Code } from '@/shared/components/ui/Code'
import {
  FormInput,
  FormMultiSelect,
  FormTextarea
} from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import { useToast } from '@/shared/components/ui/use-toast'
import { useApi } from '@/shared/hooks/use-api'
import { useTitle } from '@/shared/hooks/use-title'
import { encrypt } from '@/shared/utils/rsa'

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

type AddUserParams = {
  username: string
  nickname: string
  password: string
  authorities: string[]
  remark: string
}

const defaultValues: FormSchema = {
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  authorities: [],
  remark: ''
}

export default function AddUserPage() {
  useTitle('新增用户')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })
  const navigate = useNavigate()

  const { requestApi } = useAuth()
  const { loading: submitting, requestData } = useApi(requestApi<void>)
  const { toast } = useToast()

  async function addUser({
    username,
    nickname,
    password,
    authorities,
    remark
  }: AddUserParams) {
    return await requestData({
      url: '/api/v1/users',
      method: 'POST',
      bodyData: {
        username,
        nickname,
        password: encrypt(PUBLIC_KEY, password),
        authorities,
        remark
      }
    })
  }

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

    backToUserListPage()
  }

  function backToUserListPage() {
    return navigate('/users')
  }

  return (
    <Card className="mx-auto w-full md:w-4/5 lg:w-2/3">
      <CardHeader>
        <CardTitle>新增用户</CardTitle>
        <CardDescription>创建可登录系统的账号</CardDescription>
      </CardHeader>

      <CardContent>
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
                onClick={backToUserListPage}
                type="button"
                variant="outline"
                disabled={submitting}
              >
                返回
              </Button>

              <Button type="submit" className="self-end" disabled={submitting}>
                {submitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                提交
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
