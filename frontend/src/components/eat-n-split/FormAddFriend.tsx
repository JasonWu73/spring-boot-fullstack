import { Button } from '@/components/ui/Button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/Form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { type Friend } from '@/components/eat-n-split/friend-data'
import { FormInput } from '@/components/ui/CustomFormField'
import { useTitle } from '@/lib/use-title'

const formSchema = z.object({
  name: z.string().trim().nonempty('Must enter a name'),
  image: z.string().trim().url({ message: 'Image must be a valid URL' })
})

type FormSchema = z.infer<typeof formSchema>

type FormAddFriendProps = {
  onAddFriend: (friend: Friend) => void
}

function FormAddFriend({ onAddFriend }: FormAddFriendProps) {
  useTitle('Add a friend')

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
      balance: 0,
      creditRating: 0
    }

    onAddFriend(newFriend)

    form.reset()
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      <CardHeader>
        <CardTitle>Add a friend</CardTitle>
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

            <Button type="submit" className="self-end">
              Add
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export { FormAddFriend }
