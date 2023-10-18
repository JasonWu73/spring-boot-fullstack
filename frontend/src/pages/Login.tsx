import { Navigate, useLocation } from 'react-router-dom'
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
import { useTitle } from '@/hooks/use-title'
import { useFetch } from '@/hooks/use-fetch'
import { useRefresh } from '@/hooks/use-refresh'
import {
  type Auth,
  getAuthFromLocalStorage,
  loginApi,
  setAuthToLocalStorage
} from '@/api/dummyjson/auth'

const USERNAME = 'jissetts'
const PASSWORD = 'ePawWgrnZR8L'

const formSchema = z.object({
  username: z.string().nonempty('Must enter a username'),
  password: z.string().nonempty('Must enter a password')
})

type FormSchema = z.infer<typeof formSchema>

function Login() {
  useTitle('登录')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: USERNAME,
      password: PASSWORD
    }
  })

  const auth = getAuthFromLocalStorage()

  const { toast, dismiss } = useToast()

  const { error, loading, login, resetLogin } = useLoginAPi()

  useRefresh(() => {
    form.reset()
    resetLogin()
    dismiss()
  })

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
      setAuthToLocalStorage(data)
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
