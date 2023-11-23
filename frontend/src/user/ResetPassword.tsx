import { zodResolver } from '@hookform/resolvers/zod'
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { PUBLIC_KEY, useAuth, type PaginationData } from '@/auth/AuthProvider'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/Alert'
import { Button } from '@/shared/components/ui/Button'
import { Code } from '@/shared/components/ui/Code'
import { FormInput } from '@/shared/components/ui/CustomFormField'
import { DialogClose, DialogFooter } from '@/shared/components/ui/Dialog'
import { Form } from '@/shared/components/ui/Form'
import { useToast } from '@/shared/components/ui/use-toast'
import type { SetDataAction } from '@/shared/hooks/use-fetch'
import { useFetch } from '@/shared/hooks/use-fetch'
import { encrypt } from '@/shared/utils/rsa'
import type { User } from '@/user/UserListPage'
import { format } from 'date-fns'

const formSchema = z
  .object({
    password: z.string().min(1, '必须输入密码'),
    confirmPassword: z.string().min(1, '必须输入确认密码')
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: '密码和确认密码必须相同',
    path: ['confirmPassword']
  })

type FormSchema = z.infer<typeof formSchema>

type ResetPasswordProps = {
  userId: number
  updateUsers: (users: SetDataAction<PaginationData<User>>) => void
}

function ResetPassword({ userId, updateUsers }: ResetPasswordProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const { requestApi } = useAuth()
  const { error, loading, fetchData } = useFetch(requestApi<void>)

  async function resetPassword(password: string) {
    return await fetchData({
      url: `/api/v1/users/${userId}/password`,
      method: 'PUT',
      bodyData: { password: encrypt(PUBLIC_KEY, password) }
    })
  }

  const { toast } = useToast()

  async function onSubmit(values: FormSchema) {
    const { status } = await resetPassword(values.password)

    if (status === 204) {
      let username

      updateUsers((prevUsers) => {
        const newUsers = prevUsers.list.map((user) => {
          if (user.id === userId) {
            username = user.username

            return {
              ...user,
              updatedAt: format(Date.now(), 'yyyy-MM-dd HH:mm:ss')
            }
          }

          return user
        })

        return {
          ...prevUsers,
          list: newUsers
        }
      })

      toast({
        title: '重置用户密码成功',
        description: (
          <span>
            成功重置用户 <Code>{username}</Code> 登录密码
          </span>
        )
      })
      return
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col gap-4"
      >
        {!loading && error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>重置用户密码失败</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              取消
            </Button>
          </DialogClose>

          <Button type="submit" disabled={loading}>
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            提交
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export { ResetPassword }
