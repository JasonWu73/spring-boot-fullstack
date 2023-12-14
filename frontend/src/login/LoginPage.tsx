import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'

import { requestApi } from '@/shared/apis/backend/helpers'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { FormInput } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import LoadingButton from '@/shared/components/ui/LoadingButton'
import { useToast } from '@/shared/components/ui/use-toast'
import { useApi } from '@/shared/hooks/use-api'
import { useTitle } from '@/shared/hooks/use-title'
import { PUBLIC_KEY, getAuth, setAuth, type AuthResponse } from '@/shared/signals/auth'
import { encrypt } from '@/shared/utils/rsa'

const DEFAULT_REDIRECT_URL = '/admin'

const formSchema = z.object({
  username: z.string().min(1, '必须输入用户名'),
  password: z.string().min(1, '必须输入密码')
})

type FormSchema = z.infer<typeof formSchema>

const defaultValues: FormSchema = {
  username: '',
  password: ''
}

export default function LoginPage() {
  useTitle('登录')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const {
    state: { loading },
    requestData
  } = useApi(requestApi<AuthResponse>)

  const { toast } = useToast()

  const location = useLocation()
  const targetUrl = location.state?.from || DEFAULT_REDIRECT_URL

  // 已登录则跳转到目标页面，即登录后就不允许再访问登录页面
  if (getAuth()) return <Navigate to={targetUrl} replace />

  async function login(username: string, password: string) {
    return await requestData({
      url: '/api/v1/auth/login',
      method: 'POST',
      bodyData: {
        username: encrypt(PUBLIC_KEY, username),
        password: encrypt(PUBLIC_KEY, password)
      }
    })
  }

  async function onSubmit(values: FormSchema) {
    const { data, error } = await login(values.username, values.password)

    if (error) {
      toast({
        title: '登录失败',
        description: error,
        variant: 'destructive'
      })
      return
    }

    if (data) {
      setAuth(data)
    }

    return <Navigate to={targetUrl} replace />
  }

  return (
    <Card className="mx-auto mt-8 max-w-md lg:mt-24">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription className="flex items-center text-green-500 dark:text-green-600">
          <ShieldPlus className="mr-1 h-4 w-4" />
          用户名和密码进行加密传输，且不会被保存在本地
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex flex-col gap-4"
          >
            <FormInput
              control={form.control}
              name="username"
              type="text"
              label="用户名"
              labelWidth={100}
              placeholder="用户名"
              isError={form.getFieldState('username')?.invalid}
            />

            <FormInput
              control={form.control}
              name="password"
              type="password"
              label="密码"
              labelWidth={100}
              placeholder="密码"
              isError={form.getFieldState('password')?.invalid}
            />

            <LoadingButton type="submit" loading={loading}>
              登录
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
