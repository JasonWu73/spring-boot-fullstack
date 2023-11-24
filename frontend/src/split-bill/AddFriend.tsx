import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { FormCalendar, FormInput } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import { useTitle } from '@/shared/hooks/use-title'
import { useFriends } from '@/split-bill/FriendProvider'

const formSchema = z.object({
  name: z.string().min(1, '必须输入姓名').trim(),
  image: z.string().url({ message: '图片必须是有效的 URL' }).trim(),
  birthday: z
    .date({ required_error: '必须选择好友生日' })
    .max(new Date(), '生日不能是未来的日期')
})

type FormSchema = z.infer<typeof formSchema>

const defaultValues = {
  name: '',
  image: 'https://i.pravatar.cc/150',
  birthday: undefined
}

function AddFriend() {
  useTitle('添加好友')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const { dispatch } = useFriends()

  function onSubmit(values: FormSchema) {
    const newId = Date.now()

    dispatch({
      type: 'ADD_FRIEND',
      payload: {
        id: newId,
        name: values.name,
        image: `${values.image}?u=${newId}`,
        birthday: format(values.birthday, 'yyyy-MM-dd'),
        balance: 0,
        creditRating: 0
      }
    })

    dispatch({ type: 'SHOW_ADD_FRIEND_FORM', payload: false })
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      <CardHeader>
        <CardTitle>添加好友</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormInput
              control={form.control}
              name="name"
              type="text"
              label="👫 好友名字"
              labelWidth={100}
              placeholder="好友名字"
              isError={form.getFieldState('name')?.invalid}
              className="bg-slate-50"
            />

            <FormInput
              control={form.control}
              name="image"
              type="text"
              label="🌄 图片网址"
              labelWidth={100}
              placeholder="图片网址"
              isError={form.getFieldState('image')?.invalid}
              className="bg-slate-50"
            />

            <FormCalendar
              control={form.control}
              name="birthday"
              label="🎂 好友生日"
              labelWidth={100}
              placeholder="选择好友生日"
              disabledWhen={(date) => date > new Date() || date < new Date('1900-01-01')}
              isError={form.getFieldState('birthday')?.invalid}
              className="bg-slate-50"
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
