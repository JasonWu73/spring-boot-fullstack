import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { getAccessTokenApi, Token } from '@/api/fake/auth-api'
import { useRefresh } from '@/lib/use-refresh'

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

  const [token, setToken] = useLocalStorageState('demo-token', '')

  const { error, loading, login, resetLoginState } = useLoginAPi(setToken)

  useRefresh(() => {
    form.reset()
    resetLoginState()
  })

  useRedirectIfLoggedIn(token)

  async function onSubmit(values: FormSchema) {
    await login(values)
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

function useLoginAPi(setToken: React.Dispatch<React.SetStateAction<string>>) {
  const { toast } = useToast()

  const {
    error,
    loading,
    fetchData: login,
    reset: resetLoginState
  } = useFetch<Token, FormSchema>(async (values, signal) => {
    const { data, error } = await getAccessTokenApi({
      ...values!,
      signal
    })

    if (error) {
      toast({
        title: '登录失败',
        description: error,
        variant: 'destructive'
      })
    }

    if (data) {
      setToken(data.accessToken)
    }

    return { data, error }
  }, false)

  return { error, loading, login, resetLoginState }
}

function useRedirectIfLoggedIn(token: string) {
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true })
    }
  }, [token, navigate])
}

export { Login }
