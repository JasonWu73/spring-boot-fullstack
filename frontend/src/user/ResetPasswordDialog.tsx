import { zodResolver } from '@hookform/resolvers/zod'
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { PUBLIC_KEY, useAuth, type PaginationData } from '@/auth/AuthProvider'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/Alert'
import { Button } from '@/shared/components/ui/Button'
import { Code } from '@/shared/components/ui/Code'
import { FormInput } from '@/shared/components/ui/CustomFormField'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/Dialog'
import { Form } from '@/shared/components/ui/Form'
import { useToast } from '@/shared/components/ui/use-toast'
import type { SetStateAction } from '@/shared/hooks/use-fetch'
import { useFetch } from '@/shared/hooks/use-fetch'
import { encrypt } from '@/shared/utils/rsa'
import type { User } from '@/user/UserListPage'

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

type ResetPasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  updateState: (users: SetStateAction<PaginationData<User>>) => void
}

const defaultValues = {
  password: '',
  confirmPassword: ''
}

function ResetPasswordDialog({
  open,
  onOpenChange,
  user,
  updateState
}: ResetPasswordDialogProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const { requestApi } = useAuth()
  const {
    error,
    loading,
    fetchData,
    updateState: updateResetState
  } = useFetch(requestApi<void>)
  const { toast } = useToast()

  async function resetPassword(userId: number, password: string) {
    return await fetchData({
      url: `/api/v1/users/${userId}/password`,
      method: 'PUT',
      bodyData: { password: encrypt(PUBLIC_KEY, password) }
    })
  }

  async function onSubmit(values: FormSchema) {
    const { status } = await resetPassword(user.id, values.password)

    if (status !== 204) return

    updateState((prevState) => {
      if (!prevState.data) return prevState

      const newUsers = prevState.data.list.map((prevUser) => {
        if (prevUser.id === user.id) {
          return {
            ...prevUser,
            updatedAt: format(Date.now(), 'yyyy-MM-dd HH:mm:ss')
          }
        }

        return prevUser
      })

      return {
        ...prevState,
        data: {
          ...prevState.data,
          list: newUsers
        }
      }
    })

    resetForm()
    onOpenChange(false)

    toast({
      title: '重置用户密码成功',
      description: (
        <span>
          成功重置用户 <Code>{user.username}</Code> 登录密码
        </span>
      )
    })
  }

  function resetForm() {
    form.reset()

    updateResetState((prevState) => {
      return {
        ...prevState,
        error: undefined
      }
    })
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      resetForm()
    }

    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            重置用户 <Code>{user.username}</Code> 密码
          </DialogTitle>
          <DialogDescription>重置后，用户将使用新密码登录系统</DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  )
}

export { ResetPasswordDialog }
