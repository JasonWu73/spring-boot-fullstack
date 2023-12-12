import { zodResolver } from '@hookform/resolvers/zod'
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/shared/components/ui/Accordion'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/Alert'
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
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { useToast } from '@/shared/components/ui/use-toast'
import { useApi } from '@/shared/hooks/use-api'
import { useInitial } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import { PUBLIC_KEY, clearAuth, requestApi, updateNickname } from '@/shared/signals/auth'
import { encrypt } from '@/shared/utils/rsa'
import type { User } from '@/user/UserListPage'

const formSchema = z
  .object({
    nickname: z.string().min(1, '必须输入昵称').trim(),
    oldPassword: z.string().trim(),
    newPassword: z.string().trim(),
    confirmPassword: z.string().trim()
  })
  .refine(
    ({ oldPassword, newPassword }) =>
      (oldPassword && newPassword) || (!oldPassword && !newPassword),
    {
      message: '新旧密码必须同时存在或不存在',
      path: ['newPassword']
    }
  )
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: '新密码和确认密码必须相同',
    path: ['confirmPassword']
  })

type FormSchema = z.infer<typeof formSchema>

type UpdateUserParams = {
  nickname: string
  oldPassword?: string
  newPassword?: string
}

const defaultValues: FormSchema = {
  nickname: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}

export default function UpdateUserPage() {
  useTitle('个人资料')

  useInitial(() => {
    getUser().then(({ data }) => {
      if (data) {
        initializeUserData(data)
      }
    })
  })

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const {
    state: { loading, data: user, error },
    requestData: fetchUser
  } = useApi(requestApi<User>)

  const {
    state: { loading: submitting },
    requestData: fetchUpdate
  } = useApi(requestApi<void>)

  const { toast } = useToast()

  async function getUser() {
    return await fetchUser({ url: '/api/v1/users/me' })
  }

  function initializeUserData(user: User) {
    form.reset({
      nickname: user.nickname,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  async function updateUser({ nickname, oldPassword, newPassword }: UpdateUserParams) {
    return await fetchUpdate({
      url: '/api/v1/users/me',
      method: 'PUT',
      bodyData: {
        nickname,
        oldPassword: oldPassword ? encrypt(PUBLIC_KEY, oldPassword) : null,
        newPassword: newPassword ? encrypt(PUBLIC_KEY, newPassword) : null
      }
    })
  }

  async function onSubmit(values: FormSchema) {
    if (!user) return

    const { status, error } = await updateUser({
      nickname: values.nickname,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    })

    if (status !== 204) {
      toast({
        title: '更新资料失败',
        description: error,
        variant: 'destructive'
      })
      return
    }

    toast({
      title: '更新资料成功',
      description: <span>您已成功更新个人资料。</span>
    })

    // 若修改了密码，则需要重新登录
    if (values.newPassword) {
      // 修改密码时，后端会自动退出登录，所以前端只要删除已保存的身份验证信息即可
      clearAuth()
      return
    }

    // 更新已保存的身份验证信息
    updateNickname(values.nickname)
  }

  return (
    <Card className="mx-auto w-full md:w-4/5 lg:w-2/3">
      <CardHeader>
        <CardTitle>个人资料</CardTitle>
        <CardDescription>您的个人资料</CardDescription>
      </CardHeader>

      <CardContent>
        {loading && <FormSkeleton />}

        {!loading && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>获取个人资料失败</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormInput
                control={form.control}
                name="nickname"
                type="text"
                label="昵称"
                labelWidth={60}
                placeholder="昵称"
                isError={form.getFieldState('nickname')?.invalid}
              />

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>修改密码</AccordionTrigger>

                  <AccordionContent className="space-y-2 p-2">
                    <FormInput
                      control={form.control}
                      name="oldPassword"
                      type="password"
                      label="旧密码"
                      labelWidth={60}
                      placeholder="旧密码，不需要修改密码则不用填"
                      isError={form.getFieldState('oldPassword')?.invalid}
                    />

                    <FormInput
                      control={form.control}
                      name="newPassword"
                      type="password"
                      label="新密码"
                      labelWidth={60}
                      placeholder="新密码，不需要修改密码则不用填"
                      isError={form.getFieldState('newPassword')?.invalid}
                    />

                    <FormInput
                      control={form.control}
                      name="confirmPassword"
                      type="password"
                      label="确认密码"
                      labelWidth={60}
                      placeholder="确认密码，不需要修改密码则不用填"
                      isError={form.getFieldState('confirmPassword')?.invalid}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex gap-2 sm:justify-end">
                <Button type="submit" className="self-end" disabled={submitting}>
                  {submitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                  提交
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 1 }, (_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="grid grid-flow-row items-center gap-2 lg:grid-cols-[auto_1fr]">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9" />
          </div>
        </div>
      ))}

      <div className="border-b pb-4">
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="flex gap-2 sm:justify-end">
        <Skeleton className="h-9 w-20 self-end" />
      </div>
    </div>
  )
}
