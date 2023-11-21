import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '@/auth/AuthProvider'
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
import { useRefresh } from '@/shared/hooks/use-router'
import { useTitle } from '@/shared/hooks/use-title'
import { ShieldPlus } from 'lucide-react'

const DEFAULT_REDIRECT_URL = '/admin'

const formSchema = z.object({
  username: z.string().min(1, '必须输入用户名'),
  password: z.string().min(1, '必须输入密码')
})

type FormSchema = z.infer<typeof formSchema>

export default function LoginPage() {
  useTitle('登录')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const location = useLocation()
  const [loading, setLoading] = React.useState(false)

  const { login, auth } = useAuth()
  const { toast, dismiss } = useToast()

  const originUrl = location.state?.from || DEFAULT_REDIRECT_URL

  useRefresh(() => {
    form.reset()
    dismiss()
  })

  if (auth) return <Navigate to={originUrl} replace />

  async function onSubmit(values: FormSchema) {
    setLoading(true)

    const { error } = await login(values.username, values.password)

    setLoading(false)

    if (error) {
      toast({
        title: '登录失败',
        description: error,
        variant: 'destructive'
      })
      return
    }

    return <Navigate to={originUrl} replace />
  }

  return (
    <Card className="mx-auto mt-8 w-96 md:w-[22rem] lg:w-[30rem]">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription className="flex items-center text-green-500 dark:text-green-600">
          <ShieldPlus className="mr-1 h-4 w-4" />
          支持用户名和密码加密传输
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
