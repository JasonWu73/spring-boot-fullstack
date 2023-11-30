import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'

import { useAuth, type AuthResponse } from '@/shared/auth/AuthProvider'
import { Button } from '@/shared/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { FormInput } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import { useToast } from '@/shared/components/ui/use-toast'
import { RSA_PUBLIC_KEY } from '@/shared/constants'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useTitle } from '@/shared/hooks/use-title'
import { encrypt } from '@/shared/utils/rsa'
import { ShieldPlus } from 'lucide-react'

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

function LoginPage() {
  useTitle('登录')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })
  const location = useLocation()

  const { auth, requestApi, setAuth } = useAuth()
  const { loading, fetchData } = useFetch(requestApi<AuthResponse>)
  const { toast } = useToast()

  const targetUrl = location.state?.from || DEFAULT_REDIRECT_URL

  if (auth) return <Navigate to={targetUrl} replace />

  async function login(username: string, password: string) {
    return await fetchData({
      url: '/api/v1/auth/login',
      method: 'POST',
      bodyData: {
        username: encrypt(RSA_PUBLIC_KEY, username),
        password: encrypt(RSA_PUBLIC_KEY, password)
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

    setAuth(data!)

    return <Navigate to={targetUrl} replace />
  }

  return (
    <Card className="mx-auto mt-8 w-96 md:w-[22rem] lg:mt-24 lg:w-[30rem]">
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

            <Button type="submit" disabled={loading}>
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              登录
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LoginPage