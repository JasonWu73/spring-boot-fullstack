import { zodResolver } from '@hookform/resolvers/zod'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { ADMIN, ROOT, useAuth, USER } from '@/auth/AuthProvider'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/Alert'
import { Button } from '@/shared/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import {
  FormInput,
  FormMultiSelect,
  FormTextarea
} from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-router'
import { useTitle } from '@/shared/hooks/use-title'
import type { User } from '@/user/UserListPage'

const AUTHORITY_OPTIONS = [ADMIN, USER]

const formSchema = z.object({
  nickname: z.string().min(1, '必须输入昵称').trim(),
  authorities: z.array(z.record(z.string().trim())).min(1, '必须选择功能权限'),
  remark: z.string().trim()
})

type FormSchema = z.infer<typeof formSchema>

export default function UpdateUserPage() {
  useTitle('用户详情')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: '',
      authorities: [],
      remark: ''
    }
  })

  const { userId } = useParams()
  const navigate = useNavigate()

  const { requestApi } = useAuth()

  const {
    data: user,
    error,
    loading,
    fetchData: getUser
  } = useFetch(async () => {
    return await requestApi<User>({ url: `/api/v1/users/${userId}` })
  })

  useRefresh(() => {
    const ignore = getUser()

    return () => ignore()
  })

  React.useEffect(() => {
    if (!user) return

    form.reset({
      nickname: user.nickname,
      authorities: user.authorities.map((authority) => ({
        value: authority,
        label:
          authority === ROOT.value
            ? ROOT.label
            : authority === ADMIN.value
            ? ADMIN.label
            : authority === USER.value
            ? USER.label
            : ''
      })),
      remark: user.remark
    })
  }, [user, form])

  async function onSubmit(values: FormSchema) {
    console.log(values)
  }

  return (
    <Card className="mx-auto w-full md:w-4/5 lg:w-2/3">
      <CardHeader>
        <CardTitle>用户详情</CardTitle>
        <CardDescription>用户详情信息</CardDescription>
      </CardHeader>

      <CardContent>
        {!loading && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>获取用户详情失败</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <p>
                <label className="inline-block w-[80px]">用户名：</label>
                <span>{user?.username}</span>
              </p>
              <p>
                <label>账号状态：</label>
                <span>
                  {user?.status === 1 ? (
                    <span className="text-green-500 dark:text-green-600">启用</span>
                  ) : (
                    <span className="text-red-500 dark:text-red-600">禁用</span>
                  )}
                </span>
              </p>
              <p>
                <label>创建时间：</label>
                <span>{user?.createdAt}</span>
              </p>
              <p>
                <label>更新时间：</label>
                <span>{user?.updatedAt}</span>
              </p>

              <FormInput
                control={form.control}
                name="nickname"
                type="text"
                label="昵称"
                labelWidth={60}
                placeholder="昵称"
                isError={form.getFieldState('nickname')?.invalid}
              />

              <FormMultiSelect
                control={form.control}
                name="authorities"
                label="功能权限"
                labelWidth={60}
                placeholder="请选择功能权限"
                options={AUTHORITY_OPTIONS}
                isError={form.getFieldState('authorities')?.invalid}
              />

              <FormTextarea
                control={form.control}
                name="remark"
                label="备注"
                labelWidth={60}
                placeholder="备注"
                isError={form.getFieldState('remark')?.invalid}
              />

              <div className="flex gap-2 sm:justify-end">
                <Button
                  onClick={() => navigate('/users')}
                  type="button"
                  variant="outline"
                >
                  返回
                </Button>

                <Button type="submit" className="self-end">
                  提交
                </Button>
              </div>
            </form>
          </Form>
        )}

        {loading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>

            <div className="flex gap-2 sm:justify-end">
              <Skeleton className="h-9 w-20 self-end" />
              <Skeleton className="h-9 w-20 self-end" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
