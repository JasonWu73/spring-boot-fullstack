import {Navigate, useLocation} from 'react-router-dom'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {ReloadIcon} from '@radix-ui/react-icons'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/ui/shadcn-ui/Card'
import {Form} from '@/ui/shadcn-ui/Form'
import {FormInput} from '@/ui/shadcn-ui/CustomFormField'
import {Button} from '@/ui/shadcn-ui/Button'
import {useToast} from '@/ui/shadcn-ui/use-toast'
import {useTitle} from '@/hooks/use-title'
import {useRefresh} from '@/hooks/use-refresh'
import {useAuth} from '@/features/auth/AuthProvider'
import {useEffect, useRef} from 'react'
import {type AbortCallback} from '@/hooks/use-fetch'

const DEFAULT_REDIRECT_URL = '/admin'

const USERNAME = 'jissetts'
const PASSWORD = 'ePawWgrnZR8L'

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
      username: USERNAME,
      password: PASSWORD
    }
  })

  const {toast, dismiss} = useToast()
  const {auth, error, loading, login} = useAuth()
  const abortLoginRef = useRef<AbortCallback>()

  useErrorToast(error, toast)

  useRefresh(() => {
    form.reset()
    dismiss()

    abortLoginRef.current && abortLoginRef.current()
  })

  const location = useLocation()
  const originUrl = location.state?.from || DEFAULT_REDIRECT_URL
  if (auth) return <Navigate to={originUrl} replace/>

  function onSubmit(values: FormSchema) {
    abortLoginRef.current = login(values.username, values.password)
  }

  return (
    <Card className="md:w-[22rem] lg:w-[30rem] mx-auto mt-8 w-96 border-slate-200 bg-slate-200">
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
              {loading && <ReloadIcon className="mr-2 w-4 h-4 animate-spin"/>}
              登录
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function useErrorToast(error: string, toast: ReturnType<typeof useToast>['toast']) {
  useEffect(() => {
    if (error) {
      toast({
        title: '登录失败',
        description: error,
        variant: 'destructive'
      })
    }
  }, [error, toast])
}
