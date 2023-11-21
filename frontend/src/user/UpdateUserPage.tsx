import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AUTHORITY_OPTIONS } from '@/auth/AuthProvider'
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

const formSchema = z.object({
  nickname: z.string().min(1, '必须输入昵称').trim(),
  authorities: z.array(z.record(z.string().trim())).min(1, '必须选择功能权限'),
  remark: z.string().trim()
})

type FormSchema = z.infer<typeof formSchema>

export default function UpdateUserPage() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: '',
      authorities: [{ value: 'user', label: '用户' }],
      remark: ''
    }
  })

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              <Button type="button" variant="outline">
                返回
              </Button>

              <Button type="submit" className="self-end">
                提交
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
