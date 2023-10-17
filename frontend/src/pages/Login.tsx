import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ReloadIcon } from '@radix-ui/react-icons'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { Form } from '@/components/ui/Form'
import { FormInput } from '@/components/ui/CustomFormField'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/use-toast'
import { useTitle } from '@/lib/use-title'
import { useFetch } from '@/lib/use-fetch'
import { useLocalStorageState } from '@/lib/use-storage'
import { useRefresh } from '@/lib/use-refresh'
import { type Auth, loginApi, STORAGE_KEY } from '@/api/dummyjson/auth'
import { wait } from '@/lib/utils'

const formSchema = z.object({
  username: z.string().trim().nonempty('Must enter a username'),
  password: z.string().trim().nonempty('Must enter a password')
})

type FormSchema = z.infer<typeof formSchema>

function Login() {
  useTitle('登录')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const [auth, setAuth] = useLocalStorageState<Auth | null>(STORAGE_KEY, null)

  const { toast, dismiss } = useToast()

  const { error, loading, login, resetLogin } = useLoginAPi()

  useRefresh(() => {
    form.reset()
    resetLogin()
    dismiss()
  })

  const navigate = useNavigate()

  const location = useLocation()
  const originUrl = location.state?.from || '/'

  if (auth && auth.token) {
    return <Navigate to={originUrl} replace />
  }

  async function onSubmit(values: FormSchema) {
    const { data, error } = await login(values)

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

      // 这里添加延迟，保证在设置 Token 后再执行页面跳转
      await wait(0.2)
      navigate(originUrl, { replace: true })
    }
  }

  return (
    <Card className="mx-auto mt-8 w-96 md:w-[22rem] lg:w-[30rem]">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        {error && (
          <CardDescription className="text-red-500 dark:text-red-600">
            {error}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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

function useLoginAPi() {
  const {
    error,
    loading,
    fetchData: login,
    reset: resetLogin
  } = useFetch<Auth, FormSchema>(async (values, signal) => {
    return await loginApi(
      {
        ...values!
      },
      signal
    )
  }, false)

  return { error, loading, login, resetLogin }
}

export { Login }
