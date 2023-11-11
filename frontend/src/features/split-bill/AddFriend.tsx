import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useFriends } from '@/features/split-bill/FriendProvider'
import { usePageTitle } from '@/hooks/use-title'
import { type Friend } from '@/services/fake/friend-api'
import { Button } from '@/ui/shadcn-ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/shadcn-ui/Card'
import { FormCalendar, FormInput } from '@/ui/shadcn-ui/CustomFormField'
import { Form } from '@/ui/shadcn-ui/Form'

const formSchema = z.object({
  name: z.string().min(1, '必须输入姓名'),
  image: z.string().url({ message: '图片必须是有效的 URL' }),
  birthday: z
    .date({ required_error: '必须选择好友生日' })
    .max(new Date(), '生日不能是未来的日期')
})

type FormSchema = z.infer<typeof formSchema>

function AddFriend() {
  usePageTitle('添加好友')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: 'https://i.pravatar.cc/150',
      birthday: undefined
    }
  })
  const { addFriend, setShowAddFriend } = useFriends()

  function onSubmit(values: FormSchema) {
    const newId = Date.now()
    const newFriend: Friend = {
      id: newId,
      name: values.name,
      image: `${values.image}?u=${newId}`,
      birthday: format(values.birthday, 'yyyy-MM-dd'),
      balance: 0,
      creditRating: 0
    }

    addFriend(newFriend)
    setShowAddFriend(false)
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      <CardHeader>
        <CardTitle>添加好友</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              control={form.control}
              name="name"
              type="text"
              label="👫 好友名字"
              labelWidth={100}
              placeholder="好友名字"
              isError={form.getFieldState('name')?.invalid}
            />

            <FormInput
              control={form.control}
              name="image"
              type="text"
              label="🌄 图片网址"
              labelWidth={100}
              placeholder="图片网址"
              isError={form.getFieldState('image')?.invalid}
            />

            <FormCalendar
              control={form.control}
              name="birthday"
              label="🎂 好友生日"
              labelWidth={100}
              placeholder="选择好友生日"
              disabledWhen={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
              isError={form.getFieldState('birthday')?.invalid}
            />

            <Button type="submit" className="self-end">
              添加
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export { AddFriend }
