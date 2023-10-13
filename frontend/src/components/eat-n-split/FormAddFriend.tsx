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
import { useFetch } from '@/lib/use-fetch'
import { addFriendApi, type Friend } from '@/api/fake/friend-api'
import { useFriends } from '@/components/eat-n-split/FriendProvider'

const formSchema = z.object({
  name: z.string().trim().nonempty('Must enter a name'),
  image: z.string().trim().url({ message: 'Image must be a valid URL' })
})

type FormSchema = z.infer<typeof formSchema>

function FormAddFriend() {
  useTitle('添加好友')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: '' // https://i.pravatar.cc/150?u=xxx
    }
  })

  const { friends, setFriends } = useFriends()

  const { error, loading, addFriend } = useAddFriendApi(friends, setFriends)

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

    navigate('/eat-split?c=1')
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      <CardHeader>
        <CardTitle>添加好友</CardTitle>
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

            <Button disabled={loading} type="submit" className="self-end">
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              添加
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function useAddFriendApi(
  friends: Friend[],
  setFriends: (friends: Friend[]) => void
) {
  const {
    error,
    loading,
    fetchData: addFriend
  } = useFetch<null, Friend>(async (newFriend, signal) => {
    if (!newFriend) {
      return { data: null, error: '好友数据不存在' }
    }

    const { error } = await addFriendApi(newFriend, signal)

    if (error) {
      return { data: null, error }
    }

    setFriends([...friends, newFriend])

    return { data: null, error: '' }
  }, false)

  return { error, loading, addFriend }
}

export { FormAddFriend }
