import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/Button'
import { Form } from '@/components/ui/Form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { FormInput } from '@/components/ui/CustomFormField'
import { useTitle } from '@/lib/use-title'
import { useLocalStorageState } from '@/lib/use-storage'
import { useFetch } from '@/lib/use-fetch'
import { type Friend, addFriendApi } from '@/api/fake/friend-api'

const formSchema = z.object({
  name: z.string().trim().nonempty('Must enter a name'),
  image: z.string().trim().url({ message: 'Image must be a valid URL' })
})

type FormSchema = z.infer<typeof formSchema>

function FormAddFriend() {
  useTitle('Add a friend')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: '' // https://i.pravatar.cc/150?u=xxx
    }
  })

  const [, setFriends] = useLocalStorageState<Friend[]>('friends', [])

  const {
    error,
    loading,
    fetchData: addFriend
  } = useFetch<null, Friend>(async (values, signal) => {
    const { error } = await addFriendApi(values!, signal)

    if (error) {
      return { data: null, error }
    }

    setFriends((prev) => [...prev, values!])

    return { data: null, error: '' }
  }, false)

  const navigate = useNavigate()

  async function onSubmit(values: FormSchema) {
    const newFriendId = Date.now()

    const newFriend: Friend = {
      id: newFriendId,
      name: values.name,
      image: `${values.image}?u=${newFriendId}`,
      balance: 0,
      creditRating: 0
    }

    await addFriend(newFriend)

    form.reset()

    navigate('/eat-split?c=1')
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      <CardHeader>
        <CardTitle>Add a friend</CardTitle>
        {error && (
          <CardDescription className="text-red-500 dark:text-red-600">
            {error}
          </CardDescription>
        )}
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

            <Button disabled={loading} type="submit" className="self-end">
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Add
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export { FormAddFriend }
