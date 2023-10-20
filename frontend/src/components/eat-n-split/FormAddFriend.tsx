import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Form } from '@/components/ui/Form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { FormCalendar, FormInput } from '@/components/ui/CustomFormField'
import { useTitle } from '@/hooks/use-title'
import { type Friend } from '@/api/fake/friend'
import { useFriends } from '@/components/eat-n-split/FriendProvider'
import { format } from 'date-fns'

const formSchema = z.object({
  name: z.string().nonempty('必须输入姓名'),
  image: z.string().url({ message: '图片必须是有效的 URL' }),
  birthday: z
    .date({ required_error: '必须选择好友生日' })
    .max(new Date(), '生日不能是未来的日期')
})

type FormSchema = z.infer<typeof formSchema>

function FormAddFriend() {
  useTitle('添加好友')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: '', // https://i.pravatar.cc/150?u=xxx
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
              label="👫 朋友名字"
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

export { FormAddFriend }
