import { zodResolver } from '@hookform/resolvers/zod'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { requestApi } from '@/shared/apis/backend/helpers'
import type { User } from '@/shared/apis/backend/user'
import type { PaginationData } from '@/shared/apis/types'
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
import LoadingButton from '@/shared/components/ui/LoadingButton'
import { useToast } from '@/shared/components/ui/use-toast'
import { useFetch, type ApiResponse } from '@/shared/hooks/use-fetch'
import { PUBLIC_KEY } from '@/shared/auth/auth'
import { encrypt } from '@/shared/utils/rsa'

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
  invalidateUsers: () => Promise<ApiResponse<PaginationData<User>>>
}

const defaultValues: FormSchema = {
  password: '',
  confirmPassword: ''
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  user,
  invalidateUsers
}: ResetPasswordDialogProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const { loading, error, fetchData, reset } = useFetch(requestApi<void>)

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

    invalidateUsers().then()

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

    reset()
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      resetForm()
    }

    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
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

              <LoadingButton type="submit" loading={loading}>
                提交
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
