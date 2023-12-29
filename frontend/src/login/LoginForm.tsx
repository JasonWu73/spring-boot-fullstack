import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'

import { loginApi } from '@/shared/apis/backend/auth'
import { FormInput } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import LoadingButton from '@/shared/components/ui/LoadingButton'
import { useToast } from '@/shared/components/ui/use-toast'
import { useFetch } from '@/shared/hooks/use-fetch'
import { getAuth, setAuth } from '@/shared/auth/auth-signals'

const DEFAULT_REDIRECT_URL = '/'

const formSchema = z.object({
  username: z.string().min(1, '必须输入用户名'),
  password: z.string().min(1, '必须输入密码')
})

type FormSchema = z.infer<typeof formSchema>

const defaultValues: FormSchema = {
  username: '',
  password: ''
}

export function LoginForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const { loading, fetchData: login } = useFetch(
    async ({ username, password }: FormSchema) => await loginApi(username, password)
  )

  const { toast } = useToast()

  const location = useLocation()
  const targetUrl = location.state?.from || DEFAULT_REDIRECT_URL

  // 已登录则跳转到目标页面，即登录后就不允许再访问登录页面
  if (getAuth()) return <Navigate to={targetUrl} replace />

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
    }

    return <Navigate to={targetUrl} replace />
  }

  return (
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
  )
}
