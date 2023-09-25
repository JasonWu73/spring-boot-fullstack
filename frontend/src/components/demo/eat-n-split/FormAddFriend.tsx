import { Button } from '@/components/ui/Button.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/Form.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.tsx'
import { type Friend } from '@/components/demo/eat-n-split/friend-data.ts'
import { FormInput } from '@/components/ui/CustomFormField.tsx'

const formSchema = z.object({
  name: z.string().trim().nonempty('Must enter a name'),
  image: z.string().trim().url({ message: 'Image must be a valid URL' })
})

type FormSchema = z.infer<typeof formSchema>

type FormAddFriendProps = {
  onAddFriend: (friend: Friend) => void
}

function FormAddFriend({ onAddFriend }: FormAddFriendProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: '' // https://i.pravatar.cc/150?u=xxx
    }
  })

  function onSubmit(values: FormSchema) {
    const newFriendId = Date.now()

    const newFriend: Friend = {
      id: newFriendId,
      name: values.name,
      image: `${values.image}?u=${newFriendId}`,
      balance: 0
    }

    onAddFriend(newFriend)

    form.reset()
  }

  return (
    <Card className="md:w-[22rem] lg:w-[30rem] bg-amber-100 dark:bg-amber-100 dark:text-slate-700 text-slate-700">
      <CardHeader>
        <CardTitle>Add a friend</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormInput
              control={form.control}
              name="name"
              type="text"
              label="👫 Friend name"
              labelWidth={100}
              placeholder="Friend name"
              isError={form.getFieldState('name')?.invalid}
            />

            <FormInput
              control={form.control}
              name="image"
              type="text"
              label="🌄 Image URL"
              labelWidth={100}
              placeholder="Image URL"
              isError={form.getFieldState('image')?.invalid}
            />

            <Button type="submit" className="self-end">Add</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export { FormAddFriend }
